'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { initiatePayment } from '@/app/actions/payment'
import { getListingById } from '@/app/actions/listings'
import { PhotoGallery } from '@/app/components/ui/PhotoGallery'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'
import { useCurrency } from '@/app/contexts/CurrencyContext'
import dynamic from 'next/dynamic'
import type { Listing } from '@/app/actions/listings'

// Dynamic import for Map to avoid SSR issues
const PropertyMap = dynamic(() => import('@/app/components/ui/PropertyMap').then(mod => mod.PropertyMap), { 
  ssr: false,
  loading: () => <div className="h-[480px] w-full bg-zinc-100 animate-pulse rounded-2xl" />
})

import { useParams } from 'next/navigation'

export default function RoomDetail() {
  const params = useParams() as { id: string, locale: string }
  const t = useTranslations('Index')
  const { convertPrice, formatPrice } = useCurrency()
  const [showGallery, setShowGallery] = useState(false)
  const [days, setDays] = useState(5)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [checkIn, setCheckIn] = useState('2026-04-30')
  const [checkOut, setCheckOut] = useState('2026-05-05')

  const pricePerNight = listing?.price_bdt || 4500
  const serviceFee = listing?.service_fee_bdt || 2200
  const cleaningFee = listing?.cleaning_fee_bdt || 1500
  const total = (pricePerNight * days) + serviceFee + cleaningFee

  useEffect(() => {
    async function fetchListing() {
      setLoading(true)
      try {
        let data = await getListingById(params.id)
        
        // If not found in DB, use mock data so the UI can still be viewed (e.g. for 's1')
        if (!data) {
          data = {
            id: params.id,
            host_id: 'mock-host',
            type: 'HOME',
            title: 'Luxury Villa ' + (params.id === 's1' ? 'Sylhet' : params.id),
            description: 'Experience the beauty of Bangladesh from this luxury villa. Perfect for a peaceful getaway with modern amenities and stunning views.',
            city: 'Sylhet',
            district: 'Sylhet',
            price_bdt: 4500,
            currency: 'BDT',
            service_fee_bdt: 450,
            cleaning_fee_bdt: 500,
            max_guests: 4,
            bedrooms: 2,
            bathrooms: 2,
            amenities: ['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool'],
            image_urls: [
              `https://picsum.photos/seed/${params.id}/800/800`,
              `https://picsum.photos/seed/${params.id}1/800/800`,
              `https://picsum.photos/seed/${params.id}2/800/800`,
              `https://picsum.photos/seed/${params.id}3/800/800`,
              `https://picsum.photos/seed/${params.id}4/800/800`
            ],
            average_rating: 4.95,
            review_count: 124,
            is_guest_favorite: true,
            is_active: true,
            availability_calendar: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
        
        setListing(data)
      } catch (error) {
        console.error('Error fetching listing:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [params.id])

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <GlobalHeader activeTab="stays" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="bg-white min-h-screen">
        <GlobalHeader activeTab="stays" />
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-500">Listing not found</p>
        </div>
      </div>
    )
  }

  const property = {
    title: listing.title,
    location: `${listing.city}, ${listing.district}`,
    rating: listing.average_rating,
    reviews: listing.review_count,
    host: {
      name: "Host",
      image: "https://picsum.photos/seed/host1/100/100",
      type: "Superhost",
      years: 5
    },
    images: listing.image_urls,
    amenities: listing.amenities.map((amenity: string) => ({
      name: amenity,
      icon: "check_circle"
    })),
    lat: listing.latitude || 24.8949,
    lng: listing.longitude || 91.8687
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Photo Gallery Modal (shared) */}
      {showGallery && (
        <PhotoGallery 
          images={property.images} 
          onClose={() => setShowGallery(false)} 
        />
      )}

      {/* Mobile View Top Section */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-between items-center px-4 py-4 bg-white sticky top-0 z-50">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>

        {/* Photo Slider */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <div 
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {property.images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                className="w-full h-full object-cover flex-shrink-0 snap-center cursor-pointer" 
                alt={`Room ${i}`} 
                onClick={() => setShowGallery(true)}
              />
            ))}
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2.5 py-1 rounded-md text-[11px] font-bold">
            1 / {property.images.length}
          </div>
        </div>

        {/* Content Card Header (Mobile) */}
        <div className="bg-white rounded-t-[28px] -mt-6 relative z-10 px-6 pt-8 pb-4 border-t border-zinc-100 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
          {/* Rare Find Badge */}
          <div className="inline-flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-zinc-900">diamond</span>
            <span className="text-[13px] font-bold text-zinc-900">Rare find! This place is usually booked</span>
          </div>

          {/* Title Section */}
          <div className="flex items-start gap-4 mb-4">
            <div className="p-1 border border-zinc-200 rounded-md mt-1">
              <span className="material-symbols-outlined text-[22px] text-zinc-900 block">g_translate</span>
            </div>
            <h1 className="text-[28px] font-bold leading-[1.1] text-zinc-900">{property.title}</h1>
          </div>
        </div>
      </div>

      {/* Desktop Top Section (Header + Title + Grid) */}
      <div className="hidden md:block">
        <GlobalHeader activeTab="stays" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8">
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{property.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm font-semibold underline underline-offset-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>{property.rating}</span>
                  <span className="text-zinc-500 font-normal no-underline">· {property.reviews} reviews</span>
                </div>
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg transition-all text-sm font-semibold underline underline-offset-2">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                  Share
                </button>
                <button className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg transition-all text-sm font-semibold underline underline-offset-2">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px] rounded-2xl overflow-hidden mb-12">
            <div onClick={() => setShowGallery(true)} className="col-span-2 row-span-2 relative group cursor-pointer">
              <img src={property.images[0]} alt="Main" className="w-full h-full object-cover hover:brightness-90 transition-all" />
            </div>
            <div onClick={() => setShowGallery(true)} className="relative group cursor-pointer">
              <img src={property.images[1]} alt="Img 1" className="w-full h-full object-cover hover:brightness-90 transition-all" />
            </div>
            <div onClick={() => setShowGallery(true)} className="relative group cursor-pointer rounded-tr-2xl">
              <img src={property.images[2]} alt="Img 2" className="w-full h-full object-cover hover:brightness-90 transition-all" />
            </div>
            <div onClick={() => setShowGallery(true)} className="relative group cursor-pointer">
              <img src={property.images[3]} alt="Img 3" className="w-full h-full object-cover hover:brightness-90 transition-all" />
            </div>
            <div onClick={() => setShowGallery(true)} className="relative group cursor-pointer rounded-br-2xl">
              <img src={property.images[4]} alt="Img 4" className="w-full h-full object-cover hover:brightness-90 transition-all" />
              <button 
                onClick={(e) => { e.stopPropagation(); setShowGallery(true); }}
                className="absolute bottom-6 right-6 bg-white border border-zinc-950 px-4 py-1.5 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 hover:bg-zinc-50 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                Show all photos
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8 pb-32 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-12">
          {/* Content Column (Shared) */}
          <div className="lg:col-span-2">
            {/* Host Section */}
            <div className="flex items-center justify-between pb-8 border-b border-zinc-200">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-1">Room in a villa hosted by {property.host.name}</h2>
                <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                  <span>2 guests</span> · <span>1 bedroom</span> · <span>1 bed</span> · <span>1 shared bath</span>
                </div>
              </div>
              <div className="relative">
                <img src={property.host.image} alt="Host" className="w-14 h-14 rounded-full object-cover" />
                <div className="absolute -bottom-1 -right-1 bg-[#FF385C] text-white p-0.5 rounded-full shadow-md">
                  <span className="material-symbols-outlined text-[12px] font-bold">verified</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="py-8 border-b border-zinc-200 space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-2xl text-zinc-500">workspace_premium</span>
                <div>
                  <h3 className="font-bold text-zinc-900">Shuvo is a Superhost</h3>
                  <p className="text-sm text-zinc-500">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-2xl text-zinc-500">location_on</span>
                <div>
                  <h3 className="font-bold text-zinc-900">Great location</h3>
                  <p className="text-sm text-zinc-500">95% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-2xl text-zinc-500">event_available</span>
                <div>
                  <h3 className="font-bold text-zinc-900">Free cancellation for 48 hours</h3>
                  <p className="text-sm text-zinc-500">Get a full refund if you change your mind.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b border-zinc-200">
              <p className="text-zinc-700 leading-relaxed">
                Experience the beauty of Sylhet from this luxury villa located right in the heart of the tea gardens. 
                Perfect for couples or small families looking for a peaceful getaway with modern amenities and 
                stunning mountain views.
              </p>
              <button className="mt-4 flex items-center gap-1 font-bold underline underline-offset-2 hover:bg-zinc-50 transition-all p-1 rounded">
                Show more
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-2xl text-zinc-600">{amenity.icon}</span>
                    <span className="text-zinc-900">{amenity.name}</span>
                  </div>
                ))}
              </div>
              <button className="mt-8 px-6 py-3 rounded-xl border border-zinc-950 font-bold hover:bg-zinc-50 transition-all">
                Show all 25 amenities
              </button>
            </div>

            {/* Calendar Mock */}
            <div className="py-8">
              <h2 className="text-xl font-bold text-zinc-900 mb-1">5 nights in Sylhet</h2>
              <p className="text-sm text-zinc-500 mb-6">Apr 30, 2026 – May 5, 2026</p>
              <div className="aspect-[2/1] bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-center">
                <p className="text-zinc-400 font-medium">Interactive Calendar View</p>
              </div>
            </div>
          </div>

          {/* Sidebar Column (Desktop Only) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-28 bg-white border border-zinc-200 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <PriceDisplay 
                    priceBDT={pricePerNight} 
                    className="text-2xl font-bold text-zinc-900" 
                  />
                  <span className="text-zinc-500"> night</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>{property.rating}</span>
                  <span className="text-zinc-500 font-normal">· {property.reviews} reviews</span>
                </div>
              </div>

              {/* Booking Inputs */}
              <form action={initiatePayment}>
                <input type="hidden" name="roomId" value={params.id} />
                <input type="hidden" name="amount" value={total} />
                <input type="hidden" name="checkIn" value={checkIn} />
                <input type="hidden" name="checkOut" value={checkOut} />
                <input type="hidden" name="locale" value={params.locale} />

                <div className="border border-zinc-400 rounded-xl mb-4 overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-zinc-400">
                    <div className="p-3 border-r border-zinc-400">
                      <label className="block text-[10px] font-black uppercase text-zinc-900">Check-in</label>
                      <input type="text" value={checkIn} readOnly className="w-full text-sm outline-none cursor-pointer" />
                    </div>
                    <div className="p-3">
                      <label className="block text-[10px] font-black uppercase text-zinc-900">Checkout</label>
                      <input type="text" value={checkOut} readOnly className="w-full text-sm outline-none cursor-pointer" />
                    </div>
                  </div>
                  <div className="p-3 relative group cursor-pointer">
                    <label className="block text-[10px] font-black uppercase text-zinc-900">Guests</label>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2 guests</span>
                      <span className="material-symbols-outlined text-zinc-500 group-hover:text-zinc-900 transition-colors">expand_more</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold rounded-xl transition-all mb-4 text-lg">
                  Reserve
                </button>
              </form>

              <p className="text-center text-sm text-zinc-500 mb-6">You won't be charged yet</p>

              {/* Price Calculation */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-zinc-700 underline decoration-zinc-400 underline-offset-2">
                  <span>{formatPrice(convertPrice(pricePerNight))} x {days} nights</span>
                  <span className="no-underline">{formatPrice(convertPrice(pricePerNight * days))}</span>
                </div>
                <div className="flex justify-between text-zinc-700 underline decoration-zinc-400 underline-offset-2">
                  <span>Cleaning fee</span>
                  <span className="no-underline">{formatPrice(convertPrice(cleaningFee))}</span>
                </div>
                <div className="flex justify-between text-zinc-700 underline decoration-zinc-400 underline-offset-2">
                  <span>Atithi service fee</span>
                  <span className="no-underline">{formatPrice(convertPrice(serviceFee))}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 flex justify-between font-bold text-zinc-900 text-lg">
                <span>Total</span>
                <span>{formatPrice(convertPrice(total))}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 p-4 border border-zinc-200 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-[#FF385C]">diamond</span>
              <div>
                <h4 className="font-bold text-zinc-900">This is a rare find</h4>
                <p className="text-sm text-zinc-500">Shuvo's place on Atithi is usually fully booked.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="py-12 border-t border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Where you'll be</h2>
          <PropertyMap lat={property.lat} lng={property.lng} locationName={property.location} />
          <div className="mt-6">
            <h3 className="font-bold text-zinc-900 mb-2">{property.location}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
              Located in a quiet neighborhood just 15 minutes away from the main city. 
              The property is surrounded by lush green tea gardens and offers panoramic 
              views of the hills.
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-12 border-t border-zinc-200">
          <div className="flex items-center gap-2 text-xl font-bold text-zinc-900 mb-8">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span>{property.rating} · {property.reviews} reviews</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-4 mb-12">
            {[
              { label: 'Cleanliness', score: 4.9 },
              { label: 'Communication', score: 5.0 },
              { label: 'Check-in', score: 4.8 },
              { label: 'Accuracy', score: 4.9 },
              { label: 'Location', score: 4.7 },
              { label: 'Value', score: 4.8 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-zinc-600 font-medium">{item.label}</span>
                <div className="flex items-center gap-4 w-48">
                  <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-900" 
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-zinc-900">{item.score}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://picsum.photos/seed/guest${i}/50/50`} 
                    alt="Guest" 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div>
                    <h4 className="font-bold text-zinc-900">Guest {i + 1}</h4>
                    <p className="text-sm text-zinc-500">October 2025</p>
                  </div>
                </div>
                <p className="text-zinc-700 leading-relaxed">
                  Fantastic stay! The villa was even better than the photos. 
                  The tea garden views are breathtaking and the hospitality was top-notch.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-3 flex items-center justify-between z-50 safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-zinc-900">{formatPrice(convertPrice(pricePerNight))}</span>
            <span className="text-sm text-zinc-500">night</span>
          </div>
          <p className="text-[12px] font-bold underline underline-offset-2 text-zinc-900">Apr 30 – May 5</p>
        </div>
        <form action={initiatePayment}>
          <input type="hidden" name="roomId" value={params.id} />
          <input type="hidden" name="amount" value={total} />
          <input type="hidden" name="checkIn" value={checkIn} />
          <input type="hidden" name="checkOut" value={checkOut} />
          <input type="hidden" name="locale" value={params.locale} />
          <button type="submit" className="bg-[#FF385C] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#E31C5F] active:scale-95 transition-all shadow-md">
            Reserve
          </button>
        </form>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )

}
