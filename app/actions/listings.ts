'use server'

import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

async function getDb(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient
}

export type ListingType = 'HOME' | 'EXPERIENCE' | 'SERVICE'

export interface Listing {
  id: string
  host_id: string
  type: ListingType
  title: string
  description: string
  city: string
  district: string
  address?: string
  latitude?: number
  longitude?: number
  price_bdt: number
  currency: string
  service_fee_bdt: number
  cleaning_fee_bdt: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  image_urls: string[]
  average_rating: number
  review_count: number
  is_guest_favorite: boolean
  is_active: boolean
  availability_calendar: unknown
  created_at: string
  updated_at: string
}

export async function getListings(type?: ListingType): Promise<Listing[]> {
  const supabase = await getDb()
  let q = supabase.from('listings').select('*').eq('is_active', true)
  if (type) {
    q = q.eq('type', type)
  }
  const { data, error } = await q
    .order('is_guest_favorite', { ascending: false })
    .order('average_rating', { ascending: false })
  if (error) {
    console.error('getListings:', error)
    return []
  }
  return data ?? []
}

export async function getAllListings(): Promise<Listing[]> {
  const supabase = await getDb()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('is_active', true)
  if (error) {
    console.error('getAllListings:', error)
    return []
  }
  return data ?? []
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await getDb()
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).maybeSingle()
  if (error) {
    console.error('getListingById:', error)
    return null
  }
  return data
}

export async function searchListings(params: {
  query?: string
  city?: string
  district?: string
  type?: ListingType
  minPrice?: number
  maxPrice?: number
  guests?: number
}): Promise<Listing[]> {
  const supabase = await getDb()
  let q = supabase.from('listings').select('*').eq('is_active', true)

  if (params.type) {
    q = q.eq('type', params.type)
  }
  if (params.city) {
    q = q.eq('city', params.city)
  }
  if (params.district) {
    q = q.eq('district', params.district)
  }
  if (params.minPrice != null) {
    q = q.gte('price_bdt', params.minPrice)
  }
  if (params.maxPrice != null) {
    q = q.lte('price_bdt', params.maxPrice)
  }
  if (params.guests) {
    q = q.gte('max_guests', params.guests)
  }
  if (params.query?.trim()) {
    const escaped = params
      .query!.trim()
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_')
    const pattern = `%${escaped}%`
    q = q.or(`title.ilike.${pattern},description.ilike.${pattern}`)
  }

  const { data, error } = await q
    .order('is_guest_favorite', { ascending: false })
    .order('average_rating', { ascending: false })

  if (error) {
    console.error('searchListings:', error)
    return []
  }
  return data ?? []
}

export async function getTopDestinations() {
  const topCities = ["Cox's Bazar", 'Sylhet', 'Dhaka', 'Bandarban', 'Sajek Valley']
  const supabase = await getDb()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .in('city', topCities)
    .eq('is_active', true)
    .order('average_rating', { ascending: false })
    .limit(20)

  if (error) {
    console.error('getTopDestinations:', error)
    return []
  }
  return data ?? []
}
