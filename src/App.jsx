import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ProtectedPaymentPage from './components/ProtectedPaymentPage'
import PaymentConfirmed from './components/PaymentConfirmed'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [products, setProducts] = useState({
    'Cartão de Visita': [
      { id: 1, name: 'Cartão de Visita Premium', price: 89.90, image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800', description: 'Cartão de visita com acabamento premium e papel de alta gramatura.', specs: ['Papel Couché 300g', 'Verniz Localizado', 'Corte Especial'] }
    ],
    'Tags Personalizadas': [
      { id: 3, name: 'Kit 2.000 Tags - Papel Couché 250g', price: 189.90, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800', description: 'Kit promocional com 2.000 tags de alta qualidade.', specs: ['Papel Couché 250g', 'Impressão Colorida', 'Furo de 3mm'] }
    ],
    'DTF': [
      { id: 4, name: 'DTF Têxtil Metro Linear', price: 45.00, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800', description: 'Impressão DTF por metro linear.', specs: ['Alta Durabilidade', 'Cores Vibrantes', 'Fácil Aplicação'] }
    ]
  })

  const [config, setConfig] = useState({
    whatsappNumber: '5561993629392',
    infinityPayHandle: 'capitalqueen',
    banners: []
  })

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setProducts(data)
      })
      .catch(e => console.log('API não disponível, usando dados locais'))
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

export default App
