import { CheckCircle, Download, Home } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

export default function PaymentConfirmed() {
  const [searchParams] = useSearchParams()
  
  const receiptUrl = searchParams.get('receipt_url')
  const orderNsu = searchParams.get('order_nsu')
  const transactionNsu = searchParams.get('transaction_nsu')

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-premium p-8 sm:p-12 text-center animate-fade-in-up">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dark-900 mb-4">
            Pagamento Confirmado! 🎉
          </h1>

          {/* Message */}
          <p className="text-lg text-dark-600 mb-8">
            Seu pagamento foi processado com sucesso. Você receberá uma confirmação no WhatsApp em breve.
          </p>

          {/* Details */}
          <div className="bg-primary-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-dark-900 mb-4">Detalhes da Transação:</h3>
            <div className="space-y-3">
              {orderNsu && (
                <div className="flex justify-between">
                  <span className="text-dark-600">Pedido:</span>
                  <span className="font-mono text-dark-900">{orderNsu}</span>
                </div>
              )}
              {transactionNsu && (
                <div className="flex justify-between">
                  <span className="text-dark-600">Transação:</span>
                  <span className="font-mono text-dark-900 text-sm">{transactionNsu}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 sm:space-y-0 sm:flex gap-4">
            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Baixar Comprovante
              </a>
            )}
            <a
              href="/"
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Voltar ao Catálogo
            </a>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-left">
            <p className="text-sm text-blue-900">
              <strong>✓ Próximas ações:</strong> Você receberá uma mensagem automática no WhatsApp confirmando o pagamento. Fique atento ao seu telefone!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
