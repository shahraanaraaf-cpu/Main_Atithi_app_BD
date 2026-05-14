'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function GuestPreferencesPage() {
  const locale = useLocale()
  const [emailTips, setEmailTips] = useState(true)
  const [smsReminders, setSmsReminders] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <GlobalHeader activeTab="stays" />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-10 w-full">
        <Link
          href={`/${locale}/dashboard/guest/overview`}
          className="text-sm font-semibold text-[#C62D2D] hover:underline mb-6 inline-block"
        >
          ← Back to overview
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Travel preferences</h1>
        <p className="text-zinc-500 mb-8">How we should reach you about trips and deals.</p>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-sm">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-medium text-zinc-900">Email tips & inspiration</div>
              <div className="text-sm text-zinc-500">Ideas for your next stay in Bangladesh.</div>
            </div>
            <input
              type="checkbox"
              checked={emailTips}
              onChange={(e) => setEmailTips(e.target.checked)}
              className="h-5 w-5 rounded border-zinc-300"
            />
          </label>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-medium text-zinc-900">SMS reminders</div>
              <div className="text-sm text-zinc-500">Check-in reminders for upcoming stays.</div>
            </div>
            <input
              type="checkbox"
              checked={smsReminders}
              onChange={(e) => setSmsReminders(e.target.checked)}
              className="h-5 w-5 rounded border-zinc-300"
            />
          </label>
          <p className="text-xs text-zinc-400">
            Preferences are stored on this device for now. Account-wide settings will sync when connected to your
            profile.
          </p>
          <Button type="button" className="w-full sm:w-auto opacity-80" disabled>
            Save (coming soon)
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
