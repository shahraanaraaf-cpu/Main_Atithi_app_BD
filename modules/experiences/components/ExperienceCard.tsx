import { CardBase } from '@/components/shared/CardBase'
import type { Experience } from '../types/experiences.types'

import { useTranslations, useLocale } from 'next-intl'
import { expTitleTranslations, expHostTranslations } from '../utils/translations'

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const ti = useTranslations('Index')

  const locale = useLocale() as 'en' | 'bn'

  const localizedTitle = expTitleTranslations[experience.title]?.[locale] || experience.title
  const localizedSubtitle = expHostTranslations[experience.hostType]?.[locale] || experience.hostType

  return (
    <CardBase
      id={experience.id}
      href={`/${locale}/experiences/${experience.id}`}
      image={experience.image}
      title={localizedTitle}
      subtitle={localizedSubtitle}
      price={experience.price}
      rating={experience.rating}
      badge={experience.badge}
      location={experience.location}
      priceLabel={ti('perGuest')}
      aspectRatio="square"
    />
  )
}
