import { useState } from 'react'
import { ChevronDown, Menu, X, ShoppingBag, Star } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import ProductCard from './ProductCard'
import BannerSlide from './BannerSlide'

export default function Home({ products, config }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    tags: true,
    cartao: true,
    dtf: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white border-r-2 border-purple-200 transition-all duration-300 overflow-hidden sticky top-16 h-[calc(100vh-64px)] shadow-lg`}
        >
          <div className="p-6">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <ShoppingBag size={20} /> Categorias
            </h3>
            <nav className="space-y-2">
              {config.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    const element = document.getElementById(cat.id)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:text-purple-600 transition font-medium flex items-center gap-3 hover:shadow-md"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-8 left-8 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 md:hidden"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Main Content Area */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Banner Slide */}
            <BannerSlide slides={config.slides} features={config.features} />

            {/* Seções de Categorias */}
            {config.categories.map((category) => (
              <section key={category.id} id={category.id} className="mb-16 mt-16 scroll-mt-20">
                <div
                  onClick={() => toggleSection(category.id)}
                  className="flex items-center justify-between cursor-pointer mb-8 pb-4 border-b-2 border-gray-300 hover:border-purple-600 transition group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{category.icon}</span>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-purple-600 transition">{category.name}</h2>
                    </div>
                    <p className="text-gray-600 mt-1 text-lg">{category.description}</p>
                  </div>
                  <ChevronDown
                    size={32}
                    className={`text-purple-600 transition-transform ${
                      expandedSections[category.id] ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {expandedSections[category.id] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                    {products[category.name]?.length > 0 ? (
                      products[category.name].map(product => (
                        <ProductCard key={product.id} product={product} featured={product.featured} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">Nenhum produto disponível nesta categoria</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            ))}

            {/* CTA Section */}
            <section className="mt-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center shadow-2xl">
              <h2 className="text-4xl font-bold mb-4">Não encontrou o que procura?</h2>
              <p className="text-lg mb-8 opacity-90">Entre em contato conosco via WhatsApp para produtos personalizados</p>
              <a 
                href={`https://wa.me/${config.whatsappNumber}?text=Olá! Gostaria de conhecer mais sobre seus produtos.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105"
              >
                Enviar Mensagem no WhatsApp
              </a>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
