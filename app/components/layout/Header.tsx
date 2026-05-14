'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { HostTypeModal } from '@/app/components/modals/HostTypeModal'
import { useAuth } from '@/app/contexts/AuthContext'

export function Header({ 
  userRole, 
  forceCompact = false,
  activeTab,
  initialSearchState
}: {
  userRole?: string,
  forceCompact?: boolean,
  activeTab?: 'stays' | 'experiences' | 'services',
  initialSearchState?: any
}) {
  const t = useTranslations('Index')
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const { isAuthenticated, user, logout } = useAuth()
  
  // Debug auth state
  useEffect(() => {
    console.log('Header: Auth state changed:', { isAuthenticated, user })
    console.log('Header: localStorage user:', typeof window !== 'undefined' ? localStorage.getItem('atithi-user') : 'SSR')
  }, [isAuthenticated, user])

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)

  return (
    <div className="relative">
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${currentLocale}`} className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#FF385C]">অতি</span>
              <span className="text-2xl font-bold text-zinc-900">Atithi</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-2 flex-shrink-0 z-10">
              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-zinc-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-zinc-600">menu</span>
                </button>

                {/* PROFILE DROP DOWN */}
                {isProfileOpen && (
                  <div className="absolute top-[120%] right-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 w-[300px] py-2 z-[110]">
                    {isAuthenticated ? (
                      <>
                        <Link 
                          href={`/${currentLocale}/dashboard/${user?.role?.toLowerCase() === 'host' ? 'host' : 'guest'}/overview`}
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-6 py-3 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                        >
                          <span className="material-symbols-outlined text-zinc-500">account_circle</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{t('myAccount')}</span>
                            <span className="text-xs text-zinc-500">{user?.fullName} • {user?.role}</span>
                          </div>
                        </Link>
                        <div className="my-2 border-t border-zinc-100" />
                        <button 
                          onClick={() => {
                            logout()
                            setIsProfileOpen(false)
                            router.push(`/${currentLocale}`)
                          }}
                          className="w-full text-left px-6 py-3 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                        >
                          <span className="material-symbols-outlined text-zinc-500">logout</span>
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </>
                    ) : (
                      <Link 
                        href={`/${currentLocale}/login`}
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full text-left px-6 py-4 hover:bg-zinc-50 text-sm font-bold text-zinc-950 transition-colors block"
                      >
                        {t('loginSignup')}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Host Type Modal */}
      <HostTypeModal 
        isOpen={isHostModalOpen} 
        onClose={() => setIsHostModalOpen(false)} 
      />
    </div>
  )
}
