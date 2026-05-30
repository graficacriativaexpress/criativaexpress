export default function HeroBanner() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-yellow-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Conteúdo */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Criativa Express
              </h1>
              <p className="text-xl text-gray-600">Semijoias Premium com Design Sofisticado</p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Descubra nossa coleção exclusiva de tags personalizadas, cartões de visita premium e transferências DTF. 
              Qualidade garantida com design elegante e sofisticado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('tags')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
              >
                Explorar Catálogo
              </button>
              <a
                href="/pagamento"
                className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Gerar Pagamento
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">500+</p>
                <p className="text-sm text-gray-600">Clientes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">1000+</p>
                <p className="text-sm text-gray-600">Produtos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">24h</p>
                <p className="text-sm text-gray-600">Entrega</p>
              </div>
            </div>
          </div>

          {/* Imagem/Ilustração */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200 rounded-3xl transform rotate-6 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-yellow-200 rounded-3xl transform -rotate-6 opacity-50"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-gray-600 font-semibold">Premium Quality</p>
                  <p className="text-gray-500 text-sm">Elegant Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
