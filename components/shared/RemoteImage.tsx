'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

function canUseNextImage(src: string): boolean {
  try {
    const { hostname } = new URL(src)
    if (hostname === 'picsum.photos' || hostname === 'i.pravatar.cc') return true
    if (hostname.endsWith('.supabase.co')) return true
    return false
  } catch {
    return false
  }
}

type RemoteImageProps = {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  onLoadError?: () => void
}

/**
 * Uses next/image when the host is allow-listed in next.config remotePatterns;
 * otherwise falls back to a lazy-loaded img (unknown CDNs still load, without optimization).
 */
export function RemoteImage({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
  onLoadError,
}: RemoteImageProps) {
  const [failed, setFailed] = useState(false)
  const optimized = useMemo(() => {
    if (!src) return false
    try {
      const hostname = src.startsWith('http') ? new URL(src).hostname : ''
      return hostname === 'picsum.photos' || 
             hostname === 'i.pravatar.cc' || 
             hostname.endsWith('.supabase.co')
    } catch {
      return false
    }
  }, [src])

  const handleError = () => {
    setFailed(true)
    onLoadError?.()
  }

  if (!src || failed) {
    return null
  }

  if (!optimized) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${fill ? 'absolute inset-0 h-full w-full' : ''} ${className || ''}`.trim()}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={priority}
      onError={handleError}
    />
  )
}
