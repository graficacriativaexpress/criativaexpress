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

// Função para salvar no GitHub
async function saveToGitHub(filename, content, message) {
    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN
        const GITHUB_REPO = 'graficacriativaexpress/criativaexpress'
        const GITHUB_OWNER = 'graficacriativaexpress'
        const GITHUB_REPO_NAME = 'criativaexpress'

        if (!GITHUB_TOKEN) {
            console.log('GitHub token não configurado, salvando localmente')
            return false
        }

        const filePath = `data/${filename}`
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`

        // Primeiro, tentar obter o arquivo atual para pegar o SHA
        let sha = null
        try {
            const getRes = await axios.get(url, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+raw'
                }
            })
            sha = getRes.data.sha
        } catch (e) {
            // Arquivo não existe ainda, sem problema
        }

        // Enviar para GitHub
        const response = await axios.put(url, {
            message: message,
            content: Buffer.from(content).toString('base64'),
            sha: sha,
            branch: 'main'
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })

        console.log(`Arquivo ${filename} salvo no GitHub com sucesso`)
        return true
    } catch (error) {
        console.error(`Erro ao salvar ${filename} no GitHub:`, error.message)
        return false
    }
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
        console.error('Erro ao ler produtos:', error)
        res.status(500).json({ error: 'Erro ao ler produtos' })
    }
})

// Salvar todos os produtos
app.post('/api/products', async (req, res) => {
    try {
        const newProducts = req.body
        const content = JSON.stringify(newProducts, null, 2)
        
        // Tentar salvar no GitHub
        const savedToGitHub = await saveToGitHub(
            'products.json',
            content,
            'Atualizar produtos via painel administrativo'
        )

        // Também salvar localmente para backup
        try {
            fs.writeFileSync(productsFile, content)
        } catch (e) {
            console.log('Não foi possível salvar localmente (esperado no Vercel)')
        }

        if (savedToGitHub) {
            res.json({ success: true, message: 'Produtos salvos com sucesso no GitHub' })
        } else {
            res.json({ success: true, message: 'Produtos salvos (aguardando sincronização)' })
        }
    } catch (error) {
        console.error('Erro ao salvar produtos:', error)
        res.status(500).json({ error: 'Erro ao salvar produtos: ' + error.message })
    }
})

// Obter configurações
app.get('/api/config', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
        res.json(data)
    } catch (error) {
        console.error('Erro ao ler configurações:', error)
        res.status(500).json({ error: 'Erro ao ler configurações' })
    }
})

// Salvar configurações
app.post('/api/config', async (req, res) => {
    try {
        const newConfig = req.body
        const content = JSON.stringify(newConfig, null, 2)
        
        // Tentar salvar no GitHub
        const savedToGitHub = await saveToGitHub(
            'config.json',
            content,
            'Atualizar configurações via painel administrativo'
        )

        // Também salvar localmente para backup
        try {
            fs.writeFileSync(configFile, content)
        } catch (e) {
            console.log('Não foi possível salvar localmente (esperado no Vercel)')
        }

        if (savedToGitHub) {
            res.json({ success: true, message: 'Configurações salvas com sucesso no GitHub' })
        } else {
            res.json({ success: true, message: 'Configurações salvas (aguardando sincronização)' })
        }
    } catch (error) {
        console.error('Erro ao salvar configurações:', error)
        res.status(500).json({ error: 'Erro ao salvar configurações: ' + error.message })
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
