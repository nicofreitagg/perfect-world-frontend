import { Fragment, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CAUSES, TINT, causeFg, causeTitle, FACTS, FILMS } from './causes'
import { PIECES, icon } from './data'
import NotFound from '../pages/NotFound'
import './v2.css'
import Flow from './Flow'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'

export default function CauseV2() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const i = CAUSES.findIndex((x) => x.slug === slug)
  const raw = CAUSES[Math.max(i, 0)]
  usePageTitle(`${causeTitle(raw.name)} | Perfect World`)
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()
  const c = { ...raw, icoA: icon(raw.id, 'a'), icoB: icon(raw.id, 'b'), title: causeTitle(raw.name), placeUpper: raw.place.toUpperCase(), partnerLower: raw.partner.toLowerCase(), fg: causeFg(raw), tint: TINT[raw.id], hasPrint: !!raw.print, noPrint: !raw.print }
  const n = CAUSES[(Math.max(i, 0) + 1) % CAUSES.length]
  const next = { name: n.name, bg: n.bg, fg: causeFg(n) }
  const goNext = () => navigate(`/project/${n.slug}`)
  const fact = FACTS[raw.id]
  const film = FILMS[raw.id]
  const pieces = ([['TOTE', PIECES.tote], ['T-SHIRT', PIECES.shirt], ['OVERSIZED', PIECES.oversized], ['HOODIE', PIECES.hoodie]] as const).map(([label, p]) => ({ label, give: p.give }))
  const switcher = CAUSES.map((x) => {
    const on = x.id === raw.id
    return { short: x.short, selected: on, border: on ? '#0b0b0c' : '#cfccc5', bg: on ? '#0b0b0c' : 'transparent', fg: on ? '#ffffff' : '#0b0b0c', pick: () => navigate(`/project/${x.slug}`) }
  })

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  if (i < 0) return <NotFound />

  return (
    <>

<div className="pw2 pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />

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

  <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "18px clamp(16px, 4vw, 56px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
    <nav aria-label="Breadcrumb" style={{ fontSize: "14px", color: "#5c5c5c" }}><A href="/projects" style={{ color: "#5c5c5c" }}>Causes</A> <span aria-hidden="true">/</span> <span style={{ color: "#0b0b0c", fontWeight: "600" }}>{c.title}</span></nav>
    <div role="group" aria-label="Mockup only: preview another cause page" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
      <span className="pw-mono" style={{ fontSize: "11px", color: "#8a877f", marginRight: "4px" }}>[MOCKUP] SAME TEMPLATE FOR:</span>
      {switcher.map((sw, swI) => (<Fragment key={swI}>
        <button type="button" onClick={sw.pick} aria-pressed={sw.selected} style={{ fontFamily: "inherit", fontSize: "13px", fontWeight: "600", padding: "0 12px", minHeight: "36px", borderRadius: "999px", cursor: "pointer", border: `1.5px solid ${sw.border}`, background: sw.bg, color: sw.fg }}>{sw.short}</button>
      </Fragment>))}
    </div>
  </div>

  <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px)" }}>
    <div style={{ position: "relative", overflow: "hidden", minHeight: "560px", borderRadius: "36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "48px 24px", boxSizing: "border-box", background: c.bg, color: c.fg }}>
      <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
      <span style={{ position: "relative", width: "128px", height: "128px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src={c.logo} alt={`${c.partner} logo`} style={{ maxWidth: "96px", maxHeight: "80px", objectFit: "contain" }} /></span>
      <h1 className="pw-hand" style={{ position: "relative", margin: "22px 0 0", fontSize: "clamp(60px, 8vw, 120px)", lineHeight: ".92" }}>{c.name}</h1>
      <p className="pw-hand" style={{ position: "relative", margin: "12px 0 0", fontSize: "clamp(22px, 2.2vw, 28px)" }}>{c.line}</p>
      <p style={{ position: "relative", margin: "16px 0 0", fontSize: "12px", fontWeight: "600", letterSpacing: ".16em" }}>{c.partnerUpper} · {c.placeUpper} · IN COLLABORATION WITH PERFECT WORLD</p>
    </div>
  </section>

  <section className="pw-iso" aria-label="At a glance" style={{ position: "relative", zIndex: "78", maxWidth: "1320px", margin: "0 auto", padding: "28px clamp(16px, 4vw, 56px) 0" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "#d9d6cf", border: "1px solid #d9d6cf", borderRadius: "22px", overflow: "hidden" }}>
      <div style={{ background: "#ffffff", padding: "22px 24px" }}><p className="pw-mono" style={{ margin: "0", fontSize: "11px", color: "#5c5c5c" }}>PARTNER</p><p className="pw-fat" style={{ margin: "6px 0 0", fontSize: "22px" }}>{c.partner}</p></div>
      <div style={{ background: "#ffffff", padding: "22px 24px" }}><p className="pw-mono" style={{ margin: "0", fontSize: "11px", color: "#5c5c5c" }}>WHERE</p><p className="pw-fat" style={{ margin: "6px 0 0", fontSize: "22px" }}>{c.place}</p></div>
      <div style={{ background: "#ffffff", padding: "22px 24px" }}><p className="pw-mono" style={{ margin: "0", fontSize: "11px", color: "#5c5c5c" }}>A SHIRT GIVES</p><p className="pw-fat" style={{ margin: "6px 0 0", fontSize: "22px", color: "#c0322a" }}>€11.11</p></div>
      {fact && (<div style={{ background: "#ffffff", padding: "22px 24px" }}><p className="pw-mono" style={{ margin: "0", fontSize: "11px", color: "#5c5c5c" }}>ONE REAL FACT</p><p className="pw-mono" style={{ margin: "8px 0 0", fontSize: "13px", color: "#8a877f" }}>{fact}</p></div>)}
    </div>
  </section>

  {film && (
  <section className="pw-iso" aria-label="The film" style={{ position: "relative", zIndex: "77", maxWidth: "1320px", margin: "0 auto", padding: "clamp(56px, 7vw, 96px) clamp(16px, 4vw, 56px) 0" }}>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "12px", marginBottom: "20px" }}>
      <h2 className="pw-fat" style={{ margin: "0", fontSize: "clamp(34px, 4vw, 56px)", lineHeight: ".95" }}>Watch the film</h2>
      <p  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", margin: "0", fontSize: "22px", color: "#c0322a" }}>filmed with {c.partnerLower}</p>
    </div>
    <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "32px", overflow: "hidden", background: "#0b0b0c" }}>
      <img src={c.still} alt={`Still from the ${c.name} film`} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} />
      <span style={{ position: "absolute", inset: "0", background: "linear-gradient(0deg, rgba(0,0,0,.45), rgba(0,0,0,0) 50%)" }}></span>
      <A href={film} aria-label={`Play the ${c.name} film`} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "104px", height: "104px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,.94)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="32" height="32" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5 L12 7 L3 12.5 Z" fill="#0b0b0c"></path></svg></A>
      <p className="pw-hand" style={{ position: "absolute", left: "clamp(20px, 3vw, 40px)", bottom: "clamp(16px, 2.6vw, 32px)", margin: "0", fontSize: "clamp(26px, 3vw, 40px)", color: "#ffffff" }}>{c.name}</p>
    </div>
  </section>
  )}

  <section className="pw-iso" aria-label="The story" style={{ position: "relative", zIndex: "76", maxWidth: "1320px", margin: "0 auto", padding: "clamp(56px, 7vw, 96px) clamp(16px, 4vw, 56px)", display: "flex", flexWrap: "wrap", gap: "clamp(32px, 5vw, 72px)", alignItems: "flex-start" }}>
    <img className="pw-ico" src={c.icoA} alt="" aria-hidden="true" style={{ left: "0.5%", top: "190px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src={c.icoB} alt="" aria-hidden="true" style={{ right: "2.5%", top: "45%", width: "84px", transform: "rotate(10deg)" }} />
    <div style={{ flex: "1 1 600px", minWidth: "0", display: "flex", flexDirection: "column", gap: "clamp(36px, 4vw, 52px)" }}>
      {c.blocks.map((bl, blI) => (<Fragment key={blI}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 32px" }}>
          <h2 className="pw-hand" style={{ flex: "0 0 200px", margin: "0", fontSize: "26px", lineHeight: "1.1", color: "#c0322a" }}>{bl.title}</h2>
          <div style={{ flex: "1 1 360px", minWidth: "0" }}>
            {bl.paras.map((p, pI) => (<Fragment key={pI}>
              <p style={{ margin: "0 0 14px", fontSize: "18px", lineHeight: "1.7", color: "#2a2a2a", maxWidth: "64ch" }}>{p}</p>
            </Fragment>))}
          </div>
        </div>
      </Fragment>))}
    </div>

    <aside aria-label="Support this cause" style={{ flex: "0 1 380px", minWidth: "0", position: "sticky", top: "16px" }}>
      <div style={{ filter: "drop-shadow(0 22px 30px rgba(0,0,0,.12))" }}>
        <div className="pw-mono" style={{ background: "#ffffff", padding: "26px 26px 20px", fontSize: "14px" }}>
          <div style={{ textAlign: "center", borderBottom: "1px dashed #bdbab3", paddingBottom: "14px" }}>
            <div  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", fontSize: "22px" }}>SUPPORT {c.name}</div>
            <div style={{ fontSize: "11px", color: "#5c5c5c", marginTop: "4px" }}>EVERY {c.name} DESIGN GIVES</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: "12px", padding: "16px 0", borderBottom: "1px dashed #bdbab3" }}>
            {pieces.map((pc, pcI) => (<Fragment key={pcI}>
              <span>{pc.label}</span><span style={{ textAlign: "right", color: "#c0322a", fontWeight: "600" }}>€{pc.give}</span>
            </Fragment>))}
          </div>
          <div style={{ paddingTop: "14px", fontSize: "12px", color: "#3a3a3a", lineHeight: "1.6" }}>GOES TO {c.partnerUpper}.<br />THE SAME AMOUNT, EVERY ORDER.</div>
          <A href="/shop" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "18px", minHeight: "50px", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", textDecoration: "none", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: "600" }}>Shop for {c.title}</A>
        </div>
        <div className="pw-tear" aria-hidden="true"></div>
      </div>
    </aside>
  </section>

  <section className="pw-iso" aria-label="Wear the design" style={{ position: "relative", zIndex: "75", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) clamp(56px, 7vw, 96px)" }}>
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-180px" }}><path d="M-60 200 C 260 320, 520 60, 760 160 C 880 210, 860 330, 790 310 C 720 290, 780 150, 980 130 C 1180 110, 1300 260, 1500 200" stroke="#b07e52" strokeWidth="7"></path></svg>
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(28px, 4vw, 56px)", background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "32px", padding: "clamp(24px, 3vw, 44px)" }}>
      <div style={{ flex: "0 1 380px", aspectRatio: "1 / 1", borderRadius: "24px", background: c.tint, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {c.hasPrint && (<><img src={c.print} alt={`${c.name} back print`} style={{ width: "82%", height: "82%", objectFit: "contain", filter: "drop-shadow(0 16px 18px rgba(0,0,0,.16))" }} /></>)}
        {c.noPrint && (<><span className="pw-mono" style={{ fontSize: "12px", color: "#5c5c5c" }}>[{c.name} BACK PRINT]</span></>)}
      </div>
      <div style={{ flex: "1 1 380px" }}>
        <p className="pw-hand" style={{ margin: "0", fontSize: "24px", color: "#c0322a" }}>wear the design</p>
        <h2 className="pw-fat" style={{ margin: "8px 0 0", fontSize: "clamp(36px, 4.4vw, 60px)", lineHeight: ".92" }}>The {c.title} collection</h2>
        <p style={{ margin: "16px 0 0", fontSize: "17px", lineHeight: "1.6", color: "#3a3a3a", maxWidth: "480px" }}>Designed for this project, so its amount always goes to {c.partner}. Prefer something quieter? Its Minimal piece gives to {c.partner} too.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "24px" }}>
          <A href="/shop" style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 22px", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", textDecoration: "none", fontSize: "15px", fontWeight: "600" }}>Shop the {c.title} design</A>
          <A href="/shop" style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 22px", borderRadius: "999px", border: "1.5px solid #0b0b0c", color: "#0b0b0c", textDecoration: "none", fontSize: "15px", fontWeight: "600" }}>See the Minimal Collection</A>
        </div>
      </div>
    </div>
  </section>

  <section className="pw-iso" aria-label="Next cause" style={{ position: "relative", zIndex: "74", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) 88px" }}>
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-80px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#5DADE2" strokeWidth="7"></path></svg>
    <button type="button" onClick={goNext} className="pw-card" style={{ width: "100%", position: "relative", overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "34px clamp(24px, 3vw, 44px)", border: "none", borderRadius: "28px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", background: next.bg, color: next.fg }}>
      <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
      <span style={{ position: "relative" }}><span className="pw-mono" style={{ display: "block", fontSize: "12px" }}>NEXT CAUSE</span><span className="pw-hand" style={{ display: "block", marginTop: "6px", fontSize: "clamp(36px, 4vw, 56px)", lineHeight: "1" }}>{next.name}</span></span>
      <span className="pw-go" style={{ position: "relative", fontSize: "15px", fontWeight: "600", padding: "13px 22px", borderRadius: "999px", background: "#ffffff", color: "#0b0b0c" }}>Explore →</span>
    </button>
  </section>

  <footer className="pw-dark pw-iso" style={{ position: "relative", zIndex: "73", overflow: "hidden", padding: "clamp(60px, 6vw, 96px) clamp(16px, 4vw, 56px) 44px", textAlign: "center" }}>
    <img className="pw-ico" src={c.icoA} alt="" aria-hidden="true" style={{ right: "3%", top: "30px", width: "90px", transform: "rotate(-6deg)" }} /><img className="pw-ico pw-m-hide" src={c.icoB} alt="" aria-hidden="true" style={{ left: "92%", top: "530px", width: "96px", transform: "rotate(9deg)" }} />
    <svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "40px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#5DADE2" strokeWidth="7"></path></svg>
    
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
