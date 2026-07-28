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
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

// Configurar caminhos de dados
const dataDir = path.join(__dirname, 'data')
const productsFile = path.join(dataDir, 'products.json')
const configFile = path.join(dataDir, 'config.json')
const uploadDir = path.join(__dirname, 'public', 'uploads')

// Garantir que as pastas existam
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

// Inicializar arquivo de produtos se não existir
if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify({ 'Cartão de Visita': [], 'Tags Personalizadas': [], 'DTF': [] }, null, 2))
}

// Inicializar arquivo de configuração se não existir
if (!fs.existsSync(configFile)) {
    const defaultConfig = {
        whatsappNumber: '5561993629392',
        infinityPayHandle: 'capitalqueen',
        categories: [
            { id: 'cartao', name: 'Cartão de Visita', icon: '🎨', description: 'Cartões premium com acabamentos especiais' },
            { id: 'tags', name: 'Tags Personalizadas', icon: '🏷️', description: 'Tags para semijoias com design exclusivo' },
            { id: 'dtf', name: 'DTF', icon: '👕', description: 'Transferências DTF de alta qualidade' }
        ],
        slides: [
            { id: 1, title: 'Bem-vindo ao Criativa Express', subtitle: 'Semijoias e Acessórios Premium', gradient: 'from-purple-600 to-pink-600' },
            { id: 2, title: 'Qualidade Premium', subtitle: 'Produtos de excelência para seu negócio', gradient: 'from-blue-600 to-purple-600' }
        ],
        features: [
            { id: 1, icon: '⚡', title: 'Rápido', description: 'Entrega ágil' },
            { id: 2, icon: '💎', title: 'Premium', description: 'Qualidade garantida' },
            { id: 3, icon: '🎯', title: 'Personalizado', description: 'Seu design' }
        ]
    }
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2))
}

// Configurar multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadDir) },
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
    if (mimetype && extname) return cb(null, true)
    cb(new Error('Apenas imagens são permitidas'))
  }
})

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/uploads', express.static(uploadDir))

// --- API ENDPOINTS ---

// Listar todos os produtos
app.get('/api/products', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(productsFile, 'utf-8'))
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler produtos' })
    }
})

// Salvar todos os produtos (substituição total)
app.post('/api/products', (req, res) => {
    try {
        const newProducts = req.body
        fs.writeFileSync(productsFile, JSON.stringify(newProducts, null, 2))
        res.json({ success: true, message: 'Produtos salvos com sucesso' })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar produtos' })
    }
})

// Obter configurações
app.get('/api/config', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler configurações' })
    }
})

// Salvar configurações
app.post('/api/config', (req, res) => {
    try {
        const newConfig = req.body
        fs.writeFileSync(configFile, JSON.stringify(newConfig, null, 2))
        res.json({ success: true, message: 'Configurações salvas com sucesso' })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar configurações' })
    }
})

// Upload de imagem
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' })
    res.json({ url: `/uploads/${req.file.filename}` })
})

// Gerar descrição com IA
app.post('/api/generate-description', async (req, res) => {
  try {
    const { productName, category, apiKey } = req.body
    if (!apiKey) return res.status(400).json({ success: false, message: 'API Key não fornecida' })
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um especialista em marketing de semijoias. Crie descrições atraentes e profissionais.' },
        { role: 'user', content: `Crie uma descrição para: ${productName} na categoria ${category}.` }
      ],
      max_tokens: 150
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    })
    
    res.json({ success: true, description: response.data.choices[0].message.content.trim() })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao gerar descrição' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
