import { useEffect, useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { getShipCountries } from '../utils/shopify'

// Our print-on-demand maker delivers within Europe only (Nico, 14 Oct 2026).
// Fallback list for when Shopify's own market countries can't be read.
export const SHIPS_TO = new Set([
  'DE', 'AT', 'CH', 'LI', 'LU', 'BE', 'NL', 'FR', 'IT', 'ES', 'PT', 'IE', 'DK', 'SE', 'FI', 'NO', 'IS',
  'PL', 'CZ', 'SK', 'HU', 'SI', 'HR', 'RO', 'BG', 'GR', 'CY', 'MT', 'EE', 'LV', 'LT', 'GB', 'MC', 'SM', 'AD', 'VA',
])

/**
 * True when the visitor browses from a country our Shopify markets don't deliver to.
 * Shopify then reports every variant as not for sale, which the product pages used to show
 * as "Sold out" (11.11 launch). They now say we only ship within Europe instead.
 */
export function useOutsideShipZone(): boolean {
  const { country } = useLocale()
  const [markets, setMarkets] = useState<Set<string> | null>(null)
  useEffect(() => {
    let live = true
    getShipCountries().then((c) => { if (live && c.length) setMarkets(new Set(c)) }).catch(() => {})
    return () => { live = false }
  }, [])
  if (!country) return false
  return !(markets ?? SHIPS_TO).has(country)
}
