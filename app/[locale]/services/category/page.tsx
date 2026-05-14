'use client'

import ServicesCategoryPage from '@/components/services/ServicesCategoryPage'
import { useSearchParams } from 'next/navigation'

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'
  
  return <ServicesCategoryPage filterCategory={category} />
}
