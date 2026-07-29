import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Criativa Express" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-gray-900 font-bold text-lg">Criativa Express</h1>
              <p className="text-gray-600 text-xs">Semijoias Premium</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 space-y-2 pb-2 border-t border-gray-200 pt-3">
            <p className="text-gray-600 text-sm px-2 py-1">Menu</p>
          </nav>
        )}
      </div>
    </header>
  )
}
