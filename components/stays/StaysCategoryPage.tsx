'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  StaysCard,
  sylhetListings,
  coxsBazarListings,
  bandarbanListings,
  dhakaListings,
  staysCategories
} from '@/modules/stays'

interface StaysCategoryPageProps {
  filterCategory?: string
  filterRegion?: string
}

interface FilterState {
  propertyType: string[]
  roomType: string[]
  priceRange: [number, number]
}

export default function StaysCategoryPage({ filterCategory, filterRegion }: StaysCategoryPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || filterCategory || 'all'
  const regionFromUrl = searchParams.get('region') || filterRegion
  const t = useTranslations('Index')
  const ts = useTranslations('Stays')

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    propertyType: [],
    roomType: [],
    priceRange: [0, 50000]
  })
  const [showFilters, setShowFilters] = useState(false)

  // Enhanced stay data with property types
  const enhancedStays = [
    ...sylhetListings.map(stay => ({ ...stay, propertyType: stay.title.toLowerCase().includes('villa') ? 'House' : stay.title.toLowerCase().includes('apartment') || stay.title.toLowerCase().includes('studio') || stay.title.toLowerCase().includes('flat') || stay.title.toLowerCase().includes('loft') ? 'Apartment' : 'Hotel', roomType: stay.title.toLowerCase().includes('cabin') || stay.title.toLowerCase().includes('room') ? 'Room' : 'Entire House/Apartment' })),
    ...coxsBazarListings.map(stay => ({ ...stay, propertyType: stay.title.toLowerCase().includes('villa') || stay.title.toLowerCase().includes('cabin') || stay.title.toLowerCase().includes('lodge') ? 'House' : stay.title.toLowerCase().includes('apartment') || stay.title.toLowerCase().includes('studio') || stay.title.toLowerCase().includes('flat') || stay.title.toLowerCase().includes('loft') ? 'Apartment' : 'Hotel', roomType: stay.title.toLowerCase().includes('cabin') || stay.title.toLowerCase().includes('room') ? 'Room' : 'Entire House/Apartment' })),
    ...bandarbanListings.map(stay => ({ ...stay, propertyType: stay.title.toLowerCase().includes('villa') || stay.title.toLowerCase().includes('cabin') || stay.title.toLowerCase().includes('lodge') ? 'House' : stay.title.toLowerCase().includes('apartment') || stay.title.toLowerCase().includes('studio') || stay.title.toLowerCase().includes('flat') || stay.title.toLowerCase().includes('loft') ? 'Apartment' : 'Hotel', roomType: stay.title.toLowerCase().includes('cabin') || stay.title.toLowerCase().includes('room') ? 'Room' : 'Entire House/Apartment' })),
    ...dhakaListings.map(stay => ({ ...stay, propertyType: stay.title.toLowerCase().includes('villa') || stay.title.toLowerCase().includes('penthouse') ? 'House' : stay.title.toLowerCase().includes('apartment') || stay.title.toLowerCase().includes('studio') || stay.title.toLowerCase().includes('flat') || stay.title.toLowerCase().includes('loft') ? 'Apartment' : 'Hotel', roomType: stay.title.toLowerCase().includes('cabin') || stay.title.toLowerCase().includes('room') ? 'Room' : 'Entire House/Apartment' }))
  ]

  // Apply all filters
  const applyFilters = (stays: any[]) => {
    let filtered = stays

    // Region filter
    if (regionFromUrl) {
      const region = decodeURIComponent(regionFromUrl).toLowerCase()
      filtered = filtered.filter(stay => 
        stay.location.toLowerCase().includes('sylhet') && region.includes('sylhet') ||
        stay.location.toLowerCase().includes('cox') && region.includes('cox') ||
        stay.location.toLowerCase().includes('bandarban') && region.includes('bandarban') ||
        stay.location.toLowerCase().includes('dhaka') && region.includes('dhaka')
      )
    }

    // Category filter
    if (categoryFromUrl !== 'all' && categoryFromUrl !== 'popular') {
      filtered = filtered.filter(stay => {
        if (categoryFromUrl === 'beachfront-villas') {
          return stay.title.toLowerCase().includes('villa') || stay.title.toLowerCase().includes('beach')
        }
        if (categoryFromUrl === 'eco-resorts') {
          return stay.title.toLowerCase().includes('eco') || stay.title.toLowerCase().includes('lodge') || stay.title.toLowerCase().includes('resort')
        }
        if (categoryFromUrl === 'treehouses') {
          return stay.title.toLowerCase().includes('tree') || stay.title.toLowerCase().includes('cabin')
        }
        if (categoryFromUrl === 'private-pool-villas') {
          return stay.title.toLowerCase().includes('pool') || stay.title.toLowerCase().includes('private')
        }
        if (categoryFromUrl === 'houseboats') {
          return stay.title.toLowerCase().includes('houseboat') || stay.title.toLowerCase().includes('river')
        }
        if (categoryFromUrl === 'heritage-homes') {
          return stay.title.toLowerCase().includes('heritage') || stay.title.toLowerCase().includes('stone')
        }
        if (categoryFromUrl === 'tea-estate') {
          return stay.title.toLowerCase().includes('tea') || stay.title.toLowerCase().includes('garden')
        }
        if (categoryFromUrl === 'penthouses') {
          return stay.title.toLowerCase().includes('penthouse') || stay.title.toLowerCase().includes('apartment') || stay.title.toLowerCase().includes('studio') || stay.title.toLowerCase().includes('loft')
        }
        return true
      })
    }

    // Property type filter
    if (filters.propertyType.length > 0) {
      filtered = filtered.filter(stay => filters.propertyType.includes(stay.propertyType))
    }

    // Room type filter
    if (filters.roomType.length > 0) {
      filtered = filtered.filter(stay => filters.roomType.includes(stay.roomType))
    }

    // Price range filter
    filtered = filtered.filter(stay => stay.price >= filters.priceRange[0] && stay.price <= filters.priceRange[1])

    return filtered
  }

  const filteredStays = applyFilters(enhancedStays)

  // Determine page title based on filters
  let pageTitle = 'All Stays'
  const decodedRegion = regionFromUrl ? decodeURIComponent(regionFromUrl) : ''
  if (regionFromUrl && categoryFromUrl && categoryFromUrl !== 'all') {
    const categoryName = staysCategories.find(cat => cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === categoryFromUrl)?.name || 'Stays'
    pageTitle = `${categoryName} in ${decodedRegion}`
  } else if (regionFromUrl) {
    pageTitle = `Stays in ${decodedRegion}`
  } else if (categoryFromUrl !== 'all' && categoryFromUrl !== 'popular') {
    pageTitle = staysCategories.find(cat => cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === categoryFromUrl)?.name || 'Stays'
  }

  // Filter handlers
  const handlePropertyTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...prev.propertyType, type]
    }))
  }

  const handleRoomTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      roomType: prev.roomType.includes(type)
        ? prev.roomType.filter(t => t !== type)
        : [...prev.roomType, type]
    }))
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }))
  }

  const clearFilters = () => {
    setFilters({
      propertyType: [],
      roomType: [],
      priceRange: [0, 50000]
    })
  }

  return (
    <div className="bg-white min-h-screen">
      <GlobalHeader activeTab="stays" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <span className="material-symbols-outlined">tune</span>
              Filters
              {(filters.propertyType.length > 0 || filters.roomType.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
                <span className="bg-[#FF385C] text-white text-xs rounded-full px-2 py-1">
                  {filters.propertyType.length + filters.roomType.length + (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0)}
                </span>
              )}
            </button>
            <button 
              onClick={() => router.push('/rooms')}
              className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Property Type Filter */}
              <div>
                <h4 className="font-medium mb-3">Property Type</h4>
                <div className="space-y-2">
                  {['House', 'Apartment', 'Hotel'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.propertyType.includes(type)}
                        onChange={() => handlePropertyTypeChange(type)}
                        className="w-4 h-4 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C]"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Type Filter */}
              <div>
                <h4 className="font-medium mb-3">Room Type</h4>
                <div className="space-y-2">
                  {['Room', 'Entire House/Apartment'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.roomType.includes(type)}
                        onChange={() => handleRoomTypeChange(type)}
                        className="w-4 h-4 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C]"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {filters.priceRange[0] === 0 && filters.priceRange[1] === 50000 
                      ? 'Any price' 
                      : `৳${filters.priceRange[0]} - ৳${filters.priceRange[1]} per night`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {filteredStays.length} stays available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStays.map((stay) => (
            <StaysCard key={stay.id} stay={stay} />
          ))}
        </div>

        {filteredStays.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No stays found matching your filters.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-[#FF385C] hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
