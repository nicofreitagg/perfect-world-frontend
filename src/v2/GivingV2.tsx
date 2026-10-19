import { useEffect, useState } from 'react'
import './v2.css'
import './landing.css'
import { PIECES, NEW_PIECES, type CauseKey } from './data'
import { CAUSES, SITES, ext } from './causes'

const LOGO_ORDER: CauseKey[] = ['one-world', 'rich', 'talk', 'oceans', 'cool', 'wild']
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'
import { useT } from './t'
import { isLaunched } from './launch'

export default function GivingV2() {
  const tr = useT()
  usePageTitle('How giving works')
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  useEffect(() => {
    document.body.style.background = '#13110f'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

{/* Dark like Home and Our story (Nico 16 Oct): the menu reads dark, Raw, dark, Raw, dark. Cards stay Natural Raw. */}
<div className="pw2 pw-giving pw-grain pw-darkpage" style={{ '--pw-ground': '#13110f', fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#f2ebdf" } as React.CSSProperties}>
  <Flow />

  <div className="pw-lightband" style={{ color: "#f2ebdf" }}>
  <Header dark active="/how-giving-works" cartCount={cartCount} openCart={openCart} />
    <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1240px", margin: "0 auto", padding: "clamp(40px, 6vw, 90px) clamp(16px, 4vw, 56px) clamp(40px, 8vw, 110px)" }}>
      <div className="pw-givehero"><div>
      <p style={{ margin: "0", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", fontSize: "14px", letterSpacing: ".14em", color: "#c0322a" }}>{tr("HOW GIVING WORKS")}</p>
      <h1 style={{ margin: "18px 0 0", fontWeight: "800", fontSize: "clamp(35px, 7vw, 104px)", lineHeight: ".92", letterSpacing: "-0.02em" }} className="pw-fat">{tr("Every piece gives")}<br />{tr("a fixed amount.")}</h1>
      <p style={{ margin: "24px 0 0", fontSize: "21px", lineHeight: "1.55", color: "#cfc4b2", maxWidth: "640px" }}>{tr("Right next to the price, the same every time, for the partner behind your design.")}</p>
      </div><GiveTag /></div>
    </section>
  </div>

  <section className="pw-iso" aria-label={tr("Where it goes")} style={{ position: "relative", zIndex: "78", maxWidth: "1240px", margin: "0 auto", padding: "clamp(40px, 8vw, 110px) clamp(16px, 4vw, 56px) 0" }}>
    <h2 style={{ margin: "0", fontWeight: "800", fontSize: "clamp(26px, 4.6vw, 64px)", lineHeight: ".95" }} className="pw-fat">{tr("Where it goes")}</h2>
    <div style={{ marginTop: "34px", background: "#fbf6ec", color: "#0b0b0c", border: "1px solid #e2d6c1", borderRadius: "28px", padding: "clamp(28px, 4vw, 48px)" }}>
      <p style={{ margin: "16px 0 0", fontSize: "clamp(18px, 1.6vw, 21px)", lineHeight: "1.6", color: "#2a2a2a", maxWidth: "820px" }}>{tr("Every design is made with one of six partners, and its amount always goes to that partner. We pass it on directly, and you can ask us any time what a cause has received.")}</p>
    </div>
    <div className="pw-m-g3 pw-m-logos" style={{ marginTop: "26px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>{LOGO_ORDER.map((id) => { const c = CAUSES.find((x) => x.id === id)!; const box = { background: "#fbf6ec", border: "1px solid #e2d6c1", borderRadius: "16px", height: "86px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }; const img = <img src={c.logo} alt={`${c.partner} logo`} style={{ maxHeight: "58px", maxWidth: "100%", objectFit: "contain" }} />; return SITES[id] ? <a key={id} href={SITES[id]} {...ext} className="pw-plogo" style={box} aria-label={`${c.partner}, ${tr("website")}`}>{img}</a> : <div key={id} style={box}>{img}</div> })}</div>
  </section>

  <section className="pw-iso" aria-label={tr("Why we changed")} style={{ position: "relative", zIndex: "76", maxWidth: "1240px", margin: "0 auto", padding: "clamp(40px, 8vw, 110px) clamp(16px, 4vw, 56px) 0" }}>
    <div style={{ background: "#fbf6ec", border: "1px solid #e2d6c1", color: "#0b0b0c", borderRadius: "32px", padding: "clamp(28px, 4vw, 56px)", display: "flex", flexWrap: "wrap", gap: "36px", alignItems: "center" }}>
      <div style={{ flex: "0 1 400px" }}><p style={{ margin: "0", fontWeight: "800", fontSize: "clamp(29px, 4.2vw, 58px)", lineHeight: "1", textWrap: "balance" }} className="pw-fat">{tr("From profits to a fixed amount")}</p></div>
      <div style={{ flex: "1 1 420px", fontSize: "18px", lineHeight: "1.6", color: "#2a2a2a", display: "flex", flexDirection: "column", gap: "14px" }}>
        <p style={{ margin: "0" }}>{tr("From day one, 100% of profits was the mission behind Perfect World: proof that buying and business can exist to help, not to take.")}</p>
        <p style={{ margin: "0" }}>{isLaunched() ? tr("Since 11.11, that mission has a number: every piece gives a fixed amount, shown next to the price and passed on to the partner. It's our next step in transparency.") : tr("From 11.11, that mission gets a number: every piece gives a fixed amount, shown next to the price and passed on to the partner. It's our next step in transparency.")}</p>
      </div>
    </div>
  </section>

  <Footer icons={["/v2/icons/ic-931f8328.svg", "/v2/icons/ic-13b34769.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}

// Hero of the giving page (Nico, 14 Oct: "more engaging"): a price tag you play with.
// Pick a piece: what you pay, and what its partner gets (counts up).
const [women, bomber, beanie] = NEW_PIECES
const TAG = [
  { id: 'shirt', name: PIECES.shirt.name, price: PIECES.shirt.price, give: PIECES.shirt.give, split: false },
  { id: 'women', name: women.name, price: women.price, give: women.give, split: false },
  { id: 'oversized', name: PIECES.oversized.name, price: PIECES.oversized.price, give: PIECES.oversized.give, split: false },
  { id: 'hoodie', name: PIECES.hoodie.name, price: PIECES.hoodie.price, give: PIECES.hoodie.give, split: false },
  { id: 'bomber', name: bomber.name, price: bomber.price, give: bomber.give, split: false },
  { id: 'tote', name: PIECES.tote.name, price: PIECES.tote.price, give: PIECES.tote.give, split: false },
  { id: 'beanie', name: beanie.name, price: beanie.price, give: beanie.give, split: true },
]

function GiveTag() {
  const tr = useT()
  const [i, setI] = useState(0)
  const p = TAG[i]
  const target = Number(p.give)
  const [n, setN] = useState(target)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(target); return }
    let raf = 0
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.max(0, Math.min(1, (t - t0) / 650))
      setN(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return (
    <div className="pw-givetag">
      <p className="pw-givetag-t">{tr('Try it: what does your piece give?')}</p>
      <div className="pw-givetag-chips" role="group" aria-label={tr('Pick a piece')}>
        {TAG.map((x, j) => <button key={x.id} type="button" aria-pressed={j === i} onClick={() => setI(j)}>{tr(x.name)}</button>)}
      </div>
      <div className="pw-givetag-row"><span>{tr('You pay')}</span><span>€{p.price}</span></div>
      <div className="pw-givetag-row is-give"><span>{tr(p.split ? 'Shared by all six partners' : 'The partner gets')}</span><span className="pw-givetag-amt pw-fat" aria-live="polite">€{n.toFixed(2)}</span></div>
      <p className="pw-givetag-note">{tr('Already included in the price, never added on top.')}</p>
    </div>
  )
}
