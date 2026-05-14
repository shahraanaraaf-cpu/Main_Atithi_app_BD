'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'

interface HostTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

type HostType = 'home' | 'experience' | 'service' | null

export function HostTypeModal({ isOpen, onClose }: HostTypeModalProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('HostTypeModal')
  const [selectedType, setSelectedType] = useState<HostType>(null)

  if (!isOpen) return null

  const hostTypes = [
    {
      id: 'home' as const,
      title: t('homeTitle'),
      description: t('homeDescription'),
      icon: '🏠',
    },
    {
      id: 'experience' as const,
      title: t('experienceTitle'),
      description: t('experienceDescription'),
      icon: '🎈',
    },
    {
      id: 'service' as const,
      title: t('serviceTitle'),
      description: t('serviceDescription'),
      icon: '🛎️',
    },
  ]

  const handleNext = () => {
    if (selectedType) {
      // Redirect to signup page with host type
      router.push(`/${locale}/signup?type=${selectedType}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
        >
          <span className="material-symbols-outlined text-zinc-500">close</span>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-8">
          {t('title')}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {hostTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                selectedType === type.id
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <span className="text-6xl mb-4">{type.icon}</span>
              <span className="font-bold text-lg">{type.title}</span>
            </button>
          ))}
        </div>

        {/* Next button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedType}
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              selectedType
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  )
}
