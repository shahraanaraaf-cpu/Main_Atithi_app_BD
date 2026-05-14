'use client'

import Link from 'next/link'
import { memo } from 'react'
import { PriceDisplay } from './PriceDisplay'

interface ExperienceCardProps {
  id: string
  title: string
  hostType: string
  price: number
  rating: number
  imageUrl: string
  location?: string
  badge?: string
}

export const ExperienceCard = memo(function ExperienceCard({ id, title, hostType, price, rating, imageUrl, location, badge }: ExperienceCardProps) {
  // Generate consistent gradient based on title
  const gradients = [
    'from-orange-400 to-red-500',
    'from-green-400 to-emerald-600',
    'from-blue-400 to-cyan-600',
    'from-purple-400 to-pink-500',
    'from-amber-500 to-orange-600',
    'from-teal-400 to-blue-500',
  ]
  const gradientIndex = title.length % gradients.length
  const fallbackGradient = gradients[gradientIndex]

  return (
    <Link href={`/experiences/${id}`} className="group cursor-pointer block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-3 shadow-sm border border-zinc-100 bg-gray-100">
        {/* Gradient fallback background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} opacity-90`} />
        
        {/* Try to load image, fallback handles errors gracefully */}
        <img 
          src={imageUrl} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Hide broken image, show gradient
            (e.target as HTMLImageElement).style.opacity = '0'
          }}
        />
        
        {badge && (
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold text-zinc-900 shadow-sm border border-zinc-100 whitespace-nowrap z-20">
            {badge}
          </div>
        )}
        <button className="absolute top-3 right-3 text-white drop-shadow-md hover:scale-110 transition-transform z-20">
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400", color: '#C62D2D' }}>favorite</span>
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[13px] text-zinc-900 font-bold">
            <span className="material-symbols-outlined text-[12px] text-[#C62D2D]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span>{rating}</span>
            <span className="text-zinc-500 font-normal ml-0.5">({hostType})</span>
          </div>
        </div>
        <h3 className="font-bold text-zinc-900 text-[15px] leading-tight line-clamp-2">{title}</h3>
        {location && <p className="text-[13px] text-zinc-500">{location}</p>}
        <div className="mt-1 flex items-center gap-1">
          <PriceDisplay 
            priceBDT={price} 
            className="text-[14px] font-bold text-zinc-900" 
            prefix="From "
          />
          <span className="text-[13px] text-zinc-900">/ guest</span>
        </div>
      </div>
    </Link>
  )
})
