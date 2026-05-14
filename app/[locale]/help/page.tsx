'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

export default function HelpPage() {
  const locale = useLocale()
  const t = useTranslations('Footer')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold text-[#C62D2D]">
            Atithi
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/login`} className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Log in
            </Link>
            <Link 
              href={`/${locale}/signup`} 
              className="px-4 py-2 bg-[#C62D2D] text-white rounded-lg text-sm font-medium hover:bg-[#A82424] transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Centre</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Support Categories */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-[#FFE4E1] rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#C62D2D]">support_agent</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 text-sm mb-4">
              Learn how to create an account, book your first stay, or become a host.
            </p>
            <Link href="#" className="text-[#C62D2D] text-sm font-medium hover:underline">
              Learn more →
            </Link>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-[#FFE4E1] rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#C62D2D]">shield</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account & Security</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage your account settings, password, and NID verification.
            </p>
            <Link href="#" className="text-[#C62D2D] text-sm font-medium hover:underline">
              Learn more →
            </Link>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-[#FFE4E1] rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#C62D2D]">payments</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payments</h3>
            <p className="text-gray-600 text-sm mb-4">
              Information about payment methods, refunds, and pricing.
            </p>
            <Link href="#" className="text-[#C62D2D] text-sm font-medium hover:underline">
              Learn more →
            </Link>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-[#FFE4E1] rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#C62D2D]">gavel</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Policies</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our cancellation policies, house rules, and community guidelines.
            </p>
            <Link href="#" className="text-[#C62D2D] text-sm font-medium hover:underline">
              Learn more →
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-[#FFF5F5] rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is available 24/7 to assist you with any questions.
          </p>
          <a 
            href="mailto:support@atithi.bd" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C62D2D] text-white rounded-xl font-medium hover:bg-[#A82424] transition-colors"
          >
            <span className="material-symbols-outlined">mail</span>
            Contact Support
          </a>
        </div>
      </main>
    </div>
  )
}
