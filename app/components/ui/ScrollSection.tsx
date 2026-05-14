'use client'

import React, { useRef } from 'react'
import { SeeAllCard } from '@/components/shared/SeeAllCard'

interface ScrollSectionProps {
  title: string
  children: React.ReactNode
  seeAllHref?: string
  seeAllImages?: string[]
  seeAllText?: string
}

export function ScrollSection({ title, children, seeAllHref, seeAllImages, seeAllText }: ScrollSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <h2 className="text-[22px] font-bold text-zinc-900 tracking-tight">{title}</h2>
          <button className="h-5 w-5 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
            <span className="material-symbols-outlined text-[12px] text-zinc-500">info</span>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => scroll('left')}
            className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[48%] sm:auto-cols-[50%] md:auto-cols-[33.33%] lg:auto-cols-[20%] xl:auto-cols-[16.66%] gap-0 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
      >
        {React.Children.map(children, (child) => (
          <div className="snap-start px-2">
            {child}
          </div>
        ))}
        {seeAllHref && (
          <div className="snap-start px-2">
            <SeeAllCard href={seeAllHref} images={seeAllImages} text={seeAllText} />
          </div>
        )}
      </div>
    </section>
  )
}
