import { Fragment, useEffect } from 'react'
import { CAUSES, causeFg, causeTeaser } from './causes'
import './v2.css'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from '../components/Cart/CartDrawer'
import { usePageTitle } from '../hooks/usePageTitle'

export default function CausesV2() {
  usePageTitle('Causes | Perfect World')
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  const others = CAUSES.map((c) => ({ ...c, placeUpper: c.place.toUpperCase(), teaser: causeTeaser(c), fg: causeFg(c) }))

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

<div className="pw2 pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c", background: "#f5f4f1" }}>

  <header style={{ color: "#0b0b0c", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px clamp(16px, 4vw, 56px)" }}>
    <A href="/" aria-label="Perfect World, home" style={{ display: "block", lineHeight: "0" }}><img src="/v2/img/logo-black.png" alt="Perfect World" style={{ height: "40px", width: "auto", display: "block" }} /></A>
    <nav aria-label="Main" style={{ display: "flex", flexWrap: "wrap", gap: "26px", fontSize: "14px", fontWeight: "600" }}>
      <A href="/shop" style={{ color: "#0b0b0c", textDecoration: "none" }}>Shop</A>
      <A href="/how-giving-works" style={{ color: "#0b0b0c", textDecoration: "none" }}>How giving works</A>
      <A href="/projects" style={{ color: "#0b0b0c", textDecoration: "none", borderBottom: "2px solid #e2453c", paddingBottom: "2px" }}>Causes</A>
      <A href="/about" style={{ color: "#0b0b0c", textDecoration: "none" }}>Our story</A>
    </nav>
    <button type="button" onClick={openCart} style={{  color: "#0b0b0c", fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 18px", border: "1px solid rgba(11,11,12,.3)", borderRadius: "999px" , background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>Cart ({cartCount})</button>
  </header>

  <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1320px", margin: "0 auto", padding: "clamp(56px, 7vw, 104px) clamp(16px, 4vw, 56px) clamp(36px, 4vw, 56px)", textAlign: "center" }}>
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-40px" }}><path d="M-60 260 C 160 120, 330 330, 470 250 C 560 200, 520 120, 465 150 C 400 185, 470 330, 640 300 C 820 268, 900 120, 1060 170 C 1160 200, 1150 300, 1080 290 C 1010 280, 1080 140, 1240 130 C 1350 124, 1420 170, 1500 150" stroke="#2f6fa8" strokeWidth="7"></path></svg>
    <p className="pw-hand" style={{ margin: "0 0 10px", fontSize: "clamp(40px, 4.6vw, 68px)", lineHeight: "1.05", color: "#0b0b0c" }}>Six causes. Six designs. <span style={{ color: "#c0322a" }}>You pick one.</span></p>
    <h1 className="pw-fat" style={{ margin: "12px 0 0", fontSize: "clamp(56px, 8vw, 120px)", lineHeight: ".9" }}>The people doing the work.</h1>
  </section>

  <section className="pw-iso" aria-label="All causes" style={{ position: "relative", zIndex: "78", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) 88px" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
      {others.map((c, cI) => (<Fragment key={cI}>
        <A href={`/project/${c.slug}`} className="pw-card" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "24px", minHeight: "420px", padding: "30px", boxSizing: "border-box", borderRadius: "32px", textDecoration: "none", color: c.fg, background: c.bg }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ width: "84px", height: "84px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src={c.logo} alt={`${c.partner} logo`} style={{ maxWidth: "62px", maxHeight: "52px", objectFit: "contain" }} /></span>
            <span className="pw-mono" style={{ fontSize: "12px", textAlign: "right" }}>{c.placeUpper}</span>
          </span>
          <span style={{ position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span className="pw-hand" style={{ fontSize: "clamp(40px, 4vw, 58px)", lineHeight: ".95" }}>{c.name}</span>
            <span  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", fontSize: "20px" }}>{c.line}</span>
            <span style={{ fontSize: "15px", lineHeight: "1.5", maxWidth: "440px" }}>With {c.partner}. {c.teaser}</span>
          </span>
          <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span className="pw-go" style={{ fontSize: "15px", fontWeight: "600", padding: "13px 22px", borderRadius: "999px", background: "#ffffff", color: "#0b0b0c", transition: "background .25s, color .25s" }}>Explore the project →</span>
          </span>
        </A>
      </Fragment>))}
    </div>
  </section>

  <section className="pw-iso" aria-label="How it works" style={{ position: "relative", zIndex: "77", background: "#0b0b0c", color: "#ffffff" }}>
    <img className="pw-ico" src="/v2/icons/ic-f40a9d4d.svg" alt="" aria-hidden="true" style={{ left: "75.5%", top: "10px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-1e094dbe.svg" alt="" aria-hidden="true" style={{ left: "57.5%", top: "170px", width: "84px", transform: "rotate(10deg)" }} />
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-220px" }}><path d="M-60 300 C 300 90, 420 530, 700 420 C 870 355, 830 210, 745 245 C 640 290, 760 530, 1010 480 C 1210 440, 1300 190, 1500 260" stroke="#4cc37f" strokeWidth="7"></path></svg>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "28px" }}>
      <p className="pw-fat" style={{ margin: "0", fontSize: "clamp(32px, 4vw, 56px)", lineHeight: ".95", flex: "1 1 520px" }}>Pick a piece. Pick a cause.<br /><span style={{ color: "#e2453c" }}>We pass it on.</span></p>
      <A href="/shop"  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", fontSize: "17px", color: "#0b0b0c", background: "#ffffff", textDecoration: "none", padding: "14px 30px", borderRadius: "999px" }}>SHOP HOPE</A>
    </div>
  </section>

  <footer className="pw-dark pw-iso" style={{ position: "relative", zIndex: "76", overflow: "hidden", padding: "clamp(60px, 6vw, 96px) clamp(16px, 4vw, 56px) 44px", textAlign: "center" }}>
    <img className="pw-ico" src="/v2/icons/ic-df3d515b.svg" alt="" aria-hidden="true" style={{ right: "2.5%", top: "70px", width: "84px", transform: "rotate(8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-745e6390.svg" alt="" aria-hidden="true" style={{ left: "92%", top: "570px", width: "104px", transform: "rotate(-6deg)" }} />
    <svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-120px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#5DADE2" strokeWidth="7"></path></svg>
    
    <img src="/v2/img/logo-white.png" alt="Perfect World" style={{ height: "48px", width: "auto" }} />
    <p style={{ margin: "16px 0 0", fontWeight: "800", fontSize: "clamp(40px, 4.6vw, 68px)", lineHeight: ".9" }} className="pw-fat">Together.</p>
    <p style={{ margin: "4px 0 0", fontFamily: "'Hand', cursive", fontSize: "clamp(54px, 6.6vw, 100px)", lineHeight: "1", letterSpacing: ".01em" }} className="pw-hand">Not Alone.</p>
    <A href="/shop" style={{ display: "inline-block", marginTop: "30px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "17px", color: "#0b0b0c", background: "#f5f4f1", textDecoration: "none", padding: "12px 30px", borderRadius: "999px" }}>SHOP IMPACT</A>
    <p style={{ margin: "22px 0 0", fontSize: "14px", color: "rgba(255,255,255,.6)" }}>Comment HOPE on any post at @perfectworld.global, and we'll find you.</p>
    <nav aria-label="Footer" style={{ margin: "64px auto 0", maxWidth: "1100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "28px", textAlign: "left", paddingTop: "36px", borderTop: "1px solid rgba(255,255,255,.14)" }}><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>SHOP</p><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>All pieces</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Minimal</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>OG collections</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Size guide</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>GIVING</p><A href="/how-giving-works" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>How giving works</A><A href="/projects" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>The six causes</A><A href="/how-giving-works#payouts" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>When it's paid</A><A href="/about" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Our story</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>HELP</p><A href="/shipping-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Shipping and delivery</A><A href="/refund-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Returns and exchanges</A><A href="/how-giving-works#faq" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>FAQ</A><A href="mailto:hello@perfectworld.global" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Contact</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>LEGAL</p><A href="/legal-notice" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Imprint</A><A href="/privacy-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Privacy</A><A href="/terms-of-service" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Terms</A><A href="/refund-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Right of withdrawal</A></div></nav><p style={{ margin: "40px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", color: "rgba(255,255,255,.4)" }}>MUNICH · SIX CAUSES, ONE HOPE · PRINTED ON DEMAND IN GERMANY · SHIPS IN 1.5 TO 2 WEEKS · @PERFECTWORLD.GLOBAL</p>
  </footer>
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
