'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/app/components/layout/Header'
import { useState, useEffect } from 'react'
import { searchListings } from '@/app/actions/listings'
import type { Listing } from '@/app/actions/listings'
import { RemoteImage } from '@/components/shared/RemoteImage'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'

import { useTranslations, useLocale } from 'next-intl'

export default function SearchPage() {
  const t = useTranslations('Search')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const location = searchParams.get('location') || ''
  const checkin = searchParams.get('checkin') || ''
  const checkout = searchParams.get('checkout') || ''
  const guestsParam = searchParams.get('guests') || '0'
  const guests = parseInt(guestsParam, 10)

  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const results = await searchListings({
          city: location,
          guests: guests > 0 ? guests : undefined
        })
        setListings(results)
      } catch (error) {
        console.error('Error fetching listings:', error)
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [location, guests])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header userRole="GUEST" />
      
      {/* Search Summary Bar */}
      <div className="border-b border-zinc-200 bg-white sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-zinc-900">
                {loading ? t('searching') : `${listings.length} ${t('stays')} ${location ? `${t('in')} ${location}` : ''}`}
              </h1>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                {checkin && (
                  <span className="bg-zinc-100 px-3 py-1 rounded-full">
                    {formatDate(checkin)} - {formatDate(checkout) || '...'}
                  </span>
                )}
                {guests > 0 && (
                  <span className="bg-zinc-100 px-3 py-1 rounded-full">
                    {guests} {guests > 1 ? t('guests') : t('guest')}
                  </span>
                )}
              </div>
            </div>
            <Link 
              href="/" 
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              {t('modifySearch')}
            </Link>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-zinc-300 mb-4">search_off</span>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">{t('noResults')}</h2>
            <p className="text-zinc-500">{t('noResultsDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/rooms/${listing.id}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden relative bg-zinc-100">
                    {listing.image_urls?.[0] ? (
                      <RemoteImage
                        src={listing.image_urls[0]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-500">{listing.city}, {listing.district}</span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                        <span className="text-sm font-medium">{listing.average_rating}</span>
                        <span className="text-sm text-zinc-400">({listing.review_count})</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-zinc-900 mb-2 line-clamp-2">{listing.title}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <PriceDisplay 
                          priceBDT={listing.price_bdt} 
                          className="font-bold text-zinc-900" 
                        />
                        <span className="text-zinc-500 text-sm"> {t('perNight')}</span>
                      </div>
                      <span className="text-xs text-zinc-400">{listing.max_guests} {t('maxGuests')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
