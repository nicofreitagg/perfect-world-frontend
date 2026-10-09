import { Fragment, useEffect } from 'react'
import { CAUSES, causeFg, causeTeaser } from './causes'
import './v2.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'
import { useT } from './t'

export default function CausesV2() {
  const tr = useT()
  usePageTitle('Causes | Perfect World')
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  const others = CAUSES.map((c) => ({ ...c, placeUpper: c.place.toUpperCase(), teaser: causeTeaser(c), fg: causeFg(c) }))

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

<div className="pw2 pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />
  <Header active="/projects" cartCount={cartCount} openCart={openCart} />

  <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1320px", margin: "0 auto", padding: "clamp(56px, 7vw, 104px) clamp(16px, 4vw, 56px) clamp(36px, 4vw, 56px)", textAlign: "center" }}>
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-40px" }}><path d="M-60 260 C 160 120, 330 330, 470 250 C 560 200, 520 120, 465 150 C 400 185, 470 330, 640 300 C 820 268, 900 120, 1060 170 C 1160 200, 1150 300, 1080 290 C 1010 280, 1080 140, 1240 130 C 1350 124, 1420 170, 1500 150" stroke="#2f6fa8" strokeWidth="7"></path></svg>
    <p className="pw-hand" style={{ margin: "0 0 10px", fontSize: "clamp(40px, 4.6vw, 68px)", lineHeight: "1.05", color: "#0b0b0c" }}>{tr("Six causes. Six designs.")} <span style={{ color: "#c0322a" }}>{tr("You pick one.")}</span></p>
    <h1 className="pw-fat" style={{ margin: "12px 0 0", fontSize: "clamp(56px, 8vw, 120px)", lineHeight: ".9" }}>{tr("The people doing the work.")}</h1>
  </section>

  <section className="pw-iso" aria-label={tr("All causes")} style={{ position: "relative", zIndex: "78", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) 88px" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
      {others.map((c, cI) => (<Fragment key={cI}>
        <A href={`/project/${c.slug}`} className="pw-card" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "24px", minHeight: "420px", padding: "30px", boxSizing: "border-box", borderRadius: "32px", textDecoration: "none", color: c.fg, background: c.bg }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ width: "84px", height: "84px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src={c.logo} alt={`${c.partner} logo`} style={{ maxWidth: "62px", maxHeight: "52px", objectFit: "contain" }} /></span>
            <span className="pw-mono" style={{ fontSize: "12px", textAlign: "right" }}>{tr(c.place).toUpperCase()}</span>
          </span>
          <span style={{ position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span className="pw-hand" style={{ fontSize: "clamp(40px, 4vw, 58px)", lineHeight: ".95" }}>{c.name}</span>
            <span  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", fontSize: "20px" }}>{tr(c.line)}</span>
            <span style={{ fontSize: "15px", lineHeight: "1.5", maxWidth: "440px" }}>{tr("With")} {c.partner}. {tr(c.teaser)}</span>
          </span>
          <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span className="pw-go" style={{ fontSize: "15px", fontWeight: "600", padding: "13px 22px", borderRadius: "999px", background: "#ffffff", color: "#0b0b0c", transition: "background .25s, color .25s" }}>{tr("Explore the project →")}</span>
          </span>
        </A>
      </Fragment>))}
    </div>
  </section>

  <section className="pw-iso pw-blend pw-to-footer" aria-label={tr("How it works")} style={{ position: "relative", zIndex: "77", background: "#0b0b0c", color: "#ffffff" }}>
    <img className="pw-ico" src="/v2/icons/ic-f40a9d4d.svg" alt="" aria-hidden="true" style={{ left: "75.5%", top: "10px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-1e094dbe.svg" alt="" aria-hidden="true" style={{ left: "57.5%", top: "170px", width: "84px", transform: "rotate(10deg)" }} />
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-220px" }}><path d="M-60 300 C 300 90, 420 530, 700 420 C 870 355, 830 210, 745 245 C 640 290, 760 530, 1010 480 C 1210 440, 1300 190, 1500 260" stroke="#4cc37f" strokeWidth="7"></path></svg>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "28px" }}>
      <p className="pw-fat" style={{ margin: "0", fontSize: "clamp(32px, 4vw, 56px)", lineHeight: ".95", flex: "1 1 520px" }}>{tr("Pick a piece. Pick a cause.")}<br /><span style={{ color: "#e2453c" }}>{tr("We pass it on.")}</span></p>
      <A href="/shop"  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", fontSize: "17px", color: "#0b0b0c", background: "#ffffff", textDecoration: "none", padding: "14px 30px", borderRadius: "999px" }}>{tr("SHOP HOPE")}</A>
    </div>
  </section>
  <Footer icons={["/v2/icons/ic-df3d515b.svg", "/v2/icons/ic-745e6390.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
