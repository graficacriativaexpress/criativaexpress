import { MessageCircle, Heart } from 'lucide-react'
import { useState } from 'react'

export default function ProductCard({ product, whatsappNumber = '5511999999999' }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de fazer um pedido do kit: ${product.name}\n\nDescrição: ${product.description}\n\nPreço: ${product.price ? `R$ ${product.price}` : 'Consultar'}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="card-elegant group">
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-soft hover:shadow-elegant transition-all duration-300 z-10"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-dark-800'}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-dark-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-dark-700 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        {product.price && (
          <div className="mb-4 pb-4 border-b border-primary-100">
            <p className="text-2xl font-bold text-primary-700">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}

        {/* Specifications */}
        {product.specs && (
          <div className="mb-4 space-y-1 text-sm text-dark-600">
            {product.specs.map((spec, idx) => (
              <p key={idx}>• {spec}</p>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleWhatsApp}
          className="btn-whatsapp w-full justify-center"
        >
          <MessageCircle size={18} />
          Fazer Pedido
        </button>
      </div>
    </div>
  )
}
