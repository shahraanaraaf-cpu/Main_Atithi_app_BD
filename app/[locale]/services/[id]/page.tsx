'use client'

import { useParams } from 'next/navigation'
import ServiceListingDetail from '@/components/services/ServiceListingDetail'

export default function ServiceDetailPage() {
  const params = useParams() as { id: string, locale: string }
  
  return <ServiceListingDetail serviceId={params.id} />
}
