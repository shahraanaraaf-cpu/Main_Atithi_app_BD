'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { getTopDestinations } from '@/app/actions/listings'
import type { Listing } from '@/app/actions/listings'
import { HostTypeModal } from '@/app/components/modals/HostTypeModal'
import { useCurrency, type CurrencyCode } from '@/app/contexts/CurrencyContext'
import { useAuth } from '@/app/contexts/AuthContext'

interface SearchState {
  location?: string
  checkIn?: string
  checkout?: string
  guests?: { adults: number, children: number, infants: number, pets: number }
}

export function Header({ 
  userRole, 
  forceCompact = false,
  activeTab,
  initialSearchState
}: {
  userRole?: string,
  forceCompact?: boolean,
  activeTab?: 'stays' | 'experiences' | 'services',
  initialSearchState?: SearchState
}) {
  const t = useTranslations('Index')
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const { currency, setCurrency, convertPrice, formatPrice } = useCurrency()
  const { isAuthenticated, user, logout } = useAuth()
  
  // Debug auth state
  useEffect(() => {
    console.log('Header: Auth state changed:', { isAuthenticated, user })
    console.log('Header: localStorage user:', typeof window !== 'undefined' ? localStorage.getItem('atithi-user') : 'SSR')
  }, [isAuthenticated, user])

  const [activeMenu, setActiveMenu] = useState<'where' | 'when' | 'who' | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [dateMode, setDateMode] = useState<'dates' | 'flexible'>('dates')
  const [flexibleStay, setFlexibleStay] = useState<'weekend' | 'week' | 'month'>('weekend')
  const [guests, setGuests] = useState(initialSearchState?.guests || { adults: 0, children: 0, infants: 0, pets: 0 })
  const [selectedLocation, setSelectedLocation] = useState<string>(initialSearchState?.location || '')
  const [checkIn, setCheckIn] = useState<Date | null>(initialSearchState?.checkIn ? new Date(initialSearchState.checkIn) : null)
  const [checkOut, setCheckOut] = useState<Date | null>(initialSearchState?.checkout ? new Date(initialSearchState.checkout) : null)
  const [topDestinations, setTopDestinations] = useState<Listing[]>([])

  const searchRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadTopDestinations = async () => {
      try {
        const destinations = await getTopDestinations()
        setTopDestinations(destinations)
      } catch (error) {
        console.error('Error loading top destinations:', error)
      }
    }

    loadTopDestinations()
  }, [])

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    if (selectedLocation) searchParams.set('location', selectedLocation)
    if (checkIn) searchParams.set('checkin', checkIn.toISOString().split('T')[0])
    if (checkOut) searchParams.set('checkout', checkOut.toISOString().split('T')[0])
    if (guests.adults > 0) searchParams.set('adults', guests.adults.toString())
    if (guests.children > 0) searchParams.set('children', guests.children.toString())
    if (guests.infants > 0) searchParams.set('infants', guests.infants.toString())
    if (guests.pets > 0) searchParams.set('pets', guests.pets.toString())

    const queryString = searchParams.toString()
    router.push(`/${currentLocale}/search?${queryString}`)
  }

  const handleDateSelect = (date: Date, type: 'checkin' | 'checkout') => {
    if (type === 'checkin') {
      setCheckIn(date)
      if (checkOut && date >= checkOut) {
        setCheckOut(null)
      }
    } else {
      setCheckOut(date)
      if (checkIn && date <= checkIn) {
        setCheckIn(null)
      }
    }
  }

  const updateGuest = (type: keyof typeof guests, delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setActiveMenu(null)
  }

  return (
    <div className="relative">
      <header className={`sticky top-0 z-50 bg-white border-b border-zinc-100 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${currentLocale}`} className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#FF385C]">অতি</span>
              <span className="text-2xl font-bold text-zinc-900">Atithi</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-[600px]">
              <div className="relative flex-1" ref={searchRef}>
                <button
                  onClick={() => setActiveMenu('where')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full border transition-all ${
                    activeMenu === 'where' || selectedLocation
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-zinc-500">search</span>
                  <div className="flex flex-col w-full">
                    <span className="font-bold text-sm text-zinc-900">Where to?</span>
                    <span className="text-[10px] text-zinc-500">
                      {selectedLocation || 'Anywhere • Any week • Add guests'}
                    </span>
                  </div>
                </button>

                {/* WHERE DROP DOWN */}
                {activeMenu === 'where' && (
                  <div className="absolute top-[110%] left-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-6 w-[400px] z-[100]">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold mb-2">Suggested destinations</h3>
                        <div className="space-y-1">
                          {topDestinations.map((dest) => (
                            <button
                              key={dest.id}
                              onClick={() => handleLocationSelect(dest.title)}
                              className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                            >
                              <img src={dest.image} alt={dest.title} className="w-8 h-8 rounded-lg object-cover" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{dest.title}</span>
                                <span className="text-xs text-zinc-500">{dest.description}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMenu('when')}
                  className={`px-4 py-3 rounded-full border transition-all ${
                    activeMenu === 'when' || checkIn || checkOut
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-zinc-500">calendar_today</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-zinc-900">When</span>
                    <span className="text-[10px] text-zinc-500">
                      {checkIn && checkOut 
                        ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
                        : 'Exact day'
                      }
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveMenu('who')}
                  className={`px-4 py-3 rounded-full border transition-all ${
                    activeMenu === 'who' || (guests.adults > 0 || guests.children > 0 || guests.infants > 0 || guests.pets > 0)
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-zinc-500">person</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-zinc-900">Who</span>
                    <span className="text-[10px] text-zinc-500">
                      {guests.adults > 0 && `${guests.adults} adults`}
                      {guests.adults > 0 && guests.children > 0 && ', '}
                      {guests.children > 0 && `${guests.children} children`}
                      {guests.infants > 0 && ', '}
                      {guests.infants > 0 && `${guests.infants} infants`}
                      {guests.pets > 0 && ', '}
                      {guests.pets > 0 && `${guests.pets} pets`}
                      {!guests.adults && !guests.children && !guests.infants && !guests.pets && 'Add guests'}
                    </span>
                  </div>
                </button>
              </div>

              <button 
                onClick={handleSearch}
                disabled={!selectedLocation}
                className="bg-[#FF385C] text-white px-6 py-3 rounded-full font-bold hover:bg-[#E31C5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="material-symbols-outlined">search</span>
                Search
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-2 flex-shrink-0 z-10">
              <button 
                onClick={() => setIsHostModalOpen(true)}
                className="text-sm font-semibold text-zinc-800 hover:bg-zinc-100 rounded-full px-4 py-2 transition-all"
              >
                {userRole === 'HOST' ? t('switchToCustomer') : t('becomeHost')}
              </button>

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
                    <Link 
                      href={`/${currentLocale}/help`}
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-6 py-3 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                    >
                      <span className="material-symbols-outlined text-zinc-500">help</span>
                      <span className="text-sm font-medium">{t('helpCentre')}</span>
                    </Link>
                    <div className="my-2 border-t border-zinc-100" />
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false)
                        setIsHostModalOpen(true)
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-zinc-50 flex justify-between items-start transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold">{t('becomeHost')}</span>
                        <span className="text-xs text-zinc-500 leading-relaxed">It&apos;s easy to start hosting and earn extra income.</span>
                      </div>
                      <img src="https://picsum.photos/seed/host/40/40" alt="Host" className="w-10 h-10 rounded-lg object-cover" />
                    </button>
                    <div className="my-2 border-t border-zinc-100" />
                    <button className="w-full text-left px-6 py-3 hover:bg-zinc-50 text-sm font-medium transition-colors">{t('findCoHost')}</button>
                    <button className="w-full text-left px-6 py-3 hover:bg-zinc-50 text-sm font-medium transition-colors">{t('giftCards')}</button>
                    <div className="my-2 border-t border-zinc-100" />
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

        {/* Mobile Search - Only show when NOT scrolled */}
        {!isScrolled && (
          <div className="md:hidden flex items-center justify-center px-4 pt-4 pb-2 bg-white">
            <label className="flex items-center gap-3 bg-zinc-50 rounded-full shadow-md border border-zinc-100 w-full p-2 px-4 cursor-pointer block">
              <span className="material-symbols-outlined text-zinc-500">search</span>
              <div className="flex flex-col w-full">
                <span className="font-bold text-xs text-zinc-900">Where to?</span>
                <input type="text" placeholder="Anywhere • Any week • Add guests" className="text-[10px] text-zinc-500 bg-transparent outline-none w-full" />
              </div>
            </label>
          </div>
        )}

        {/* WHEN & WHO DROP DOWNS - Mobile */}
        {(activeMenu === 'when' || activeMenu === 'who') && (
          <div className="md:hidden fixed inset-0 bg-white z-[100] p-6">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-zinc-100 p-8">
              {activeMenu === 'when' && (
                <>
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">When do you want to go?</h3>
                      <button 
                        onClick={() => {setCheckIn(null); setCheckOut(null); setActiveMenu('where')}}
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 underline"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                    {dateMode === 'dates' ? (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-7 gap-2 w-full">
                          {['M','T','W','T','F','S','S'].map((d, i) => <span key={`day-${i}`} className="text-zinc-400 py-2">{d}</span>)}
                          {Array.from({length: 31}, (_, i) => {
                            const date = new Date(2026, 4, i + 1)
                            const isSelected = checkIn?.toDateString() === date.toDateString() || checkOut?.toDateString() === date.toDateString()
                            const isInRange = checkIn && checkOut && date > checkIn && date < checkOut
                            return (
                              <button 
                                key={i} 
                                onClick={() => handleDateSelect(date, !checkIn || (checkIn && checkOut) ? 'checkin' : 'checkout')}
                                className={`py-3 hover:bg-zinc-100 rounded-full cursor-pointer ${isSelected ? 'bg-zinc-900 text-white hover:bg-zinc-800' : ''} ${isInRange ? 'bg-zinc-200' : ''}`}
                              >
                                {i + 1}
                              </button>
                            )
                          })}
                        </div>
                        <div className="flex border border-zinc-200 rounded-2xl divide-x">
                          <div className={`flex-1 p-4 px-6 flex justify-between items-center cursor-pointer hover:bg-zinc-50 rounded-l-2xl ${checkIn ? 'bg-zinc-50' : ''}`}>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase">Check in</span>
                              <span className="font-bold">{checkIn ? formatDate(checkIn) : 'Exact day'}</span>
                            </div>
                            {checkIn && <span className="material-symbols-outlined text-zinc-400">check</span>}
                          </div>
                          <div className={`flex-1 p-4 px-6 flex justify-between items-center cursor-pointer hover:bg-zinc-50 rounded-r-2xl ${checkOut ? 'bg-zinc-50' : ''}`}>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase">Check out</span>
                              <span className="font-bold">{checkOut ? formatDate(checkOut) : 'Exact day'}</span>
                            </div>
                            {checkOut && <span className="material-symbols-outlined text-zinc-400">check</span>}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-4">
                          <h3 className="text-lg font-bold">How long would you like to stay?</h3>
                          <div className="flex gap-4">
                            {['weekend', 'week', 'month'].map(s => (
                              <button key={s} onClick={() => setFlexibleStay(s as any)} className={`px-8 py-2.5 rounded-full border transition-all text-sm font-bold capitalize ${flexibleStay === s ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 hover:border-zinc-950'}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-4 w-full">
                          <h3 className="text-lg font-bold">When do you want to go?</h3>
                          <div className="grid grid-cols-6 gap-3 w-full">
                            {['May', 'June', 'July', 'August', 'September', 'October'].map(m => (
                              <button key={m} className={`flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl transition-all hover:border-zinc-950 ${m === 'August' ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950' : 'border-zinc-200'}`}>
                                <span className="material-symbols-outlined text-3xl text-zinc-400">calendar_today</span>
                                <div className="flex flex-col items-center">
                                  <span className="font-bold text-sm">{m}</span>
                                  <span className="text-[10px] text-zinc-400">2026</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-between items-center">
                      <button 
                        onClick={() => {setCheckIn(null); setCheckOut(null); setActiveMenu('where')}}
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 underline"
                      >
                        {t('cancel')}
                      </button>
                      <button 
                        onClick={() => setActiveMenu('who')}
                        className="bg-zinc-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-zinc-800 transition-colors"
                      >
                        {t('next')}
                      </button>
                    </div>
                  </>
                )}

                {activeMenu === 'who' && (
                  <div className="absolute top-[110%] right-0 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-8 w-[400px] z-[100]">
                    <div className="flex flex-col gap-6">
                      {[
                        { id: 'adults', title: 'Adults', sub: 'Ages 13 or above' },
                        { id: 'children', title: 'Children', sub: 'Ages 2–12' },
                        { id: 'infants', title: 'Infants', sub: 'Under 2' },
                        { id: 'pets', title: 'Pets', sub: 'Bringing a service animal?' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900">{item.title}</span>
                            <span className={`text-sm ${item.id === 'pets' ? 'text-blue-600 underline' : 'text-zinc-500'}`}>{item.sub}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => updateGuest(item.id as any, -1)}
                              disabled={guests[item.id as keyof typeof guests] === 0}
                              className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-950 disabled:opacity-30 disabled:hover:border-zinc-200 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="w-4 text-center font-medium text-zinc-900">{guests[item.id as keyof typeof guests]}</span>
                            <button 
                              onClick={() => updateGuest(item.id as any, 1)}
                              className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-950 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-200">
                      <button 
                        onClick={handleSearch}
                        disabled={!selectedLocation}
                        className="w-full bg-[#FF385C] text-white py-3 rounded-xl font-bold hover:bg-[#E31C5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">search</span>
                        {selectedLocation ? `Search ${selectedLocation}` : 'Select a location'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
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
