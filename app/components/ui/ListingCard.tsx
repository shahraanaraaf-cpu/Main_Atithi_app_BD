'use client'

import { memo, useState } from 'react'
import { RemoteImage } from '@/components/shared/RemoteImage'
import { PriceDisplay } from './PriceDisplay'

interface ListingCardProps {
  id: string
  title: string
  location: string
  rating: number
  price: number
  imageUrl: string
  isGuestFavorite?: boolean
  hostInfo?: string
  dates?: string
}

export const ListingCard = memo(function ListingCard({ title, location, rating, price, imageUrl, isGuestFavorite, hostInfo, dates }: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="flex flex-col gap-3 group cursor-pointer w-full">
      {/* Image Wrapper */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 shadow-sm">
        <RemoteImage
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 280px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Guest Favorite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold text-zinc-900 shadow-sm border border-zinc-100 whitespace-nowrap">
            Guest favorite
          </div>
        )}

        {/* Wishlist Heart */}
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute top-3 right-3 text-white transition-all hover:scale-110 active:scale-90"
        >
          <span 
            className="material-symbols-outlined text-[24px] drop-shadow-md" 
            style={{ 
              fontVariationSettings: `'FILL' ${isLiked ? 1 : 0}, 'wght' 400`,
              color: isLiked ? '#FF385C' : 'white'
            }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-0.5 mt-1">
        <div className="flex justify-between items-start">
          <h3 className="text-[13px] font-bold text-zinc-900 leading-tight line-clamp-1">{location}</h3>
          <div className="flex items-center gap-1 text-zinc-900 shrink-0">
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-[12px] font-medium">{rating.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col text-[12px] text-zinc-500 leading-normal">
          <p className="line-clamp-1">{hostInfo || title}</p>
          <p>{dates || 'Oct 12 - 17'}</p>
        </div>
        <div className="mt-0.5 flex items-center gap-1">
          <PriceDisplay 
            priceBDT={price} 
            className="text-[13px] font-bold text-zinc-900" 
          />
          <span className="text-[12px] text-zinc-900">night</span>
        </div>
      </div>
    </div>
  )
})
