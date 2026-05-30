import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-dark-900 to-dark-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="h-12 w-12 bg-gradient-to-br from-accent-400 to-primary-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-lg font-bold">✨</span>
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">Tags Premium</h3>
            <p className="text-gray-300 text-sm">
              Qualidade e elegância em cada detalhe
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#cartao-de-visita" className="hover:text-accent-400 transition-colors">Cartão de Visita</a></li>
              <li><a href="#dtf" className="hover:text-accent-400 transition-colors">DTF</a></li>
              <li><a href="#tags-personalizadas" className="hover:text-accent-400 transition-colors">Tags Personalizadas</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <MessageCircle size={16} />
                <a href="https://wa.me/5511999999999" className="hover:text-accent-400 transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:contato@example.com" className="hover:text-accent-400 transition-colors">Email</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(11) 9999-9999</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-3">
              Receba novidades e promoções exclusivas
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-3 py-2 bg-dark-700 text-white placeholder-gray-400 rounded-l-lg focus:outline-none"
              />
              <button className="px-4 py-2 bg-accent-600 hover:bg-accent-700 transition-colors rounded-r-lg font-semibold">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} Tags Premium. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent-400 transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-accent-400 transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
