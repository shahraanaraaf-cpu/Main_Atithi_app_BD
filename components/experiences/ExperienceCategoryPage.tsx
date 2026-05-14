'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  popularExperiences, 
  atithiOriginals, 
  happeningToday, 
  tomorrowInDhaka,
  dhakaExperiences,
  chittagongExperiences,
  sylhetExperiences,
  rajshahiExperiences,
  khulnaExperiences,
  coxsBazarExperiences,
  experienceCategories,
  ExperienceCard
} from '@/modules/experiences'
import { getUserLocation, getCityPriorityOrder, matchesCity } from '@/utils/geolocation'

interface ExperienceListingPageProps {
  filterCategory?: string
  filterRegion?: string
}

export default function ExperienceListingPage({ filterCategory, filterRegion }: ExperienceListingPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || filterCategory || 'all'
  const regionFromUrl = searchParams.get('region') || filterRegion
  const t = useTranslations('Index')

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

  const allExperiences = [
    ...popularExperiences,
    ...atithiOriginals,
    ...happeningToday,
    ...tomorrowInDhaka,
    ...dhakaExperiences,
    ...chittagongExperiences,
    ...sylhetExperiences,
    ...rajshahiExperiences,
    ...khulnaExperiences,
    ...coxsBazarExperiences
  ]

  // Prioritize experiences based on user location
  const prioritizeExperiences = (experiences: any[]) => {
    if (locationLoading || cityPriority.length === 0) {
      return experiences
    }

    return experiences.sort((a, b) => {
      // Get priority scores for both experiences
      const getPriorityScore = (experience: any) => {
        for (let i = 0; i < cityPriority.length; i++) {
          const cityRegion = cityPriority[i]
          if (matchesCity(experience.location, cityRegion)) {
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

  // Apply all filters
  const applyFilters = (experiences: any[]) => {
    let filtered = experiences

    // Region filter
    if (regionFromUrl) {
      const region = decodeURIComponent(regionFromUrl).toLowerCase()
      filtered = filtered.filter(exp => 
        exp.location.toLowerCase().includes('dhaka') && region.includes('dhaka') ||
        exp.location.toLowerCase().includes('chittagong') && region.includes('chittagong') ||
        exp.location.toLowerCase().includes('sylhet') && region.includes('sylhet') ||
        exp.location.toLowerCase().includes('rajshahi') && region.includes('rajshahi') ||
        exp.location.toLowerCase().includes('khulna') && region.includes('khulna') ||
        exp.location.toLowerCase().includes('cox') && region.includes('cox')
      )
    }

    // Category filter
    if (categoryFromUrl !== 'all' && categoryFromUrl !== 'popular') {
      filtered = filtered.filter(exp => {
        if (categoryFromUrl === 'atithi-originals') return exp.badge === 'Atithi Original'
        if (categoryFromUrl === 'happening-today') return happeningToday.some(h => h.id === exp.id)
        
        // Filter by category based on experience title and description patterns
        const title = exp.title.toLowerCase()
        const desc = exp.description?.toLowerCase() || ''
        
        if (categoryFromUrl === 'cultureTours') {
          return title.includes('culture') || title.includes('temple') || title.includes('heritage') || title.includes('tour') || desc.includes('culture')
        }
        if (categoryFromUrl === 'landmarks') {
          return title.includes('landmark') || title.includes('monument') || title.includes('fort') || title.includes('palace') || desc.includes('landmark')
        }
        if (categoryFromUrl === 'artWorkshops') {
          return title.includes('art') || title.includes('workshop') || title.includes('painting') || title.includes('craft') || desc.includes('art')
        }
        if (categoryFromUrl === 'foodTours') {
          return title.includes('food') || title.includes('cuisine') || title.includes('cooking') || title.includes('tasting') || desc.includes('food')
        }
        if (categoryFromUrl === 'museums') {
          return title.includes('museum') || title.includes('gallery') || title.includes('exhibition') || desc.includes('museum')
        }
        if (categoryFromUrl === 'cooking') {
          return title.includes('cooking') || title.includes('culinary') || title.includes('kitchen') || title.includes('recipe') || desc.includes('cooking')
        }
        if (categoryFromUrl === 'outdoors') {
          return title.includes('outdoor') || title.includes('hiking') || title.includes('trek') || title.includes('adventure') || desc.includes('outdoor')
        }
        if (categoryFromUrl === 'dining') {
          return title.includes('dining') || title.includes('restaurant') || title.includes('meal') || title.includes('dinner') || desc.includes('dining')
        }
        if (categoryFromUrl === 'galleries') {
          return title.includes('gallery') || title.includes('art') || title.includes('exhibition') || desc.includes('gallery')
        }
        if (categoryFromUrl === 'boatTrips') {
          return title.includes('boat') || title.includes('cruise') || title.includes('river') || title.includes('sailing') || desc.includes('boat')
        }
        if (categoryFromUrl === 'nightlife') {
          return title.includes('night') || title.includes('club') || title.includes('party') || title.includes('entertainment') || desc.includes('nightlife')
        }
        if (categoryFromUrl === 'photography') {
          return title.includes('photo') || title.includes('camera') || title.includes('shooting') || title.includes('capture') || desc.includes('photography')
        }
        if (categoryFromUrl === 'adventure') {
          return title.includes('adventure') || title.includes('extreme') || title.includes('thrill') || title.includes('exciting') || desc.includes('adventure')
        }
        if (categoryFromUrl === 'wellness') {
          return title.includes('wellness') || title.includes('spa') || title.includes('yoga') || title.includes('meditation') || desc.includes('wellness')
        }
        if (categoryFromUrl === 'shoppingFashion') {
          return title.includes('shopping') || title.includes('fashion') || title.includes('market') || title.includes('boutique') || desc.includes('shopping')
        }
        if (categoryFromUrl === 'performances') {
          return title.includes('performance') || title.includes('show') || title.includes('concert') || title.includes('theater') || desc.includes('performance')
        }
        
        return false // Default to false for unknown categories
      })
    }

    return filtered
  }

  const filteredExperiences = prioritizeExperiences(applyFilters(allExperiences))

  // Determine page title based on filters
  let pageTitle = 'All Experiences'
  const decodedRegion = regionFromUrl ? decodeURIComponent(regionFromUrl) : ''
  if (regionFromUrl && categoryFromUrl && categoryFromUrl !== 'all') {
    let categoryName = 'Experiences'
    if (categoryFromUrl === 'atithi-originals') categoryName = 'Atithi Originals'
    else if (categoryFromUrl === 'happening-today') categoryName = 'Happening Today'
    else if (categoryFromUrl === 'popular') categoryName = 'Popular Experiences'
    else {
      // Use translation key instead of hardcoded Bengali text
      categoryName = t(`Experiences.categories.${categoryFromUrl}`) || 'Experiences'
    }
    pageTitle = `${categoryName} in ${decodedRegion}`
  } else if (regionFromUrl) {
    pageTitle = `Experiences in ${decodedRegion}`
  } else if (categoryFromUrl === 'atithi-originals') {
    pageTitle = 'Atithi Originals'
  } else if (categoryFromUrl === 'happening-today') {
    pageTitle = 'Happening Today'
  } else if (categoryFromUrl === 'popular') {
    pageTitle = 'Popular Experiences'
  } else {
    // Use translation key instead of hardcoded Bengali text
    pageTitle = t(`Experiences.categories.${categoryFromUrl}`) || 'Experiences'
  }

  return (
    <div className="bg-white min-h-screen">
      <GlobalHeader activeTab="experiences" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          <button 
            onClick={() => router.push('/experiences')}
            className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No experiences found in this category.</p>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
