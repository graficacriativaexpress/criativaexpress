import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Criativa Express</h3>
            <p className="text-gray-400 text-sm">
              Soluções criativas e personalizadas para suas semijoias, cartões e transferências DTF.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/pagamento" className="hover:text-white transition">Gerar Pagamento</a></li>
              <li><a href="/admin" className="hover:text-white transition">Admin</a></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/#tags" className="hover:text-white transition">Tags Personalizadas</a></li>
              <li><a href="/#cartao" className="hover:text-white transition">Cartão de Visita</a></li>
              <li><a href="/#dtf" className="hover:text-white transition">DTF</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+55 61 99362-9392</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>contato@criativaexpress.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} Criativa Express. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
