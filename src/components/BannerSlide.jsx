import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Zap, Truck, Clock, Shield } from 'lucide-react'

const iconMap = {
  Zap,
  Truck,
  Clock,
  Shield
}

export default function BannerSlide({ slides = [], features = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length === 0) return
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0 || features.length === 0) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Slide Banner */}
      <div className="relative h-48 rounded-lg overflow-hidden shadow-lg">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-opacity duration-500 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="h-full flex flex-col items-center justify-center text-white px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">{slide.title}</h2>
              <p className="text-lg md:text-xl text-white/90 text-center">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, idx) => {
          const Icon = iconMap[feature.icon] || Zap
          return (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Icon size={28} className="text-purple-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
