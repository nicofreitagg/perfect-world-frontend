// Meta pixel shopping events for the Vercel site (pixel 792108707196031, loaded in index.html).
// index.html sends PageView, and the pixel sends a new PageView on each in-app page change by itself.
// The shop steps (view product, add to cart, start checkout) only exist here, so we send them ourselves.
// Purchase happens on Shopify's checkout and is sent by Shopify's "Facebook & Instagram" app.

type Fbq = (...args: unknown[]) => void

const fbq = (): Fbq | undefined => (typeof window !== 'undefined' ? (window as unknown as { fbq?: Fbq }).fbq : undefined)

// "gid://shopify/ProductVariant/123" -> "123"
const num = (gid: string) => gid.split('/').pop() ?? gid

// Same ID format as the catalog Shopify's Facebook & Instagram app syncs, so ads can match events to products.
export const contentId = (productId: string, variantId: string) => `shopify_DE_${num(productId)}_${num(variantId)}`

const send = (event: string, data: Record<string, unknown>) => {
  try {
    fbq()?.('track', event, { currency: 'EUR', content_type: 'product', ...data })
  } catch {
    /* tracking must never break the shop */
  }
}

export const trackViewContent = (p: { productId: string; variantId: string; title: string; price: number }) =>
  send('ViewContent', { content_ids: [contentId(p.productId, p.variantId)], content_name: p.title, value: p.price })

export const trackAddToCart = (p: { productId: string; variantId: string; title: string; price: number; quantity: number }) =>
  send('AddToCart', {
    content_ids: [contentId(p.productId, p.variantId)],
    content_name: p.title,
    contents: [{ id: contentId(p.productId, p.variantId), quantity: p.quantity }],
    value: Math.round(p.price * p.quantity * 100) / 100,
  })

export const trackInitiateCheckout = (items: { productId: string; variantId: string; price: number; quantity: number }[]) =>
  send('InitiateCheckout', {
    content_ids: items.map((i) => contentId(i.productId, i.variantId)),
    contents: items.map((i) => ({ id: contentId(i.productId, i.variantId), quantity: i.quantity })),
    num_items: items.reduce((n, i) => n + i.quantity, 0),
    value: Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100,
  })
