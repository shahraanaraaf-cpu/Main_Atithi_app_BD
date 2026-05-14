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
  forceCompact, 
  activeTab = 'stays',
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
  
  const menuRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  // Handle scroll to toggle compact view
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (window.scrollY > 20) setActiveMenu(null)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch top destinations on mount
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const destinations = await getTopDestinations()
        setTopDestinations(destinations)
      } catch (error) {
        console.error('Error fetching top destinations:', error)
      }
    }
    fetchDestinations()
  }, [])

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateGuest = (type: keyof typeof guests, amount: number) => {
    setGuests(prev => ({ ...prev, [type]: Math.max(0, prev[type] + amount) }))
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setActiveMenu('when')
  }

  const handleDateSelect = (date: Date, type: 'checkin' | 'checkout') => {
    if (type === 'checkin') {
      setCheckIn(date)
      if (checkOut && date > checkOut) {
        setCheckOut(null)
      }
    } else {
      setCheckOut(date)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedLocation) params.set('location', selectedLocation)
    if (checkIn) params.set('checkin', checkIn.toISOString().split('T')[0])
    if (checkOut) params.set('checkout', checkOut.toISOString().split('T')[0])
    const totalGuests = guests.adults + guests.children + guests.infants + guests.pets
    if (totalGuests > 0) params.set('guests', totalGuests.toString())
    
    router.push(`/en/search?${params.toString()}`)
    setActiveMenu(null)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Add dates'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`sticky top-0 w-full z-50 bg-white border-b border-zinc-200 transition-all duration-300 ${(forceCompact || isScrolled) ? 'py-3 shadow-md' : 'flex flex-col'}`}>
      <header className={`flex items-center justify-between px-6 md:px-20 w-full bg-white transition-all duration-300 ${(forceCompact || isScrolled) ? 'h-12' : 'pt-4 pb-6'}`}>
        
        {/* Logo Section */}
        <Link href={`/${currentLocale}`} className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-10 w-[250px]">
          <span className="material-symbols-outlined text-[#FF385C] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>air</span>
          <span className={`text-2xl font-black text-[#FF385C] tracking-tighter transition-opacity ${(forceCompact || isScrolled) ? 'hidden lg:block' : ''}`}>Atithi App BD</span>
        </Link>
        
        {/* Center Navigation & Search */}
        <div className="flex flex-col items-center flex-1 px-8 z-0">
          {/* Top Nav - Hidden on scroll */}
          {!(forceCompact || isScrolled) && (
            <nav className="flex items-center gap-8 mb-6 transition-all duration-300 opacity-100 scale-100">
              <Link 
                href={`/${currentLocale}`}
                className={`flex items-center gap-2 font-medium pb-2 border-b-2 transition-colors ${activeTab === 'stays' ? 'text-zinc-950 border-zinc-950' : 'text-zinc-500 hover:text-zinc-900 border-transparent'}`}
              >
                <span className="text-xl">🏠</span>
                <span>{t('stays')}</span>
              </Link>
              <Link 
                href={`/${currentLocale}/experiences`}
                className={`flex items-center gap-2 font-medium pb-2 border-b-2 transition-colors relative ${activeTab === 'experiences' ? 'text-zinc-950 border-zinc-950' : 'text-zinc-500 hover:text-zinc-900 border-transparent'}`}
              >
                <span className="text-xl">🎈</span>
                <span>{t('experiences')}</span>
                <span className="absolute -top-3 -right-6 bg-[#3b4c6b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
              </Link>
              <Link 
                href={`/${currentLocale}/services`}
                className={`flex items-center gap-2 font-medium pb-2 border-b-2 transition-colors relative ${activeTab === 'services' ? 'text-zinc-950 border-zinc-950' : 'text-zinc-500 hover:text-zinc-900 border-transparent'}`}
              >
                <span className="text-xl">🛎️</span>
                <span>{t('services')}</span>
                <span className="absolute -top-3 -right-6 bg-[#3b4c6b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
              </Link>
            </nav>
          )}
          
          {/* Search Container */}
          <div ref={menuRef} className={`relative transition-all duration-300 ${(forceCompact || isScrolled) ? 'w-[400px]' : 'w-full max-w-[850px]'}`}>
            {(forceCompact || isScrolled) ? (
              /* COMPACT SEARCH PILL (On Scroll) */
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => setActiveMenu('where'), 300); }}
                className="flex items-center justify-between w-full bg-white border border-zinc-200 rounded-full py-2 px-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center divide-x divide-zinc-200 gap-4">
                  <span className="text-sm font-bold text-zinc-900">{t('anywhere')}</span>
                  <span className="text-sm font-bold text-zinc-900 pl-4">{t('anytime')}</span>
                  <span className="text-sm text-zinc-500 pl-4">{t('addGuests')}</span>
                </div>
                <div className="bg-[#FF385C] text-white h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] font-bold">search</span>
                </div>
              </button>
            ) : (
              /* FULL SEARCH BAR */
              <div className={`flex items-center bg-white rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] border border-zinc-200 divide-x divide-zinc-200 transition-all ${activeMenu ? 'bg-zinc-100' : ''}`}>
                <button 
                  onClick={() => setActiveMenu('where')}
                  className={`flex-[1.5] flex flex-col items-start px-8 py-3 hover:bg-zinc-200 rounded-full transition-colors text-left ${activeMenu === 'where' ? 'bg-white shadow-lg' : ''}`}
                >
                  <span className="text-[12px] text-zinc-900 font-bold">{t('where')}</span>
                  <span className="text-sm text-zinc-600">{selectedLocation || t('searchDestinations')}</span>
                </button>
                <button 
                  onClick={() => setActiveMenu('when')}
                  className={`flex-1 flex flex-col items-start px-8 py-3 hover:bg-zinc-200 rounded-full transition-colors text-left ${activeMenu === 'when' ? 'bg-white shadow-lg' : ''}`}
                >
                  <span className="text-[12px] text-zinc-900 font-bold">{t('when')}</span>
                  <span className="text-sm text-zinc-500">
                    {checkIn && checkOut 
                      ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
                      : checkIn 
                        ? formatDate(checkIn)
                        : t('addDates')}
                  </span>
                </button>
                <div 
                  onClick={() => setActiveMenu('who')}
                  className={`flex-[1.5] flex items-center justify-between pl-8 pr-2 py-1.5 hover:bg-zinc-200 rounded-full transition-colors cursor-pointer group ${activeMenu === 'who' ? 'bg-white shadow-lg' : ''}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[12px] text-zinc-900 font-bold">{t('who')}</span>
                    <span className="text-sm text-zinc-500">
                      {Object.values(guests).reduce((a, b) => a + b, 0) > 0 
                        ? `${Object.values(guests).reduce((a, b) => a + b, 0)} ${t('guests')}` 
                        : t('addGuests')}
                    </span>
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="bg-[#FF385C] text-white h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#E31C5F] transition-colors ml-4 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px] font-bold">search</span>
                  </button>
                </div>
              </div>
            )}

            {/* FLYOUT MENUS (Only in full mode) */}
            {!(forceCompact || isScrolled) && (
              <>
                {/* WHERE DROP DOWN */}
                {activeMenu === 'where' && (
                  <div className="absolute top-[110%] left-0 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-8 w-[450px] z-[100]">
                    <h3 className="text-sm font-bold text-zinc-900 mb-6">{t('suggestedDestinations')}</h3>
                    <div className="flex flex-col gap-2">
                      {topDestinations.length > 0 ? (
                        topDestinations.map((listing) => (
                          <button 
                            key={listing.id} 
                            onClick={() => handleLocationSelect(listing.city)}
                            className={`flex items-center gap-4 p-3 hover:bg-zinc-100 rounded-xl transition-colors text-left group ${selectedLocation === listing.city ? 'bg-zinc-100 ring-1 ring-zinc-900' : ''}`}>
                            <div className="h-12 w-12 rounded-xl overflow-hidden">
                              <img 
                                src={listing.image_urls[0]} 
                                alt={listing.city}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900">{listing.city}</span>
                              <span className="text-sm text-zinc-500">{formatPrice(convertPrice(listing.price_bdt))} / {t('pricePerNight')}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        // Fallback to hardcoded destinations if no data
                        [
                          { name: t('nearby'), sub: t('findAroundYou'), icon: 'near_me', color: 'bg-blue-50 text-blue-600' },
                          { name: 'Cox\'s Bazar', sub: 'World\'s longest sea beach', icon: 'beach_access', color: 'bg-cyan-50 text-cyan-600' },
                          { name: 'Sylhet', sub: 'Tea gardens & waterfalls', icon: 'forest', color: 'bg-green-50 text-green-600' },
                          { name: 'Bandarban', sub: 'Explore the hill tracts', icon: 'terrain', color: 'bg-amber-50 text-amber-600' },
                          { name: 'Sajek Valley', sub: 'The land of clouds', icon: 'cloud', color: 'bg-sky-50 text-sky-600' },
                          { name: 'Dhaka', sub: 'Bustling heart of Bangladesh', icon: 'location_city', color: 'bg-purple-50 text-purple-600' },
                        ].map((dest) => (
                          <button 
                            key={dest.name} 
                            onClick={() => handleLocationSelect(dest.name)}
                            className={`flex items-center gap-4 p-3 hover:bg-zinc-100 rounded-xl transition-colors text-left group ${selectedLocation === dest.name ? 'bg-zinc-100 ring-1 ring-zinc-900' : ''}`}>
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${dest.color}`}>
                              <span className="material-symbols-outlined">{dest.icon}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900">{dest.name}</span>
                              <span className="text-sm text-zinc-500">{dest.sub}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* WHEN DROP DOWN */}
                {activeMenu === 'when' && (
                  <div className="absolute top-[110%] left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-10 w-[850px] z-[100]">
                    <div className="flex justify-center mb-8">
                      <div className="bg-zinc-100 p-1 rounded-full flex">
                        <button onClick={() => setDateMode('dates')} className={`px-12 py-2.5 rounded-full text-sm font-bold transition-all ${dateMode === 'dates' ? 'bg-white shadow-md' : 'text-zinc-500'}`}>Dates</button>
                        <button onClick={() => setDateMode('flexible')} className={`px-12 py-2.5 rounded-full text-sm font-bold transition-all ${dateMode === 'flexible' ? 'bg-white shadow-md' : 'text-zinc-500'}`}>Flexible</button>
                      </div>
                    </div>

                    {dateMode === 'dates' ? (
                      <div className="flex flex-col gap-8">
                        <div className="flex justify-between gap-12">
                          <div className="flex-1">
                            <h4 className="text-center font-bold mb-4">April 2026</h4>
                            <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
                              {['M','T','W','T','F','S','S'].map((d, i) => <span key={`day-${i}`} className="text-zinc-400 py-2">{d}</span>)}
                              {Array.from({length: 30}, (_, i) => {
                                const date = new Date(2026, 3, i + 1)
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
                          </div>
                          <div className="flex-1">
                            <h4 className="text-center font-bold mb-4">May 2026</h4>
                            <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
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
                          </div>
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
                      <div className="flex flex-col items-center gap-10">
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
                  </div>
                )}

                {/* WHO DROP DOWN */}
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
              </>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-2 flex-shrink-0 z-10 w-[250px]">
          <button 
            onClick={() => setIsHostModalOpen(true)}
            className="text-sm font-semibold text-zinc-800 hover:bg-zinc-100 rounded-full px-4 py-2 transition-all"
          >
            {userRole === 'HOST' ? t('switchToCustomer') : t('becomeHost')}
          </button>
          {/* Language Dropdown */}
          <div ref={languageRef} className="relative">
            <button 
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="h-10 w-10 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all flex items-center justify-center"
              title="Language"
            >
              <span className="material-symbols-outlined text-zinc-800 text-[20px]">language</span>
            </button>

            {/* LANGUAGE & CURRENCY DROP DOWN */}
            {isLanguageOpen && (
              <div className="absolute top-[120%] right-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 w-[220px] py-3 z-[110]">
                {/* Language Section */}
                <div className="px-4 pb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Language / ভাষা</span>
                </div>
                <button 
                  onClick={() => {
                    const newPath = pathname.replace(/^\/(en|bn)/, '/en')
                    router.push(newPath)
                    setIsLanguageOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currentLocale === 'en' ? 'text-zinc-900' : 'text-zinc-600'}`}>English</span>
                  {currentLocale === 'en' && <span className="material-symbols-outlined text-[#FF385C] text-lg">check</span>}
                </button>
                <button 
                  onClick={() => {
                    const newPath = pathname.replace(/^\/(en|bn)/, '/bn')
                    router.push(newPath)
                    setIsLanguageOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currentLocale === 'bn' ? 'text-zinc-900' : 'text-zinc-600'}`}>বাংলা</span>
                  {currentLocale === 'bn' && <span className="material-symbols-outlined text-[#FF385C] text-lg">check</span>}
                </button>

                <div className="my-2 border-t border-zinc-100" />

                {/* Currency Section */}
                <div className="px-4 pb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{t('currency')}</span>
                </div>
                <button 
                  onClick={() => {
                    setCurrency('BDT')
                    setIsLanguageOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currency === 'BDT' ? 'text-zinc-900' : 'text-zinc-600'}`}>{t('bdt')}</span>
                  {currency === 'BDT' && <span className="material-symbols-outlined text-[#FF385C] text-lg">check</span>}
                </button>
                <button 
                  onClick={() => {
                    setCurrency('USD')
                    setIsLanguageOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
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
      </header>
      
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

      {/* Host Type Modal */}
      <HostTypeModal 
        isOpen={isHostModalOpen} 
        onClose={() => setIsHostModalOpen(false)} 
      />
    </div>
  )
}
