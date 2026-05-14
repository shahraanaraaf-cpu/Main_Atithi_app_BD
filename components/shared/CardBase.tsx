'use client'

import Link from 'next/link'
import { memo, useState } from 'react'
import { RemoteImage } from '@/components/shared/RemoteImage'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'

export interface CardBaseProps {
  id: string
  href: string
  image: string
  title: string
  subtitle?: string
  price: number
  rating: number
  badge?: string
  location?: string
  priceLabel?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  showWishlist?: boolean
}

export const CardBase = memo(function CardBase({
  href,
  image,
  title,
  subtitle,
  price,
  rating,
  badge,
  location,
  priceLabel = '',
  aspectRatio = 'square',
  showWishlist = true
}: CardBaseProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Generate consistent gradient based on title
  const gradients = [
    'from-orange-400 to-red-500',
    'from-green-400 to-emerald-600',
    'from-blue-400 to-cyan-600',
    'from-purple-400 to-pink-500',
    'from-amber-500 to-orange-600',
    'from-teal-400 to-blue-500',
    'from-rose-400 to-red-500',
    'from-indigo-400 to-purple-500',
  ]
  const gradientIndex = title.length % gradients.length
  const fallbackGradient = gradients[gradientIndex]

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[4/3]'
  }

  return (
    <Link href={href} className="group cursor-pointer block">
      <div className={`relative ${aspectClasses[aspectRatio]} overflow-hidden rounded-2xl mb-3 shadow-sm border border-zinc-100 bg-gray-100`}>
        {/* Gradient fallback background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} opacity-90`} />
        
        {/* Try to load image, fallback handles errors gracefully */}
        {!imageError && (
          <RemoteImage
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
            onLoadError={() => setImageError(true)}
          />
        )}
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold text-zinc-900 shadow-sm border border-zinc-100 whitespace-nowrap z-20">
            {badge}
          </div>
        )}
        
        {/* Wishlist Button */}
        {showWishlist && (
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className="absolute top-3 right-3 z-20 hover:scale-110 transition-transform"
          >
            <span 
              className="material-symbols-outlined text-[24px] drop-shadow-md" 
              style={{ 
                fontVariationSettings: `'FILL' ${isLiked ? 1 : 0}, 'wght' 400`,
                color: isLiked ? '#C62D2D' : 'white'
              }}
            >
              favorite
            </span>
          </button>
        )}
      </div>
      
      {/* Info Section */}
      <div className="space-y-0.5 px-0.5">
        <h3 className="font-bold text-zinc-900 text-[15px] leading-tight line-clamp-1 group-hover:text-[#C62D2D] transition-colors">{title}</h3>
        
        {location && <p className="text-[13px] text-zinc-500 line-clamp-1">{location}</p>}
        
        <div className="flex items-center gap-1.5 pt-0.5 w-full">
          <div className="flex items-baseline gap-1 flex-1 min-w-0">
            <PriceDisplay 
              priceBDT={price} 
              className="text-[14px] font-bold text-zinc-900 shrink-0" 
            />
            {priceLabel && <span className="text-[13px] text-zinc-900 whitespace-nowrap truncate">{priceLabel}</span>}
          </div>
          <span className="text-zinc-300 text-[10px] shrink-0">·</span>
          <div className="flex items-center gap-1 text-[13px] text-zinc-900 font-medium shrink-0">
            <span className="material-symbols-outlined text-[14px] text-zinc-900" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
})
