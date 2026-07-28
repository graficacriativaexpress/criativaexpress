import { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, LogOut, Eye, EyeOff, Upload, Loader, Save, X, Settings, Package, Sliders } from 'lucide-react'

export default function AdminDashboard({ onLogout, onProductsUpdate, onConfigUpdate, initialProducts, config }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [products, setProducts] = useState(initialProducts)
  const [editingId, setEditingId] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
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
  const [localConfig, setLocalConfig] = useState(config)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('001394aR@')
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', icon: '', description: '' })
  const [editingCategoryForm, setEditingCategoryForm] = useState(null)

  useEffect(() => {
    const isAuth = localStorage.getItem('semijoias_admin_auth')
    if (isAuth === 'true') {
      setIsAuthenticated(true)
      fetchProducts()
      fetchConfig()
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

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config')
      const data = await res.json()
      if (data && !data.error) {
        setLocalConfig(data)
        if (onConfigUpdate) onConfigUpdate(data)
      }
    } catch (e) { console.error('Erro ao buscar config:', e) }
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

  const saveConfigToServer = async (updatedConfig) => {
    setLoading(true)
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      })
      alert('Configurações salvas com sucesso!')
    } catch (e) { alert('Erro ao salvar configurações') }
    setLoading(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('semijoias_admin_auth', 'true')
      fetchProducts()
      fetchConfig()
    } else {
      alert('Senha incorreta')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('semijoias_admin_auth')
    if (onLogout) onLogout()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })
      const data = await res.json()
      if (data.url) {
        setFormData({ ...formData, image: data.url })
      }
    } catch (e) {
      alert('Erro ao fazer upload da imagem')
    }
    setUploadingImage(false)
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.image) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const newProduct = { 
      ...formData, 
      id: Date.now(),
      price: parseFloat(formData.price),
      specs: formData.specs ? formData.specs.split(',').map(s => s.trim()) : []
    }
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

  const handleEditProduct = (product, category) => {
    setEditingId(product.id)
    setEditingCategory(category)
    setFormData({
      name: product.name,
      category: category,
      description: product.description,
      price: product.price,
      specs: product.specs ? product.specs.join(', ') : '',
      featured: product.featured || false,
      image: product.image
    })
  }

  const handleUpdateProduct = (e) => {
    e.preventDefault()
    const updatedProducts = { ...products }
    const productIndex = updatedProducts[editingCategory].findIndex(p => p.id === editingId)
    
    if (productIndex !== -1) {
      updatedProducts[editingCategory][productIndex] = {
        ...updatedProducts[editingCategory][productIndex],
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        specs: formData.specs ? formData.specs.split(',').map(s => s.trim()) : [],
        image: formData.image,
        featured: formData.featured
      }
      
      setProducts(updatedProducts)
      saveToServer(updatedProducts)
      if (onProductsUpdate) onProductsUpdate(updatedProducts)
      
      setEditingId(null)
      setEditingCategory(null)
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
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!newCategoryForm.name) {
      alert('Digite o nome da categoria')
      return
    }

    const newCategory = {
      id: newCategoryForm.name.toLowerCase().replace(/\s+/g, ''),
      name: newCategoryForm.name,
      icon: newCategoryForm.icon || '📦',
      description: newCategoryForm.description
    }

    const updatedConfig = {
      ...localConfig,
      categories: [...localConfig.categories, newCategory]
    }

    const updatedProducts = { ...products }
    updatedProducts[newCategoryForm.name] = []

    setLocalConfig(updatedConfig)
    setProducts(updatedProducts)
    saveConfigToServer(updatedConfig)
    saveToServer(updatedProducts)
    if (onConfigUpdate) onConfigUpdate(updatedConfig)

    setNewCategoryForm({ name: '', icon: '', description: '' })
  }

  const handleDeleteCategory = (categoryName) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"? Todos os produtos serão removidos!`)) {
      const updatedConfig = {
        ...localConfig,
        categories: localConfig.categories.filter(c => c.name !== categoryName)
      }

      const updatedProducts = { ...products }
      delete updatedProducts[categoryName]

      setLocalConfig(updatedConfig)
      setProducts(updatedProducts)
      saveConfigToServer(updatedConfig)
      saveToServer(updatedProducts)
      if (onConfigUpdate) onConfigUpdate(updatedConfig)
    }
  }

  const handleUpdateConfig = (e) => {
    e.preventDefault()
    saveConfigToServer(localConfig)
    if (onConfigUpdate) onConfigUpdate(localConfig)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Painel Administrativo</h2>
          <p className="text-gray-600 text-center mb-6">Criativa Express</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha de Acesso</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg font-bold hover:shadow-lg transition">
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-2 font-medium border-b-2 transition ${
              activeTab === 'products'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="inline mr-2" size={20} /> Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-2 font-medium border-b-2 transition ${
              activeTab === 'categories'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sliders className="inline mr-2" size={20} /> Categorias
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-2 font-medium border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="inline mr-2" size={20} /> Configurações
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* PRODUTOS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Formulário de Adicionar/Editar Produto */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus size={28} className="text-purple-600" /> {editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h2>
              <form onSubmit={editingId ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Nome do Produto"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
                <select
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {localConfig.categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <input
                  placeholder="Preço (ex: 89.90)"
                  type="number"
                  step="0.01"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="p-3 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  {uploadingImage && <Loader className="animate-spin text-purple-600" size={20} />}
                </div>
                <textarea
                  placeholder="Descrição"
                  className="p-3 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
                <input
                  placeholder="Especificações (separadas por vírgula)"
                  className="p-3 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={formData.specs}
                  onChange={e => setFormData({...formData, specs: e.target.value})}
                />
                {formData.image && (
                  <div className="md:col-span-2">
                    <img src={formData.image} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                  </div>
                )}
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 flex items-center justify-center gap-2">
                    {loading ? <Loader className="animate-spin" /> : <Save size={20} />} {editingId ? 'Atualizar' : 'Salvar'} Produto
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setEditingCategory(null)
                        setFormData({
                          name: '',
                          category: 'Tags Personalizadas',
                          description: '',
                          price: '',
                          specs: '',
                          featured: false,
                          image: ''
                        })
                      }}
                      className="px-4 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Produtos */}
            <div className="space-y-6">
              {Object.entries(products).map(([category, items]) => (
                <div key={category} className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-4 pb-3 border-b-2 border-gray-200">{category}</h3>
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhum produto nesta categoria</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map(product => (
                        <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition">
                          <img src={product.image} className="w-full h-40 object-cover rounded-lg mb-3" alt={product.name} />
                          <h4 className="font-bold text-gray-900">{product.name}</h4>
                          <p className="text-purple-600 font-bold text-lg my-2">R$ {parseFloat(product.price).toFixed(2)}</p>
                          <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product, category)}
                              className="flex-1 text-blue-500 hover:bg-blue-50 p-2 rounded flex items-center justify-center gap-1"
                            >
                              <Edit2 size={16} /> Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(category, product.id)}
                              className="flex-1 text-red-500 hover:bg-red-50 p-2 rounded flex items-center justify-center gap-1"
                            >
                              <Trash2 size={16} /> Deletar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIAS TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Adicionar Nova Categoria</h2>
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Nome da Categoria"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={newCategoryForm.name}
                  onChange={e => setNewCategoryForm({...newCategoryForm, name: e.target.value})}
                  required
                />
                <input
                  placeholder="Ícone (emoji ou caractere)"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={newCategoryForm.icon}
                  onChange={e => setNewCategoryForm({...newCategoryForm, icon: e.target.value})}
                  maxLength="2"
                />
                <textarea
                  placeholder="Descrição da Categoria"
                  className="p-3 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={newCategoryForm.description}
                  onChange={e => setNewCategoryForm({...newCategoryForm, description: e.target.value})}
                />
                <button type="submit" className="md:col-span-2 bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 flex items-center justify-center gap-2">
                  <Plus size={20} /> Adicionar Categoria
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Categorias Existentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localConfig.categories.map(cat => (
                  <div key={cat.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-start">
                    <div>
                      <p className="text-2xl mb-2">{cat.icon}</p>
                      <h4 className="font-bold text-gray-900">{cat.name}</h4>
                      <p className="text-gray-600 text-sm">{cat.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.name)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONFIGURAÇÕES TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Configurações Gerais</h2>
            <form onSubmit={handleUpdateConfig} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número WhatsApp</label>
                <input
                  placeholder="5511999999999"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={localConfig.whatsappNumber}
                  onChange={e => setLocalConfig({...localConfig, whatsappNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Handle Infinity Pay</label>
                <input
                  placeholder="seu_handle"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={localConfig.infinityPayHandle}
                  onChange={e => setLocalConfig({...localConfig, infinityPayHandle: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 flex items-center justify-center gap-2">
                {loading ? <Loader className="animate-spin" /> : <Save size={20} />} Salvar Configurações
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
