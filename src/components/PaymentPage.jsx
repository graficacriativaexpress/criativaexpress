import { useState } from 'react'
import { MessageCircle, Check, AlertCircle, Loader } from 'lucide-react'

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    amount: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generatePaymentLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validação básica
      if (!formData.amount || !formData.description) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }

      const amountInCents = Math.round(parseFloat(formData.amount) * 100)

      // Dados para enviar à API
      const payload = {
        handle: 'capitalqueen',
        redirect_url: `${window.location.origin}/pagamento-confirmado`,
        webhook_url: `${window.location.origin}/api/webhook/infinitepay`,
        order_nsu: `ORDER-${Date.now()}`,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone_number: formData.customerPhone,
        },
        items: [
          {
            quantity: 1,
            price: amountInCents,
            description: formData.description,
          }
        ]
      }

      // Chamar o endpoint do servidor (proxy seguro)
      const response = await fetch('/api/payment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao gerar link de pagamento')
      }

      const data = await response.json()
      if (!data.success || !data.url) {
        throw new Error(data.message || 'Erro ao gerar link de pagamento')
      }
      setPaymentLink(data.url)
      
      // Limpar formulário
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        amount: '',
        description: '',
      })
    } catch (err) {
      setError(err.message || 'Erro ao gerar link de pagamento')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openPaymentLink = () => {
    window.open(paymentLink, '_blank')
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-800 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-4">
            Gerar Link de Pagamento
          </h1>
          <p className="text-xl text-accent-200">
            Crie um link de pagamento personalizado e envie para seu cliente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-white rounded-2xl shadow-premium p-8 animate-fade-in-up">
            <h2 className="font-serif text-2xl font-bold text-dark-900 mb-6">
              Dados do Pagamento
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-red-900">Erro</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={generatePaymentLink} className="space-y-4">
              {/* Nome do Cliente */}
              <div>
                <label className="block text-sm font-semibold text-dark-800 mb-2">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-dark-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="joao@email.com"
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-semibold text-dark-800 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+55 11 99999-9999"
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-semibold text-dark-800 mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="100.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-dark-800 mb-2">
                  Descrição do Produto *
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ex: Kit Tags Personalizadas"
                  required
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Gerando link...
                  </>
                ) : (
                  'Gerar Link de Pagamento'
                )}
              </button>
            </form>
          </div>

          {/* Resultado */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {paymentLink ? (
              <div className="bg-white rounded-2xl shadow-premium p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="text-green-600" size={24} />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-dark-900">
                      Link Gerado!
                    </h3>
                  </div>

                  <p className="text-dark-600 mb-6">
                    Seu link de pagamento foi criado com sucesso. Compartilhe com seu cliente:
                  </p>

                  {/* Link Box */}
                  <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mb-6">
                    <p className="text-xs text-dark-600 mb-2 font-semibold">LINK DE PAGAMENTO:</p>
                    <p className="text-sm text-primary-700 font-mono break-all mb-3">
                      {paymentLink}
                    </p>
                    <button
                      onClick={copyToClipboard}
                      className="text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
                    >
                      {copied ? '✓ Copiado!' : 'Copiar Link'}
                    </button>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                    <p className="text-sm text-blue-900">
                      <strong>Dica:</strong> Quando seu cliente pagar, você receberá uma notificação automática no WhatsApp!
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={openPaymentLink}
                    className="w-full btn-primary"
                  >
                    Abrir Link de Pagamento
                  </button>
                  <button
                    onClick={() => {
                      setPaymentLink(null)
                      setFormData({
                        customerName: '',
                        customerEmail: '',
                        customerPhone: '',
                        amount: '',
                        description: '',
                      })
                    }}
                    className="w-full btn-secondary"
                  >
                    Gerar Outro Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-premium p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="text-primary-700" size={32} />
                </div>
                <h3 className="font-serif text-xl font-bold text-dark-900 mb-2">
                  Pronto para cobrar?
                </h3>
                <p className="text-dark-600">
                  Preencha os dados ao lado e gere um link de pagamento personalizado para seu cliente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
