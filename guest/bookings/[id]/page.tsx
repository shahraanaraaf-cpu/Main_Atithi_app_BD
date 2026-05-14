import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGuestBookingById } from '@/app/actions/booking'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'
import { toGuestBookingVM } from '@/lib/guest-dashboard'

export default async function GuestBookingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const raw = await getGuestBookingById(id)
  if (!raw) notFound()

  const booking = toGuestBookingVM(raw as Record<string, unknown>)
  const fallbackImage = 'https://picsum.photos/seed/trip/800/500'

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <GlobalHeader activeTab="stays" />
      <main className="flex-1 max-w-3xl mx-auto px-6 md:px-10 py-10 w-full">
        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          <Link href={`/${locale}/dashboard/guest/bookings`} className="text-[#C62D2D] font-semibold hover:underline">
            ← All bookings
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href={`/${locale}/dashboard/guest/overview`} className="text-zinc-600 hover:underline">
            Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="aspect-[21/9] bg-zinc-100 relative">
            <img
              src={booking.imageUrl || fallbackImage}
              alt={booking.listingTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-xs font-bold shadow-md">
              {booking.status}
            </div>
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{booking.listingTitle}</h1>
            <p className="text-zinc-500 mb-6">{booking.location}</p>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <dt className="text-zinc-400 font-semibold uppercase text-xs tracking-wide">Host</dt>
                <dd className="font-medium text-zinc-900 mt-1">{booking.hostName}</dd>
              </div>
              <div>
                <dt className="text-zinc-400 font-semibold uppercase text-xs tracking-wide">Total</dt>
                <dd className="font-medium text-zinc-900 mt-1">
                  <PriceDisplay priceBDT={booking.totalPrice} />
                </dd>
              </div>
              <div>
                <dt className="text-zinc-400 font-semibold uppercase text-xs tracking-wide">Check-in</dt>
                <dd className="font-medium text-zinc-900 mt-1">{booking.startDate}</dd>
              </div>
              <div>
                <dt className="text-zinc-400 font-semibold uppercase text-xs tracking-wide">Checkout</dt>
                <dd className="font-medium text-zinc-900 mt-1">{booking.endDate}</dd>
              </div>
            </dl>

            <div className="flex flex-col sm:flex-row gap-3">
              {booking.listingId ? (
                <Link
                  href={`/${locale}/rooms/${booking.listingId}`}
                  className="inline-flex justify-center items-center px-6 py-3 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  View listing
                </Link>
              ) : null}
              <Link
                href={`/${locale}/messages`}
                className="inline-flex justify-center items-center px-6 py-3 border border-zinc-300 text-zinc-900 font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
              >
                Message host
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
