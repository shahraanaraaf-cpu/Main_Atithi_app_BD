'use client'

import { getHostBookings } from '@/app/actions/booking'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { useState, useEffect } from 'react'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getHostBookings()
        setBookings(data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <GlobalHeader activeTab="stays" />
      
      <main className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">Host Dashboard</h1>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-200">
          <h2 className="text-xl font-semibold mb-6">Recent Bookings</h2>
          
          {loading ? (
            <div className="text-center py-12 text-zinc-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF385C] mx-auto"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>You don't have any bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="pb-4 font-semibold text-zinc-600">Guest</th>
                    <th className="pb-4 font-semibold text-zinc-600">Listing</th>
                    <th className="pb-4 font-semibold text-zinc-600">Dates</th>
                    <th className="pb-4 font-semibold text-zinc-600">Status</th>
                    <th className="pb-4 font-semibold text-zinc-600 text-right">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: any) => (
                    <tr key={booking.id} className="border-b border-zinc-100 last:border-0">
                      <td className="py-4 font-medium text-zinc-900">
                        {booking.profiles?.full_name || 'Unknown Guest'}
                      </td>
                      <td className="py-4 text-zinc-700">
                        {booking.listings?.title || 'Unknown Listing'}
                      </td>
                      <td className="py-4 text-zinc-700">
                        {booking.start_date} to {booking.end_date}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-semibold text-zinc-900">
                        <PriceDisplay priceBDT={booking.total_price} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
