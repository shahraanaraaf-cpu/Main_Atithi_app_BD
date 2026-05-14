import { getGuestBookings } from '@/app/actions/booking'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'
import Link from 'next/link'
import { toGuestBookingVM } from '@/lib/guest-dashboard'

export default async function GuestDashboard({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const raw = await getGuestBookings()
  const bookings = (raw || []).map((row: any) => toGuestBookingVM(row as Record<string, unknown>))
  const fallbackImage = 'https://picsum.photos/seed/trip/800/500'

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <GlobalHeader activeTab="stays" />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Trips</h1>
          <Link
            href={`/${locale}/dashboard/guest/overview`}
            className="text-sm font-semibold text-[#C62D2D] hover:underline"
          >
            Dashboard overview →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-zinc-200 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-zinc-400">travel_explore</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">No trips booked... yet!</h2>
            <p className="text-zinc-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
            <Link
              href={`/${locale}/search`}
              className="inline-block px-6 py-3 bg-[#FF385C] text-white font-bold rounded-xl hover:bg-[#E31C5F] transition-all"
            >
              Start searching
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking: any) => (
              <Link
                key={booking.id}
                href={
                  booking.listingId
                    ? `/${locale}/rooms/${booking.listingId}`
                    : `/${locale}/dashboard/guest/bookings/${booking.id}`
                }
                className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden group block text-left hover:border-zinc-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C62D2D]"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={booking.imageUrl || fallbackImage}
                    alt={booking.listingTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-xs font-bold shadow-md">
                    {booking.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-zinc-900 mb-1 truncate">{booking.listingTitle}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{booking.location}</p>

                  <div className="flex items-center gap-4 py-4 border-t border-zinc-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-zinc-400">Check-in</span>
                      <span className="text-sm font-bold text-zinc-900">{booking.startDate}</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-100" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-zinc-400">Checkout</span>
                      <span className="text-sm font-bold text-zinc-900">{booking.endDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium text-zinc-900">Total</span>
                    <PriceDisplay priceBDT={booking.totalPrice} className="font-bold text-zinc-900" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#C62D2D] group-hover:underline">
                    Open listing →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
