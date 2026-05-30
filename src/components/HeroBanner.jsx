import { ChevronDown } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-primary-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo Placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 bg-gradient-to-br from-accent-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-premium">
            <span className="text-white text-4xl font-bold">✨</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          Tags para Semijoias
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-accent-200 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Qualidade premium com design elegante e sofisticado
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a href="#cartao-de-visita" className="btn-primary">
            Explorar Catálogo
          </a>
          <a href="#contato" className="btn-secondary text-white border-white hover:bg-white/10">
            Saiba Mais
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-accent-400" />
        </div>
      </div>
    </section>
  )
}
