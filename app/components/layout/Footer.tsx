'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useCurrency } from '@/app/contexts/CurrencyContext'

export function Footer() {
  const currentLocale = useLocale()
  const { currency, getCurrencySymbol } = useCurrency()
  
  const t = useTranslations('Footer')
  const th = useTranslations('Header')
  
  return (
    <footer className="bg-[#F7F7F7] border-t border-zinc-200 mt-12">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 py-12">
        {/* Inspiration Section */}
        <section className="mb-12">
          <h2 className="font-bold text-xl text-zinc-950 mb-4">{t('inspiration')}</h2>
          <div className="flex items-center gap-6 border-b border-zinc-200 mb-8 overflow-x-auto no-scrollbar">
            <button className="text-zinc-950 font-semibold pb-4 border-b-2 border-zinc-950 whitespace-nowrap">{t('tabPopular') || 'Popular'}</button>
            <button className="text-zinc-500 font-semibold pb-4 hover:text-zinc-700 whitespace-nowrap transition-colors">{t('tabCoastal') || 'Coastal'}</button>
            <button className="text-zinc-500 font-semibold pb-4 hover:text-zinc-700 whitespace-nowrap transition-colors">{t('tabIslands') || 'Islands'}</button>
            <button className="text-zinc-500 font-semibold pb-4 hover:text-zinc-700 whitespace-nowrap transition-colors">{t('tabLakes') || 'Lakes'}</button>
            <button className="text-zinc-500 font-semibold pb-4 hover:text-zinc-700 whitespace-nowrap transition-colors">{t('unique')}</button>
            <button className="text-zinc-500 font-semibold pb-4 hover:text-zinc-700 whitespace-nowrap transition-colors">{t('thingsToDo')}</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4">
            {[
              'srimangal1', 'bandarban1', 'sylhet', 'coxsBazar', 'sajek', 'bandarban2', 
              'dhaka', 'chittagong', 'srimangal2', 'rangamati', 'kuakata', 'sundarbans', 
              'barisal', 'rajshahi'
            ].map((key) => (
              <Link key={key} href="#" className="flex flex-col group">
                <span className="text-sm font-semibold text-zinc-900 group-hover:underline">{t(`destinations.${key}.name`)}</span>
                <span className="text-sm text-zinc-500">{t(`destinations.${key}.sub`)}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 border-t border-zinc-200 pt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-sm font-bold text-zinc-950 mb-4">{t('support')}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('helpCenter')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('atithiCover')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('antiDiscrimination')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('disabilitySupport')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('cancellationOptions')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 mb-4">{t('hosting')}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('atithiYourHome')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('atithiCoverForHosts')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('hostingResources')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('communityForum')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('hostResponsibly')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 mb-4">{t('atithiAppBD')}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('newsroom')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('newFeatures')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('careers')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('investors')}</Link></li>
              <li><Link href="#" className="text-sm text-zinc-600 hover:underline">{t('atithiOrg')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200" />

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-600">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1">
            <span>{t('copyright')}</span>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">{t('privacy')}</Link>
            <span>·</span>
            <Link href="#" className="hover:underline">{t('terms')}</Link>
            <span>·</span>
            <Link href="#" className="hover:underline">{t('sitemap')}</Link>
            <span>·</span>
            <Link href="#" className="hover:underline">{t('companyDetails')}</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 font-bold text-zinc-900">
              <button className="flex items-center gap-1.5 hover:underline">
                <span className="material-symbols-outlined text-lg">language</span>
                <span>{currentLocale === 'en' ? 'English (GB)' : 'বাংলা (বিডি)'}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:underline font-bold">
                <span>{getCurrencySymbol()}</span>
                <span>{currency}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="#" className="text-zinc-900 hover:text-zinc-600">
                <span className="material-symbols-outlined text-xl">facebook</span>
              </Link>
              <Link href="#" className="text-zinc-900 hover:text-zinc-600">
                <span className="material-symbols-outlined text-xl">x</span>
              </Link>
              <Link href="#" className="text-zinc-900 hover:text-zinc-600">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
