import ProductCard from './ProductCard'

export default function CategorySection({ category, products }) {
  const categoryId = category.toLowerCase().replace(/\s+/g, '-')
  
  // Separar produtos em destaque e normais
  const featuredProducts = products.filter(p => p.featured)
  const normalProducts = products.filter(p => !p.featured)
  const sortedProducts = [...featuredProducts, ...normalProducts]

  return (
    <section id={categoryId} className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {category}
            </h2>
            {featuredProducts.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ {featuredProducts.length} em destaque
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Conheça nossa coleção exclusiva de {category.toLowerCase()} com acabamento premium
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} featured={product.featured} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Em breve, novos produtos nesta categoria!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
