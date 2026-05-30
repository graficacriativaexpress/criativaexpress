import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Servir arquivos estáticos do Vite
app.use(express.static(path.join(__dirname, 'dist')))

// Configurações
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '5561993629392'
const INFINITEPAY_HANDLE = process.env.INFINITY_PAY_HANDLE || 'capitalqueen'

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
