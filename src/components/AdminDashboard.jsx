import { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, LogOut, Eye, EyeOff, Upload, Loader, Image as ImageIcon, Save } from 'lucide-react'

export default function AdminDashboard({ onLogout, onProductsUpdate, onConfigUpdate, initialProducts, config }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [products, setProducts] = useState(initialProducts)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tags Personalizadas',
    description: '',
    price: '',
    specs: '',
    featured: false,
    image: ''
  })
  const [activeTab, setActiveTab] = useState('products')
  const [whatsappNumber, setWhatsappNumber] = useState('5561993629392')
  const [infinityPayHandle, setInfinityPayHandle] = useState('capitalqueen')
  const [localConfig, setLocalConfig] = useState(config)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('001394aR@')

  useEffect(() => {
    const isAuth = localStorage.getItem('semijoias_admin_auth')
    if (isAuth === 'true') {
      setIsAuthenticated(true)
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data && !data.error) {
        setProducts(data)
        if (onProductsUpdate) onProductsUpdate(data)
      }
    } catch (e) { console.error('Erro ao buscar produtos:', e) }
  }

  const saveToServer = async (updatedProducts) => {
    setLoading(true)
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProducts)
      })
      alert('Alterações salvas com sucesso!')
    } catch (e) { alert('Erro ao salvar no servidor') }
    setLoading(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('semijoias_admin_auth', 'true')
      fetchProducts()
    } else {
      alert('Senha incorreta')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('semijoias_admin_auth')
    if (onLogout) onLogout()
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    const newProduct = { ...formData, id: Date.now() }
    const updatedProducts = { ...products }
    if (!updatedProducts[formData.category]) updatedProducts[formData.category] = []
    updatedProducts[formData.category].push(newProduct)
    
    setProducts(updatedProducts)
    saveToServer(updatedProducts)
    if (onProductsUpdate) onProductsUpdate(updatedProducts)
    
    setFormData({
      name: '',
      category: 'Tags Personalizadas',
      description: '',
      price: '',
      specs: '',
      featured: false,
      image: ''
    })
  }

  const handleDeleteProduct = (category, id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const updatedProducts = { ...products }
      updatedProducts[category] = updatedProducts[category].filter(p => p.id !== id)
      setProducts(updatedProducts)
      saveToServer(updatedProducts)
      if (onProductsUpdate) onProductsUpdate(updatedProducts)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Painel Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha de acesso"
                className="w-full p-3 border rounded-lg pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700">
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg">
            <LogOut size={20} /> Sair
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus size={24} className="text-purple-600" /> Adicionar Novo Produto
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nome do Produto"
              className="p-3 border rounded-lg"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <select
              className="p-3 border rounded-lg"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>Tags Personalizadas</option>
              <option>Cartão de Visita</option>
              <option>DTF</option>
            </select>
            <input
              placeholder="Preço (ex: 89.90)"
              className="p-3 border rounded-lg"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              required
            />
            <input
              placeholder="URL da Imagem"
              className="p-3 border rounded-lg"
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              required
            />
            <textarea
              placeholder="Descrição"
              className="p-3 border rounded-lg md:col-span-2"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
            <button type="submit" className="md:col-span-2 bg-purple-600 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2">
              {loading ? <Loader className="animate-spin" /> : <Save size={20} />} Salvar Produto
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {Object.entries(products).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(product => (
                  <div key={product.id} className="border rounded-xl p-4 flex gap-4">
                    <img src={product.image} className="w-20 h-20 object-cover rounded-lg" alt={product.name} />
                    <div className="flex-1">
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-purple-600 font-bold">R$ {product.price}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleDeleteProduct(category, product.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
