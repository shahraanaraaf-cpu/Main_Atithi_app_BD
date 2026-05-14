'use client'

import ExperienceListingPage from '@/components/experiences/ExperienceCategoryPage'
import { useSearchParams } from 'next/navigation'

export default function ExperienceCategoryPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const region = searchParams.get('region')
  
  return <ExperienceListingPage filterCategory={category} filterRegion={region || undefined} />
}
