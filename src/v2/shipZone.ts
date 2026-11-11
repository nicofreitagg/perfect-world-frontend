import { useLocale } from '../contexts/LocaleContext'
import type { ShopifyVariant } from '../types/shopify.types'

/**
 * True when Shopify won't sell this product to the visitor's country.
 * We print on demand, so a product is never really sold out: when Shopify marks every
 * variant as not for sale for the visitor's country (checked 11 Nov 2026: US, GB, NO, AU,
 * ZA, CA; DE, FR, CH sell normally), it means we don't deliver there yet. The product
 * pages used to call that "Sold out"; they now say so honestly.
 */
export function useNoDeliveryHere(variants: Pick<ShopifyVariant, 'availableForSale'>[]): boolean {
  const { country } = useLocale()
  return !!country && country !== 'DE' && variants.length > 0 && variants.every((v) => !v.availableForSale)
}
