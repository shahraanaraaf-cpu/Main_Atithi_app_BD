'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { useCurrency } from '@/app/contexts/CurrencyContext'
import { popularServices, chefServices, carDriverServices, photoServices } from '@/modules/services'
import BookingModal from './BookingModal'

const PropertyMap = dynamic(() => import('@/app/components/ui/PropertyMap').then(mod => mod.PropertyMap), { 
  ssr: false,
  loading: () => <div className="h-[480px] w-full bg-zinc-100 animate-pulse rounded-2xl" />
})

interface ServiceListingDetailProps {
  serviceId: string
}

interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  duration: number
  host: {
    name: string
    avatar: string
    title: string
    isSuperhost: boolean
    rating: number
    qualifications: string[]
    careerHighlights: string[]
    education: string[]
  }
  rating: number
  reviews: number
  images: string[]
  specialties: string[]
  offerings: {
    id: string
    title: string
    description: string
    price: number
    duration: number
  }[]
  serviceArea: string
  travelInfo: string
  thingsToKnow: {
    guestRequirements: string
    accessibility: string
    cancellationPolicy: string
    checks: string
  }
  latitude?: number
  longitude?: number
}

interface TimeSlot {
  id: string
  time: string
  displayTime: string
  available: boolean
  price?: number
}

interface DateAvailability {
  date: string
  dayName: string
  monthDay: string
  timeSlots: TimeSlot[]
  available: boolean
}

interface GuestCounts {
  adults: number
  children: number
  infants: number
}

