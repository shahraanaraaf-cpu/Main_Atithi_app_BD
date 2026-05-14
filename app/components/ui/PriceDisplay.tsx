'use client'

import { useTranslations } from 'next-intl'
import { useCurrency } from '@/app/contexts/CurrencyContext'

interface PriceDisplayProps {
  priceBDT: number
  date?: string
  showPerNight?: boolean
  className?: string
  prefix?: string
  suffix?: string
}

export function PriceDisplay({ 
  priceBDT, 
  date, 
  showPerNight = false,
  className = '',
  prefix = '',
  suffix = ''
}: PriceDisplayProps) {
  const { convertPrice, formatPrice } = useCurrency()
  const t = useTranslations('Index')
  
  const convertedPrice = convertPrice(priceBDT, date)
  const formattedPrice = formatPrice(convertedPrice)
  
  return (
    <span className={className} suppressHydrationWarning>
      {prefix}{formattedPrice}{suffix}
      {showPerNight && <span className="text-zinc-500 font-normal"> {t('perNight')}</span>}
    </span>
  )
}

// For displaying total price with breakdown
interface TotalPriceDisplayProps {
  pricePerNightBDT: number
  numberOfNights: number
  serviceFeeBDT?: number
  cleaningFeeBDT?: number
  date?: string
  className?: string
}

export function TotalPriceDisplay({
  pricePerNightBDT,
  numberOfNights,
  serviceFeeBDT = 0,
  cleaningFeeBDT = 0,
  date,
  className = ''
}: TotalPriceDisplayProps) {
  const { convertPrice, formatPrice } = useCurrency()
  const t = useTranslations('Index')
  const tr = useTranslations('Room')
  
  const subtotal = pricePerNightBDT * numberOfNights
  const total = subtotal + serviceFeeBDT + cleaningFeeBDT
  
  return (
    <div className={className}>
      <div className="flex justify-between py-2">
        <span suppressHydrationWarning>{formatPrice(convertPrice(pricePerNightBDT, date))} x {numberOfNights} {t('nights')}</span>
        <span suppressHydrationWarning>{formatPrice(convertPrice(subtotal, date))}</span>
      </div>
      {serviceFeeBDT > 0 && (
        <div className="flex justify-between py-2">
          <span className="underline">{tr('serviceFee')}</span>
          <span suppressHydrationWarning>{formatPrice(convertPrice(serviceFeeBDT, date))}</span>
        </div>
      )}
      {cleaningFeeBDT > 0 && (
        <div className="flex justify-between py-2">
          <span className="underline">{tr('cleaningFee')}</span>
          <span suppressHydrationWarning>{formatPrice(convertPrice(cleaningFeeBDT, date))}</span>
        </div>
      )}
      <div className="flex justify-between py-3 border-t font-bold">
        <span>{tr('total')}</span>
        <span suppressHydrationWarning>{formatPrice(convertPrice(total, date))}</span>
      </div>
    </div>
  )
}
