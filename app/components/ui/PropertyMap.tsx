'use client'

import dynamic from 'next/dynamic'

interface PropertyMapProps {
  lat: number
  lng: number
  locationName: string
}

function MapSkeleton() {
  return (
    <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-100 flex items-center justify-center">
      <span className="text-zinc-400 text-sm">Loading map...</span>
    </div>
  )
}

const MapWithNoSSR = dynamic(
  () => import('./MapComponent').then((mod) => mod.MapComponent),
  { ssr: false, loading: () => <MapSkeleton /> }
)

export function PropertyMap({ lat, lng, locationName }: PropertyMapProps) {
  return <MapWithNoSSR lat={lat} lng={lng} locationName={locationName} />
}
