import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Shell from './Shell'
import { A } from './A'
import { CAUSES } from './causes'
import { PIECES } from './data'
import { useT } from './t'
import { useCart } from '../contexts/CartContext'
import { getProduct } from '../utils/shopify'
import { getCollectionKey, extractProductType } from '../utils/productGrouping'
import type { ShopifyProduct, ShopifyVariant } from '../types/shopify.types'

// /product/:handle on the new site. Cause designs go to their /design page;
// anything else (for example the Minimal pieces) gets this simple product page.
const GIVE: Record<string, string> = { tote: PIECES.tote.give, tshirt: PIECES.shirt.give, oversized: PIECES.oversized.give, hoodie: PIECES.hoodie.give }
const sizeOf = (v: ShopifyVariant) => v.selectedOptions?.find((o) => /size|gr(ö|oe)(ß|ss)e/i.test(o.name))?.value ?? v.title
const mono = "'JetBrains Mono', monospace"

export default function ProductHandleV2() {
  const t = useT()
  const { handle } = useParams()
  const { addToCart, openCart } = useCart()
  const [p, setP] = useState<ShopifyProduct | null | undefined>(undefined)
  const [vid, setVid] = useState('')
  const [shot, setShot] = useState(0)

  useEffect(() => { if (handle) getProduct(handle).then(setP).catch(() => setP(null)) }, [handle])

  if (p === undefined) return <Shell><p style={{ padding: '120px 16px', textAlign: 'center', fontFamily: mono }}>{t('LOADING…')}</p></Shell>
  if (p === null) return <Navigate to="/shop" replace />
  const cause = CAUSES.find((c) => c.name === getCollectionKey(p.title))
  if (cause && !/minimal/i.test(p.title)) return <Navigate to={`/design/${cause.slug}`} replace />

  const variant = p.variants.find((v) => v.id === vid && v.availableForSale) ?? p.variants.find((v) => v.availableForSale)
  const price = variant ? Number(variant.price.amount) : Number(p.priceRange.minVariantPrice.amount)
  const give = GIVE[extractProductType(p.title)]
  const img = p.images[shot]?.url

  return (
    <Shell active="/shop">
      <section className="pw-iso" style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(24px, 4vw, 56px) clamp(16px, 4vw, 56px) clamp(64px, 8vw, 110px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 4vw, 56px)' }}>
        <div style={{ flex: '1 1 480px', minWidth: 0, display: 'grid', gap: '12px' }}>
          <div style={{ aspectRatio: '4 / 5', borderRadius: '28px', overflow: 'hidden', background: '#e9e7e2' }}>
            {img && <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
          </div>
          {p.images.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {p.images.slice(0, 4).map((im, k) => (
                <button key={im.url} type="button" onClick={() => setShot(k)} aria-pressed={k === shot} style={{ aspectRatio: '1 / 1', borderRadius: '16px', overflow: 'hidden', padding: 0, cursor: 'pointer', border: k === shot ? '2px solid #0b0b0c' : '1px solid #e3e1dc', background: '#fff' }}>
                  <img src={im.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            {/minimal/i.test(p.title) && <p style={{ margin: 0, fontFamily: mono, fontSize: '12px', color: '#c0322a' }}>{t('THE MINIMAL COLLECTION')}</p>}
            <h1 className="pw-fat" style={{ margin: '10px 0 0', fontSize: 'clamp(26px, 4.4vw, 60px)', lineHeight: 0.95 }}>{p.title}</h1>
            <p style={{ margin: '14px 0 0', fontFamily: mono, fontSize: '22px' }}>€{price.toFixed(2)}</p>
            {give && <p style={{ margin: '6px 0 0', fontFamily: mono, fontSize: '14px', color: '#c0322a' }}>€{give} {t('goes to the partner it was made with')}</p>}
          </div>
          {p.variants.length > 1 && (
            <div>
              <p style={{ margin: '0 0 10px', fontFamily: mono, fontSize: '12px', letterSpacing: '.1em', display: 'flex', justifyContent: 'space-between' }}><span>{t('SIZE')}</span><A href="/size-guide" style={{ color: '#0b0b0c', letterSpacing: 0 }}>{t('Size guide')}</A></p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {p.variants.map((v) => {
                  const on = v === variant
                  return <button key={v.id} type="button" className="pw-chip" disabled={!v.availableForSale} aria-pressed={on} onClick={() => setVid(v.id)} style={{ fontFamily: mono, fontSize: '14px', minWidth: '52px', minHeight: '46px', borderRadius: '999px', cursor: 'pointer', border: '1.5px solid #0b0b0c', background: on ? '#0b0b0c' : '#fff', color: on ? '#fff' : '#0b0b0c' }}>{sizeOf(v)}</button>
                })}
              </div>
            </div>
          )}
          <button type="button" disabled={!variant} onClick={() => { if (!variant) return; addToCart({ variantId: variant.id, productId: p.id, title: p.title, variant: variant.title, price, image: p.images[0]?.url ?? '', quantity: 1 }); openCart() }} style={{ minHeight: '56px', borderRadius: '999px', border: 'none', background: '#0b0b0c', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '16px', cursor: variant ? 'pointer' : 'not-allowed', opacity: variant ? 1 : 0.5 }}>
            {variant ? `${t('ADD TO CART')} · €${price.toFixed(2)}` : t('SOLD OUT')}
          </button>
          {p.description && <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#3a3a3a' }}>{p.description}</p>}
          <p style={{ margin: 0, fontFamily: mono, fontSize: '12px', color: '#5c5c5c' }}>{t('MADE TO ORDER · ABOUT 1½ TO 2 WEEKS · SHIPPING €5')}</p>
        </div>
      </section>
    </Shell>
  )
}