export default function ServiceListingDetail({ serviceId }: ServiceListingDetailProps) {
  const router = useRouter()
  const { convertPrice, formatPrice } = useCurrency()
  const [showGallery, setShowGallery] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0
  })
  const [service, setService] = useState<Service | null>(null)
  const [availability, setAvailability] = useState<DateAvailability[]>([])

  useEffect(() => {
    // Find service from existing data
    const allServices = [
      ...popularServices,
      ...chefServices,
      ...carDriverServices,
      ...photoServices
    ]
    
    const foundService = allServices.find(s => s.id === serviceId)
    
    if (foundService) {
      // Create enhanced service data with additional details
      const enhancedService: Service = {
        id: foundService.id,
        title: foundService.title,
        description: `Experience ${foundService.title} with professional service and attention to detail. This premium service offers exceptional quality and value, delivered by experienced professionals who are committed to exceeding your expectations.`,
        category: getServiceCategory(foundService.id),
        price: foundService.price,
        duration: getServiceDuration(foundService.id),
        host: {
          name: foundService.provider,
          avatar: `https://i.pravatar.cc/150?img=${foundService.id}`,
          title: getHostTitle(foundService.id),
          isSuperhost: foundService.reviews > 200,
          rating: foundService.rating,
          qualifications: getQualifications(foundService.id),
          careerHighlights: getCareerHighlights(foundService.id),
          education: getEducation(foundService.id)
        },
        rating: foundService.rating,
        reviews: foundService.reviews,
        images: getServiceImages(foundService.id),
        specialties: getSpecialties(foundService.id),
        offerings: getServiceOfferings(foundService.id),
        serviceArea: foundService.location,
        travelInfo: getTravelInfo(foundService.id),
        thingsToKnow: {
          guestRequirements: getGuestRequirements(foundService.id),
          accessibility: getAccessibility(foundService.id),
          cancellationPolicy: 'Free cancellation up to 24 hours before',
          checks: 'Verified professional service provider'
        },
        latitude: 23.8103,
        longitude: 90.4125
      }
      
      setService(enhancedService)

    // Generate mock availability data
    const mockAvailability: DateAvailability[] = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
      const monthDay = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const dateString = currentDate.toISOString().split('T')[0]
      
      const timeSlots: TimeSlot[] = [
        { id: 'morning', time: '09:00', displayTime: '9:00 AM', available: Math.random() > 0.2 },
        { id: 'afternoon', time: '14:00', displayTime: '2:00 PM', available: Math.random() > 0.2 },
        { id: 'evening', time: '18:00', displayTime: '6:00 PM', available: Math.random() > 0.3 }
      ]
      
      mockAvailability.push({
        date: dateString,
        dayName,
        monthDay,
        timeSlots,
        available: timeSlots.some(slot => slot.available)
      })
    }
      setAvailability(mockAvailability)
    }
  }, [serviceId])

  // Helper functions to generate service-specific data
  const getServiceCategory = (id: string): string => {
    if (id.startsWith('s')) return 'Popular Services'
    if (id.startsWith('c')) return 'Culinary Services'
    if (id.startsWith('cd')) return 'Transportation'
    if (id.startsWith('ph')) return 'Photography'
    return 'Services'
  }

  const getServiceType = (id: string): string => {
    if (id.startsWith('c')) return 'culinary'
    if (id.startsWith('cd')) return 'transportation'
    if (id.startsWith('ph')) return 'photography'
    if (id.includes('laundry') || id.includes('clean')) return 'laundry'
    return 'general'
  }

  const getServiceDuration = (id: string): number => {
    if (id.startsWith('ph')) return 8 // Photography is usually full day
    if (id.startsWith('c')) return 4 // Chef services
    if (id.startsWith('cd')) return 12 // Driver services
    return 3 // Default
  }

  const getHostTitle = (id: string): string => {
    if (id.startsWith('c')) return 'Professional Chef'
    if (id.startsWith('cd')) return 'Professional Driver'
    if (id.startsWith('ph')) return 'Professional Photographer'
    return 'Service Provider'
  }

  const getQualifications = (id: string): string[] => {
    if (id.startsWith('c')) {
      return [
        '9+ years of culinary experience',
        'Food safety certified',
        'Specialized in traditional cuisine'
      ]
    }
    if (id.startsWith('cd')) {
      return [
        '10+ years driving experience',
        'Valid professional license',
        'Defensive driving certified'
      ]
    }
    if (id.startsWith('ph')) {
      return [
        '5+ years photography experience',
        'Professional equipment',
        'Specialized in travel photography'
      ]
    }
    return ['Certified professional', 'Experienced service provider']
  }

  const getCareerHighlights = (id: string): string[] => {
    if (id.startsWith('c')) {
      return [
        'Executive Chef at 5-star hotel',
        'Featured in Food Magazine',
        'Catered for VIP events'
      ]
    }
    if (id.startsWith('cd')) {
      return [
        'Served 5000+ happy clients',
        'Expert in intercity travel',
        'Airport transfer specialist'
      ]
    }
    if (id.startsWith('ph')) {
      return [
        'Published in travel magazines',
        '1000+ photoshoots completed',
        'Specialized in destination photography'
      ]
    }
    return ['Top-rated service provider', '1000+ satisfied customers']
  }

  const getEducation = (id: string): string[] => {
    if (id.startsWith('c')) {
      return [
        'Culinary Arts Degree',
        'Food Safety Certification',
        'Hospitality Management'
      ]
    }
    if (id.startsWith('cd')) {
      return [
        'Professional Driving License',
        'First Aid Certified',
        'Customer Service Training'
      ]
    }
    if (id.startsWith('ph')) {
      return [
        'Photography Degree',
        'Professional Equipment Training',
        'Digital Editing Certification'
      ]
    }
    return ['Professional Certification', 'Service Excellence Training']
  }

  const getServiceImages = (id: string): string[] => {
    const baseImage = `https://picsum.photos/seed/${id}/800/800`
    return [
      baseImage,
      `https://picsum.photos/seed/${id}a/800/800`,
      `https://picsum.photos/seed/${id}b/800/800`,
      `https://picsum.photos/seed/${id}c/800/800`,
      `https://picsum.photos/seed/${id}d/800/800`
    ]
  }

  const getSpecialties = (id: string): string[] => {
    if (id.startsWith('c')) {
      return ['Traditional Cuisine', 'Fusion Dishes', 'Dessert Specialties', 'BBQ & Grilling']
    }
    if (id.startsWith('cd')) {
      return ['City Tours', 'Airport Transfers', 'Intercity Travel', 'Luxury Vehicles']
    }
    if (id.startsWith('ph')) {
      return ['Portrait Photography', 'Landscape Shots', 'Event Coverage', 'Drone Photography']
    }
    return ['Premium Service', 'Professional Quality', 'Customer Satisfaction', 'Reliable Support']
  }

  const getServiceOfferings = (id: string) => {
    if (id.startsWith('c')) {
      return [
        {
          id: 'prep-meals',
          title: 'Meal Preparation',
          description: 'Complete meal preparation for your event',
          price: 15000,
          duration: 4
        },
        {
          id: 'cooking-class',
          title: 'Cooking Class',
          description: 'Learn traditional cooking techniques',
          price: 8000,
          duration: 2
        },
        {
          id: 'catering',
          title: 'Event Catering',
          description: 'Full catering service for events',
          price: 25000,
          duration: 6
        }
      ]
    }
    if (id.startsWith('cd')) {
      return [
        {
          id: 'daily-driver',
          title: 'Full Day Driver',
          description: 'Personal driver for the entire day',
          price: 12000,
          duration: 12
        },
        {
          id: 'airport-transfer',
          title: 'Airport Transfer',
          description: 'Professional airport pickup and drop-off',
          price: 3500,
          duration: 2
        },
        {
          id: 'city-tour',
          title: 'City Tour',
          description: 'Guided city tour with transportation',
          price: 8000,
          duration: 8
        }
      ]
    }
    if (id.startsWith('ph')) {
      return [
        {
          id: 'full-day',
          title: 'Full Day Photoshoot',
          description: 'Complete day photography coverage',
          price: 20000,
          duration: 8
        },
        {
          id: 'half-day',
          title: 'Half Day Photoshoot',
          description: 'Half day photography session',
          price: 12000,
          duration: 4
        },
        {
          id: 'event',
          title: 'Event Photography',
          description: 'Professional event coverage',
          price: 30000,
          duration: 6
        }
      ]
    }
    return [
      {
        id: 'standard',
        title: 'Standard Service',
        description: 'Professional service delivery',
        price: 10000,
        duration: 3
      }
    ]
  }

  const getTravelInfo = (id: string): string => {
    if (id.startsWith('cd')) return "I'll come to you with my vehicle"
    if (id.startsWith('ph')) return "I'll come to your location"
    return "I'll come to you"
  }

  const getGuestRequirements = (id: string): string => {
    if (id.startsWith('c')) return 'Maximum 20 guests per booking'
    if (id.startsWith('cd')) return 'Maximum 4 passengers per vehicle'
    if (id.startsWith('ph')) return 'Maximum 10 people per photoshoot'
    return 'Flexible group sizes available'
  }

  const getAccessibility = (id: string): string => {
    if (id.startsWith('c')) return 'Kitchen access required for cooking services'
    if (id.startsWith('cd')) return 'Vehicle can accommodate wheelchairs upon request'
    if (id.startsWith('ph')) return 'Accessible locations available for photoshoots'
    return 'Service can be adapted to your needs'
  }

  const totalGuests = guests.adults + guests.children + guests.infants
  const totalPrice = service?.price || 80

  const updateGuests = (type: keyof GuestCounts, increment: boolean) => {
    setGuests(prev => {
      const newGuests = { ...prev }
      if (increment) {
        newGuests[type] = Math.min(newGuests[type] + 1, type === 'infants' ? 5 : 10)
      } else {
        newGuests[type] = Math.max(newGuests[type] - 1, type === 'adults' ? 1 : 0)
      }
      return newGuests
    })
  }

  const handleBookingConfirm = (bookingData: any) => {
    // Handle booking logic here
    console.log('Service booking confirmed:', bookingData)
    // You can add API call, state update, etc.
  }

  if (!service) {
    return (
      <div className="bg-white min-h-screen">
        <GlobalHeader activeTab="services" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-zinc-200">
              <h2 className="text-xl font-semibold">Photos</h2>
              <button 
                onClick={() => setShowGallery(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service.images.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    className="w-full h-48 object-cover rounded-lg" 
                    alt={`${service.title} ${i}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        serviceId={serviceId}
        serviceType={getServiceType(serviceId)}
        onBookingConfirm={handleBookingConfirm}
      />

      <GlobalHeader activeTab="services" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 text-sm">
            <button 
              onClick={() => router.push('/services')}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Services
            </button>
            <span className="material-symbols-outlined text-zinc-400">chevron_right</span>
            <span className="font-medium text-zinc-900">{service.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                <div 
                  className="relative h-96 cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setShowGallery(true)}
                >
                  <img 
                    src={service.images[0]} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {service.host.isSuperhost && (
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      <span className="text-[#FF385C]">★</span> Superhost
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="relative h-[188px] cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setShowGallery(true)}
                    >
                      <img 
                        src={service.images[i] || service.images[0]} 
                        alt={`${service.title} ${i}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-2xl font-bold">+{service.images.length - 4}</div>
                            <div className="text-sm">Photos</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Title and Rating */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">{service.title}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-zinc-600" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-lg font-medium text-zinc-900">{service.rating}</span>
                  <span className="text-zinc-600">({service.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-zinc-600">location_on</span>
                  <span className="text-zinc-900">{service.serviceArea}</span>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-8">
              <div className="flex items-center gap-4">
                <img 
                  src={service.host.avatar} 
                  alt={service.host.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">{service.host.name}</h3>
                  <div className="text-sm text-zinc-600">{service.host.title}</div>
                  {service.host.isSuperhost && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#FF385C]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm text-zinc-600">Superhost</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-zinc-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-medium text-zinc-600">{service.host.rating}</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">
                Contact host
              </button>
            </div>

            {/* About this service */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">About this service</h2>
              <p className="text-zinc-700 text-lg leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Service Offerings */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Service offerings</h2>
              <div className="space-y-4">
                {service.offerings.map((offering) => (
                  <div key={offering.id} className="border border-zinc-200 rounded-xl p-6 hover:border-[#FF385C] transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-zinc-900 mb-2">{offering.title}</h3>
                        <p className="text-zinc-600 mb-3">{offering.description}</p>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            {offering.duration} hours
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-zinc-900">
                          {formatPrice(convertPrice(offering.price))}
                        </div>
                        <div className="text-sm text-zinc-600">per session</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-zinc-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">My qualifications</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-3">Experience & Achievements</h3>
                  <ul className="space-y-2">
                    {service.host.qualifications.map((qualification, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-green-600 flex-shrink-0 mt-0.5">check_circle</span>
                        <span className="text-zinc-700">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-3">Career Highlights</h3>
                  <ul className="space-y-2">
                    {service.host.careerHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-blue-600 flex-shrink-0 mt-0.5">workspace_premium</span>
                        <span className="text-zinc-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-900 mb-3">Education & Training</h3>
                  <ul className="space-y-2">
                    {service.host.education.map((edu, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-purple-600 flex-shrink-0 mt-0.5">school</span>
                        <span className="text-zinc-700">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Specialties Gallery */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Specialties</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {service.specialties.map((specialty, index) => (
                  <div key={index} className="relative h-32 rounded-lg overflow-hidden group">
                    <img 
                      src={service.images[index % service.images.length]} 
                      alt={specialty}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <span className="text-white font-medium">{specialty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Service area</h2>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-[24px] text-zinc-600">location_on</span>
                    <div>
                      <p className="text-zinc-900 font-medium">{service.serviceArea}</p>
                      <p className="text-sm text-zinc-600">{service.travelInfo}</p>
                    </div>
                  </div>
                </div>
                <PropertyMap 
                  lat={service.latitude || 23.8103}
                  lng={service.longitude || 90.4125}
                  locationName={service.serviceArea}
                />
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Reviews ({service.reviews})</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-zinc-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-lg font-medium text-zinc-600">{service.rating}</span>
                </div>
                <span className="text-sm text-zinc-500">Based on {service.reviews} reviews</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-zinc-200 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={`https://i.pravatar.cc/150?img=reviewer${i}`}
                        alt="Reviewer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-zinc-900">Client {i}</h4>
                        <p className="text-sm text-zinc-500">2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[14px] text-zinc-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-medium text-zinc-900">5.0</span>
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        Absolutely amazing service! {service.host.name} is incredibly professional and the food was exceptional. Highly recommend!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Things to Know */}
            <div className="mt-12 space-y-8">
              <h2 className="text-2xl font-bold text-zinc-900">Things to know</h2>
              
              <div className="bg-zinc-50 rounded-xl p-6">
                <h3 className="font-semibold text-zinc-900 mb-3">Guest requirements</h3>
                <p className="text-zinc-700">{service.thingsToKnow.guestRequirements}</p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-6">
                <h3 className="font-semibold text-zinc-900 mb-3">Accessibility</h3>
                <p className="text-zinc-700">{service.thingsToKnow.accessibility}</p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-6">
                <h3 className="font-semibold text-zinc-900 mb-3">Cancellation policy</h3>
                <p className="text-zinc-700">{service.thingsToKnow.cancellationPolicy}</p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-6">
                <h3 className="font-semibold text-zinc-900 mb-3">Professional verification</h3>
                <p className="text-zinc-700">{service.thingsToKnow.checks}</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-bold text-zinc-900">
                      From {formatPrice(convertPrice(service.price))}
                    </span>
                    <span className="text-zinc-600">per session</span>
                  </div>
                  
                  
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="w-full py-3 bg-[#FF385C] text-white rounded-xl font-bold hover:bg-[#E31C5F] transition-all transform hover:scale-105"
                  >
                    Schedule now
                  </button>
                  
                  <p className="text-xs text-zinc-500 text-center mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </div>

              {/* Quality Assurance */}
              <div className="mt-6 bg-zinc-50 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-[#FF385C]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <div>
                    <p className="font-semibold text-zinc-900">Vetted professionals</p>
                    <p className="text-sm text-zinc-600">All service providers are verified for quality and expertise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
