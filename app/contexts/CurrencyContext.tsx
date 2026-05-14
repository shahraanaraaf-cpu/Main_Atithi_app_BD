'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useLocale } from 'next-intl'

export type CurrencyCode = 'BDT' | 'USD' | 'GBP'

interface ExchangeRates {
  [date: string]: {
    USD: number
    GBP: number
  }
}

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  exchangeRates: ExchangeRates
  convertPrice: (priceBDT: number, date?: string) => number
  formatPrice: (price: number) => string
  getCurrencySymbol: () => string
}

// Default exchange rates (these would typically come from an API)
const DEFAULT_RATES: ExchangeRates = {
  'default': {
    USD: 0.0083,  // 1 BDT = 0.0083 USD (approx 120 BDT = 1 USD)
    GBP: 0.0065,  // 1 BDT = 0.0065 GBP (approx 154 BDT = 1 GBP)
  }
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('BDT')
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(DEFAULT_RATES)

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferred-currency')
    if (saved && ['BDT', 'USD', 'GBP'].includes(saved)) {
      setCurrencyState(saved as CurrencyCode)
    }
  }, [])

  // Fetch exchange rates (in production, this would call an API)
  useEffect(() => {
    // TODO: Replace with actual API call
    // Example: fetch('https://api.exchangerate-api.com/v4/latest/BDT')
    // For now, using static rates
    setExchangeRates(DEFAULT_RATES)
  }, [])

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('preferred-currency', newCurrency)
  }

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'USD':
        return '$'
      case 'GBP':
        return '£'
      case 'BDT':
      default:
        return '৳'
    }
  }

  const convertPrice = (priceBDT: number, date?: string): number => {
    if (currency === 'BDT') return priceBDT

    // Use date-specific rates if available, otherwise use default
    const rates = date && exchangeRates[date] ? exchangeRates[date] : exchangeRates['default']
    
    if (!rates) return priceBDT

    const rate = rates[currency]
    if (!rate) return priceBDT

    return Math.round(priceBDT * rate)
  }

  const locale = useLocale()

  const formatPrice = (price: number): string => {
    const symbol = getCurrencySymbol()
    
    // Use bn-BD for Bengali digits, en-US for Latin digits
    const numberLocale = locale === 'bn' ? 'bn-BD' : 'en-US'
    
    try {
      const formatter = new Intl.NumberFormat(numberLocale, {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      
      let formatted = formatter.format(price)
      
      // Safety check: if we are in English mode but somehow got Bengali digits, force them to Latin
      if (locale !== 'bn' && /[০-৯]/.test(formatted)) {
        const bengaliToLatin: { [key: string]: string } = {
          '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
          '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
        }
        formatted = formatted.replace(/[০-৯]/g, m => bengaliToLatin[m])
      }
      
      return `${symbol}${formatted}`
    } catch (e) {
      // Fallback if Intl.NumberFormat fails
      return `${symbol}${price.toLocaleString(numberLocale)}`
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRates,
        convertPrice,
        formatPrice,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
