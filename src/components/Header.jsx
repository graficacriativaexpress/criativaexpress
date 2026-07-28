import { useState } from 'react'
import { Menu, X, Settings } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
              <img src="/logo.png" alt="Criativa Express" className="h-10 w-auto" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-xl">Criativa Express</h1>
              <p className="text-white/80 text-xs">Semijoias Premium</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="/#/admin" 
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition backdrop-blur"
            >
              <Settings size={18} />
              Painel Admin
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-3 border-t border-white/20 pt-4">
            <a 
              href="/#/admin" 
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition backdrop-blur w-full"
            >
              <Settings size={18} />
              Painel Admin
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
