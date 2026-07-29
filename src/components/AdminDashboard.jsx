import { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, LogOut, Eye, EyeOff, Upload, Loader, Save, X, Settings, Package, Sliders, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react'

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
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Configurações do GitHub
  const GITHUB_REPO = 'graficacriativaexpress/criativaexpress'
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''

  useEffect(() => {
    const isAuth = localStorage.getItem('semijoias_admin_auth')
    if (isAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const showSuccess = (msg) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (msg) => {
    setErrorMessage(msg)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  // Função para salvar no GitHub
  const saveToGitHub = async (filename, content) => {
    if (!GITHUB_TOKEN) {
      showError('Token do GitHub não configurado! Verifique as variáveis de ambiente.')
      return false
    }

    setLoading(true)
    try {
      const path = `public/${filename}`
      const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`
      
      // 1. Pegar o SHA atual do arquivo
      const getRes = await fetch(url, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
      })
      
      let sha = ''
      if (getRes.ok) {
        const getData = await getRes.json()
        sha = getData.sha
      }

      // 2. Salvar o novo conteúdo
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Atualizar ${filename} via Painel Admin`,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
          sha: sha || undefined
        })
      })

      if (putRes.ok) {
        showSuccess(`${filename} salvo com sucesso no GitHub!`)
        return true
      } else {
        const errorData = await putRes.json()
        showError(`Erro ao salvar no GitHub: ${errorData.message}`)
        return false
      }
    } catch (e) {
      showError('Erro de conexão com o GitHub')
      console.error(e)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('semijoias_admin_auth', 'true')
    } else {
      showError('Senha incorreta')
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

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      showError('Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas')
      return
    }

    // Limite maior para Base64 (3MB)
    if (file.size > 3 * 1024 * 1024) {
      showError('Imagem muito grande! Máximo 3MB.')
      return
    }

    setUploadingImage(true)
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result })
        showSuccess('Imagem carregada!')
      }
      reader.readAsDataURL(file)
    } catch (e) {
      showError('Erro ao carregar imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.image) {
      showError('Preencha nome, preço e adicione uma imagem')
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
    
    const success = await saveToGitHub('products.json', updatedProducts)
    if (success) {
      setProducts(updatedProducts)
      if (onProductsUpdate) onProductsUpdate(updatedProducts)
      setFormData({
        name: '', category: 'Tags Personalizadas', description: '', price: '', specs: '', featured: false, image: ''
      })
    }
  }

  const handleDeleteProduct = async (category, id) => {
    if (window.confirm('Excluir este produto?')) {
      const updatedProducts = { ...products }
      updatedProducts[category] = updatedProducts[category].filter(p => p.id !== id)
      
      const success = await saveToGitHub('products.json', updatedProducts)
      if (success) {
        setProducts(updatedProducts)
        if (onProductsUpdate) onProductsUpdate(updatedProducts)
      }
    }
  }

  const handleEditProduct = (product, category) => {
    setEditingId(product.id)
    setEditingCategory(category)
    setFormData({
      name: product.name,
      category: category,
      description: product.description,
      price: product.price.toString(),
      specs: product.specs ? product.specs.join(', ') : '',
      featured: product.featured || false,
      image: product.image
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    if (!editingId || !editingCategory) return

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
      
      const success = await saveToGitHub('products.json', updatedProducts)
      if (success) {
        setProducts(updatedProducts)
        if (onProductsUpdate) onProductsUpdate(updatedProducts)
        setEditingId(null)
        setEditingCategory(null)
        setFormData({
          name: '', category: 'Tags Personalizadas', description: '', price: '', specs: '', featured: false, image: ''
        })
      }
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryForm.name) return

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
    if (!updatedProducts[newCategoryForm.name]) updatedProducts[newCategoryForm.name] = []

    const successConfig = await saveToGitHub('config.json', updatedConfig)
    const successProducts = await saveToGitHub('products.json', updatedProducts)

    if (successConfig && successProducts) {
      setLocalConfig(updatedConfig)
      setProducts(updatedProducts)
      if (onConfigUpdate) onConfigUpdate(updatedConfig)
      setNewCategoryForm({ name: '', icon: '', description: '' })
    }
  }

  const handleDeleteCategory = async (categoryName) => {
    if (window.confirm(`Excluir a categoria "${categoryName}"?`)) {
      const updatedConfig = {
        ...localConfig,
        categories: localConfig.categories.filter(c => c.name !== categoryName)
      }
      const updatedProducts = { ...products }
      delete updatedProducts[categoryName]

      const successConfig = await saveToGitHub('config.json', updatedConfig)
      const successProducts = await saveToGitHub('products.json', updatedProducts)

      if (successConfig && successProducts) {
        setLocalConfig(updatedConfig)
        setProducts(updatedProducts)
        if (onConfigUpdate) onConfigUpdate(updatedConfig)
      }
    }
  }

  const handleUpdateConfig = async (e) => {
    e.preventDefault()
    const success = await saveToGitHub('config.json', localConfig)
    if (success && onConfigUpdate) onConfigUpdate(localConfig)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Painel Admin</h2>
            <p className="text-gray-600">Criativa Express</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha de Acesso</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl pr-10 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-bold hover:shadow-lg transition transform hover:scale-105">
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificações */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50 animate-bounce">
          <CheckCircle size={20} /> {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50 animate-shake">
          <AlertCircle size={20} /> {errorMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'products' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="inline mr-2" size={20} /> Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'categories' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sliders className="inline mr-2" size={20} /> Categorias
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'settings' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="inline mr-2" size={20} /> Configurações
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Formulário */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-purple-600">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                {editingId ? <Edit2 className="text-purple-600" /> : <Plus className="text-purple-600" />}
                {editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h2>
              <form onSubmit={editingId ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input
                    placeholder="Nome do Produto"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {localConfig.categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-4">
                    <input
                      placeholder="Preço (ex: 89.90)"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                    <label className="flex-1 cursor-pointer bg-purple-50 border-2 border-dashed border-purple-300 rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-purple-100 transition">
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      {uploadingImage ? <Loader className="animate-spin" /> : <ImageIcon size={20} />}
                      <span className="text-sm font-medium text-purple-700">Selecionar Imagem</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <textarea
                    placeholder="Descrição"
                    className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-purple-600"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                  <input
                    placeholder="Especificações (separadas por vírgula)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    value={formData.specs}
                    onChange={e => setFormData({...formData, specs: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2">
                    {loading ? <Loader className="animate-spin" /> : <Save size={20} />}
                    {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', category: 'Tags Personalizadas', description: '', price: '', specs: '', featured: false, image: '' });
                      }}
                      className="px-8 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista */}
            <div className="space-y-6">
              {Object.entries(products).map(([category, items]) => (
                <div key={category} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-600">
                  <h3 className="text-xl font-bold mb-4 pb-3 border-b-2 border-gray-200">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(product => (
                      <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                        <img src={product.image} className="w-full h-40 object-cover rounded-lg mb-3" alt={product.name} />
                        <h4 className="font-bold">{product.name}</h4>
                        <p className="text-pink-600 font-bold">R$ {parseFloat(product.price).toFixed(2)}</p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleEditProduct(product, category)} className="flex-1 text-blue-500 hover:bg-blue-50 p-2 rounded flex items-center justify-center gap-1"><Edit2 size={16} /> Editar</button>
                          <button onClick={() => handleDeleteProduct(category, product.id)} className="flex-1 text-red-500 hover:bg-red-50 p-2 rounded flex items-center justify-center gap-1"><Trash2 size={16} /> Deletar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
              <h2 className="text-2xl font-bold mb-6">Nova Categoria</h2>
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Nome" className="p-3 border rounded-lg" value={newCategoryForm.name} onChange={e => setNewCategoryForm({...newCategoryForm, name: e.target.value})} required />
                <input placeholder="Ícone" className="p-3 border rounded-lg" value={newCategoryForm.icon} onChange={e => setNewCategoryForm({...newCategoryForm, icon: e.target.value})} />
                <textarea placeholder="Descrição" className="p-3 border rounded-lg md:col-span-2" value={newCategoryForm.description} onChange={e => setNewCategoryForm({...newCategoryForm, description: e.target.value})} />
                <button type="submit" className="md:col-span-2 bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 transition">Adicionar</button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localConfig.categories.map(cat => (
                <div key={cat.id} className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
                  <div><span className="text-2xl">{cat.icon}</span> <span className="font-bold ml-2">{cat.name}</span></div>
                  <button onClick={() => handleDeleteCategory(cat.name)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-600">
            <h2 className="text-2xl font-bold mb-6">Configurações</h2>
            <form onSubmit={handleUpdateConfig} className="space-y-6">
              <input placeholder="WhatsApp" className="w-full p-3 border rounded-lg" value={localConfig.whatsappNumber} onChange={e => setLocalConfig({...localConfig, whatsappNumber: e.target.value})} />
              <input placeholder="Infinity Pay" className="w-full p-3 border rounded-lg" value={localConfig.infinityPayHandle} onChange={e => setLocalConfig({...localConfig, infinityPayHandle: e.target.value})} />
              <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 transition">Salvar Tudo</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
