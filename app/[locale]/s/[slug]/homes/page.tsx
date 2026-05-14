'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ListingCard } from '@/app/components/ui/ListingCard'
import { Header } from '@/app/components/layout/Header'

export default function SearchPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string, locale: string },
  searchParams: { query?: string, checkin?: string, checkout?: string, adults?: string }
}) {
  const t = useTranslations('Index')
  const [view, setView] = useState<'list' | 'map'>('list')
  
  const query = searchParams.query || params.slug.replace(/-/g, ' ')
  const checkIn = searchParams.checkin || '30 Apr'
  const checkOut = searchParams.checkout || '30 May'
  const guests = searchParams.adults ? `${searchParams.adults} guests` : '2 guests'

  const mockHomes = [
    {
      id: '1',
      title: 'Flat in Dhaka',
      location: 'Banani, Dhaka',
      rating: 4.9,
      reviews: 29,
      price: 4500,
      originalPrice: 5200,
      badge: 'Guest favorite',
      images: ['https://picsum.photos/seed/dhaka1/800/600', 'https://picsum.photos/seed/dhaka2/800/600'],
      info: 'Individual host • 2 beds'
    },
    {
      id: '2',
      title: 'Luxury Apartment',
      location: 'Gulshan 2, Dhaka',
      rating: 4.86,
      reviews: 7,
      price: 7800,
      badge: 'Rare find',
      images: ['https://picsum.photos/seed/dhaka3/800/600', 'https://picsum.photos/seed/dhaka4/800/600'],
      info: 'Business host • 3 beds'
    },
    {
      id: '3',
      title: 'Cozy Studio',
      location: 'Dhanmondi, Dhaka',
      rating: 4.95,
      reviews: 42,
      price: 3200,
      images: ['https://picsum.photos/seed/dhaka5/800/600'],
      info: 'Individual host • 1 bed'
    },
    {
      id: '4',
      title: 'Modern Penthouse',
      location: 'Uttara, Dhaka',
      rating: 4.7,
      reviews: 15,
      price: 12000,
      images: ['https://picsum.photos/seed/dhaka6/800/600'],
      info: 'Business host • 4 beds'
    }
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Header 
        forceCompact 
        initialSearchState={{
          location: query,
          checkIn,
          checkout: checkOut,
          guests: { adults: Number(searchParams.adults) || 2, children: 0, infants: 0, pets: 0 }
        }}
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-white z-20">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full border border-zinc-950 text-sm font-bold bg-white">Any</button>
          <button className="px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium hover:border-zinc-950 transition-all bg-white">Home</button>
          <button className="px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium hover:border-zinc-950 transition-all bg-white">Hotel</button>
          <div className="w-[1px] h-6 bg-zinc-200 mx-1" />
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium hover:border-zinc-950 transition-all bg-white">
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Filters</span>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-zinc-500">Showing 1 – {mockHomes.length} of {mockHomes.length} stays in {query}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Listings */}
        <div className="w-full lg:w-[60%] overflow-y-auto px-6 py-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-1">Available for similar dates</h1>
            <p className="text-sm text-zinc-500">1 / 3</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
            {mockHomes.map((home) => (
              <ListingCard 
                key={home.id}
                id={home.id}
                title={home.title}
                location={home.location}
                rating={home.rating}
                price={home.price}
                imageUrl={home.images[0]}
                hostInfo={home.info}
                isGuestFavorite={home.badge === 'Guest favorite'}
              />
            ))}
          </div>

          <div className="mt-12 mb-8 flex justify-center">
            <button className="px-6 py-3 rounded-xl border border-zinc-200 font-bold hover:bg-zinc-50 transition-all flex items-center gap-2">
              Search similar dates
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="hidden lg:block lg:w-[40%] relative bg-zinc-100 border-l border-zinc-200">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-[#f8f9fa]">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
              alt="Map" 
              className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
            />
            {/* Map Overlay Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#ffffff22_100%)]" />
            
            {/* Price Markers */}
            <div className="absolute top-[20%] left-[30%]">
              <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-zinc-200 font-bold text-sm hover:scale-110 transition-transform cursor-pointer">
                ৳4,569
              </div>
            </div>
            <div className="absolute top-[40%] left-[50%]">
              <div className="bg-zinc-900 text-white px-3 py-1.5 rounded-full shadow-lg border border-zinc-800 font-bold text-sm hover:scale-110 transition-transform cursor-pointer">
                ৳7,800
              </div>
            </div>
            <div className="absolute top-[60%] left-[40%]">
              <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-zinc-200 font-bold text-sm hover:scale-110 transition-transform cursor-pointer">
                ৳3,200
              </div>
            </div>
            <div className="absolute top-[35%] left-[25%]">
              <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-zinc-200 font-bold text-sm hover:scale-110 transition-transform cursor-pointer">
                ৳5,514
              </div>
            </div>
            <div className="absolute top-[15%] left-[70%]">
              <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-zinc-200 font-bold text-sm hover:scale-110 transition-transform cursor-pointer">
                ৳12,000
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute right-6 top-6 flex flex-col gap-2">
            <button className="h-10 w-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-zinc-50">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>
          <div className="absolute right-6 bottom-10 flex flex-col bg-white rounded-xl shadow-lg border border-zinc-200">
            <button className="h-10 w-10 flex items-center justify-center hover:bg-zinc-50 border-b border-zinc-100">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="h-10 w-10 flex items-center justify-center hover:bg-zinc-50">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Map Toggle Button */}
      <button 
        onClick={() => setView(view === 'list' ? 'map' : 'list')}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 md:hidden"
      >
        <span className="material-symbols-outlined text-sm">{view === 'list' ? 'map' : 'list'}</span>
        <span className="font-bold text-sm">{view === 'list' ? 'Show map' : 'Show list'}</span>
      </button>

    </div>
  )
}
