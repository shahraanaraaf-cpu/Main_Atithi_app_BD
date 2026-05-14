'use client'

import { useParams } from 'next/navigation'
import ExperienceListingDetail from '@/components/experiences/ExperienceListingDetail'

export default function ExperienceDetailPage() {
  const params = useParams() as { id: string, locale: string }
  
  return <ExperienceListingDetail experienceId={params.id} />
}
