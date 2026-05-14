'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useCurrency, type CurrencyCode } from '@/app/contexts/CurrencyContext'
import { useAuth } from '@/app/contexts/AuthContext'

const HostTypeModal = dynamic(() => import('@/app/components/modals/HostTypeModal').then(mod => mod.HostTypeModal), {
  ssr: false
})

interface GlobalHeaderProps {
  activeTab?: 'stays' | 'experiences' | 'services'
  forceCompact?: boolean
}

// Generate calendar days for a month
function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

// Get month name
function getMonthName(date: Date, locale: string) {
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}

export function GlobalHeader({ activeTab = 'stays', forceCompact = false }: GlobalHeaderProps) {
  const t = useTranslations('Index')
  const th = useTranslations('Header')
  const currentLocale = useLocale()
  const { currency, setCurrency } = useCurrency()
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<'where' | 'when' | 'who' | null>(null)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
  const [dateMode, setDateMode] = useState<'dates' | 'flexible'>('dates')
  const [flexibleStay, setFlexibleStay] = useState<'weekend' | 'week' | 'month'>('weekend')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [calendarOffset, setCalendarOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [quickDate, setQuickDate] = useState<'anytime' | 'weekend' | 'week' | 'month'>('anytime')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [mobileSearchSection, setMobileSearchSection] = useState<'where' | 'when' | 'who'>('where')
  const menuRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Handle scroll for compact mode
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 20
    setIsScrolled(scrolled)
    if (scrolled) setActiveMenu(null)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close menus on click outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActiveMenu(null)
    }
    if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
      setIsLanguageOpen(false)
    }
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setIsProfileOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  // Lock body scroll when mobile search modal is open
  useEffect(() => {
    if (isMobileSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileSearchOpen])

  const isCompact = forceCompact || isScrolled

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedLocation) params.set('location', selectedLocation)
    if (checkIn) params.set('checkin', checkIn.toISOString().split('T')[0])
    if (checkOut) params.set('checkout', checkOut.toISOString().split('T')[0])
    const totalGuests = guests.adults + guests.children + guests.infants + guests.pets
    if (totalGuests > 0) params.set('guests', totalGuests.toString())
    
    router.push(`/${currentLocale}/search?${params.toString()}`)
    setActiveMenu(null)
  }, [selectedLocation, checkIn, checkOut, guests, currentLocale, router])

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`sticky top-0 w-full z-50 bg-white border-b border-zinc-200 ${isCompact ? 'py-3 shadow-md' : 'flex flex-col'}`}>
      <header className={`flex items-center justify-between px-4 md:px-6 lg:px-20 w-full bg-white transition-all duration-300 ${isCompact ? 'h-12 py-2' : 'py-3 md:pt-4 md:pb-6'}`}>
        
        {/* Logo Section */}
        <Link href={`/${currentLocale}`} prefetch={true} className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-10 w-auto md:w-[200px] lg:w-[250px]">
          <span className="material-symbols-outlined text-[#C62D2D] text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>air</span>
          <span className={`text-xl md:text-2xl font-black text-[#C62D2D] tracking-tighter transition-opacity hidden md:block ${isCompact ? 'hidden lg:block' : ''}`}>Atithi</span>
        </Link>
        
        {/* Center Navigation & Search - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-center flex-1 px-4 lg:px-8 z-0">
          {/* Top Nav - Hidden on scroll */}
          {!isCompact && (
            <nav className="flex items-center gap-8 mb-6 transition-all duration-300 opacity-100 scale-100">
              <Link 
                href={`/${currentLocale}`}
                prefetch={true}
                className={`flex items-center gap-2 font-medium pb-2 border-b-2 transition-colors ${activeTab === 'stays' ? 'text-zinc-950 border-zinc-950' : 'text-zinc-500 hover:text-zinc-900 border-transparent'}`}
              >
                <span className="text-xl">🏠</span>
                <span>{t('stays')}</span>
              </Link>
              <Link 
                href={`/${currentLocale}/experiences`}
                prefetch={true}
                className={`flex items-center gap-2 font-medium pb-2 border-b-2 transition-colors relative ${activeTab === 'experiences' ? 'text-zinc-950 border-zinc-950' : 'text-zinc-500 hover:text-zinc-900 border-transparent'}`}
              >
                <span className="text-xl">🎈</span>
                <span>{t('experiences')}</span>
                <span className="absolute -top-3 -right-6 bg-[#3b4c6b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{th('new')}</span>
              </Link>
              <Link 
                href={`/${currentLocale}/services`}
                prefetch={true}
                className={`flex items-center gap-2 font-medium pb-2 border-b-2 transition-colors relative ${activeTab === 'services' ? 'text-zinc-950 border-zinc-950' : 'text-zinc-500 hover:text-zinc-900 border-transparent'}`}
              >
                <span className="text-xl">🛎️</span>
                <span>{t('services')}</span>
                <span className="absolute -top-3 -right-6 bg-[#3b4c6b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{th('new')}</span>
              </Link>
            </nav>
          )}
          
          {/* Search Container */}
          <div ref={menuRef} className={`relative transition-all duration-300 ${isCompact ? 'w-[400px]' : 'w-full max-w-[850px]'}`}>
            {isCompact ? (
              /* COMPACT SEARCH PILL (On Scroll) */
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => setActiveMenu('where'), 300); }}
                className="flex items-center justify-between w-full bg-white border border-zinc-200 rounded-full py-2 px-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center divide-x divide-zinc-200 gap-4">
                  <span className="text-sm font-bold text-zinc-900">{t('anywhere')}</span>
                  <span className="text-sm font-bold text-zinc-900 pl-4">{th('anyweek')}</span>
                  <span className="text-sm text-zinc-500 pl-4">{t('addGuests')}</span>
                </div>
                <div className="bg-[#C62D2D] text-white h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] font-bold">search</span>
                </div>
              </button>
            ) : activeTab === 'experiences' ? (
              /* EXPERIENCES SEARCH BAR - Three sections to match Image 2 */
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
                    {selectedDate 
                      ? selectedDate.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' })
                      : quickDate === 'anytime' 
                        ? t('addDates')
                        : quickDate === 'weekend' 
                          ? t('nextWeekend')
                          : quickDate === 'week' 
                            ? th('thisWeek') 
                            : th('thisMonth')}
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
                    className="bg-[#C62D2D] text-white h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#A52525] transition-colors ml-4 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px] font-bold">search</span>
                  </button>
                </div>
              </div>
            ) : activeTab === 'services' ? (
              /* SERVICES SEARCH BAR - Category-based design */
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
                  <span className="text-[12px] text-zinc-900 font-bold">{t('category')}</span>
                  <span className="text-sm text-zinc-500">{selectedCategory || th('allServices')}</span>
                </button>
                <button 
                  onClick={handleSearch}
                  className="bg-[#C62D2D] text-white h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#A52525] transition-colors ml-4 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">search</span>
                </button>
              </div>
            ) : (
              /* STAYS FULL SEARCH BAR */
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
                    className="bg-[#C62D2D] text-white h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#A52525] transition-colors ml-4 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px] font-bold">search</span>
                  </button>
                </div>
              </div>
            )}

            {/* FLYOUT MENUS (Only in full mode) */}
            {!isCompact && activeMenu === 'where' && (
              <div className="absolute top-[110%] left-0 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 w-[450px] z-[100]">
                <h3 className="text-sm font-semibold text-zinc-500 mb-4">{th('suggestedDestinations')}</h3>
                <div className="flex flex-col gap-1">
                  {[
                    { name: t('nearby'), desc: th('nearbyDesc'), icon: 'near_me' },
                    { name: t('sylhet'), desc: th('sylhetDesc'), icon: 'park' },
                    { name: t('coxsbazar'), desc: th('coxsBazarDesc'), icon: 'beach_access' },
                    { name: t('bandarban'), desc: th('bandarbanDesc'), icon: 'landscape' },
                    { name: t('sajek'), desc: th('sajekDesc'), icon: 'cloud' },
                    { name: t('dhaka'), desc: th('dhakaDesc'), icon: 'location_city' },
                  ].map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => { setSelectedLocation(dest.name); setActiveMenu('when'); }}
                      className="flex items-center gap-4 p-3 hover:bg-zinc-100 rounded-xl transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200">
                        <span className="material-symbols-outlined text-zinc-500 text-xl">{dest.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{dest.name}</p>
                        <p className="text-sm text-zinc-500">{dest.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isCompact && activeMenu === 'when' && (
              <div className={`absolute top-[110%] bg-white rounded-3xl shadow-2xl border border-zinc-100 p-8 z-[100] left-1/2 -translate-x-1/2 ${activeTab === 'stays' ? 'w-[800px]' : 'w-[800px]'}`}>
                {activeTab === 'services' ? (
                  <>
                    {/* SERVICES CATEGORY SELECTOR */}
                    <h3 className="text-sm font-semibold text-zinc-500 mb-4">{th('browseByCategory')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: th('privateChefs'), icon: 'skillet', count: 156 },
                        { name: th('carDriver'), icon: 'local_taxi', count: 234 },
                        { name: th('photographers'), icon: 'photo_camera', count: 89 },
                        { name: th('tourGuides'), icon: 'tour', count: 67 },
                        { name: th('airportPickup'), icon: 'flight_land', count: 45 },
                        { name: th('laundry'), icon: 'local_laundry_service', count: 78 },
                        { name: th('groceryDelivery'), icon: 'local_grocery_store', count: 123 },
                        { name: th('eventDecor'), icon: 'celebration', count: 56 },
                        { name: th('nannies'), icon: 'child_care', count: 34 },
                        { name: th('security'), icon: 'security', count: 92 },
                      ].map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            selectedCategory === cat.name
                              ? 'border-zinc-900 bg-zinc-50' 
                              : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-zinc-600">{cat.icon}</span>
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-zinc-900 text-sm">{cat.name}</p>
                            <p className="text-xs text-zinc-500">{cat.count} {th('available')}</p>
                          </div>
                          {selectedCategory === cat.name && (
                            <span className="material-symbols-outlined text-zinc-900 ml-auto">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                ) : activeTab === 'experiences' ? (
                  <div className="flex gap-10">
                    {/* Sidebar Presets */}
                    <div className="flex flex-col gap-4 w-[260px] flex-shrink-0">
                      {[
                        { key: 'today', label: t('today'), date: new Date() },
                        { key: 'tomorrow', label: t('tomorrow'), date: new Date(new Date().setDate(new Date().getDate() + 1)) },
                        { 
                          key: 'weekend', 
                          label: t('nextWeekend'), 
                          dateRange: (() => {
                            const today = new Date();
                            const friday = new Date(today);
                            friday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7));
                            const sunday = new Date(friday);
                            sunday.setDate(friday.getDate() + 2);
                            return `${friday.getDate()}-${sunday.getDate()} ${friday.toLocaleDateString(currentLocale, { month: 'short' })}`;
                          })()
                        },
                      ].map((preset) => {
                        const isSelected = quickDate === preset.key && !selectedDate;
                        return (
                          <button
                            key={preset.key}
                            onClick={() => { setQuickDate(preset.key as any); setSelectedDate(null); }}
                            className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-zinc-900 bg-white' 
                                : 'border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50'
                            }`}
                          >
                            <span className="font-bold text-lg text-zinc-900">{preset.label}</span>
                            <span className="text-zinc-500">
                              {preset.dateRange || preset.date?.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Calendar Section */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center justify-between mb-8">
                        <button 
                          onClick={() => setCalendarOffset(prev => prev - 1)}
                          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                          <span className="material-symbols-outlined text-zinc-400">chevron_left</span>
                        </button>
                        <h4 className="font-bold text-lg text-zinc-900">
                          {getMonthName(new Date(new Date().getFullYear(), new Date().getMonth() + calendarOffset, 1), currentLocale)}
                        </h4>
                        <button 
                          onClick={() => setCalendarOffset(prev => prev + 1)}
                          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                          <span className="material-symbols-outlined text-zinc-400">chevron_right</span>
                        </button>
                      </div>
                      
                      {/* Weekdays - Monday first */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[13px] font-bold text-zinc-400 mb-4">
                        {['M','T','W','T','F','S','S'].map((d, i) => (
                          <span key={i} className="py-2">{d}</span>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const year = new Date().getFullYear()
                          const month = new Date().getMonth() + calendarOffset
                          const firstDay = new Date(year, month, 1).getDay() // 0 is Sunday
                          // Adjust for Monday-first: Mon=0, ..., Sun=6
                          const offset = (firstDay + 6) % 7
                          const days = getDaysInMonth(year, month)
                          
                          return [
                            ...Array(offset).fill(null),
                            ...days.map(day => {
                              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
                              const isToday = day.toDateString() === new Date().toDateString()
                              return (
                                <button
                                  key={day.toISOString()}
                                  onClick={() => { setSelectedDate(day); setQuickDate('anytime'); }}
                                  className={`h-11 w-11 rounded-full text-sm font-semibold flex items-center justify-center transition-all relative ${
                                    isSelected 
                                      ? 'bg-zinc-900 text-white' 
                                      : 'hover:bg-zinc-100 text-zinc-900'
                                  }`}
                                >
                                  {day.getDate()}
                                  {isToday && !isSelected && (
                                    <div className="absolute bottom-1 w-1 h-1 bg-[#C62D2D] rounded-full" />
                                  )}
                                </button>
                              )
                            })
                          ]
                        })()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* STAYS/SERVICES DATES/FLEXIBLE TOGGLE */}
                    <div className="flex justify-center mb-6">
                      <div className="flex bg-zinc-100 rounded-full p-1">
                          <button
                            onClick={() => setDateMode('dates')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${dateMode === 'dates' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                          >
                            {th('dates')}
                          </button>
                          <button
                            onClick={() => setDateMode('flexible')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${dateMode === 'flexible' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                          >
                            {th('flexible')}
                          </button>
                      </div>
                    </div>

                    {dateMode === 'dates' ? (
                      <>
                        {/* Calendar View */}
                        <div className="flex items-center justify-between mb-4">
                          <button 
                            onClick={() => setCalendarOffset(prev => prev - 1)}
                            className="p-2 hover:bg-zinc-100 rounded-full"
                          >
                            <span className="material-symbols-outlined">chevron_left</span>
                          </button>
                          <div className="flex gap-16">
                            <div className="text-center">
                              <h4 className="font-semibold text-zinc-900">{getMonthName(new Date(new Date().getFullYear(), new Date().getMonth() + calendarOffset, 1), currentLocale)}</h4>
                            </div>
                            <div className="text-center">
                              <h4 className="font-semibold text-zinc-900">{getMonthName(new Date(new Date().getFullYear(), new Date().getMonth() + calendarOffset + 1, 1), currentLocale)}</h4>
                            </div>
                          </div>
                          <button 
                            onClick={() => setCalendarOffset(prev => prev + 1)}
                            className="p-2 hover:bg-zinc-100 rounded-full"
                          >
                            <span className="material-symbols-outlined">chevron_right</span>
                          </button>
                        </div>
                        
                        <div className="flex gap-8">
                          {/* First Month */}
                          <div className="flex-1">
                            <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 mb-2">
                              <span>{th('days.sun')}</span><span>{th('days.mon')}</span><span>{th('days.tue')}</span><span>{th('days.wed')}</span><span>{th('days.thu')}</span><span>{th('days.fri')}</span><span>{th('days.sat')}</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {(() => {
                                const year = new Date().getFullYear()
                                const month = new Date().getMonth() + calendarOffset
                                const firstDay = new Date(year, month, 1).getDay()
                                const days = getDaysInMonth(year, month)
                                return [
                                  ...Array(firstDay).fill(null),
                                  ...days.map(day => {
                                    const isSelected = (checkIn && day.toDateString() === checkIn.toDateString()) || 
                                                      (checkOut && day.toDateString() === checkOut.toDateString())
                                    const isInRange = checkIn && checkOut && day > checkIn && day < checkOut
                                    return (
                                      <button
                                        key={day.toISOString()}
                                        onClick={() => {
                                          if (!checkIn || (checkIn && checkOut)) {
                                            setCheckIn(day)
                                            setCheckOut(null)
                                          } else if (day > checkIn) {
                                            setCheckOut(day)
                                          } else {
                                            setCheckIn(day)
                                          }
                                        }}
                                        className={`h-10 w-10 rounded-full text-sm flex items-center justify-center transition-all ${
                                          isSelected ? 'bg-zinc-900 text-white' : 
                                          isInRange ? 'bg-zinc-100' : 
                                          'hover:bg-zinc-100'
                                        }`}
                                      >
                                        {day.getDate()}
                                      </button>
                                    )
                                  })
                                ]
                              })()}
                            </div>
                          </div>
                          
                          {/* Second Month */}
                          <div className="flex-1">
                            <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 mb-2">
                              <span>{th('days.sun')}</span><span>{th('days.mon')}</span><span>{th('days.tue')}</span><span>{th('days.wed')}</span><span>{th('days.thu')}</span><span>{th('days.fri')}</span><span>{th('days.sat')}</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {(() => {
                                const year = new Date().getFullYear()
                                const month = new Date().getMonth() + calendarOffset + 1
                                const firstDay = new Date(year, month, 1).getDay()
                                const days = getDaysInMonth(year, month)
                                return [
                                  ...Array(firstDay).fill(null),
                                  ...days.map(day => {
                                    const isSelected = (checkIn && day.toDateString() === checkIn.toDateString()) || 
                                                      (checkOut && day.toDateString() === checkOut.toDateString())
                                    const isInRange = checkIn && checkOut && day > checkIn && day < checkOut
                                    return (
                                      <button
                                        key={day.toISOString()}
                                        onClick={() => {
                                          if (!checkIn || (checkIn && checkOut)) {
                                            setCheckIn(day)
                                            setCheckOut(null)
                                          } else if (day > checkIn) {
                                            setCheckOut(day)
                                          } else {
                                            setCheckIn(day)
                                          }
                                        }}
                                        className={`h-10 w-10 rounded-full text-sm flex items-center justify-center transition-all ${
                                          isSelected ? 'bg-zinc-900 text-white' : 
                                          isInRange ? 'bg-zinc-100' : 
                                          'hover:bg-zinc-100'
                                        }`}
                                      >
                                        {day.getDate()}
                                      </button>
                                    )
                                  })
                                ]
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Check-in/Check-out Display */}
                        <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-zinc-100">
                          <div className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg">
                            <div>
                              <p className="text-xs text-zinc-500">{th('checkIn')}</p>
                              <p className="text-sm font-semibold">{checkIn ? formatDate(checkIn) : th('exactDay')}</p>
                            </div>
                            <span className="material-symbols-outlined text-zinc-400">expand_more</span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg">
                            <div>
                              <p className="text-xs text-zinc-500">{th('checkOut')}</p>
                              <p className="text-sm font-semibold">{checkOut ? formatDate(checkOut) : th('exactDay')}</p>
                            </div>
                            <span className="material-symbols-outlined text-zinc-400">expand_more</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Flexible Dates View */}
                        <div className="text-center mb-6">
                          <h4 className="font-semibold text-lg text-zinc-900 mb-1">{th('howLongStay')}</h4>
                          <p className="text-zinc-500">{th('selectDuration')}</p>
                        </div>
                        
                        <div className="flex justify-center gap-3 mb-8">
                          {[
                            { key: 'weekend', label: th('weekend') },
                            { key: 'week', label: th('week') },
                            { key: 'month', label: th('month') },
                          ].map(({ key, label }) => (
                            <button
                              key={key}
                              onClick={() => setFlexibleStay(key as any)}
                              className={`px-6 py-3 rounded-full border-2 font-medium transition-all ${
                                flexibleStay === key 
                                  ? 'border-zinc-900 bg-zinc-900 text-white' 
                                  : 'border-zinc-300 hover:border-zinc-900'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        
                        <div className="text-center mb-4">
                          <h4 className="font-semibold text-lg text-zinc-900 mb-1">{th('whenGo')}</h4>
                          <p className="text-zinc-500">{th('selectUpTo3Months')}</p>
                        </div>
                        
                        <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                          {Array.from({ length: 6 }).map((_, i) => {
                            const date = new Date()
                            date.setMonth(date.getMonth() + i)
                            const monthName = date.toLocaleDateString(currentLocale, { month: 'long' })
                            const year = date.getFullYear()
                            const monthKey = `${monthName} ${year}`
                            return (
                              <button
                                key={monthKey}
                                onClick={() => setSelectedMonth(selectedMonth === monthKey ? '' : monthKey)}
                                className={`flex flex-col items-center p-4 rounded-xl border-2 min-w-[100px] transition-all ${
                                  selectedMonth === monthKey 
                                    ? 'border-zinc-900 bg-zinc-50' 
                                    : 'border-zinc-200 hover:border-zinc-400'
                                }`}
                              >
                                <span className="material-symbols-outlined text-2xl mb-1 text-zinc-600">calendar_today</span>
                                <span className="text-sm font-medium">{monthName}</span>
                                <span className="text-xs text-zinc-500">{year}</span>
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {!isCompact && activeMenu === 'who' && (
              <div className="absolute top-[110%] right-0 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 w-[400px] z-[100]">
                <div className="flex flex-col gap-4">
                  {[
                    { key: 'adults', label: th('adults'), desc: th('adultsDesc') },
                    { key: 'children', label: th('children'), desc: th('childrenDesc') },
                    { key: 'infants', label: th('infants'), desc: th('infantsDesc') },
                    { key: 'pets', label: th('pets'), desc: th('petsDesc') },
                  ].map(({ key, label, desc }) => {
                    const count = guests[key as keyof typeof guests]
                    return (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
                        <div>
                          <p className="font-semibold text-zinc-900">{label}</p>
                          <p className="text-sm text-zinc-500">{desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setGuests(prev => ({ ...prev, [key]: Math.max(0, prev[key as keyof typeof guests] - 1) }))}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                              count === 0 
                                ? 'border-zinc-200 text-zinc-300 cursor-not-allowed' 
                                : 'border-zinc-400 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900'
                            }`}
                            disabled={count === 0}
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-6 text-center font-semibold text-lg">{count}</span>
                          <button 
                            onClick={() => setGuests(prev => ({ ...prev, [key]: prev[key as keyof typeof guests] + 1 }))}
                            className="w-8 h-8 rounded-full border border-zinc-400 text-zinc-600 flex items-center justify-center hover:border-zinc-900 hover:text-zinc-900 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center justify-end gap-1 md:gap-2 flex-shrink-0 z-10 w-auto md:w-[200px] lg:w-[250px]">
          {/* Become a Host - Opens Host Type Modal */}
          <button 
            onClick={() => setIsHostModalOpen(true)}
            className="hidden lg:block text-sm font-semibold text-zinc-800 hover:bg-zinc-100 rounded-full px-4 py-2 transition-all whitespace-nowrap"
          >
            {t('becomeHost') || 'Become a host'}
          </button>
          
          {/* Language & Currency Dropdown - Hidden on mobile */}
          <div ref={languageRef} className="relative hidden sm:block">
            <button 
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="h-9 w-9 md:h-10 md:w-10 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all flex items-center justify-center"
              title="Language & Currency"
            >
              <span className="material-symbols-outlined text-zinc-800 text-[20px]">language</span>
            </button>

            {/* LANGUAGE & CURRENCY DROP DOWN */}
            {isLanguageOpen && (
              <div className="absolute top-[120%] right-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 w-[220px] py-3 z-[110]">
                {/* Language Section */}
                <div className="px-4 pb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{th('language')}</span>
                </div>
                <button 
                  onClick={() => {
                    router.push(`/en${pathname.replace(/^\/(en|bn)/, '')}`)
                    setIsLanguageOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currentLocale === 'en' ? 'text-zinc-900' : 'text-zinc-600'}`}>English</span>
                  {currentLocale === 'en' && <span className="material-symbols-outlined text-[#C62D2D] text-lg">check</span>}
                </button>
                <button 
                  onClick={() => {
                    router.push(`/bn${pathname.replace(/^\/(en|bn)/, '')}`)
                    setIsLanguageOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currentLocale === 'bn' ? 'text-zinc-900' : 'text-zinc-600'}`}>বাংলা</span>
                  {currentLocale === 'bn' && <span className="material-symbols-outlined text-[#C62D2D] text-lg">check</span>}
                </button>

                <div className="my-2 border-t border-zinc-100" />

                {/* Currency Section */}
                <div className="px-4 pb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{th('currency')}</span>
                </div>
                <button 
                  onClick={() => { setCurrency('BDT'); setIsLanguageOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currency === 'BDT' ? 'text-zinc-900' : 'text-zinc-600'}`}>BDT (৳)</span>
                  {currency === 'BDT' && <span className="material-symbols-outlined text-[#C62D2D] text-lg">check</span>}
                </button>
                <button 
                  onClick={() => { setCurrency('USD'); setIsLanguageOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currency === 'USD' ? 'text-zinc-900' : 'text-zinc-600'}`}>USD ($)</span>
                  {currency === 'USD' && <span className="material-symbols-outlined text-[#C62D2D] text-lg">check</span>}
                </button>
                <button 
                  onClick={() => { setCurrency('GBP'); setIsLanguageOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                >
                  <span className={`text-sm font-medium ${currency === 'GBP' ? 'text-zinc-900' : 'text-zinc-600'}`}>GBP (£)</span>
                  {currency === 'GBP' && <span className="material-symbols-outlined text-[#C62D2D] text-lg">check</span>}
                </button>
              </div>
            )}
          </div>
          
          {/* Profile Menu */}
          <div ref={profileRef} className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-9 w-9 md:h-10 md:w-10 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-zinc-800 text-[20px]">menu</span>
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
                    <span className="text-xs text-zinc-500 leading-relaxed">{th('becomeHostDesc')}</span>
                  </div>
                  <img src="https://picsum.photos/seed/host/40/40" alt="Host" className="w-10 h-10 rounded-lg object-cover" />
                </button>
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
                        <span className="text-xs text-zinc-500">
                          {user?.fullName} • {user?.role}
                        </span>
                      </div>
                    </Link>
                    <button
                      type="button"
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
                    href={`/${currentLocale}/signup`}
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

      {/* MOBILE SEARCH BAR - Visible only on mobile, collapses on scroll */}
      <div className={`md:hidden bg-white border-b border-zinc-200 transition-all duration-300 ease-in-out overflow-hidden ${isCompact ? 'px-3 py-2' : 'px-4 pb-3'}`}>
        {isCompact ? (
          /* COMPACT PILL — shown when scrolled */
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="w-full flex items-center gap-2 bg-white border border-zinc-200 rounded-full py-2 px-4 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[#C62D2D] flex-shrink-0" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1, 'wght' 500" }}>search</span>
            <span className="text-zinc-700 font-semibold text-[13px] truncate">{t('startYourSearch')}</span>
          </button>
        ) : (
          /* FULL SEARCH + TAB NAV — shown at top */
          <>
            {/* Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="w-full flex items-center gap-3 bg-white border border-zinc-200 rounded-full py-3.5 px-6 shadow-md shadow-zinc-100/50 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-zinc-900 text-[20px]">search</span>
              <span className="text-zinc-800 font-bold text-[14px]">{t('startYourSearch')}</span>
            </button>

            {/* Mobile Tab Navigation */}
            <nav className="flex items-center justify-around mt-4">
              <Link
                href={`/${currentLocale}`}
                className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-colors ${activeTab === 'stays' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-zinc-500'}`}
              >
                <span className="text-2xl">🏠</span>
                <span className="text-xs font-medium">{t('homes')}</span>
              </Link>
              <Link
                href={`/${currentLocale}/experiences`}
                className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-colors relative ${activeTab === 'experiences' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-zinc-500'}`}
              >
                <span className="text-2xl">🎈</span>
                <span className="text-xs font-medium">{t('experiences')}</span>
                {activeTab !== 'experiences' && (
                  <span className="absolute -top-1 -right-2 bg-[#3b4c6b] text-white text-[8px] font-bold px-1 py-0.5 rounded-full">{th('new')}</span>
                )}
              </Link>
              <Link
                href={`/${currentLocale}/services`}
                className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-colors relative ${activeTab === 'services' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-zinc-500'}`}
              >
                <span className="text-2xl">🛎️</span>
                <span className="text-xs font-medium">{t('services')}</span>
                {activeTab !== 'services' && (
                  <span className="absolute -top-1 -right-2 bg-[#3b4c6b] text-white text-[8px] font-bold px-1 py-0.5 rounded-full">{th('new')}</span>
                )}
              </Link>
            </nav>
          </>
        )}
      </div>

      {/* Host Type Modal */}
      <HostTypeModal 
        isOpen={isHostModalOpen} 
        onClose={() => setIsHostModalOpen(false)} 
      />

      {/* MOBILE SEARCH MODAL - Card-based design matching reference */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-zinc-100 flex flex-col md:hidden animate-in fade-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-white px-4 py-4 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <div className="flex gap-8">
                <Link 
                  href={`/${currentLocale}/`}
                  onClick={() => setIsMobileSearchOpen(false)}
                  className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${activeTab === 'stays' ? 'border-zinc-950 text-zinc-950 scale-110' : 'border-transparent text-zinc-400'}`}
                >
                  <span className="text-2xl">🏠</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('homes')}</span>
                </Link>
                <Link 
                  href={`/${currentLocale}/experiences`}
                  onClick={() => setIsMobileSearchOpen(false)}
                  className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${activeTab === 'experiences' ? 'border-zinc-950 text-zinc-950 scale-110' : 'border-transparent text-zinc-400'}`}
                >
                  <span className="text-2xl">🎈</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('experiences')}</span>
                </Link>
                <Link 
                  href={`/${currentLocale}/services`}
                  onClick={() => setIsMobileSearchOpen(false)}
                  className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${activeTab === 'services' ? 'border-zinc-950 text-zinc-950 scale-110' : 'border-transparent text-zinc-400'}`}
                >
                  <span className="text-2xl">🛎️</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('services')}</span>
                </Link>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileSearchOpen(false)}
              className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-zinc-800">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* WHERE SECTION */}
            <div className={`bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden transition-all duration-300 ${mobileSearchSection === 'where' ? 'ring-2 ring-zinc-950' : ''}`}>
              {mobileSearchSection === 'where' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">{th('whereTitle')}</h2>
                  <div className="relative mb-6">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
                    <input 
                      type="text"
                      placeholder={t('searchDestinations')}
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-shadow shadow-sm"
                    />
                  </div>

                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">{th('suggestedDestinations')}</p>
                  <div className="space-y-1">
                    {[
                      { name: t('nearby'), desc: th('nearbyDesc'), icon: 'near_me' },
                      { name: t('sylhet'), desc: th('sylhetDesc'), icon: 'park' },
                      { name: t('coxsbazar'), desc: th('coxsBazarDesc'), icon: 'beach_access' },
                      { name: t('bandarban'), desc: th('bandarbanDesc'), icon: 'landscape' },
                      { name: t('sajek'), desc: th('sajekDesc'), icon: 'cloud' },
                      { name: t('dhaka'), desc: th('dhakaDesc'), icon: 'location_city' },
                    ].map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => { setSelectedLocation(dest.name); setMobileSearchSection('when'); }}
                        className="w-full flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-2xl transition-colors text-left group"
                      >
                        <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200 group-hover:bg-white transition-colors shadow-sm">
                          <span className="material-symbols-outlined text-zinc-600 text-xl">{dest.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900">{dest.name}</p>
                          <p className="text-xs text-zinc-500">{dest.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setMobileSearchSection('where')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-zinc-500">{t('where')}</span>
                  <span className="text-sm font-bold text-zinc-900 truncate max-w-[200px]">
                    {selectedLocation || t('anywhere')}
                  </span>
                </button>
              )}
            </div>

            {/* WHEN SECTION */}
            <div className={`bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden transition-all duration-300 ${mobileSearchSection === 'when' ? 'ring-2 ring-zinc-950' : ''}`}>
              {mobileSearchSection === 'when' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">{th('whenTitle')}</h2>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <button 
                      onClick={() => setDateMode('dates')}
                      className={`py-3 px-6 rounded-full border text-sm font-bold transition-all ${dateMode === 'dates' ? 'bg-zinc-950 text-white border-zinc-950 shadow-md' : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'}`}
                    >
                      {th('exactDates')}
                    </button>
                    <button 
                      onClick={() => setDateMode('flexible')}
                      className={`py-3 px-6 rounded-full border text-sm font-bold transition-all ${dateMode === 'flexible' ? 'bg-zinc-950 text-white border-zinc-950 shadow-md' : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'}`}
                    >
                      {th('imFlexible')}
                    </button>
                  </div>
                  
                  {/* Calendar placeholder for mobile */}
                  <div className="bg-zinc-50 rounded-3xl p-8 text-center border-2 border-dashed border-zinc-200">
                    <span className="material-symbols-outlined text-4xl text-zinc-300 mb-2">calendar_month</span>
                    <p className="text-sm text-zinc-500 font-medium">{th('calendarComingSoon')}</p>
                    <button 
                      onClick={() => setMobileSearchSection(activeTab === 'services' ? 'who' : 'who')}
                      className="mt-4 text-xs font-bold text-zinc-900 underline"
                    >
                      {activeTab === 'services' ? th('addService') : th('skipToGuests')}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setMobileSearchSection('when')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-zinc-500">{t('when')}</span>
                  <span className="text-sm font-bold text-zinc-900">
                    {checkIn ? formatDate(checkIn) : t('addDates')}
                  </span>
                </button>
              )}
            </div>

            {/* WHO / WHAT SECTION */}
            <div className={`bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden transition-all duration-300 ${mobileSearchSection === 'who' ? 'ring-2 ring-zinc-950' : ''}`}>
              {mobileSearchSection === 'who' ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">{activeTab === 'services' ? th('whatTitle') : th('whoTitle')}</h2>
                  
                  {activeTab === 'services' ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'private-chefs', title: th('privateChefs'), icon: 'restaurant' },
                        { id: 'car-driver', title: th('carDriver'), icon: 'directions_car' },
                        { id: 'photographers', title: th('photographers'), icon: 'photo_camera' },
                        { id: 'tour-guides', title: th('tourGuides'), icon: 'map' },
                        { id: 'airport-pickup', title: th('airportPickup'), icon: 'local_taxi' },
                        { id: 'laundry', title: th('laundry'), icon: 'local_laundry_service' },
                        { id: 'grocery-delivery', title: th('groceryDelivery'), icon: 'shopping_cart' },
                        { id: 'event-decor', title: th('eventDecor'), icon: 'celebration' },
                        { id: 'nannies', title: th('nannies'), icon: 'child_care' },
                        { id: 'security', title: th('security'), icon: 'security' },
                      ].map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedCategory(service.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${selectedCategory === service.id ? 'bg-zinc-950 text-white border-zinc-950 shadow-md scale-105' : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'}`}
                        >
                          <span className="material-symbols-outlined text-2xl">{service.icon}</span>
                          <span className="text-xs font-bold text-center">{service.title}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {[
                        { key: 'adults', title: th('adults'), desc: th('adultsDesc') },
                        { key: 'children', title: th('children'), desc: th('childrenDesc') },
                        { key: 'infants', title: th('infants'), desc: th('infantsDesc') },
                        { key: 'pets', title: th('pets'), desc: th('petsDesc') },
                      ].map((type) => (
                        <div key={type.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-zinc-900">{type.title}</p>
                            <p className="text-xs text-zinc-500">{type.desc}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setGuests({ ...guests, [type.key]: Math.max(0, guests[type.key as keyof typeof guests] - 1) })}
                              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-900 active:scale-90 transition-all"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="w-6 text-center font-bold text-zinc-900">{guests[type.key as keyof typeof guests]}</span>
                            <button 
                              onClick={() => setGuests({ ...guests, [type.key]: guests[type.key as keyof typeof guests] + 1 })}
                              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-900 active:scale-90 transition-all"
                            >
                              <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setMobileSearchSection('who')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-zinc-500">{activeTab === 'services' ? th('what') : t('who')}</span>
                  <span className="text-sm font-bold text-zinc-900">
                    {activeTab === 'services' 
                      ? (selectedCategory ? th(selectedCategory.replace(/-/g, ' ').split(' ').map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('')) : th('addService'))
                      : (Object.values(guests).reduce((a, b) => a + b, 0) > 0 
                          ? `${Object.values(guests).reduce((a, b) => a + b, 0)} ${t('guests')}` 
                          : t('addGuests'))
                    }
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white px-6 py-4 border-t border-zinc-200 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => {
                setSelectedLocation('')
                setCheckIn(null)
                setCheckOut(null)
                setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
                setSelectedCategory('')
              }}
              className="text-sm font-bold text-zinc-900 underline underline-offset-4 decoration-2"
            >
              {th('clearAll')}
            </button>
            <button 
              onClick={() => {
                setIsMobileSearchOpen(false)
                handleSearch()
              }}
              className="bg-zinc-950 text-white px-10 py-3.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-zinc-950/20 active:scale-95 transition-all"
            >
              {activeTab === 'services' ? t('next') : th('search')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
