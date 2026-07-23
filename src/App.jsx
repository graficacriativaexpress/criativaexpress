import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ProtectedPaymentPage from './components/ProtectedPaymentPage'
import PaymentConfirmed from './components/PaymentConfirmed'
import AdminDashboard from './components/AdminDashboard'

const CACHE_VERSION = '3.0'

function App() {
  useEffect(() => {
    const savedVersion = localStorage.getItem('semijoias_version')
    if (savedVersion !== CACHE_VERSION) {
      localStorage.removeItem('semijoias_config')
      localStorage.removeItem('semijoias_products')
      localStorage.setItem('semijoias_version', CACHE_VERSION)
      window.location.reload()
    }
  }, [])

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('semijoias_config')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Erro ao carregar config:', e)
    }
    return {
      slides: [
        { id: 1, title: 'Qualidade Premium', subtitle: 'Produtos de alta qualidade', gradient: 'from-purple-600 to-blue-600' },
        { id: 2, title: 'Entrega Rápida', subtitle: 'Em até 24 horas', gradient: 'from-blue-600 to-cyan-500' }
      ],
      features: [
        { id: 1, title: 'Qualidade Premium', description: 'Garantida', icon: 'Zap' }
      ]
    }
  })

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('semijoias_products')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Erro ao carregar produtos:', e)
    }
    return []
  })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home config={config} products={products} />} />
        <Route path="/admin" element={<AdminDashboard initialProducts={products} config={config} onProductsUpdate={setProducts} onConfigUpdate={setConfig} onLogout={() => {}} />} />
        <Route path="/pagamento" element={<ProtectedPaymentPage config={config} />} />
        <Route path="/confirmado" element={<PaymentConfirmed config={config} />} />
      </Routes>
    </Router>
  )
}

export default App;
