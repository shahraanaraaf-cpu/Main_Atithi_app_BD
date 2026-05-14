'use client'

import { useSearchParams, useParams } from 'next/navigation'
import { Header } from '@/app/components/layout/Header'
import { Footer } from '@/app/components/layout/Footer'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'
import Link from 'next/link'

export default function SuccessPage() {
  const params = useParams() as { locale: string }
  const searchParams = useSearchParams()
  const tranId = searchParams.get('tranId')
  const amount = searchParams.get('amount')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header forceCompact />
      
      <main className="flex-1 flex items-center justify-center p-6 py-20">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-zinc-200 shadow-2xl p-12 text-center relative overflow-hidden">
          {/* Animated Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-gradient-x" />
          
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
            <span className="material-symbols-outlined text-5xl font-bold">check_circle</span>
          </div>

          <h1 className="text-4xl font-black text-zinc-900 mb-4">Reservation Confirmed!</h1>
          <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto">
            Pack your bags! Your booking is secured and your host has been notified. 
            We've sent the confirmation details to your email.
          </p>

          <div className="bg-zinc-50 rounded-2xl p-8 mb-10 text-left border border-zinc-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-500 font-medium">Transaction ID</span>
              <span className="font-black text-zinc-900 font-mono uppercase">{tranId || 'AT-992384'}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-500 font-medium">Amount Paid</span>
              <PriceDisplay priceBDT={Number(amount || 0)} className="font-black text-zinc-900" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 font-medium">Status</span>
              <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">Confirmed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href={`/${params.locale}/dashboard/guest`}
              className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Manage Trip
            </Link>
            <button 
              onClick={() => window.print()}
              className="px-8 py-4 border-2 border-zinc-950 text-zinc-950 font-bold rounded-2xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              PDF Receipt
            </button>
          </div>
          
          <Link 
            href={`/${params.locale}`}
            className="inline-block mt-8 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-all underline underline-offset-4"
          >
            Back to Explore
          </Link>
        </div>
      </main>

      <Footer />

    </div>
  )
}
