import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ProtectedPaymentPage from './components/ProtectedPaymentPage'
import PaymentConfirmed from './components/PaymentConfirmed'
import AdminDashboard from './components/AdminDashboard'

function App() {
  // Configurações globais com localStorage
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('semijoias_config')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Erro ao carregar config:', e)
    }
    return {
      slides: [
        {
          id: 1,
          title: 'Qualidade Premium',
          subtitle: 'Produtos de alta qualidade para suas semijoias',
          gradient: 'from-purple-600 to-blue-600'
        },
        {
          id: 2,
          title: 'Entrega Rápida',
          subtitle: 'Receba seus pedidos em até 24 horas',
          gradient: 'from-blue-600 to-cyan-500'
        },
        {
          id: 3,
          title: 'Melhor Preço',
          subtitle: 'Os melhores preços do mercado',
          gradient: 'from-purple-600 to-pink-600'
        }
      ],
      features: [
        {
          id: 1,
          title: 'Qualidade Premium',
          description: 'Produtos de alta qualidade garantida',
          icon: 'Zap'
        },
        {
          id: 2,
          title: 'Entrega Rápida',
          description: 'Entrega em até 24 horas',
          icon: 'Truck'
        },
        {
          id: 3,
          title: 'Atendimento 24/7',
          description: 'Suporte sempre disponível',
          icon: 'Clock'
        },
        {
          id: 4,
          title: 'Segurança',
          description: 'Compra 100% segura',
          icon: 'Shield'
        }
      ],
      categories: [
        { id: 'tags', name: 'Tags Personalizadas', icon: '🏷️', description: 'Conheça nossa coleção exclusiva' },
        { id: 'cartao', name: 'Cartão de Visita', icon: '💼', description: 'Cartões premium para sua marca' },
        { id: 'dtf', name: 'DTF', icon: '🎨', description: 'Transferências de alta qualidade' }
      ]
    }
  })

  // Salvar config no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('semijoias_config', JSON.stringify(config))
  }, [config])

  // Dados de produtos com localStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('semijoias_products')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Erro ao carregar produtos:', e)
    }
    return {
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
          id: 26,
          name: 'DTF UV - Folha A3 29x42cm',
          category: 'DTF',
          description: 'Transferência DTF UV em folha A3 - Média 50-70 adesivos',
          price: 89.90,
          image: 'https://via.placeholder.com/400x300?text=DTF+UV',
          specs: ['Folha A3', 'Qualidade UV', 'Durável']
        },
        {
          id: 27,
          name: 'DTF Floral Elegante',
          category: 'DTF',
          description: 'Design floral elegante para transferência',
          price: 28.90,
          image: 'https://via.placeholder.com/400x300?text=DTF+Floral',
          specs: ['Padrão floral', 'Alta qualidade', 'Cores vibrantes']
        },
        {
          id: 28,
          name: 'DTF Geométrico',
          category: 'DTF',
          description: 'Padrão geométrico moderno',
          price: 32.90,
          image: 'https://via.placeholder.com/400x300?text=DTF+Geométrico',
          specs: ['Padrão geométrico', 'Design moderno', 'Premium']
        },
        {
          id: 29,
          name: 'DTF Personalizado',
          category: 'DTF',
          description: 'Transferência personalizada conforme sua necessidade',
          price: 0.00,
          image: 'https://via.placeholder.com/400x300?text=DTF+Personalizado',
          specs: ['Personalização', 'Sob encomenda', 'Consulte preço']
        }
      ],
      'Tags Personalizadas': [
        {
          id: 4,
          name: 'Kit 2.000 Tags Brincos',
          category: 'Tags Personalizadas',
          description: 'Kit com 2.000 tags para brincos - Couché 300g',
          price: 249.90,
          image: '/zeglam-38589.png',
          specs: ['2.000 unidades', 'Couché 300g', 'Colorido frente e verso'],
          featured: true
        },
        {
          id: 5,
          name: 'Kit Tags Variação 1',
          category: 'Tags Personalizadas',
          description: 'Kit tags personalizado - Qualidade premium',
          price: 249.90,
          image: '/zeglam-38590.png',
          specs: ['Qualidade Premium', 'Personalização disponível', 'Entrega rápida'],
          featured: false
        },
        {
          id: 6,
          name: 'Kit Tags Variação 2',
          category: 'Tags Personalizadas',
          description: 'Kit tags personalizado - Qualidade premium',
          price: 249.90,
          image: '/zeglam-38591.png',
          specs: ['Qualidade Premium', 'Personalização disponível', 'Entrega rápida'],
          featured: false
        },
        {
          id: 7,
          name: 'Kit Tags Variação 3',
          category: 'Tags Personalizadas',
          description: 'Kit tags personalizado - Qualidade premium',
          price: 249.90,
          image: '/zeglam-38592.png',
          specs: ['Qualidade Premium', 'Personalização disponível', 'Entrega rápida'],
          featured: false
        }
      ]
    }
  })

  // Salvar produtos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('semijoias_products', JSON.stringify(products))
  }, [products])

  const handleProductsUpdate = (updatedProducts) => {
    const allProducts = {}
    updatedProducts.forEach(product => {
      if (!allProducts[product.category]) {
        allProducts[product.category] = []
      }
      allProducts[product.category].push(product)
    })
    setProducts(allProducts)
  }

  const handleConfigUpdate = (newConfig) => {
    setConfig(newConfig)
  }

  const getAllProducts = () => {
    return Object.values(products).flat()
  }

  return (
    <Router>
      <Routes>
        {/* Página Principal */}
        <Route path="/" element={
          <Home products={products} config={config} />
        } />
        
        {/* Página de Pagamento */}
        <Route path="/pagamento" element={
          <ProtectedPaymentPage />
        } />
        
        {/* Página de Confirmação */}
        <Route path="/pagamento-confirmado" element={
          <PaymentConfirmed />
        } />

        {/* Painel Admin */}
        <Route path="/admin" element={
          <AdminDashboard 
            onLogout={() => window.location.href = '/'}
            onProductsUpdate={handleProductsUpdate}
            onConfigUpdate={handleConfigUpdate}
            initialProducts={getAllProducts()}
            config={config}
          />
        } />
      </Routes>
    </Router>
  )
}

export default App
