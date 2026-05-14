import { getGuestBookings } from '@/app/actions/booking'
import { toGuestBookingVM } from '@/lib/guest-dashboard'
import { GuestOverviewClient } from './GuestOverviewClient'

export default async function GuestOverviewPage() {
  const raw = await getGuestBookings()
  const bookings = (raw || []).map((row) => toGuestBookingVM(row as Record<string, unknown>))

  return <GuestOverviewClient bookings={bookings} />
}
