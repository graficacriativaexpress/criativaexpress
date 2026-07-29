import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ProtectedPaymentPage from './components/ProtectedPaymentPage'
import PaymentConfirmed from './components/PaymentConfirmed'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [products, setProducts] = useState({
    'Cartão de Visita': [
      { id: 1, name: 'Cartão de Visita Premium', price: 89.90, image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800', description: 'Cartão de visita com acabamento premium e papel de alta gramatura.', specs: ['Papel Couché 300g', 'Verniz Localizado', 'Corte Especial'], category: 'Cartão de Visita' }
    ],
    'Tags Personalizadas': [
      { id: 3, name: 'Kit 2.000 Tags - Papel Couché 250g', price: 189.90, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800', description: 'Kit promocional com 2.000 tags de alta qualidade.', specs: ['Papel Couché 250g', 'Impressão Colorida', 'Furo de 3mm'], category: 'Tags Personalizadas' }
    ],
    'DTF': [
      { id: 4, name: 'DTF Têxtil Metro Linear', price: 45.00, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800', description: 'Impressão DTF por metro linear.', specs: ['Alta Durabilidade', 'Cores Vibrantes', 'Fácil Aplicação'], category: 'DTF' }
    ]
  })

  const [config, setConfig] = useState({
    whatsappNumber: '5561993629392',
    infinityPayHandle: 'capitalqueen',
    banners: [],
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
  })

  // Função para buscar dados do GitHub em tempo real
  const fetchFromGitHub = async () => {
    try {
      const token = process.env.REACT_APP_GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN
      const headers = token ? { 'Authorization': `token ${token}` } : {}
      
      // Buscar products.json
      const productsResponse = await fetch(
        'https://api.github.com/repos/graficacriativaexpress/criativaexpress/contents/public/products.json',
        { headers }
      )
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        const decodedProducts = JSON.parse(atob(productsData.content))
        setProducts(decodedProducts)
      }
    } catch (error) {
      console.log('GitHub API não disponível, usando dados locais')
    }
  }

  useEffect(() => {
    // Buscar dados inicialmente
    fetchFromGitHub()

    // Buscar dados a cada 5 segundos para sincronização em tempo real
    const interval = setInterval(fetchFromGitHub, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Fallback: tentar API local
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setProducts(data)
      })
      .catch(e => console.log('API local não disponível'))

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setConfig(prev => ({ ...prev, ...data }))
      })
      .catch(e => console.log('Config API não disponível'))
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home products={products} config={config} />} />
        <Route path="/admin" element={
          <AdminDashboard 
            initialProducts={products} 
            config={config}
            onProductsUpdate={setProducts}
            onConfigUpdate={setConfig}
          />
        } />
        <Route path="/checkout/:productId" element={<ProtectedPaymentPage products={products} config={config} />} />
        <Route path="/payment-confirmed" element={<PaymentConfirmed />} />
      </Routes>
    </Router>
  )
}

export default App;
