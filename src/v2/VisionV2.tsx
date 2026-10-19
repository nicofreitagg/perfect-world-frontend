import { useEffect, useRef, useState } from 'react'
import './v2.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'
import { useT } from './t'

export default function VisionV2() {
  const tr = useT()
  usePageTitle('Our story')
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  useEffect(() => {
    document.body.style.background = '#13110f'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

<div className="pw2 pw-grain pw-darkpage" style={{ '--pw-ground': '#13110f', fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#f2ebdf" } as React.CSSProperties}>
  <Flow />

  <div className="pw-lightband" style={{ color: "#f2ebdf" }}>
  <Header dark active="/about" cartCount={cartCount} openCart={openCart} />

    <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1240px", margin: "0 auto", padding: "clamp(32px, 5vw, 72px) clamp(16px, 4vw, 56px) clamp(40px, 7vw, 100px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "48px" }}>
      <div className="pw-m-founder" style={{ flex: "0 1 380px", margin: "0 auto", position: "relative" }}>
        <img src="/v2/img/vision.webp" alt={tr("Nico, founder of Perfect World, smiling")} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "50%", display: "block", boxShadow: "0 0 0 10px rgba(242,235,223,.08), 0 30px 60px rgba(0,0,0,.18)", objectPosition: "50% 0.0386%" }} />
        <span style={{ position: "absolute", right: "-6px", bottom: "22px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "20px", background: "#f2ebdf", color: "#14110e", padding: "6px 14px", borderRadius: "999px", transform: "rotate(-5deg)" }}>{tr("FOUNDER")}</span>
      </div>
      <div style={{ flex: "1 1 480px" }}>
        <p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "clamp(32px, 6vw, 84px)", lineHeight: "1" }} className="pw-hand">{tr("HI, I'M NICO.")}</p>
        <h1 style={{ margin: "16px 0 0", fontWeight: "800", fontSize: "clamp(22px, 3.6vw, 52px)", lineHeight: "1.04", letterSpacing: "-0.02em" }} className="pw-fat">{tr("From pain to purpose.")}</h1>
        <p style={{ margin: "18px 0 0", fontSize: "18px", lineHeight: "1.55", color: "#cfc4b2", maxWidth: "560px" }}>{tr("Perfect World started long before the brand ever existed. I spent nine months in a hospital, long enough to realize that my pain wasn't unique. Everyone around me was carrying something.")}</p>
      </div>
    </section>
  </div>

  <section className="pw-iso" aria-label={tr("Founder video")} style={{ position: "relative", zIndex: "78", padding: "0 clamp(12px, 2.5vw, 32px)" }}>
    <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", aspectRatio: "16 / 9", borderRadius: "clamp(24px, 3vw, 40px)", overflow: "hidden", background: "#2a2a2e", boxShadow: "0 30px 60px rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <FounderVideo label={tr("A message from Nico")} playLabel={tr("Play the video")} />
    </div>
  </section>

  <section className="pw-iso" aria-label={tr("The story")} style={{ position: "relative", zIndex: "77", maxWidth: "900px", margin: "0 auto", padding: "clamp(40px, 8vw, 110px) clamp(16px, 4vw, 56px) 24px", display: "flex", flexDirection: "column", gap: "28px", fontSize: "19px", lineHeight: "1.65", color: "#d9cfbf" }}>
    <p style={{ margin: "0" }}>{tr("And yet, even in all that heaviness, I saw something else: people helping each other. People caring. People trying. It changed me.")}</p>
    <p style={{ margin: "0" }}>{tr("I had always lived a privileged life. South Africa, Germany, California, Spain. I saw beautiful places, met incredible people, and learned what opportunity feels like. But I also learned what responsibility feels like.")}</p>
    <blockquote style={{ margin: "12px 0", padding: "0 0 0 0", textAlign: "center", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "clamp(20px, 3.4vw, 44px)", lineHeight: "1.2", color: "#f2ebdf" }} className="pw-hand">{tr("PRIVILEGE WITHOUT ACTION IS JUST")} <span style={{ color: "#c0322a" }}>{tr("COMFORT.")}</span></blockquote>
    <p style={{ margin: "0" }}>{tr("During that time in the hospital, I realized something simple but important: my pain isn't special. But what I do with it can be. I wanted to give back. I wanted to create something that didn't just exist, but helped.")}</p>
    <p style={{ margin: "0" }}>{tr("I didn't have the perfect business plan. I didn't know anything about fashion. I didn't have an investor. I just had one belief:")}</p>
    <blockquote style={{ margin: "12px 0", textAlign: "center", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "clamp(20px, 3.4vw, 44px)", lineHeight: "1.2", color: "#f2ebdf" }} className="pw-hand">{tr("MONEY SHOULD HELP PEOPLE,")} <span style={{ color: "#c0322a" }}>{tr("NOT HURT THEM.")}</span></blockquote>
  </section>

  <section className="pw-iso" aria-label={tr("Why we do it")} style={{ position: "relative", zIndex: "76", maxWidth: "1100px", margin: "24px auto 0", padding: "0 clamp(16px, 4vw, 56px)" }}>
    <div style={{ background: "#f3ebdd", color: "#1c1813", border: "1px solid #e2d6c1", borderRadius: "32px", padding: "clamp(28px, 4vw, 56px)", display: "flex", flexWrap: "wrap", gap: "36px", alignItems: "center" }}>
      <div style={{ flex: "0 1 260px", textAlign: "center" }}>
        <p style={{ margin: "0", fontWeight: "800", fontSize: "clamp(38px, 5vw, 64px)", letterSpacing: "-0.02em", lineHeight: "0.95", color: "#c0322a" }} className="pw-fat">{tr("Help, not take.")}</p>
        <p style={{ margin: "8px 0 0", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "20px" }}>{tr("WHY WE DO IT")}</p>
      </div>
      <div style={{ flex: "1 1 420px", fontSize: "18px", lineHeight: "1.6", color: "#3a3128", display: "flex", flexDirection: "column", gap: "14px" }}>
        <p style={{ margin: "0" }}>{tr("From day one, Perfect World was my way of showing that buying and business can exist to help, not to take.")}</p>
        <p style={{ margin: "0", fontWeight: "600", color: "#1c1813" }}>{tr("Because I believe we are stronger together. Change happens and hope grows when we join forces.")}</p>
        <p style={{ margin: "0", fontWeight: 700 }}>Together. Not Alone. 😉</p>
      </div>
    </div>
  </section>

  <section className="pw-iso" aria-label={tr("Sign-off")} style={{ position: "relative", zIndex: "73", maxWidth: "820px", margin: "0 auto", padding: "clamp(40px, 8vw, 110px) clamp(16px, 4vw, 56px)", textAlign: "center" }}>
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-170px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#b07e52" strokeWidth="7"></path></svg>
    <p style={{ margin: "0", fontSize: "20px", lineHeight: "1.6", color: "#d9cfbf" }}>{tr("I built this movement because I've received more love in my life than I ever deserved. This is my way of giving some of it back.")}</p>
    <p style={{ margin: "22px 0 0", fontWeight: "800", fontSize: "clamp(19px, 3vw, 38px)", letterSpacing: "-0.02em", lineHeight: "1.15" }} className="pw-fat">{tr("Perfect World isn't mine anymore. It's ours.")}</p>
    <p style={{ margin: "22px 0 0", fontSize: "18px", color: "#cfc4b2" }}>{tr("Thanks for being here. Truly.")}</p>
    <p style={{ margin: "14px 0 0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "44px", transform: "rotate(-4deg)" }} className="pw-hand">{tr("NICO")}</p>
    <A href="/shop" style={{ display: "inline-block", marginTop: "30px", background: "#f2ebdf", color: "#14110e", textDecoration: "none", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "20px", padding: "14px 30px", borderRadius: "999px" }}>{tr("SHOP HOPE")}</A>
  </section>
  <Footer icons={["/v2/icons/ic-931f8328.svg", "/v2/icons/ic-13b34769.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}

// The browser's own controls dim the paused video, so it starts as the bright
// poster with our own play button and only shows controls once it plays.
function FounderVideo({ label, playLabel }: { label: string; playLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const play = () => { setPlaying(true); ref.current?.play().catch(() => {}) }
  return (
    <>
      <video ref={ref} src="/v2/video/founder.mp4" poster="/v2/img/founder-poster.jpg" controls={playing} playsInline preload="metadata" aria-label={label} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", background: "#0b0b0c" }} />
      {!playing && (
        <button type="button" onClick={play} aria-label={playLabel} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", padding: 0, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: "clamp(64px, 8vw, 92px)", height: "clamp(64px, 8vw, 92px)", borderRadius: "50%", background: "#ffffff", boxShadow: "0 12px 30px rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="30%" height="30%" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.5 L12 7 L3.5 12.5 Z" fill="#e2453c" /></svg>
          </span>
        </button>
      )}
    </>
  )
}
