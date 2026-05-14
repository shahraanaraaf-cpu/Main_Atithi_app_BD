'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: April 26, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600">
              We collect information you provide directly to us, including your name, email address, 
              phone number, NID information, and payment details. We also collect information about 
              your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. NID Data Security</h2>
            <p className="text-gray-600">
              Your National ID (NID) information is encrypted using military-grade encryption and 
              stored on secure local servers. We never share your NID details with hosts or third parties 
              without your explicit consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600">
              We use your information to provide and improve our services, process transactions, 
              verify your identity, and communicate with you about bookings and account activity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
            <p className="text-gray-600">
              We retain your information as long as your account is active or as needed to provide 
              you services. You can request account deletion at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
            <p className="text-gray-600">
              For privacy-related questions, please contact us at{' '}
              <a href="mailto:privacy@atithi.bd" className="text-[#C62D2D] hover:underline">
                privacy@atithi.bd
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
