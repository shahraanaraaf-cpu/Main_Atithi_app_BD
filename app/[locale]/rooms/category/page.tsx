'use client'

import StaysCategoryPage from '@/components/stays/StaysCategoryPage'
import { useSearchParams } from 'next/navigation'

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const region = searchParams.get('region')
  
  return <StaysCategoryPage filterCategory={category} filterRegion={region || undefined} />
}
