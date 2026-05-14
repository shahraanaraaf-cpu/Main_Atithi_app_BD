'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import type { GuestBookingVM } from '@/lib/guest-dashboard'
import { isUpcomingStay } from '@/lib/guest-dashboard'
import { cn } from '@/lib/utils'

function nightsUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const start = new Date(dateStr)
  if (Number.isNaN(start.getTime())) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)
  const ms = start.getTime() - now.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export function GuestOverviewClient({ bookings }: { bookings: GuestBookingVM[] }) {
  const t = useTranslations('GuestDashboard')
  const locale = useLocale()
  const router = useRouter()

  const upcomingBookings = bookings.filter(isUpcomingStay)
  const totalTrips = bookings.length
  const upcomingStays = upcomingBookings.length
  const nextStay = upcomingBookings[0]
  const nextNights = nextStay ? nightsUntil(nextStay.startDate) : null

  const recentActivity = [...bookings]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5)
    .map((b) => ({
      id: b.id,
      type: 'booking' as const,
      title:
        b.status.toUpperCase() === 'CONFIRMED'
          ? 'Booking confirmed'
          : b.status.toUpperCase() === 'PENDING'
            ? 'Booking pending'
            : `Booking ${b.status}`,
      description: `${b.listingTitle} · ${b.startDate} – ${b.endDate}`,
      timestamp: b.createdAt ? new Date(b.createdAt).toLocaleDateString(locale) : '',
    }))

  const fallbackImage = 'https://picsum.photos/seed/trip/800/500'

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader activeTab="stays" />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('overview')}</h1>
              <p className="text-gray-600 mt-1">{t('welcomeBackGuest')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/${locale}/search`)}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined">search</span>
                {t('explorePlaces')}
              </Button>
              <Button
                onClick={() => router.push(`/${locale}/dashboard/guest/bookings`)}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined">book_online</span>
                {t('viewBookings')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href={`/${locale}/dashboard/guest`} className="block transition-opacity hover:opacity-90">
            <Card className="h-full cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{t('totalTrips')}</CardTitle>
                <span className="material-symbols-outlined text-blue-600">flight_takeoff</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{totalTrips}</div>
                <p className="text-xs text-gray-500 mt-1">{t('amazingExperiences')}</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${locale}/dashboard/guest/bookings`} className="block transition-opacity hover:opacity-90">
            <Card className="h-full cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{t('upcomingStays')}</CardTitle>
                <span className="material-symbols-outlined text-green-600">event_available</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{upcomingStays}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {nextNights != null && nextNights >= 0
                    ? `${t('nextStayIn')} ${nextNights} ${t('days')}`
                    : t('yourConfirmedBookings')}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${locale}/search`} className="block transition-opacity hover:opacity-90">
            <Card className="h-full cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{t('favoritePlaces')}</CardTitle>
                <span className="material-symbols-outlined text-red-600">favorite</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">—</div>
                <p className="text-xs text-gray-500 mt-1">{t('savedForLater')}</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${locale}/search`} className="block transition-opacity hover:opacity-90">
            <Card className="h-full cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{t('totalSaved')}</CardTitle>
                <span className="material-symbols-outlined text-purple-600">savings</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  <PriceDisplay
                    priceBDT={bookings.reduce((sum, b) => sum + (Number.isFinite(b.totalPrice) ? b.totalPrice : 0), 0)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('withMemberDiscounts')}</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/search`)}
            >
              <span className="material-symbols-outlined text-xl">search</span>
              <span className="text-sm">{t('explore')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/dashboard/guest/preferences`)}
            >
              <span className="material-symbols-outlined text-xl">tune</span>
              <span className="text-sm">{t('preferences')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/messages`)}
            >
              <span className="material-symbols-outlined text-xl">message</span>
              <span className="text-sm">{t('messages')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/dashboard/guest/settings`)}
            >
              <span className="material-symbols-outlined text-xl">account_circle</span>
              <span className="text-sm">{t('profile')}</span>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center gap-2">
              <CardTitle>{t('upcomingStays')}</CardTitle>
              <Link
                href={`/${locale}/dashboard/guest/bookings`}
                className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline shrink-0"
              >
                {t('viewAll')}
              </Link>
            </div>
            <CardDescription>{t('yourConfirmedBookings')}</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="mb-4">{t('amazingExperiences')}</p>
                <Button onClick={() => router.push(`/${locale}/search`)}>{t('explorePlaces')}</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      className="w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                      onClick={() =>
                        booking.listingId
                          ? router.push(`/${locale}/rooms/${booking.listingId}`)
                          : router.push(`/${locale}/dashboard/guest/bookings/${booking.id}`)
                      }
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        <img
                          src={booking.imageUrl || fallbackImage}
                          alt={booking.listingTitle}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </button>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{booking.listingTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {t('hostedBy')} {booking.hostName}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {booking.location}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-sm text-gray-500">{t('dates')}</div>
                          <div className="font-medium text-gray-900">
                            {booking.startDate} – {booking.endDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{t('total')}</div>
                          <div className="font-bold text-gray-900">
                            <PriceDisplay priceBDT={booking.totalPrice} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/${locale}/dashboard/guest/bookings/${booking.id}`)}
                          className="flex-1"
                        >
                          {t('viewDetails')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/${locale}/messages`)}
                          className="flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">message</span>
                          {t('contact')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
            <CardDescription>{t('latestActivity')}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">{t('latestActivity')}</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => router.push(`/${locale}/dashboard/guest/bookings/${activity.id}`)}
                    className={cn(
                      'w-full flex items-start gap-4 p-4 border border-gray-100 rounded-lg text-left',
                      'hover:bg-gray-50 transition-colors cursor-pointer'
                    )}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
                      <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                      <div className="text-xs text-gray-400 mt-2">{activity.timestamp}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
