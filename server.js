import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import fs from 'fs'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Configurar multer para upload de imagens
const uploadDir = path.join(__dirname, 'public', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Apenas imagens sao permitidas'))
    }
  }
})

// Servir arquivos estáticos do Vite
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/uploads', express.static(uploadDir))

// Configurações
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '5561993629392'
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || 'capitalqueen'

// Endpoint para gerar descrição com IA
app.post('/api/generate-description', async (req, res) => {
  try {
    const { productName, category, apiKey } = req.body

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API Key não fornecida'
      })
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em marketing de semijoias. Crie descrições atraentes e profissionais para produtos de tags personalizadas.'
        },
        {
          role: 'user',
          content: `Crie uma descrição atraente e profissional para este produto:\n\nNome: ${productName}\nCategoria: ${category}\n\nA descrição deve ser concisa (2-3 linhas), destacar os benefícios e ser persuasiva.`
        }
      ],
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const description = response.data.choices[0].message.content.trim()
    res.json({
      success: true,
      description: description
    })
  } catch (error) {
    console.error('Erro ao gerar descrição:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || 'Erro ao gerar descrição com IA'
    })
  }
})

// Endpoint para upload de imagens
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao fazer upload da imagem'
    })
  }
})

// Endpoint para gerar link de pagamento (proxy seguro)
app.post('/api/payment/generate', async (req, res) => {
  try {
    const { handle, redirect_url, webhook_url, order_nsu, customer, items } = req.body

    // Validar dados
    if (!handle || !redirect_url || !webhook_url || !order_nsu || !customer || !items) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para gerar link de pagamento'
      })
    }

    // Chamar API da Infinity Pay do servidor (seguro)
    const response = await axios.post('https://api.checkout.infinitepay.io/links', {
      handle,
      redirect_url,
      webhook_url,
      order_nsu,
      customer,
      items
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Retornar URL do pagamento
    res.json({
      success: true,
      url: response.data.url
    })
  } catch (error) {
    console.error('Erro ao gerar link de pagamento:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Erro ao gerar link de pagamento'
    })
  }
})

// Webhook da Infinity Pay
app.post('/api/webhook/infinitepay', async (req, res) => {
  try {
    console.log('Webhook recebido:', JSON.stringify(req.body, null, 2))

    const {
      invoice_slug,
      amount,
      paid_amount,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
      items
    } = req.body

    // Validar se o pagamento foi confirmado
    if (!invoice_slug || !transaction_nsu) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos'
      })
    }

    // Preparar mensagem do WhatsApp
    const amountFormatted = (paid_amount / 100).toFixed(2).replace('.', ',')
    const paymentMethod = capture_method === 'pix' ? 'Pix' : 'Cartão de Crédito'
    
    const itemsDescription = items
      ?.map(item => `• ${item.description} (R$ ${(item.price / 100).toFixed(2).replace('.', ',')})`)
      .join('\n') || 'Produto'

    const whatsappMessage = `
✅ *PAGAMENTO CONFIRMADO!*

Olá! Seu pagamento foi recebido com sucesso!

📋 *Detalhes do Pedido:*
${itemsDescription}

💰 *Valor Pago:* R$ ${amountFormatted}
💳 *Método:* ${paymentMethod}
🔐 *ID da Transação:* ${transaction_nsu}

🧾 *Comprovante:* ${receipt_url || 'Disponível em breve'}

Obrigado pela compra! Em breve você receberá mais informações sobre sua encomenda.

Qualquer dúvida, estamos à disposição! 😊
    `.trim()

    // Enviar notificação via WhatsApp (usando API de terceiros ou serviço)
    // Aqui você pode usar: Twilio, WhatsApp Business API, ou outro serviço
    console.log(`\n📱 Mensagem para enviar ao WhatsApp (${WHATSAPP_NUMBER}):\n${whatsappMessage}\n`)

    // Simular envio (em produção, você usaria uma API real)
    await simulateWhatsAppNotification(WHATSAPP_NUMBER, whatsappMessage)

    // Responder com sucesso
    res.status(200).json({
      success: true,
      message: 'Webhook processado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Função para simular envio de notificação WhatsApp
async function simulateWhatsAppNotification(phone, message) {
  try {
    // Aqui você pode integrar com:
    // - Twilio
    // - WhatsApp Business API
    // - Baileys (WhatsApp Web)
    // - Outro serviço de envio de mensagens

    console.log(`✓ Notificação WhatsApp enviada para ${phone}`)
    console.log(`Mensagem: ${message}`)

    // Exemplo com Twilio (descomente para usar):
    /*
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+${phone}`
    })
    */

    return true
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    throw error
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando' })
})

// Servir index.html para todas as rotas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Teste de webhook
app.post('/api/test-webhook', (req, res) => {
  const testPayload = {
    invoice_slug: 'test-123',
    amount: 10000,
    paid_amount: 10000,
    installments: 1,
    capture_method: 'pix',
    transaction_nsu: 'test-transaction-123',
    order_nsu: 'ORDER-' + Date.now(),
    receipt_url: 'https://example.com/receipt',
    items: [
      {
        quantity: 1,
        price: 10000,
        description: 'Produto de Teste'
      }
    ]
  }

  console.log('Teste de webhook enviado:', testPayload)
  res.json({
    success: true,
    message: 'Teste enviado com sucesso',
    payload: testPayload
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📱 WhatsApp configurado: ${WHATSAPP_NUMBER}`)
  console.log(`💳 Infinity Pay Handle: ${INFINITEPAY_HANDLE}`)
  console.log(`\n✓ Pronto para receber webhooks!\n`)
})
