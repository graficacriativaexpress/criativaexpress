import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden sticky top-16 h-[calc(100vh-64px)]`}
        >
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Categorias</h3>
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
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition font-medium flex items-center gap-2"
                >
                  <span>{cat.icon}</span>
                  {cat.name}
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
            className="fixed bottom-8 left-8 z-40 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition md:hidden"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Main Content Area */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Banner Slide */}
            <BannerSlide slides={config.slides} features={config.features} />

            {/* Seções de Categorias */}
            {config.categories.map((category) => (
              <section key={category.id} id={category.id} className="mb-12 mt-12">
                <div
                  onClick={() => toggleSection(category.id)}
                  className="flex items-center justify-between cursor-pointer mb-6 pb-4 border-b-2 border-gray-200 hover:border-purple-600 transition"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <ChevronDown
                    size={28}
                    className={`text-purple-600 transition-transform ${
                      expandedSections[category.id] ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {expandedSections[category.id] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products[category.name]?.map(product => (
                      <ProductCard key={product.id} product={product} featured={product.featured} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
