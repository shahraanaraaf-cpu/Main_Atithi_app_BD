'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function TermsPage() {
  const locale = useLocale()
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href={`/${locale}`} className="text-2xl font-bold text-[#C62D2D]">
            Atithi
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: April 26, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing or using Atithi App BD, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
            <p className="text-gray-600">
              You must be at least 18 years old to create an account. You are responsible for 
              maintaining the confidentiality of your account information and for all activities 
              that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. NID Verification</h2>
            <p className="text-gray-600">
              All users must complete NID verification to ensure community safety. 
              Your NID information is encrypted and stored securely.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Bookings and Payments</h2>
            <p className="text-gray-600">
              When you book a stay or experience, you agree to pay all applicable fees. 
              Cancellation policies vary by listing and are clearly displayed before booking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact</h2>
            <p className="text-gray-600">
              For questions about these terms, please contact us at{' '}
              <a href="mailto:legal@atithi.bd" className="text-[#C62D2D] hover:underline">
                legal@atithi.bd
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
