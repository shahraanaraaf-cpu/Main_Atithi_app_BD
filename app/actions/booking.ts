'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(listingId: string) {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Check if it already exists
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single()

  if (existing) {
    // Remove from wishlist
    await supabase.from('wishlists').delete().eq('id', existing.id)
  } else {
    // Add to wishlist
    await supabase.from('wishlists').insert({
      user_id: user.id,
      listing_id: listingId
    })
  }

  revalidatePath('/', 'layout')
}

export async function createBooking(listingId: string, hostId: string, startDate: Date, endDate: Date, price: number, guests: number) {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  const { error } = await supabase.from('bookings').insert({
    listing_id: listingId,
    guest_id: user.id,
    host_id: hostId,
    check_in: startDate.toISOString().split('T')[0],
    check_out: endDate.toISOString().split('T')[0],
    nights: nights,
    total_price_bdt: price,
    guests_count: guests,
    status: 'PENDING'
  })

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return true
}

export async function getHostBookings() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*, listings(title, image_urls), profiles!guest_id(full_name)')
    .eq('host_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }

  return data
}

export async function getGuestBookings() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(
      '*, listings(id, title, image_urls, city, district, address), profiles!host_id(full_name)'
    )
    .eq('guest_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching guest bookings:', error)
    return []
  }

  return data
}

export async function getGuestBookingById(bookingId: string) {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('bookings')
    .select(
      '*, listings(id, title, image_urls, city, district, address, price_bdt), profiles!host_id(full_name)'
    )
    .eq('id', bookingId)
    .eq('guest_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching guest booking:', error)
    return null
  }

  return data
}
