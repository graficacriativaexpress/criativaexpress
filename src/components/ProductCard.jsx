import { MessageCircle, Heart, Star } from 'lucide-react'
import { useState } from 'react'

export default function ProductCard({ product, featured = false, whatsappNumber = '5561993629392' }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de fazer um pedido do kit: ${product.name}\n\nDescrição: ${product.description}\n\nPreço: ${product.price ? `R$ ${product.price.toFixed(2)}` : 'Consultar'}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className={`relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col ${featured ? 'ring-2 ring-yellow-400' : ''}`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-20 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star size={14} fill="currentColor" />
          Destaque
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 z-10"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Specifications */}
        {product.specs && product.specs.length > 0 && (
          <div className="mb-3 space-y-1 text-xs text-gray-600">
            {product.specs.slice(0, 2).map((spec, idx) => (
              <p key={idx} className="line-clamp-1">• {spec}</p>
            ))}
          </div>
        )}

        {/* Price */}
        {product.price > 0 && (
          <div className="mb-3 pb-3 border-t border-gray-200">
            <p className="text-lg md:text-xl font-bold text-purple-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleWhatsApp}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
        >
          <MessageCircle size={16} />
          Fazer Pedido
        </button>
      </div>
    </div>
  )
}
