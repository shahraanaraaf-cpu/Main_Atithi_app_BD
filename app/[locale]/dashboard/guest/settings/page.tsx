'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function GuestSettingsPage() {
  const locale = useLocale()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

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
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Account</h1>
        <p className="text-zinc-500 mb-8">Profile and sign-in for your guest dashboard.</p>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 shadow-sm">
          {isAuthenticated && user ? (
            <>
              <div>
                <div className="text-xs font-semibold uppercase text-zinc-400 tracking-wide">Name</div>
                <div className="text-zinc-900 font-medium mt-1">{user.fullName}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-zinc-400 tracking-wide">Email</div>
                <div className="text-zinc-900 font-medium mt-1">{user.email}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-zinc-400 tracking-wide">Role</div>
                <div className="text-zinc-900 font-medium mt-1">{user.role}</div>
              </div>
              <Button
                type="button"
                variant="destructive"
                className="mt-4"
                onClick={() => {
                  logout()
                  router.push(`/${locale}`)
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <p className="text-zinc-600 text-sm">You&apos;re not signed in with a saved session.</p>
              <Link
                href={`/${locale}/login`}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
