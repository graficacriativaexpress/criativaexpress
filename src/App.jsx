import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import CategorySection from './components/CategorySection'
import Footer from './components/Footer'
import PaymentPage from './components/PaymentPage'
import PaymentConfirmed from './components/PaymentConfirmed'

function App() {
  // Dados de exemplo - você pode conectar com uma API depois
  const [products] = useState({
    'Cartão de Visita': [
      {
        id: 1,
        name: 'Cartão Premium Dourado',
        category: 'Cartão de Visita',
        description: 'Cartão de visita com acabamento premium em dourado',
        price: 45.90,
        image: 'https://via.placeholder.com/400x300?text=Cartão+Premium+Dourado',
        specs: ['Papel 300g', 'Impressão colorida', 'Corte reto']
      },
      {
        id: 2,
        name: 'Cartão Minimalista',
        category: 'Cartão de Visita',
        description: 'Design minimalista e elegante',
        price: 35.90,
        image: 'https://via.placeholder.com/400x300?text=Cartão+Minimalista',
        specs: ['Papel 250g', 'Impressão preta', 'Acabamento fosco']
      },
      {
        id: 3,
        name: 'Cartão Luxo Preto',
        category: 'Cartão de Visita',
        description: 'Cartão com acabamento luxuoso em preto',
        price: 55.90,
        image: 'https://via.placeholder.com/400x300?text=Cartão+Luxo+Preto',
        specs: ['Papel 350g', 'Impressão metalizada', 'Verniz brilho']
      }
    ],
    'DTF': [
      {
        id: 4,
        name: 'DTF Floral Elegante',
        category: 'DTF',
        description: 'Transferência DTF com design floral sofisticado',
        price: 28.90,
        image: 'https://via.placeholder.com/400x300?text=DTF+Floral',
        specs: ['Impressão full color', 'Acabamento brilhante', 'Pronto para aplicar']
      },
      {
        id: 5,
        name: 'DTF Geométrico',
        category: 'DTF',
        description: 'Design geométrico moderno e versátil',
        price: 32.90,
        image: 'https://via.placeholder.com/400x300?text=DTF+Geométrico',
        specs: ['Alta definição', 'Cores vibrantes', 'Durável']
      },
      {
        id: 6,
        name: 'DTF Personalizado',
        category: 'DTF',
        description: 'Crie seu próprio design DTF',
        price: 0,
        image: 'https://via.placeholder.com/400x300?text=DTF+Personalizado',
        specs: ['Sob encomenda', 'Qualidade garantida', 'Consulte preço']
      }
    ],
    'Tags Personalizadas': [
      {
        id: 7,
        name: 'Tag Semijoias Dourada',
        category: 'Tags Personalizadas',
        description: 'Tag personalizada para semijoias com acabamento dourado',
        price: 0.12,
        image: 'https://via.placeholder.com/400x300?text=Tag+Dourada',
        specs: ['Tamanho 5x3cm', 'Papel 300g', 'Furação para fio']
      },
      {
        id: 8,
        name: 'Tag Premium Preta',
        category: 'Tags Personalizadas',
        description: 'Tag elegante com fundo preto e detalhes em ouro',
        price: 0.15,
        image: 'https://via.placeholder.com/400x300?text=Tag+Preta',
        specs: ['Tamanho 4x2.5cm', 'Papel 350g', 'Verniz brilho']
      },
      {
        id: 9,
        name: 'Tag Minimalista Branca',
        category: 'Tags Personalizadas',
        description: 'Design minimalista em papel branco premium',
        price: 0.10,
        image: 'https://via.placeholder.com/400x300?text=Tag+Branca',
        specs: ['Tamanho 5x3cm', 'Papel 250g', 'Impressão preta']
      }
    ]
  })

  return (
    <Router>
      <Routes>
        {/* Página Principal */}
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            <Header />
            <HeroBanner />
            
            {/* Sections */}
            <CategorySection category="Cartão de Visita" products={products['Cartão de Visita']} />
            <CategorySection category="DTF" products={products['DTF']} />
            <CategorySection category="Tags Personalizadas" products={products['Tags Personalizadas']} />
            
            <Footer />
          </div>
        } />
        
        {/* Página de Pagamento */}
        <Route path="/pagamento" element={
          <div className="min-h-screen bg-white">
            <Header />
            <PaymentPage />
            <Footer />
          </div>
        } />
        
        {/* Página de Confirmação */}
        <Route path="/pagamento-confirmado" element={
          <div className="min-h-screen bg-white">
            <Header />
            <PaymentConfirmed />
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App

// Adicionar link de acesso à página de pagamento no Header
// Você pode adicionar um botão no Header que leva para /pagamento
