import { useEffect, useState, type ReactNode } from 'react'
import { useCart } from '../contexts/CartContext'
import { createCheckout } from '../utils/shopify'
import { getCollectionKey, extractProductType } from '../utils/productGrouping'
import { CAUSES } from './causes'
import { PIECES } from './data'
import { useT } from './t'

// The cart as a receipt, in the 11.11 look: what you pay, and what each piece gives to whom.
const GIVE: Record<string, string> = { tote: PIECES.tote.give, tshirt: PIECES.shirt.give, oversized: PIECES.oversized.give, hoodie: PIECES.hoodie.give }
const eur = (n: number) => '€' + n.toFixed(2)
const mono = "'JetBrains Mono', monospace"

export default function CartDrawerV2({ isOpen, onClose, inline = false }: { isOpen: boolean; onClose: () => void; inline?: boolean }) {
  const tr = useT()
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen && !inline) return null

  // Per partner: what this cart gives.
  const gives = new Map<string, number>()
  for (const item of cart) {
    const cause = CAUSES.find((c) => c.name === getCollectionKey(item.title))
    const give = GIVE[extractProductType(item.title)]
    if (cause && give) gives.set(cause.partner, (gives.get(cause.partner) ?? 0) + Number(give) * item.quantity)
  }

  const checkout = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await createCheckout(cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity })))
      if (!res?.webUrl) throw new Error('no checkout link')
      window.location.href = res.webUrl
    } catch {
      setError('Checkout did not open. Please try again in a moment.')
      setBusy(false)
    }
  }

  const round = { width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #0b0b0c', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontFamily: 'inherit', lineHeight: 1 } as const

  return (
    <Overlay inline={inline} onClose={onClose}>
      <aside role={inline ? undefined : 'dialog'} aria-label={tr("Your cart")} style={{ width: '100%', maxWidth: inline ? '640px' : '420px', height: inline ? 'auto' : '100%', margin: inline ? '0 auto' : undefined, borderRadius: inline ? '28px' : undefined, border: inline ? '1px solid #e3e1dc' : undefined, background: '#f5f4f1', color: '#0b0b0c', display: 'flex', flexDirection: 'column', fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: 500, boxShadow: '-20px 0 50px rgba(0,0,0,.15)' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 22px 16px', borderBottom: '1.5px solid #0b0b0c' }}>
          <h2 className="pw-fat" style={{ margin: 0, fontSize: '34px', lineHeight: 1, fontFamily: "'fatfrank', system-ui, sans-serif", fontWeight: 400 }}>{tr("Your cart")}</h2>
          {!inline && <button type="button" onClick={onClose} aria-label={tr("Close cart")} style={{ ...round, width: '40px', height: '40px' }}>✕</button>}
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '18px', margin: '0 0 6px' }}>{tr("Nothing in here yet.")}</p>
              <p style={{ fontSize: '14px', color: '#5c5c5c', margin: '0 0 22px' }}>{tr("Every piece gives a fixed amount to its partner.")}</p>
              <a href="/shop" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', minHeight: '46px', padding: '0 22px', borderRadius: '999px', background: '#0b0b0c', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>{tr("Shop the pieces")}</a>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {cart.map((item) => (
                <div key={item.variantId} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img src={item.image} alt="" style={{ width: '76px', height: '76px', borderRadius: '16px', objectFit: 'cover', background: '#e9e7e2', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    {item.variant !== 'Default Title' && <p style={{ margin: '2px 0 8px', fontFamily: mono, fontSize: '12px', color: '#5c5c5c' }}>{item.variant}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button type="button" style={round} aria-label={tr("One less")} onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}>−</button>
                      <span style={{ fontFamily: mono, fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                      <button type="button" style={round} aria-label={tr("One more")} onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 8px', fontFamily: mono, fontSize: '14px' }}>{eur(item.price * item.quantity)}</p>
                    <button type="button" onClick={() => removeFromCart(item.variantId)} style={{ background: 'none', border: 'none', padding: 0, fontSize: '12px', color: '#5c5c5c', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>{tr("Remove")}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <footer style={{ padding: '0 22px 22px' }}>
            <div style={{ background: '#ffffff', padding: '16px 18px', fontFamily: mono, fontSize: '13px', boxShadow: '0 10px 24px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{tr("SUBTOTAL")}</span><span>{eur(cartTotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5c5c5c', marginTop: '6px' }}><span>{tr("SHIPPING")}</span><span>€5.00</span></div>
              {[...gives].map(([partner, amount]) => (
                <div key={partner} style={{ display: 'flex', justifyContent: 'space-between', color: '#c0322a', marginTop: '6px' }}><span>→ {partner.toUpperCase()}</span><span>{eur(amount)}</span></div>
              ))}
            </div>
            <div className="pw-tear" aria-hidden="true" style={{ height: '14px', background: 'linear-gradient(135deg,#ffffff 7px,transparent 0) 0 0/14px 14px repeat-x,linear-gradient(-135deg,#ffffff 7px,transparent 0) 0 0/14px 14px repeat-x' }} />
            {error && <p role="alert" style={{ margin: '12px 0 0', fontSize: '13px', color: '#c0322a' }}>{tr(error)}</p>}
            <button type="button" onClick={checkout} disabled={busy} style={{ width: '100%', marginTop: '14px', minHeight: '54px', borderRadius: '999px', border: 'none', background: '#0b0b0c', color: '#ffffff', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1 }}>
              {busy ? tr('Opening checkout…') : `${tr('Checkout')} · ${eur(cartTotal + 5)}`}
            </button>
            <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '12px', color: '#5c5c5c' }}>{tr("Secure checkout by Shopify. Made to order, about 1½ to 2 weeks.")}</p>
          </footer>
        )}
      </aside>
    </Overlay>
  )
}

function Overlay({ inline, onClose, children }: { inline: boolean; onClose: () => void; children: ReactNode }) {
  if (inline) return <div style={{ padding: 'clamp(32px, 5vw, 72px) clamp(16px, 4vw, 40px)' }}>{children}</div>
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose() }} style={{ position: 'fixed', inset: 0, zIndex: 2147482000, background: 'rgba(11,11,12,.35)', display: 'flex', justifyContent: 'flex-end' }}>
      {children}
    </div>
  )
}
