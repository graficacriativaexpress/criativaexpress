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
  const [adminPassword, setAdminPassword] = useState('001394aR@')
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
