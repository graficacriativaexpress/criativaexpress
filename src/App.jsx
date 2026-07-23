import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ProtectedPaymentPage from './components/ProtectedPaymentPage'
import PaymentConfirmed from './components/PaymentConfirmed'
import AdminDashboard from './components/AdminDashboard'


const CACHE_VERSION = '3.0' // Incrementar para limpar cache


function App() {
  // Limpar cache antigo se versão mudou
  useEffect(() => {
    const savedVersion = localStorage.getItem('semijoias_version')
    if (savedVersion !== CACHE_VERSION) {
      localStorage.removeItem('semijoias_config')
      localStorage.removeItem('semijoias_products')
      localStorage.setItem('semijoias_version', CACHE_VERSION)
      window.location.reload()
    }
  }, [])


  // Configurações globais com localStorage
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('semijoias_config')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Erro ao carregar config:', e)
    }
    return {
    slides: [
      {
        id: 1,
        title: 'Qualidade Premium',
        subtitle: 'Produtos de alta qualidade para suas semijoias',
        gradient: 'from-purple-600 to-blue-600'
      },
      {
        id: 2,
        title: 'Entrega Rápida',
        subtitle: 'Receba seus pedidos em até 24 horas',
        gradient: 'from-blue-600 to-cyan-500'
      },
      {
        id: 3,
        title: 'Melhor Preço',
        subtitle: 'Os melhores preços do mercado',
        gradient: 'from-purple-600 to-pink-600'
      }
    ],
    features: [
      {
        id: 1,
        title: 'Qualidade Premium',
        description: 'Produtos de alta qualidade garantida',
        icon: 'Zap'
      },
      {
        id: 2,
        title: 'Entrega Rápida',
        description: 'Entrega em até 24 horas',
        icon: 'Truck'
      },
      {
        id: 3,
        title: 'Atendimento 24/7',
        description: 'Suporte sempre disponível',
        icon: 'Clock'
      },
