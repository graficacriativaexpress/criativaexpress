import { MessageCircle, Heart, Star, X, Zap } from 'lucide-react'
import { useState } from 'react'

export default function ProductCard({ product, featured = false, whatsappNumber = '5561993629392' }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de fazer um pedido do kit: ${product.name}\n\nDescrição: ${product.description}\n\nPreço: ${product.price ? `R$ ${product.price.toFixed(2)}` : 'Consultar'}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col border-2 ${featured ? 'border-yellow-400 ring-2 ring-yellow-300' : 'border-transparent hover:border-purple-200'}`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star size={16} fill="currentColor" />
          Destaque
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer" onClick={() => setShowLightbox(true)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* View Image Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-lg">Ver Imagem</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-md hover:shadow-lg transition-all duration-300 z-10 hover:bg-white hover:scale-110"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-purple-600 transition">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Specifications */}
        {product.specs && product.specs.length > 0 && (
          <div className="mb-3 space-y-1 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
            {product.specs.slice(0, 2).map((spec, idx) => (
              <p key={idx} className="line-clamp-1 flex items-center gap-1">
                <Zap size={12} className="text-purple-600" /> {spec}
              </p>
            ))}
          </div>
        )}

        {/* Price */}
        {product.price > 0 && (
          <div className="mb-4 pb-4 border-t-2 border-gray-100">
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleWhatsApp}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:from-green-600 hover:to-green-700 transform hover:scale-105"
        >
          <MessageCircle size={18} />
          Fazer Pedido
        </button>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowLightbox(false)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition transform hover:scale-110"
            >
              <X size={36} />
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <p className="text-xl text-green-400 font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
