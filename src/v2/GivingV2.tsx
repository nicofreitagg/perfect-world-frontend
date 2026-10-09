import { useEffect } from 'react'
import './v2.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import Sustain from './Sustain'
import { FAQ } from './faq'
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
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

<div className="pw2 pw-giving pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />

  <div className="pw-stars pw-blend-b" style={{ color: "#ffffff" }}>
  <Header dark active="/how-giving-works" cartCount={cartCount} openCart={openCart} />
    <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1100px", margin: "0 auto", padding: "clamp(40px, 6vw, 90px) clamp(16px, 4vw, 56px) clamp(70px, 8vw, 110px)" }}>
      <p style={{ margin: "0", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", fontSize: "14px", letterSpacing: ".14em", color: "#ff6b5f" }}>{tr("HOW GIVING WORKS")}</p>
      <h1 style={{ margin: "18px 0 0", fontWeight: "800", fontSize: "clamp(48px, 7vw, 104px)", lineHeight: ".92", letterSpacing: "-0.02em" }} className="pw-fat">{tr("Every piece gives")}<br />{tr("a fixed amount.")}</h1>
      <p style={{ margin: "24px 0 0", fontSize: "21px", lineHeight: "1.55", color: "#dcdcdc", maxWidth: "640px" }}>{tr("A clear amount for every piece. Shown right next to the price, the same on every order, and it goes straight to the partner your design was made with.")}</p>
      <div style={{ marginTop: "48px", maxWidth: "760px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "24px", paddingBottom: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".1em", color: "rgba(255,255,255,.5)" }}><span>{tr("PIECE")}</span><span>{tr("PRICE")}</span><span style={{ minWidth: "110px", textAlign: "right" }}>{tr("GIVES")}</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "24px", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.16)", fontSize: "20px", alignItems: "baseline" }}><span style={{ fontWeight: "600" }}>{tr("Tote bag")}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,.6)" }}>€27.77</span><span style={{ fontWeight: "800", fontSize: "28px", color: "#ff6b5f", minWidth: "110px", textAlign: "right" }} className="pw-fat">€7.77</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "24px", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.16)", fontSize: "20px", alignItems: "baseline" }}><span style={{ fontWeight: "600" }}>{tr("T-shirt")}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,.6)" }}>€33.33</span><span style={{ fontWeight: "800", fontSize: "28px", color: "#ff6b5f", minWidth: "110px", textAlign: "right" }} className="pw-fat">€11.11</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "24px", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.16)", fontSize: "20px", alignItems: "baseline" }}><span style={{ fontWeight: "600" }}>{tr("Oversized shirt")}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,.6)" }}>€55.55</span><span style={{ fontWeight: "800", fontSize: "28px", color: "#ff6b5f", minWidth: "110px", textAlign: "right" }} className="pw-fat">€22.22</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "24px", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.16)", fontSize: "20px", alignItems: "baseline" }}><span style={{ fontWeight: "600" }}>{tr("Hoodie")}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,.6)" }}>€77.77</span><span style={{ fontWeight: "800", fontSize: "28px", color: "#ff6b5f", minWidth: "110px", textAlign: "right" }} className="pw-fat">€33.33</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "24px", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.16)", fontSize: "20px", alignItems: "baseline" }}><span style={{ fontWeight: "600" }}>{tr("Bomber jacket")}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,.6)" }}>€111.11</span><span style={{ fontWeight: "800", fontSize: "28px", color: "#ff6b5f", minWidth: "110px", textAlign: "right" }} className="pw-fat">€44.44</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "24px", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.16)", fontSize: "20px", alignItems: "baseline" }}><span style={{ fontWeight: "600" }}>{tr("Beanie")}<span style={{ display: "block", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,.55)" }}>{tr("SHARED BY ALL SIX PARTNERS")}</span></span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,.6)" }}>€33.33</span><span style={{ fontWeight: "800", fontSize: "28px", color: "#ff6b5f", minWidth: "110px", textAlign: "right" }} className="pw-fat">€7.77</span></div></div>
    </section>
  </div>

  <section className="pw-iso" aria-label={tr("Where it goes")} style={{ position: "relative", zIndex: "78", maxWidth: "1240px", margin: "0 auto", padding: "clamp(70px, 8vw, 110px) clamp(16px, 4vw, 56px) 0" }}>
    <h2 style={{ margin: "0", fontWeight: "800", fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: ".95" }} className="pw-fat">{tr("Where it goes")}</h2>
    <div style={{ marginTop: "34px", background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "28px", padding: "clamp(28px, 4vw, 48px)" }}>
      <p style={{ margin: "0", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", letterSpacing: ".1em", color: "#c0322a" }}>{tr("OG AND MINIMAL")}</p>
      <h3 style={{ margin: "12px 0 0", fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: "1.05" }} className="pw-fat">{tr("The partner it was made with")}</h3>
      <p style={{ margin: "16px 0 0", fontSize: "clamp(18px, 1.6vw, 21px)", lineHeight: "1.6", color: "#2a2a2a", maxWidth: "820px" }}>{tr("Every design, OG or Minimal, is made with one of our six partners, and its amount always goes to them. Buy the Wild at Heart print, and it goes to Elephants for Africa. Pick a quiet Minimal piece, and it goes to the partner it was made with. Always.")}</p>
    </div>
    <div style={{ marginTop: "26px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}><div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "16px", height: "86px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}><img src="/v2/img/logo-care-in-action.png" alt="" style={{ maxHeight: "58px", maxWidth: "100%", objectFit: "contain" }} /></div><div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "16px", height: "86px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}><img src="/v2/img/logo-mission-positivity.png" alt="" style={{ maxHeight: "58px", maxWidth: "100%", objectFit: "contain" }} /></div><div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "16px", height: "86px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}><img src="/v2/img/logo-mhi.png" alt="" style={{ maxHeight: "58px", maxWidth: "100%", objectFit: "contain" }} /></div><div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "16px", height: "86px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}><img src="/v2/img/logo-secore.png" alt="" style={{ maxHeight: "58px", maxWidth: "100%", objectFit: "contain" }} /></div><div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "16px", height: "86px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}><img src="/v2/img/logo-pftp.png" alt="" style={{ maxHeight: "58px", maxWidth: "100%", objectFit: "contain" }} /></div><div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "16px", height: "86px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}><img src="/v2/img/logo-efa.png" alt="" style={{ maxHeight: "58px", maxWidth: "100%", objectFit: "contain" }} /></div></div>
  </section>

  <section className="pw-iso" id="payouts" aria-label={tr("When it is paid and how you can check")} style={{ position: "relative", zIndex: "77", maxWidth: "1240px", margin: "0 auto", padding: "clamp(70px, 8vw, 110px) clamp(16px, 4vw, 56px) 0" }}>
    <h2 style={{ margin: "0", fontWeight: "800", fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: ".95" }} className="pw-fat">{tr("When it's paid")}</h2>
    <div style={{ marginTop: "34px", background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "24px", padding: "30px", maxWidth: "820px" }}>
      <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.6", color: "#2a2a2a" }}>{tr("We add up the fixed amounts from every order and transfer them to each partner directly. Ask us any time how much has gone to a cause, and we'll tell you.")}</p>
      <p style={{ margin: "14px 0 0", fontSize: "18px", lineHeight: "1.6", color: "#2a2a2a" }}>{tr("As Perfect World grows and orders come in more regularly, we'll publish the totals per partner here.")}</p>
    </div>
  </section>

  <section className="pw-iso" aria-label={tr("Why we changed")} style={{ position: "relative", zIndex: "76", maxWidth: "1100px", margin: "0 auto", padding: "clamp(70px, 8vw, 110px) clamp(16px, 4vw, 56px) 0" }}>
    <div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "32px", padding: "clamp(28px, 4vw, 56px)", display: "flex", flexWrap: "wrap", gap: "36px", alignItems: "center" }}>
      <div style={{ flex: "0 1 260px" }}><p style={{ margin: "0", fontWeight: "800", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: ".95" }} className="pw-fat">{tr("From profits to a fixed amount")}</p></div>
      <div style={{ flex: "1 1 420px", fontSize: "18px", lineHeight: "1.6", color: "#2a2a2a", display: "flex", flexDirection: "column", gap: "14px" }}>
        <p style={{ margin: "0" }}>{tr("From day one, 100% of profits was the mission behind Perfect World: proof that buying and business can exist to help, not to take.")}</p>
        <p style={{ margin: "0" }}>{isLaunched() ? tr("Since 11.11, that mission has a number: every piece gives a fixed amount, shown next to the price and passed on to the partner. It's our next step in transparency.") : tr("From 11.11, that mission gets a number: every piece gives a fixed amount, shown next to the price and passed on to the partner. It's our next step in transparency.")}</p>
        <p style={{ margin: "0", fontWeight: "700", color: "#0b0b0c" }}>{tr("Same belief: we are stronger together. Now you can count it.")}</p>
      </div>
    </div>
  </section>

  <section className="pw-iso" id="faq" aria-label={tr("Questions")} style={{ position: "relative", zIndex: "75", maxWidth: "1100px", margin: "0 auto", padding: "clamp(70px, 8vw, 110px) clamp(16px, 4vw, 56px) clamp(80px, 9vw, 120px)" }}>
    <h2 style={{ margin: "0 0 20px", fontWeight: "800", fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: ".95" }} className="pw-fat">{tr("Questions")}</h2>
    {FAQ.map((f) => (
      <details key={f.q} style={{ borderTop: "1px solid #dcd9d2", padding: "20px 0" }}><summary style={{ cursor: "pointer", fontWeight: "700", fontSize: "19px" }}>{tr(f.q)}</summary><p style={{ margin: "12px 0 0", fontSize: "17px", lineHeight: "1.6", color: "#2a2a2a", maxWidth: "720px" }}>{tr(f.a)}</p></details>
    ))}
  </section>

  <Sustain />
  <Footer icons={["/v2/icons/ic-931f8328.svg", "/v2/icons/ic-13b34769.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
