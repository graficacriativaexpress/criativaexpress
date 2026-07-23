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

  // Carregar produtos do servidor ao entrar
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
      setProducts(data)
      if (onProductsUpdate) onProductsUpdate(data)
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
      alert('Alterações salvas permanentemente!')
    } catch (e) { alert('Erro ao salvar no servidor') }
    setLoading(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('semijoias_admin_auth', 'true')
      fetchProducts()
    } else { alert('Senha incorreta!') }
  }

  const handleLogout = () => {
    localStorage.removeItem('semijoias_admin_auth')
    setIsAuthenticated(false)
    if (onLogout) onLogout()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    const data = new FormData()
    data.append('image', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data })
      const result = await res.json()
      setFormData({ ...formData, image: result.url })
    } catch (e) { alert('Erro no upload') }
    setUploadingImage(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedProducts = { ...products }
    const productData = {
      ...formData,
      id: editingId || Date.now(),
      price: parseFloat(formData.price),
      specs: formData.specs.split('\n').filter(s => s.trim())
    }

    if (editingId) {
      updatedProducts[formData.category] = updatedProducts[formData.category].map(p => p.id === editingId ? productData : p)
    } else {
      updatedProducts[formData.category] = [...updatedProducts[formData.category], productData]
    }

    setProducts(updatedProducts)
    await saveToServer(updatedProducts)
    setEditingId(null)
    setFormData({ name: '', category: 'Tags Personalizadas', description: '', price: '', specs: '', featured: false, image: '' })
  }

  const handleDelete = async (category, id) => {
    if (!confirm('Deseja excluir este produto?')) return
    const updatedProducts = { ...products }
    updatedProducts[category] = updatedProducts[category].filter(p => p.id !== id)
    setProducts(updatedProducts)
    await saveToServer(updatedProducts)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      ...product,
      specs: product.specs.join('\n')
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Acesso Administrativo</h1>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">Entrar</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Painel de Controle</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"><LogOut size={20} /> Sair</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            {editingId ? <Edit2 size={20} className="text-purple-600" /> : <Plus size={20} className="text-green-600" />}
            {editingId ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none">
                  <option>Tags Personalizadas</option>
                  <option>Cartão de Visita</option>
                  <option>DTF</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especificações (uma por linha)</label>
                <textarea rows="3" value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

            <div className="md:col-span-2 border-t pt-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                <div className="flex items-center gap-4">
                  {formData.image && <img src={formData.image} className="w-20 h-20 rounded-lg object-cover border" />}
                  <label className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                    {uploadingImage ? <Loader className="animate-spin text-purple-600" /> : <Upload className="text-gray-400 mb-2" />}
                    <span className="text-sm text-gray-500">Clique para fazer upload</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => {setEditingId(null); setFormData({name: '', category: 'Tags Personalizadas', description: '', price: '', specs: '', featured: false, image: ''})}} className="px-6 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={loading} className="px-10 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all flex items-center gap-2">
                  {loading ? <Loader className="animate-spin" /> : <Save size={20} />}
                  {editingId ? 'Atualizar Produto' : 'Adicionar Produto'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          {Object.entries(products).map(([category, items]) => (
            <section key={category}>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                {category}
                <span className="text-sm font-normal text-gray-500">{items.length} produtos</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <img src={product.image} className="w-full h-40 object-cover rounded-lg mb-4 border" />
                    <h4 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h4>
                    <p className="text-purple-600 font-bold mb-4">R$ {product.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(product)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"><Edit2 size={16} /> Editar</button>
                      <button onClick={() => handleDelete(category, product.id)} className="flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
