import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { ScrollSection } from '@/app/components/ui/ScrollSection'
import { StaysCard, sylhetListings, coxsBazarListings, bandarbanListings, dhakaListings } from '@/modules/stays'
import { useTranslations, useLocale } from 'next-intl'

export default function StaysPage() {
  const t = useTranslations('Stays')
  const locale = useLocale()
  
  // Critical top sections
  const topSections = [
    { title: t('sylhetTitle'), items: sylhetListings },
    { title: t('coxsBazarTitle'), items: coxsBazarListings },
  ]

  // Non-critical sections that can be deferred or just rendered later
  const bottomSections = [
    { title: t('bandarbanTitle'), items: bandarbanListings },
    { title: t('dhakaTitle'), items: dhakaListings },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-['Plus_Jakarta_Sans']">
      <GlobalHeader activeTab="stays" />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12 sm:gap-16">
        {/* Render top sections immediately */}
        {topSections.map((section) => (
          <ScrollSection 
            key={section.title} 
            title={section.title}
            seeAllHref={`/${locale}/rooms/category?region=${encodeURIComponent(section.title)}`}
            seeAllImages={section.items.slice(0, 3).map(stay => stay.images[0])}
            seeAllText={t('seeAll')}
          >
            {section.items.map(stay => (
              <StaysCard key={stay.id} stay={stay} />
            ))}
          </ScrollSection>
        ))}

        {/* Bottom sections */}
        {bottomSections.map((section) => (
          <ScrollSection 
            key={section.title} 
            title={section.title}
            seeAllHref={`/${locale}/rooms/category?region=${encodeURIComponent(section.title)}`}
            seeAllImages={section.items.slice(0, 3).map(stay => stay.images[0])}
            seeAllText={t('seeAll')}
          >
            {section.items.map(stay => (
              <StaysCard key={stay.id} stay={stay} />
            ))}
          </ScrollSection>
        ))}
      </main>

      <Footer />
    </div>
  )
}
