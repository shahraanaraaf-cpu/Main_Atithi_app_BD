'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { handleIPN } from '@/app/actions/payment'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'
import { useCurrency } from '@/app/contexts/CurrencyContext'

export default function MockPaymentGateway() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tranId = searchParams.get('tranId')
  const amount = searchParams.get('amount')
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash')
  const [loading, setLoading] = useState(false)
  const { formatPrice, convertPrice } = useCurrency()

  const handlePay = async () => {
    setLoading(true)
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Call the IPN handler (Simulation)
    const result = await handleIPN(tranId!, 'VALID')
    
    if (result.success) {
      router.push(`/checkout/success?tranId=${tranId}&amount=${amount}`)
    } else {
      alert('Payment failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="bg-[#1d3557] p-6 text-white text-center">
          <h1 className="text-xl font-bold tracking-tight">Atithi Secure Checkout</h1>
          <p className="text-sm opacity-80">SSLCommerz Hosted Integration (Simulation)</p>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            <p className="text-zinc-500 text-sm mb-1 uppercase font-black tracking-widest">Amount to Pay</p>
            <h2 className="text-4xl font-black text-zinc-900">
              <PriceDisplay priceBDT={Number(amount)} />
            </h2>
            <p className="text-[10px] text-zinc-400 mt-2 font-mono">TRANSACTION ID: {tranId}</p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-sm font-bold text-zinc-900">Select Payment Method:</p>
            
            <button 
              onClick={() => setMethod('bkash')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${method === 'bkash' ? 'border-[#E2136E] bg-[#E2136E]/5' : 'border-zinc-100 hover:border-zinc-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E2136E] rounded-lg flex items-center justify-center text-white font-bold text-xs">bKash</div>
                <span className="font-bold text-zinc-900">bKash Checkout</span>
              </div>
              {method === 'bkash' && <span className="material-symbols-outlined text-[#E2136E]">check_circle</span>}
            </button>

            <button 
              onClick={() => setMethod('nagad')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${method === 'nagad' ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-zinc-100 hover:border-zinc-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F7941D] rounded-lg flex items-center justify-center text-white font-bold text-xs">Nagad</div>
                <span className="font-bold text-zinc-900">Nagad Checkout</span>
              </div>
              {method === 'nagad' && <span className="material-symbols-outlined text-[#F7941D]">check_circle</span>}
            </button>

            <button 
              onClick={() => setMethod('card')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${method === 'card' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                </div>
                <span className="font-bold text-zinc-900">VISA / Mastercard</span>
              </div>
              {method === 'card' && <span className="material-symbols-outlined text-zinc-900">check_circle</span>}
            </button>
          </div>

          <button 
            onClick={handlePay}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${loading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-[#1d3557] hover:bg-[#152a45] active:scale-95'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay ${formatPrice(convertPrice(Number(amount)))}`
            )}
          </button>

          <p className="mt-6 text-center text-[10px] text-zinc-400 leading-relaxed uppercase tracking-tighter">
            Securely processed by SSLCommerz Payment Gateway.<br />
            Do not refresh this page.
          </p>
        </div>
      </div>
    </div>
  )
}
