import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Criativa Express" className="h-12 w-auto" />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Menu vazio - sem botão Admin */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 space-y-2 pb-3 border-t border-gray-200 pt-3">
            {/* Menu vazio - sem botão Admin */}
          </nav>
        )}
      </div>
    </header>
  )
}
