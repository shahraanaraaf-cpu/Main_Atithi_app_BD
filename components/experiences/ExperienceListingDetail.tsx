'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { useCurrency } from '@/app/contexts/CurrencyContext'
import { popularExperiences, atithiOriginals, happeningToday, tomorrowInDhaka, dhakaExperiences, chittagongExperiences, sylhetExperiences, rajshahiExperiences, khulnaExperiences, coxsBazarExperiences } from '@/modules/experiences'

const PropertyMap = dynamic(() => import('@/app/components/ui/PropertyMap').then(mod => mod.PropertyMap), { 
  ssr: false,
  loading: () => <div className="h-[480px] w-full bg-zinc-100 animate-pulse rounded-2xl" />
})

interface ExperienceListingDetailProps {
  experienceId: string
}

interface Experience {
  id: string
  title: string
  description: string
  city: string
  district: string
  price: number
  duration: number
  language: string
  host: {
    name: string
    avatar: string
    isSuperhost: boolean
    rating: number
  }
  rating: number
  reviews: number
  images: string[]
  tags: string[]
  difficulty: string
  maxGroupSize: number
  meetingPoint: string
  whatToBring: string[]
  nextAvailable: string
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

export default function ExperienceListingDetail({ experienceId }: ExperienceListingDetailProps) {
  const router = useRouter()
  const { convertPrice, formatPrice } = useCurrency()
  const [showGallery, setShowGallery] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0
  })
  const [experience, setExperience] = useState<Experience | null>(null)
  const [availability, setAvailability] = useState<DateAvailability[]>([])

  useEffect(() => {
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
    const found = allExperiences.find(exp => exp.id === experienceId)
    if (found) {
      setExperience({
        id: found.id,
        title: found.title,
        description: `Explore ${found.title} with a knowledgeable local guide. This comprehensive experience covers major highlights and hidden gems that only locals know about. Perfect for first-time visitors and those looking to deepen their understanding of our culture.`,
        city: found.location?.split(',')[0] || 'Bangladesh',
        district: found.location?.split(',')[1]?.trim() || 'Local Area',
        price: found.price,
        duration: 3,
        language: 'English',
        host: {
          name: found.hostType,
          avatar: `https://i.pravatar.cc/150?img=${experienceId}`,
          isSuperhost: found.badge === 'Atithi Original',
          rating: found.rating
        },
        rating: found.rating,
        reviews: Math.floor(found.rating * 20),
        images: [found.image],
        tags: ['Local', 'Cultural', 'Guided'],
        difficulty: 'Moderate',
        maxGroupSize: 10,
        meetingPoint: found.location || 'Central meeting point',
        whatToBring: ['Comfortable shoes', 'Camera', 'Water bottle'],
        nextAvailable: 'Available now',
        latitude: 23.8103,
        longitude: 90.4125
      })

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
  }, [experienceId])

  const totalGuests = guests.adults + guests.children + guests.infants
  const totalPrice = experience ? experience.price * totalGuests : 0

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

  const handleDateSelect = (date: DateAvailability) => {
    setSelectedDate(date.date)
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      setSelectedTimeSlot(timeSlot)
    }
  }

  const handleBooking = () => {
    if (selectedDate && selectedTimeSlot) {
      // Handle booking logic here
      console.log('Booking confirmed:', {
        experienceId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        guests
      })
      setShowBookingModal(false)
    }
  }

  if (!experience) {
    return (
      <div className="bg-white min-h-screen">
        <GlobalHeader activeTab="experiences" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
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
                {experience.images.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    className="w-full h-48 object-cover rounded-lg" 
                    alt={`${experience.title} ${i}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-zinc-200">
              <h2 className="text-2xl font-semibold">Book this experience</h2>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Date Selection */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Select a date</h3>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-zinc-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 mb-8">
                    {availability.slice(0, 35).map((date, index) => (
                      <button
                        key={date.date}
                        onClick={() => date.available && handleDateSelect(date)}
                        disabled={!date.available}
                        className={`
                          p-3 rounded-lg border transition-all transform hover:scale-105
                          ${selectedDate === date.date 
                            ? 'border-[#FF385C] bg-[#FF385C] text-white shadow-lg' 
                            : date.available 
                              ? 'border-zinc-300 hover:border-[#FF385C] hover:shadow-md cursor-pointer' 
                              : 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="text-sm">{date.monthDay.split(' ')[1]}</div>
                      </button>
                    ))}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Select a time</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {availability
                          .find(d => d.date === selectedDate)
                          ?.timeSlots.map(slot => (
                            <button
                              key={slot.id}
                              onClick={() => handleTimeSlotSelect(slot)}
                              disabled={!slot.available}
                              className={`
                                p-4 rounded-lg border transition-all transform hover:scale-105
                                ${selectedTimeSlot?.id === slot.id 
                                  ? 'border-[#FF385C] bg-[#FF385C] text-white shadow-lg' 
                                  : slot.available 
                                    ? 'border-zinc-300 hover:border-[#FF385C] hover:shadow-md cursor-pointer' 
                                    : 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed'
                                }
                              `}
                            >
                              <div className="font-medium">{slot.displayTime}</div>
                              {!slot.available && (
                                <div className="text-xs mt-1">Not available</div>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Guest Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Guests</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-zinc-200">
                        <div>
                          <div className="font-medium">Adults</div>
                          <div className="text-sm text-zinc-600">Ages 13+</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateGuests('adults', false)}
                            disabled={guests.adults <= 1}
                            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 hover:border-[#FF385C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center">{guests.adults}</span>
                          <button
                            onClick={() => updateGuests('adults', true)}
                            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 hover:border-[#FF385C] transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-zinc-200">
                        <div>
                          <div className="font-medium">Children</div>
                          <div className="text-sm text-zinc-600">Ages 2-12</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateGuests('children', false)}
                            disabled={guests.children <= 0}
                            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 hover:border-[#FF385C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center">{guests.children}</span>
                          <button
                            onClick={() => updateGuests('children', true)}
                            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 hover:border-[#FF385C] transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium">Infants</div>
                          <div className="text-sm text-zinc-600">Under 2</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateGuests('infants', false)}
                            disabled={guests.infants <= 0}
                            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center">{guests.infants}</span>
                          <button
                            onClick={() => updateGuests('infants', true)}
                            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Booking Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-zinc-50 rounded-xl p-6 sticky top-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2">{experience.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{experience.duration} hours</span>
                        <span>·</span>
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        <span>Max {experience.maxGroupSize}</span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-200 pt-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-600">
                          {formatPrice(convertPrice(experience.price))} × {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}
                        </span>
                        <span className="font-medium">
                          {formatPrice(convertPrice(totalPrice))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-xl">
                          {formatPrice(convertPrice(totalPrice))}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={!selectedDate || !selectedTimeSlot}
                      className="w-full py-3 bg-[#FF385C] text-white rounded-xl font-bold hover:bg-[#E31C5F] transition-all transform hover:scale-105 disabled:bg-zinc-300 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {!selectedDate || !selectedTimeSlot ? 'Select date and time' : 'Book now'}
                    </button>
                    
                    <p className="text-xs text-zinc-500 text-center mt-4">
                      You won't be charged yet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <GlobalHeader activeTab="experiences" />

      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 text-sm">
            <button 
              onClick={() => router.push('/experiences')}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Experiences
            </button>
            <span className="material-symbols-outlined text-zinc-400">chevron_right</span>
            <span className="font-medium text-zinc-900">{experience.title}</span>
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
                    src={experience.images[0]} 
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                  {experience.rating >= 4.8 && (
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
                        src={experience.images[0]} 
                        alt={`${experience.title} ${i}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-2xl font-bold">+{experience.images.length - 4}</div>
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
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">{experience.title}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-zinc-600" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-lg font-medium text-zinc-900">{experience.rating}</span>
                  <span className="text-zinc-600">({experience.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-zinc-600">location_on</span>
                  <span className="text-zinc-900">{experience.city}, {experience.district}</span>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-8">
              <div className="flex items-center gap-4">
                <img 
                  src={experience.host.avatar} 
                  alt={experience.host.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">{experience.host.name}</h3>
                  {experience.host.isSuperhost && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#FF385C]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm text-zinc-600">Superhost</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-zinc-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-medium text-zinc-600">{experience.host.rating}</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">
                Contact host
              </button>
            </div>

            {/* About this experience */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">About this experience</h2>
              <p className="text-zinc-700 text-lg leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* What you'll do */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">What you'll do</h2>
              <div className="space-y-6">
                {[
                  { icon: 'explore', title: 'Explore Local Culture', description: 'Discover authentic local experiences and hidden gems' },
                  { icon: 'camera_alt', title: 'Capture Memories', description: 'Perfect photo opportunities at iconic locations' },
                  { icon: 'restaurant', title: 'Taste Local Cuisine', description: 'Sample traditional dishes and local specialties' },
                  { icon: 'history_edu', title: 'Learn History', description: 'Fascinating stories and historical insights' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px] text-zinc-600">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 mb-1">{item.title}</h3>
                      <p className="text-zinc-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-zinc-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[24px] text-zinc-600">schedule</span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{experience.duration} hours</p>
                    <p className="text-sm text-zinc-600">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[24px] text-zinc-600">group</span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Max {experience.maxGroupSize}</p>
                    <p className="text-sm text-zinc-600">Group size</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[24px] text-zinc-600">translate</span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{experience.language}</p>
                    <p className="text-sm text-zinc-600">Language</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[24px] text-zinc-600">signal_cellular_alt</span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{experience.difficulty}</p>
                    <p className="text-sm text-zinc-600">Difficulty</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">What's included</h2>
              <div className="flex flex-wrap gap-3">
                {experience.tags.map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Meeting point */}
            <div className="bg-zinc-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Where we'll meet</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px] text-zinc-600">location_on</span>
                </div>
                <div>
                  <p className="text-zinc-900 font-medium">{experience.meetingPoint}</p>
                  <p className="text-sm text-zinc-600">Central meeting point</p>
                </div>
              </div>
            </div>

            {/* What to bring */}
            <div className="bg-zinc-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">What to bring</h2>
              <div className="space-y-3">
                {experience.whatToBring.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-green-600">check_circle</span>
                    <span className="text-zinc-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
              <div className="p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Location</h2>
                <PropertyMap 
                  lat={experience.latitude || 23.8103}
                  lng={experience.longitude || 90.4125}
                  locationName={`${experience.city}, ${experience.district}`}
                />
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Reviews ({experience.reviews})</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-zinc-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-lg font-medium text-zinc-600">{experience.rating}</span>
                </div>
                <span className="text-sm text-zinc-500">Based on {experience.reviews} reviews</span>
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
                        <h4 className="font-bold text-zinc-900">Guest {i}</h4>
                        <p className="text-sm text-zinc-500">2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[14px] text-zinc-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-medium text-zinc-900">5.0</span>
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        Amazing experience! The guide was knowledgeable and the route was well-planned. Highly recommend!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-bold text-zinc-900">
                      {formatPrice(convertPrice(experience.price))}
                    </span>
                    <span className="text-zinc-600">per person</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-zinc-900">Date</span>
                      <button 
                        onClick={() => setShowBookingModal(true)}
                        className="text-sm text-[#FF385C] hover:underline font-medium"
                      >
                        Show dates
                      </button>
                    </div>
                    <div className="space-y-2">
                      {availability.slice(0, 3).map(date => (
                        <div key={date.date} className="flex items-center justify-between py-2 px-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                             onClick={() => setShowBookingModal(true)}>
                          <span className="text-sm text-zinc-900">{date.dayName}</span>
                          <span className="text-sm text-zinc-600">{date.monthDay}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full mt-3 py-2 text-sm text-[#FF385C] border border-[#FF385C] rounded-lg hover:bg-[#FF385C] hover:text-white transition-colors font-medium"
                    >
                      View all dates
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="w-full py-3 bg-[#FF385C] text-white rounded-xl font-bold hover:bg-[#E31C5F] transition-all transform hover:scale-105"
                  >
                    Book now
                  </button>
                  
                  <p className="text-xs text-zinc-500 text-center mt-4">
                    You won't be charged yet
                  </p>
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
