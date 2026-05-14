import { createClient } from '@supabase/supabase-js'
import { staysCategories } from '../modules/stays/data/staysCategories'
import { experienceCategories } from '../modules/experiences/data/experienceCategories'
import { serviceCategories } from '../modules/services/data/serviceCategories'

import { sylhetListings, coxsBazarListings, bandarbanListings, dhakaListings } from '../modules/stays/data/staysListings'
import { popularExperiences, atithiOriginals, happeningToday, tomorrowInDhaka, dhakaExperiences, chittagongExperiences, sylhetExperiences, rajshahiExperiences, khulnaExperiences, coxsBazarExperiences } from '../modules/experiences/data/experienceData'
import { popularServices, chefServices, carDriverServices, photoServices } from '../modules/services/data/serviceData'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('Starting seeding to Supabase...')

  // 1. Get or Create a Host Profile
  console.log('Checking for existing profiles...')
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single()

  let hostId: string
  if (profileError || !profileData) {
    console.log('No profile found, falling back to a mock UUID for hostId (this may fail if FK constraints are strictly enforced).')
    hostId = '00000000-0000-0000-0000-000000000001'
  } else {
    hostId = profileData.id
  }

  console.log('Using Host ID:', hostId)

  // 2. Seed Listings
  console.log('Seeding listings...')

  const listingsToInsert: any[] = []

  // Helper to parse location into city and district
  const parseLoc = (loc: string) => {
    const parts = loc.split(',').map(p => p.trim())
    return {
      city: parts[0],
      district: parts[1] || parts[0]
    }
  }

  // Stays
  const allStays = [...sylhetListings, ...coxsBazarListings, ...bandarbanListings, ...dhakaListings]
  allStays.forEach(s => {
    const { city, district } = parseLoc(s.location)
    listingsToInsert.push({
      host_id: hostId,
      type: 'HOME',
      title: s.title,
      description: `Beautiful stay in ${s.location}. ${s.host}.`,
      city: city,
      district: district,
      price_bdt: s.price,
      currency: 'BDT',
      service_fee_bdt: Math.round(s.price * 0.1),
      cleaning_fee_bdt: 500,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['Wifi', 'Kitchen', 'Air conditioning'],
      image_urls: s.images,
      average_rating: s.rating,
      review_count: Math.floor(Math.random() * 100),
      is_guest_favorite: s.isGuestFavorite || false,
      is_active: true
    })
  })

  // Experiences
  const allExperiences = [
    ...popularExperiences, ...atithiOriginals, ...happeningToday, 
    ...tomorrowInDhaka, ...dhakaExperiences, ...chittagongExperiences, 
    ...sylhetExperiences, ...rajshahiExperiences, ...khulnaExperiences, ...coxsBazarExperiences
  ]
  allExperiences.forEach(e => {
    const { city, district } = parseLoc(e.location || 'Dhaka')
    listingsToInsert.push({
      host_id: hostId,
      type: 'EXPERIENCE',
      title: e.title,
      description: `${e.title} hosted by ${e.hostType}.`,
      city: city,
      district: district,
      price_bdt: e.price,
      currency: 'BDT',
      service_fee_bdt: 0,
      cleaning_fee_bdt: 0,
      max_guests: 10,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [e.hostType],
      image_urls: [e.image],
      average_rating: e.rating,
      review_count: Math.floor(Math.random() * 50),
      is_guest_favorite: e.badge === 'Popular',
      is_active: true
    })
  })

  // Services
  const allServices = [...popularServices, ...chefServices, ...carDriverServices, ...photoServices]
  allServices.forEach(s => {
    const { city, district } = parseLoc(s.location || 'Dhaka')
    listingsToInsert.push({
      host_id: hostId,
      type: 'SERVICE',
      title: s.title,
      description: `${s.title} provided by ${s.provider}.`,
      city: city,
      district: district,
      price_bdt: s.price,
      currency: 'BDT',
      service_fee_bdt: 0,
      cleaning_fee_bdt: 0,
      max_guests: 1,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [s.provider],
      image_urls: [s.image],
      average_rating: s.rating,
      review_count: s.reviews,
      is_guest_favorite: false,
      is_active: true
    })
  })

  // Chunking inserts to avoid payload size issues
  const chunkSize = 50
  for (let i = 0; i < listingsToInsert.length; i += chunkSize) {
    const chunk = listingsToInsert.slice(i, i + chunkSize)
    const { error: listError } = await supabase
      .from('listings')
      .insert(chunk)

    if (listError) {
      console.error(`Error seeding chunk ${i / chunkSize}:`, listError)
    } else {
      console.log(`Successfully seeded chunk ${i / chunkSize}.`)
    }
  }

  console.log('Seeding completed!')
}

seed()
