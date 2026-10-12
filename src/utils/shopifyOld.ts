// The pre-11.11 pages read Shopify through this module: same calls, but the Minimal
// collection (launching on the new site at 11.11) never shows there. Mirrors the
// filter that went live on main on 12 Oct 2026.
import { getAllProducts as all, getCollectionProducts as collection, getProduct as product } from './shopify'
import type { ShopifyCollection, ShopifyProduct } from '../types/shopify.types'

export * from './shopify'

const isMinimal = (p: { title: string }) => /minimal/i.test(p.title)

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  return (await all()).filter((p) => !isMinimal(p))
}

export async function getCollectionProducts(handle: string): Promise<ShopifyCollection> {
  const c = await collection(handle)
  return { ...c, products: c.products.filter((p) => !isMinimal(p)) }
}

export async function getProduct(handle: string): Promise<ShopifyProduct> {
  const p = await product(handle)
  if (isMinimal(p)) throw new Error(`Product with handle "${handle}" not found`)
  return p
}
