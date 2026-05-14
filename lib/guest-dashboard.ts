/** Serializable guest booking view for dashboard UI (server → client). */
export type GuestBookingVM = {
  id: string
  listingId: string | null
  listingTitle: string
  hostName: string
  location: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  imageUrl: string | null
  createdAt: string
}

export function toGuestBookingVM(row: Record<string, unknown>): GuestBookingVM {
  const listing = row.listings as Record<string, unknown> | null | undefined
  const profile = row.profiles as Record<string, unknown> | null | undefined
  const images = listing?.image_urls as string[] | undefined

  const start = (row.start_date ?? row.check_in ?? '') as string
  const end = (row.end_date ?? row.check_out ?? '') as string
  const listingId =
    row.listing_id != null
      ? String(row.listing_id)
      : listing?.id != null
        ? String(listing.id)
        : null

  const loc =
    [listing?.city, listing?.district].filter(Boolean).join(', ') ||
    (listing?.address as string) ||
    ''

  return {
    id: String(row.id),
    listingId,
    listingTitle: (listing?.title as string) || 'Stay',
    hostName: (profile?.full_name as string) || 'Host',
    location: loc || 'Bangladesh',
    startDate: String(start),
    endDate: String(end),
    totalPrice: Number(row.total_price ?? row.total_price_bdt ?? row.amount_bdt ?? 0),
    status: String(row.status ?? 'PENDING'),
    imageUrl: images?.[0] ?? null,
    createdAt: String(row.created_at ?? ''),
  }
}

export function isUpcomingStay(b: GuestBookingVM): boolean {
  if (!b.endDate) return false
  const end = new Date(b.endDate)
  if (Number.isNaN(end.getTime())) return false
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const status = b.status.toUpperCase()
  return end >= now && (status === 'CONFIRMED' || status === 'PENDING')
}
