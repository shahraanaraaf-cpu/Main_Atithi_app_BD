'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ServiceCard,
  popularServices,
  chefServices,
  carDriverServices,
  photoServices,
  serviceCategories
} from '@/modules/services'
import { getUserLocation, getCityPriorityOrder, matchesCity } from '@/utils/geolocation'

interface ServicesCategoryPageProps {
  filterCategory?: string
}

export default function ServicesCategoryPage({ filterCategory }: ServicesCategoryPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || filterCategory || 'all'
  const t = useTranslations('Index')
  const ts = useTranslations('Services')

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [cityPriority, setCityPriority] = useState<string[]>([])
  const [locationLoading, setLocationLoading] = useState(true)

  // Get user location on component mount
  useEffect(() => {
    const getUserGeolocation = async () => {
      try {
        const location = await getUserLocation()
        setUserLocation(location)
        const priority = getCityPriorityOrder(location.lat, location.lng)
        setCityPriority(priority)
      } catch (error) {
        console.log('Geolocation not available, using default order')
        // Default city priority if geolocation fails
        setCityPriority(['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'coxsBazar'])
      } finally {
        setLocationLoading(false)
      }
    }

    getUserGeolocation()
  }, [])

  const allServices = [
    ...popularServices,
    ...chefServices,
    ...carDriverServices,
    ...photoServices
  ]

  // Prioritize services based on user location
  const prioritizeServices = (services: any[]) => {
    if (locationLoading || cityPriority.length === 0) {
      return services
    }

    return services.sort((a, b) => {
      // Get priority scores for both services
      const getPriorityScore = (service: any) => {
        for (let i = 0; i < cityPriority.length; i++) {
          const cityRegion = cityPriority[i]
          if (matchesCity(service.location, cityRegion)) {
            return i // Lower index = higher priority
          }
        }
        return cityPriority.length // Lowest priority for non-matching cities
      }

      const aPriority = getPriorityScore(a)
      const bPriority = getPriorityScore(b)

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      // If same city priority, sort by rating
      return (b.rating || 0) - (a.rating || 0)
    })
  }

  const filteredServices = categoryFromUrl === 'all' || categoryFromUrl === 'popular'
    ? prioritizeServices(allServices)
    : prioritizeServices(allServices.filter(service => {
        // Filter by category based on service ID patterns
        if (categoryFromUrl === 'private-chefs') {
          return service.id.startsWith('c')
        }
        if (categoryFromUrl === 'car-driver') {
          return service.id.startsWith('cd')
        }
        if (categoryFromUrl === 'photographers') {
          return service.id.startsWith('ph')
        }
        if (categoryFromUrl === 'tour-guides') {
          return service.title.toLowerCase().includes('guide') || service.title.toLowerCase().includes('tour')
        }
        if (categoryFromUrl === 'airport-pickup') {
          return service.title.toLowerCase().includes('airport') || service.title.toLowerCase().includes('pickup')
        }
        if (categoryFromUrl === 'laundry') {
          return service.title.toLowerCase().includes('laundry') || service.title.toLowerCase().includes('cleaning')
        }
        if (categoryFromUrl === 'grocery-delivery') {
          return service.title.toLowerCase().includes('grocery') || service.title.toLowerCase().includes('delivery')
        }
        if (categoryFromUrl === 'event-decor') {
          return service.title.toLowerCase().includes('decor') || service.title.toLowerCase().includes('event')
        }
        if (categoryFromUrl === 'nannies') {
          return service.title.toLowerCase().includes('nanny') || service.title.toLowerCase().includes('maid') || service.title.toLowerCase().includes('child')
        }
        if (categoryFromUrl === 'security') {
          return service.title.toLowerCase().includes('security') || service.title.toLowerCase().includes('guard')
        }
        return false
      }))

  const pageTitle = categoryFromUrl === 'all' || categoryFromUrl === 'popular' 
    ? ts('allServices') 
    : ts(`categories.${categoryFromUrl}`) || 'Services'

  return (
    <div className="bg-white min-h-screen">
      <GlobalHeader activeTab="services" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          <button 
            onClick={() => router.push('/services')}
            className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found in this category.</p>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
