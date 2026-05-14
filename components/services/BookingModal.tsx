'use client'

import React, { useState } from 'react'
import { useCurrency } from '@/app/contexts/CurrencyContext'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  serviceType: string
  onBookingConfirm: (bookingData: any) => void
}

interface TimeSlot {
  time: string
  available: boolean
  price?: number
}

interface ServiceOffering {
  id: string
  title: string
  image: string
  pricePerGuest: number
  minimumPrice: number
  timeSlots: TimeSlot[]
}

export default function BookingModal({ isOpen, onClose, serviceId, serviceType, onBookingConfirm }: BookingModalProps) {
  const { convertPrice, formatPrice } = useCurrency()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedOffering, setSelectedOffering] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [guests, setGuests] = useState(1)

  // Generate service-specific offerings
  const getServiceOfferings = (): ServiceOffering[] => {
    if (serviceType === 'culinary') {
      return [
        {
          id: 'indian-fusion',
          title: 'Indian Fusion Feast',
          image: 'https://picsum.photos/seed/indian-fusion/100/100',
          pricePerGuest: 70,
          minimumPrice: 320,
          timeSlots: generateTimeSlots(['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'])
        },
        {
          id: 'michelin-indian',
          title: 'Michelin-style Indian',
          image: 'https://picsum.photos/seed/michelin-indian/100/100',
          pricePerGuest: 120,
          minimumPrice: 480,
          timeSlots: generateTimeSlots(['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'])
        },
        {
          id: 'family-indian',
          title: 'Family-style Indian Party',
          image: 'https://picsum.photos/seed/family-indian/100/100',
          pricePerGuest: 55,
          minimumPrice: 275,
          timeSlots: generateTimeSlots(['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'])
        }
      ]
    }

    if (serviceType === 'photography') {
      return [
        {
          id: 'portrait-session',
          title: 'Portrait Photography Session',
          image: 'https://picsum.photos/seed/portrait/100/100',
          pricePerGuest: 150,
          minimumPrice: 150,
          timeSlots: generateTimeSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
        },
        {
          id: 'event-coverage',
          title: 'Event Photography Coverage',
          image: 'https://picsum.photos/seed/event/100/100',
          pricePerGuest: 200,
          minimumPrice: 400,
          timeSlots: generateTimeSlots(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'])
        },
        {
          id: 'travel-photoshoot',
          title: 'Travel Photoshoot Experience',
          image: 'https://picsum.photos/seed/travel/100/100',
          pricePerGuest: 180,
          minimumPrice: 360,
          timeSlots: generateTimeSlots(['06:00', '07:00', '08:00', '17:00', '18:00', '19:00'])
        }
      ]
    }

    if (serviceType === 'transportation') {
      return [
        {
          id: 'city-tour',
          title: 'City Tour Experience',
          image: 'https://picsum.photos/seed/city-tour/100/100',
          pricePerGuest: 80,
          minimumPrice: 160,
          timeSlots: generateTimeSlots(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
        },
        {
          id: 'airport-transfer',
          title: 'Airport Transfer Service',
          image: 'https://picsum.photos/seed/airport/100/100',
          pricePerGuest: 50,
          minimumPrice: 50,
          timeSlots: generateTimeSlots(['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'])
        },
        {
          id: 'intercity-travel',
          title: 'Intercity Travel Service',
          image: 'https://picsum.photos/seed/intercity/100/100',
          pricePerGuest: 120,
          minimumPrice: 240,
          timeSlots: generateTimeSlots(['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'])
        }
      ]
    }

    if (serviceType === 'laundry') {
      return [
        {
          id: 'express-laundry',
          title: 'Express Laundry Service',
          image: 'https://picsum.photos/seed/laundry/100/100',
          pricePerGuest: 30,
          minimumPrice: 30,
          timeSlots: generateTimeSlots(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'])
        },
        {
          id: 'premium-laundry',
          title: 'Premium Laundry & Ironing',
          image: 'https://picsum.photos/seed/premium/100/100',
          pricePerGuest: 45,
          minimumPrice: 45,
          timeSlots: generateTimeSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
        },
        {
          id: 'same-day',
          title: 'Same-Day Service',
          image: 'https://picsum.photos/seed/sameday/100/100',
          pricePerGuest: 60,
          minimumPrice: 60,
          timeSlots: generateTimeSlots(['08:00', '09:00', '10:00', '11:00'])
        }
      ]
    }

    // Default offerings for other service types
    return [
      {
        id: 'standard-service',
        title: 'Standard Service',
        image: 'https://picsum.photos/seed/standard/100/100',
        pricePerGuest: 100,
        minimumPrice: 100,
        timeSlots: generateTimeSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
      }
    ]
  }

  const generateTimeSlots = (times: string[]): TimeSlot[] => {
    return times.map(time => ({
      time,
      available: Math.random() > 0.3 // 70% availability
    }))
  }

  const offerings = getServiceOfferings()
  const selectedOfferingData = offerings.find(o => o.id === selectedOffering)
  const selectedTimeData = selectedOfferingData?.timeSlots.find(slot => slot.time === selectedTimeSlot)

  const calculateTotalPrice = () => {
    if (!selectedOfferingData) return 0
    const guestPrice = selectedOfferingData.pricePerGuest * guests
    return Math.max(guestPrice, selectedOfferingData.minimumPrice)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedOffering(null)
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (offeringId: string, time: string) => {
    const offering = offerings.find(o => o.id === offeringId)
    const timeSlot = offering?.timeSlots.find(slot => slot.time === time)
    
    if (timeSlot?.available) {
      setSelectedOffering(offeringId)
      setSelectedTimeSlot(time)
    }
  }

  const handleBookingConfirm = () => {
    if (selectedDate && selectedOffering && selectedTimeSlot) {
      onBookingConfirm({
        serviceId,
        offering: selectedOfferingData,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        guests,
        totalPrice: calculateTotalPrice()
      })
      onClose()
    }
  }

  const renderCalendar = () => {
    const year = selectedDate?.getFullYear() || new Date().getFullYear()
    const month = selectedDate?.getMonth() || new Date().getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{monthNames[month]} {year}</h3>
          <span className="material-symbols-outlined text-zinc-600">calendar_month</span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-zinc-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = i + 1
            const currentDate = new Date(year, month, date)
            const isSelected = selectedDate?.getDate() === date && 
                            selectedDate?.getMonth() === month && 
                            selectedDate?.getFullYear() === year
            const isToday = new Date().toDateString() === currentDate.toDateString()
            
            return (
              <button
                key={date}
                onClick={() => handleDateSelect(currentDate)}
                className={`p-2 text-sm rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-[#FF385C] text-white' 
                    : isToday 
                      ? 'bg-zinc-100 text-zinc-900 font-medium'
                      : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                {date}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderServiceOfferings = () => {
    return (
      <div className="space-y-4">
        {offerings.map((offering) => (
          <div key={offering.id} className="bg-white rounded-xl p-4 border border-zinc-200">
            <div className="flex gap-4">
              <img 
                src={offering.image} 
                alt={offering.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              
              <div className="flex-1">
                <h4 className="font-semibold text-zinc-900 mb-1">{offering.title}</h4>
                <p className="text-sm text-zinc-600 mb-3">
                  {formatPrice(convertPrice(offering.pricePerGuest))} / guest · Minimum {formatPrice(convertPrice(offering.minimumPrice))}
                </p>
                
                <div className="grid grid-cols-4 gap-2">
                  {offering.timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSlotSelect(offering.id, slot.time)}
                      disabled={!slot.available}
                      className={`py-2 px-3 text-xs rounded-lg border transition-all ${
                        selectedOffering === offering.id && selectedTimeSlot === slot.time
                          ? 'bg-[#FF385C] text-white border-[#FF385C]'
                          : slot.available
                            ? 'border-zinc-300 hover:border-[#FF385C] text-zinc-700'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-semibold">Schedule your {getServiceLabel(serviceType)}</h2>
          <div className="flex items-center gap-4">
            {/* Guest Counter */}
            <div className="flex items-center gap-2 bg-zinc-100 rounded-lg px-3 py-2">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-6 h-6 rounded-full bg-white border border-zinc-300 flex items-center justify-center hover:bg-zinc-50"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="text-sm font-medium px-2">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
              <button
                onClick={() => setGuests(guests + 1)}
                className="w-6 h-6 rounded-full bg-white border border-zinc-300 flex items-center justify-center hover:bg-zinc-50"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            {renderCalendar()}
            
            {/* Service Offerings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Available {getServiceLabel(serviceType, true)}</h3>
              {renderServiceOfferings()}
            </div>
          </div>

          {/* Booking Summary */}
          {selectedOfferingData && selectedTimeSlot && (
            <div className="mt-6 p-4 bg-zinc-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium text-zinc-900">{selectedOfferingData.title}</p>
                  <p className="text-sm text-zinc-600">
                    {selectedDate?.toLocaleDateString()} at {selectedTimeSlot}
                  </p>
                  <p className="text-sm text-zinc-600">{guests} {guests === 1 ? 'guest' : 'guests'}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-zinc-900">
                    {formatPrice(convertPrice(calculateTotalPrice()))}
                  </p>
                  <p className="text-xs text-zinc-500">Total price</p>
                </div>
              </div>
              
              <button
                onClick={handleBookingConfirm}
                className="w-full py-3 bg-[#FF385C] text-white rounded-xl font-bold hover:bg-[#E31C5F] transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getServiceLabel(serviceType: string, plural: boolean = false): string {
  const labels: Record<string, { singular: string; plural: string }> = {
    culinary: { singular: 'meal', plural: 'meals' },
    photography: { singular: 'session', plural: 'sessions' },
    transportation: { singular: 'ride', plural: 'rides' },
    laundry: { singular: 'service', plural: 'services' }
  }
  
  const label = labels[serviceType] || { singular: 'service', plural: 'services' }
  return plural ? label.plural : label.singular
}
