'use client'

import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { ServiceCard, serviceCategories, popularServices, chefServices, carDriverServices, photoServices } from '@/modules/services'
import { useState, useRef } from 'react'

import { useTranslations, useLocale } from 'next-intl'

export default function ServicesPage() {
  const t = useTranslations('Services')
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader activeTab="services" />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>

        {/* Categories Section - Like Experiences Page */}
        <section className="mb-12 relative px-12">
          {/* Navigation Arrows - Centered on image area */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-2 top-[50px] -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <span className="material-symbols-outlined text-gray-600 text-sm">chevron_left</span>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-2 top-[50px] -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <span className="material-symbols-outlined text-gray-600 text-sm">chevron_right</span>
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {serviceCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => window.location.href = `/${locale}/services/category?category=${encodeURIComponent(cat.id)}`}
                className="flex flex-col items-center gap-2 min-w-[100px] group flex-shrink-0"
              >
                {/* Category Image Container */}
                <div className={`relative w-[100px] h-[100px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeCategory === cat.name ? 'border-gray-900 scale-105' : 'border-gray-200 group-hover:border-gray-400'}`}>
                  <img 
                    src={cat.image} 
                    alt={cat.id ? t(`categories.${cat.id}`) : cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/90 text-3xl drop-shadow-lg">{cat.icon}</span>
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="text-center">
                  <p className={`text-sm font-medium leading-tight ${activeCategory === cat.name ? 'text-gray-900 underline underline-offset-4' : 'text-gray-700'}`}>
                    {cat.id ? t(`categories.${cat.id}`) : cat.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.count} {t('available')}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Services */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('popularServices')}</h2>
            <button 
              onClick={() => window.location.href = `/${locale}/services/category?category=popular`}
              className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
            >
              {t('showAll')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {popularServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Private Chefs Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C62D2D]">skillet</span>
              <h2 className="text-xl font-bold text-gray-900">{t('privateChefs')}</h2>
            </div>
            <button 
              onClick={() => window.location.href = `/${locale}/services/category?category=privateChefs`}
              className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
            >
              {t('showAll')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {chefServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Car & Driver Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C62D2D]">local_taxi</span>
              <h2 className="text-xl font-bold text-gray-900">{t('carDriver')}</h2>
            </div>
            <button 
              onClick={() => window.location.href = `/${locale}/services/category?category=carDriver`}
              className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
            >
              {t('showAll')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {carDriverServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Photography Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C62D2D]">photo_camera</span>
              <h2 className="text-xl font-bold text-gray-900">{t('photographers')}</h2>
            </div>
            <button 
              onClick={() => window.location.href = `/${locale}/services/category?category=photographers`}
              className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
            >
              {t('showAll')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {photoServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
