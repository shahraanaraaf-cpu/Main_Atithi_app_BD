'use client'

import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { 
  ExperienceCard, 
  experienceCategories, 
  popularExperiences, 
  atithiOriginals, 
  happeningToday, 
  tomorrowInDhaka,
  dhakaExperiences,
  chittagongExperiences,
  sylhetExperiences,
  rajshahiExperiences,
  khulnaExperiences,
  coxsBazarExperiences
} from '@/modules/experiences'
import { useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { Experience } from '@/modules/experiences'

// Reusable Section Component for experiences
function ExperienceSection({ title, experiences, region, category, locale }: { title: string; experiences: Experience[]; region?: string; category?: string; locale: string }) {
  const t = useTranslations('Experiences')
  
  const handleShowAll = () => {
    if (region) {
      window.location.href = `/${locale}/experiences/category?region=${encodeURIComponent(region)}`
    } else if (category) {
      window.location.href = `/${locale}/experiences/category?category=${encodeURIComponent(category)}`
    } else {
      window.location.href = `/${locale}/experiences/category`
    }
  }
  
  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button 
          onClick={handleShowAll}
          className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
        >
          {t('showAll')}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {experiences.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  )
}

// Inspiration Section Component
function InspirationSection() {
  const [activeTab, setActiveTab] = useState('popular')
  const t = useTranslations('Experiences')
  
  const tabs = [
    { id: 'popular', label: t('tabPopular') },
    { id: 'coastal', label: t('tabCoastal') },
    { id: 'historic', label: t('tabHistoric') },
    { id: 'islands', label: t('tabIslands') },
    { id: 'lakes', label: t('tabLakes') },
    { id: 'activities', label: t('tabActivities') },
  ]
  
  const destinations = {
    popular: [
      { name: t('destinations.dhaka'), desc: t('destinations.dhakaDesc') },
      { name: t('destinations.coxsBazar'), desc: t('destinations.coxsBazarDesc') },
      { name: t('destinations.sylhet'), desc: t('destinations.sylhetDesc') },
      { name: t('destinations.chittagong'), desc: t('destinations.chittagongDesc') },
      { name: t('destinations.khulna'), desc: t('destinations.khulnaDesc') },
      { name: t('destinations.rajshahi'), desc: t('destinations.rajshahiDesc') },
    ],
    coastal: [
      { name: t('destinations.coxsBazar'), desc: t('destinations.coastDesc') },
      { name: t('destinations.teknaf'), desc: t('destinations.teknafDesc') },
      { name: t('destinations.kuakata'), desc: t('destinations.kuakataDesc') },
      { name: t('destinations.chittagong'), desc: 'Bay of Bengal' }, // Need translation for Bay of Bengal if needed
      { name: t('destinations.patenga'), desc: t('destinations.patengaDesc') },
      { name: t('destinations.himchari'), desc: t('destinations.himchariDesc') },
    ],
    historic: [
      { name: t('destinations.dhaka'), desc: t('destinations.mughalHeritage') },
      { name: t('destinations.sonargaon'), desc: t('destinations.sonargaonDesc') },
      { name: t('destinations.puthia'), desc: t('destinations.puthiaDesc') },
      { name: t('destinations.bagerhat'), desc: t('destinations.bagerhatDesc') },
      { name: t('destinations.mahasthangarh'), desc: t('destinations.mahasthangarhDesc') },
      { name: t('destinations.paharpur'), desc: t('destinations.paharpurDesc') },
    ],
    islands: [
      { name: t('destinations.saintMartins'), desc: t('destinations.coralIsland') },
      { name: t('destinations.maheshkhali'), desc: t('destinations.maheshkhaliDesc') },
      { name: t('destinations.nijhumDwip'), desc: t('destinations.deer island') },
      { name: t('destinations.hatia'), desc: t('destinations.riverIsland') },
      { name: t('destinations.sandwip'), desc: t('destinations.historicIsland') },
      { name: t('destinations.bhola'), desc: t('destinations.largestIsland') },
    ],
    lakes: [
      { name: t('destinations.kaptaiLake'), desc: t('destinations.rangamati') },
      { name: t('destinations.tanguarHaor'), desc: t('destinations.sunamganj') },
      { name: t('destinations.rangamatiLake'), desc: t('destinations.hillTracts') },
      { name: t('destinations.foysLake'), desc: t('destinations.chittagong') },
      { name: t('destinations.niladriLake'), desc: t('destinations.sunamganj') },
      { name: t('destinations.birishiri'), desc: t('destinations.netrokona') },
    ],
    activities: [
      { name: t('destinations.boatRides'), desc: t('destinations.riverCruises') },
      { name: t('destinations.trekking'), desc: t('destinations.hillTrails') },
      { name: t('destinations.foodTours'), desc: t('destinations.streetFood') },
      { name: t('destinations.photography'), desc: t('destinations.wildlifeNature') },
      { name: t('destinations.craftWorkshops'), desc: t('destinations.traditionalArts') },
      { name: t('destinations.surfing'), desc: t('destinations.coxsBazar') },
    ],
  }
  
  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('inspiration')}</h2>
      
      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Destinations Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
        {destinations[activeTab as keyof typeof destinations].map((dest, i) => (
          <div key={i} className="cursor-pointer group">
            <p className="font-semibold text-gray-900 group-hover:underline">{dest.name}</p>
            <p className="text-sm text-gray-500">{dest.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('Experiences')
  const locale = useLocale()

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
      <GlobalHeader activeTab="experiences" />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>

        {/* Categories Section - Horizontal Scroll */}
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
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pr-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {experienceCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => window.location.href = `/${locale}/experiences/category?category=${encodeURIComponent(cat.id)}`}
                className="flex flex-col items-center gap-2 min-w-[100px] group flex-shrink-0"
              >
                {/* Category Image Container */}
                <div className={`relative w-[100px] h-[100px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeCategory === cat.id ? 'border-gray-900 scale-105' : 'border-gray-200 group-hover:border-gray-400'}`}>
                  <img 
                    src={cat.image} 
                    alt={cat.name}
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
                  <p className={`text-sm font-medium leading-tight ${activeCategory === cat.id ? 'text-gray-900 underline underline-offset-4' : 'text-gray-700'}`}>
                    {t(`categories.${cat.id}`)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.count} {t('available')}</p>
                </div>
              </button>
            ))}
            {/* Spacer for last item visibility */}
            <div className="w-4 flex-shrink-0"></div>
          </div>
        </section>

        {/* Popular Experiences */}
        <ExperienceSection title={t('popularExperiences')} experiences={popularExperiences} category="popular" locale={locale} />

        {/* Atithi Originals Section */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C62D2D]">verified</span>
              <h2 className="text-xl font-bold text-gray-900">{t('atithiOriginals')}</h2>
            </div>
            <button 
              onClick={() => window.location.href = `/${locale}/experiences/category?category=atithi-originals`}
              className="text-sm font-semibold text-[#C62D2D] hover:underline flex items-center gap-1"
            >
              {t('showAll')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <p className="text-gray-600 mb-5 text-sm">{t('atithiOriginalsDesc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {atithiOriginals.map(exp => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </section>

        {/* Happening Today Section */}
        <ExperienceSection title={t('happeningToday')} experiences={happeningToday} category="happening-today" locale={locale} />

        {/* Tomorrow in Dhaka Section */}
        <ExperienceSection title={t('tomorrowInDhaka')} experiences={tomorrowInDhaka} region="Tomorrow in Dhaka" locale={locale} />

        {/* DHAKA Section */}
        <ExperienceSection title={t('topInDhaka')} experiences={dhakaExperiences} region="Top in Dhaka" locale={locale} />

        {/* CHITTAGONG Section */}
        <ExperienceSection title={t('topInChittagong')} experiences={chittagongExperiences} region="Top in Chittagong" locale={locale} />

        {/* SYLHET & SREEMANGAL Section */}
        <ExperienceSection title={t('topInSylhet')} experiences={sylhetExperiences} region="Top in Sylhet" locale={locale} />

        {/* RAJSHAHI Section */}
        <ExperienceSection title={t('topInRajshahi')} experiences={rajshahiExperiences} region="Top in Rajshahi" locale={locale} />

        {/* KHULNA Section */}
        <ExperienceSection title={t('topInKhulna')} experiences={khulnaExperiences} region="Top in Khulna" locale={locale} />

        {/* COX'S BAZAR Section */}
        <ExperienceSection title={t('topInCoxsBazar')} experiences={coxsBazarExperiences} region="Top in Cox's Bazar" locale={locale} />

        {/* Inspiration for Future Getaways */}
        <InspirationSection />
      </main>

      <Footer />
    </div>
  )
}
