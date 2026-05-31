import { useState } from 'react'
import { Edit2, Trash2, Plus, LogOut, Eye, EyeOff, Upload, Loader, Image as ImageIcon } from 'lucide-react'

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
  const [uploadingSlide, setUploadingSlide] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [adminPassword, setAdminPassword] = useState('admin123')
  const [editingPassword, setEditingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Verificar se já está autenticado ao carregar
  useEffect(() => {
    try {
      const isAuth = localStorage.getItem('semijoias_admin_auth')
      if (isAuth === 'true') {
        setIsAuthenticated(true)
      }
    } catch (e) {
      console.error('Erro ao verificar autenticação:', e)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('semijoias_admin_auth', 'true')
      setPassword('')
    } else {
      alert('Senha incorreta!')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, image: data.url })
      } else {
        alert('Erro ao fazer upload: ' + data.message)
      }
    } catch (error) {
      alert('Erro ao fazer upload: ' + error.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSlideImageUpload = async (e, idx) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingSlide(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        handleUpdateSlide(idx, 'image', data.url)
      } else {
        alert('Erro ao fazer upload: ' + data.message)
      }
    } catch (error) {
      alert('Erro ao fazer upload: ' + error.message)
    } finally {
      setUploadingSlide(false)
    }
  }

  const generateDescription = async () => {
    if (!apiKey) {
      alert('Por favor, configure a API Key da OpenAI nas Configurações primeiro!')
      return
    }

    if (!formData.name) {
      alert('Por favor, preencha o nome do produto primeiro!')
      return
    }

    setGeneratingDescription(true)
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productName: formData.name,
          category: formData.category,
          apiKey: apiKey
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, description: data.description })
        alert('Descrição gerada com sucesso!')
      } else {
        alert('Erro ao gerar descrição: ' + (data.message || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro detalhado:', error)
      alert('Erro ao gerar descrição: ' + error.message)
    } finally {
      setGeneratingDescription(false)
    }
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.description) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    let updatedProducts
    
    if (editingId) {
      updatedProducts = products.map(p => 
        p.id === editingId 
          ? { 
              ...p, 
              ...formData, 
              price: parseFloat(formData.price),
              specs: formData.specs.split(',').map(s => s.trim()) 
            }
          : p
      )
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...formData,
        price: parseFloat(formData.price),
        specs: formData.specs.split(',').map(s => s.trim())
      }
      updatedProducts = [...products, newProduct]
    }
    
    setProducts(updatedProducts)
    onProductsUpdate(updatedProducts)
    resetForm()
    alert('Produto salvo com sucesso!')
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      specs: product.specs.join(', '),
      featured: product.featured || false,
      image: product.image
    })
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      const updated = products.filter(p => p.id !== id)
      setProducts(updated)
      onProductsUpdate(updated)
    }
  }

  const handleToggleFeatured = (id) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, featured: !p.featured } : p
    )
    setProducts(updated)
    onProductsUpdate(updated)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Tags Personalizadas',
      description: '',
      price: '',
      specs: '',
      featured: false,
      image: ''
    })
    setEditingId(null)
  }

  const handleUpdateSlide = (idx, field, value) => {
    const newSlides = [...localConfig.slides]
    newSlides[idx] = { ...newSlides[idx], [field]: value }
    setLocalConfig({ ...localConfig, slides: newSlides })
  }

  const handleUpdateFeature = (idx, field, value) => {
    const newFeatures = [...localConfig.features]
    newFeatures[idx] = { ...newFeatures[idx], [field]: value }
    setLocalConfig({ ...localConfig, features: newFeatures })
  }

  const handleUpdateCategory = (idx, field, value) => {
    const newCategories = [...localConfig.categories]
    newCategories[idx] = { ...newCategories[idx], [field]: value }
    setLocalConfig({ ...localConfig, categories: newCategories })
  }

  const handleSaveConfig = () => {
    try {
      // Salvar no localStorage
      localStorage.setItem('semijoias_config', JSON.stringify(localConfig))
      // Chamar callback para atualizar App.jsx
      onConfigUpdate(localConfig)
      alert('Configurações salvas com sucesso!')
      // Recarregar página após 500ms para sincronizar
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (e) {
      alert('Erro ao salvar: ' + e.message)
    }
  }

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert('Preencha todos os campos!')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('As senhas não conferem!')
      return
    }
    if (newPassword.length < 4) {
      alert('A senha deve ter pelo menos 4 caracteres!')
      return
    }
    setAdminPassword(newPassword)
    setNewPassword('')
    setConfirmPassword('')
    setEditingPassword(false)
    alert('Senha alterada com sucesso!')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Painel Admin</h1>
          <p className="text-center text-gray-600 mb-6">Criativa Express</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Digite a senha"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Painel Admin - Criativa Express</h1>
          <div className="flex items-center gap-3">
            <a
              href="/pagamento"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <Plus size={20} />
              Gerar Pagamento
            </a>
            <button
              onClick={() => {
                setIsAuthenticated(false)
                localStorage.removeItem('semijoias_admin_auth')
                onLogout()
              }}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-4 border-b border-gray-200 flex-wrap">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'products'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'slides'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Slides
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'features'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'categories'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'settings'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Configurações
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Produtos */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  {editingId ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {localConfig.categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <div className="flex gap-2">
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="3"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateDescription}
                      disabled={generatingDescription || !apiKey}
                      className="mt-2 w-full text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {generatingDescription ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        '🤖 Gerar com IA'
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Especificações</label>
                    <input
                      type="text"
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Papel 300g, Impressão colorida"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload de Imagem</label>
                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition">
                        <div className="flex items-center gap-2">
                          {uploadingImage ? (
                            <>
                              <Loader size={16} className="animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload size={16} />
                              Escolher foto
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.image && (
                      <div className="mt-2 relative">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Produto em Destaque
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      {editingId ? 'Atualizar' : 'Adicionar'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Imagem</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Produto</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Preço</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Destaque</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                <ImageIcon size={16} className="text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">R$ {product.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleToggleFeatured(product.id)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                                product.featured
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {product.featured ? '⭐ Sim' : 'Não'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-800 transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-800 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slides */}
        {activeTab === 'slides' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Slides</h2>
            <div className="space-y-6">
              {localConfig.slides.map((slide, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Slide {idx + 1}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => handleUpdateSlide(idx, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gradiente</label>
                      <input
                        type="text"
                        value={slide.gradient}
                        onChange={(e) => handleUpdateSlide(idx, 'gradient', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: from-purple-600 to-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload de Imagem (Recomendado: 1920x600px)
                      </label>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition">
                          <div className="flex items-center gap-2">
                            {uploadingSlide ? (
                              <>
                                <Loader size={16} className="animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Escolher imagem
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSlideImageUpload(e, idx)}
                            disabled={uploadingSlide}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {slide.image && (
                        <div className="mt-2 relative">
                          <img
                            src={slide.image}
                            alt="Slide preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateSlide(idx, 'image', '')}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleSaveConfig}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Salvar Slides
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        {activeTab === 'features' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Informações</h2>
            <div className="space-y-6">
              {localConfig.features.map((feature, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Informação {idx + 1}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                      <select
                        value={feature.icon}
                        onChange={(e) => handleUpdateFeature(idx, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Zap">Zap</option>
                        <option value="Truck">Truck</option>
                        <option value="Clock">Clock</option>
                        <option value="Shield">Shield</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleSaveConfig}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Salvar Informações
              </button>
            </div>
          </div>
        )}

        {/* Categorias */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Categorias</h2>
            <div className="space-y-6">
              {localConfig.categories.map((category, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">{category.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={category.description}
                        onChange={(e) => handleUpdateCategory(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                      <input
                        type="text"
                        value={category.icon}
                        onChange={(e) => handleUpdateCategory(idx, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: 🏷️"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleSaveConfig}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Salvar Categorias
              </button>
            </div>
          </div>
        )}

        {/* Configurações */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Configurações</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número WhatsApp</label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="5561993629392"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Handle Infinity Pay</label>
                <input
                  type="text"
                  value={infinityPayHandle}
                  onChange={(e) => setInfinityPayHandle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="capitalqueen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key para IA (OpenAI)</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="sk-..."
                />
                <p className="text-xs text-gray-500 mt-1">Deixe em branco para desabilitar geração de descrições com IA</p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Segurança</h3>
                {!editingPassword ? (
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    Alterar Senha de Admin
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Digite a nova senha"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleChangePassword}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                      >
                        Salvar Senha
                      </button>
                      <button
                        onClick={() => {
                          setEditingPassword(false)
                          setNewPassword('')
                          setConfirmPassword('')
                        }}
                        className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSaveConfig}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
