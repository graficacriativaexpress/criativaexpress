import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
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

// Garantir que as pastas existam
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

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

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')))

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
