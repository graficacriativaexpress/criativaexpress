import ProductCard from './ProductCard'

export default function CategorySection({ category, products }) {
  const categoryId = category.toLowerCase().replace(/\s+/g, '-')

  return (
    <section id={categoryId} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark-900 mb-4">
            {category}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-700 to-accent-700 mx-auto mb-6"></div>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Conheça nossa coleção exclusiva de {category.toLowerCase()} com acabamento premium
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600 text-lg">
              Em breve, novos produtos nesta categoria!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
