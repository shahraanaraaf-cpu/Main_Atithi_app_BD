'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'
import { GlobalHeader } from '@/components/shared/GlobalHeader'

export default function HostOverviewPage() {
  const t = useTranslations('HostDashboard')
  const locale = useLocale()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalEarnings: 125450,
    activeBookings: 8,
    totalListings: 3,
    hostRating: 4.98,
    upcomingCheckins: 2,
    pendingRequests: 3
  })
  
  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      guestName: 'Sarah Johnson',
      listingTitle: 'Cozy Apartment in Dhanmondi',
      startDate: '2024-05-15',
      endDate: '2024-05-18',
      status: 'CONFIRMED',
      totalPrice: 12000
    },
    {
      id: 2,
      guestName: 'Michael Chen',
      listingTitle: 'Villa near Gulshan',
      startDate: '2024-05-20',
      endDate: '2024-05-25',
      status: 'PENDING',
      totalPrice: 25000
    },
    {
      id: 3,
      guestName: 'Fatima Rahman',
      listingTitle: 'Beach House in Cox\'s Bazar',
      startDate: '2024-05-22',
      endDate: '2024-05-24',
      status: 'CONFIRMED',
      totalPrice: 18000
    }
  ])

  const handleAcceptBooking = (bookingId: number) => {
    setRecentBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CONFIRMED' }
          : booking
      )
    )
    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
      activeBookings: prev.activeBookings + 1
    }))
  }

  const handleDeclineBooking = (bookingId: number) => {
    setRecentBookings(prev => 
      prev.filter(booking => booking.id !== bookingId)
    )
    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader activeTab="stays" />
      {/* Page title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('overview')}</h1>
              <p className="text-gray-600 mt-1">{t('welcomeBack')}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/${locale}/dashboard/host/calendar`)}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined">calendar_month</span>
                {t('calendar')}
              </Button>
              <Button 
                onClick={() => router.push(`/${locale}/dashboard/host/listings`)}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                {t('newListing')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('totalEarnings')}
              </CardTitle>
              <span className="material-symbols-outlined text-green-600">payments</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                <PriceDisplay priceBDT={stats.totalEarnings} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +12% {t('fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('activeBookings')}
              </CardTitle>
              <span className="material-symbols-outlined text-blue-600">book_online</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeBookings}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.upcomingCheckins} {t('checkinsTomorrow')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('totalListings')}
              </CardTitle>
              <span className="material-symbols-outlined text-purple-600">home</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalListings}</div>
              <p className="text-xs text-gray-500 mt-1">
                2 {t('available')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('hostRating')}
              </CardTitle>
              <span className="material-symbols-outlined text-yellow-600">star</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.hostRating}</div>
              <p className="text-xs text-gray-500 mt-1">
                {t('superhostStatus')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/dashboard/host/listings`)}
            >
              <span className="material-symbols-outlined text-xl">add_home</span>
              <span className="text-sm">{t('addListing')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/dashboard/host/calendar`)}
            >
              <span className="material-symbols-outlined text-xl">event_available</span>
              <span className="text-sm">{t('updateAvailability')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/dashboard/host/earnings`)}
            >
              <span className="material-symbols-outlined text-xl">trending_up</span>
              <span className="text-sm">{t('viewEarnings')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${locale}/dashboard/host/settings`)}
            >
              <span className="material-symbols-outlined text-xl">settings</span>
              <span className="text-sm">{t('settings')}</span>
            </Button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('recentBookings')}</CardTitle>
                <Link href={`/${locale}/dashboard/host/bookings`}>
                  <Button variant="link" size="sm">
                    {t('viewAll')}
                  </Button>
                </Link>
              </div>
              <CardDescription>
                {t('latestBookingActivity')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{booking.guestName}</div>
                      <div className="text-sm text-gray-500">{booking.listingTitle}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {booking.startDate} - {booking.endDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        <PriceDisplay priceBDT={booking.totalPrice} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('pendingRequests')}</CardTitle>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                  {stats.pendingRequests}
                </span>
              </div>
              <CardDescription>
                {t('bookingRequestsNeedingAction')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings
                  .filter(booking => booking.status === 'PENDING')
                  .map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-sm text-gray-500">{booking.listingTitle}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {booking.startDate} - {booking.endDate}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAcceptBooking(booking.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeclineBooking(booking.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {stats.pendingRequests === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <span className="material-symbols-outlined text-3xl text-gray-300">check_circle</span>
                    <p className="mt-2 text-sm">{t('noPendingRequests')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
