import { useEffect, type ReactNode } from 'react'
import './v2.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import CartDrawer from './CartDrawerV2'
import { useCart } from '../contexts/CartContext'

// Frame for the smaller pages (legal, contact, order status, 404) in the new look.
export default function Shell({ children, active }: { children: ReactNode; active?: string }) {
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div className="pw2 pw-grain" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Flow />
      <Header active={active} cartCount={cartCount} openCart={openCart} />
      <main style={{ flex: 1, position: 'relative', zIndex: 78 }}>{children}</main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  )
}

/** Title block + readable column used by text pages. */
export function Page({ kicker, title, sub, children }: { kicker?: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section className="pw-iso" style={{ maxWidth: '820px', margin: '0 auto', padding: 'clamp(40px, 6vw, 88px) clamp(16px, 4vw, 40px) clamp(64px, 8vw, 110px)' }}>
      {kicker && <p className="pw-hand" style={{ margin: '0 0 10px', fontSize: 'clamp(26px, 3vw, 38px)', color: '#c0322a' }}>{kicker}</p>}
      <h1 className="pw-fat" style={{ margin: 0, fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 0.95 }}>{title}</h1>
      {sub && <p style={{ margin: '14px 0 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#5c5c5c' }}>{sub}</p>}
      <div className="pw-prose" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>{children}</div>
    </section>
  )
}
