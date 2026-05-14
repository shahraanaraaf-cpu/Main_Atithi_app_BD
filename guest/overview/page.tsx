import { getGuestBookings } from '@/app/actions/booking'
import { toGuestBookingVM, type GuestBookingVM } from '@/lib/guest-dashboard'
import { GuestOverviewClient } from './GuestOverviewClient'

export default async function GuestOverviewPage() {
  const raw = await getGuestBookings()
  const bookings: GuestBookingVM[] = (raw || []).map((row: Record<string, unknown>) => toGuestBookingVM(row))

  return <GuestOverviewClient bookings={bookings} />
}
