import { useEffect } from 'react'
import './v2.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'

export default function VisionV2() {
  usePageTitle('Our story')
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

<div className="pw2 pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />

  <div className="pw-stars" style={{ color: "#ffffff" }}>
  <Header active="/about" cartCount={cartCount} openCart={openCart} />

    <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1240px", margin: "0 auto", padding: "clamp(32px, 5vw, 72px) clamp(16px, 4vw, 56px) clamp(56px, 7vw, 100px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "48px" }}>
    <img className="pw-ico" src="/v2/icons/ic-df3d515b.svg" alt="" aria-hidden="true" style={{ right: "3%", top: "30px", width: "90px", transform: "rotate(-6deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-745e6390.svg" alt="" aria-hidden="true" style={{ left: "95%", top: "390px", width: "96px", transform: "rotate(9deg)" }} />
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-40px" }}><path d="M1500 90 C 1250 30, 1120 180, 1010 150 C 930 128, 950 50, 1015 70 C 1100 98, 1000 270, 860 330 C 760 375, 740 560, 980 610 S 1320 580, 1500 650" stroke="#FF8C42" strokeWidth="7"></path></svg>
      <div style={{ flex: "0 1 380px", margin: "0 auto", position: "relative" }}>
        <img src="/v2/img/vision.webp" alt="Nico, founder of Perfect World, smiling" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "50%", display: "block", boxShadow: "0 0 0 10px rgba(255,255,255,.06), 0 30px 60px rgba(0,0,0,.4)", objectPosition: "50% 0.0386%" }} />
        <span style={{ position: "absolute", right: "-6px", bottom: "22px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "20px", background: "#ffffff", color: "#0b0b0c", padding: "6px 14px", borderRadius: "999px", transform: "rotate(-5deg)" }}>FOUNDER</span>
      </div>
      <div style={{ flex: "1 1 480px" }}>
        <p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "clamp(44px, 6vw, 84px)", lineHeight: "1" }} className="pw-hand">HI, I'M NICO.</p>
        <h1 style={{ margin: "16px 0 0", fontWeight: "800", fontSize: "clamp(30px, 3.6vw, 52px)", lineHeight: "1.04", letterSpacing: "-0.02em" }} className="pw-fat">From pain to purpose.</h1>
        <p style={{ margin: "18px 0 0", fontSize: "18px", lineHeight: "1.55", color: "#dcdcdc", maxWidth: "560px" }}>Perfect World started long before the brand ever existed. I spent nine months in a hospital, long enough to realize that my pain wasn't unique. Everyone around me was carrying something.</p>
      </div>
    </section>
  </div>

  <section className="pw-iso" aria-label="Founder video" style={{ position: "relative", zIndex: "78", background: "linear-gradient(180deg, #0b0b0c 0 50%, #f5f4f1 50% 100%)", padding: "0 clamp(12px, 2.5vw, 32px)" }}>
    <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", aspectRatio: "16 / 9", borderRadius: "clamp(24px, 3vw, 40px)", overflow: "hidden", background: "#2a2a2e", boxShadow: "0 30px 60px rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <video src="/v2/video/founder.mp4" poster="/v2/img/founder-poster.jpg" controls playsInline preload="none" aria-label="A message from Nico" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", background: "#0b0b0c" }} />
    </div>
  </section>

  <section className="pw-iso" aria-label="The story" style={{ position: "relative", zIndex: "77", maxWidth: "900px", margin: "0 auto", padding: "clamp(64px, 8vw, 110px) clamp(16px, 4vw, 56px) 24px", display: "flex", flexDirection: "column", gap: "28px", fontSize: "19px", lineHeight: "1.65", color: "#2a2a2a" }}>
    <p style={{ margin: "0" }}>And yet, even in all that heaviness, I saw something else: people helping each other. People caring. People trying. It changed me.</p>
    <p style={{ margin: "0" }}>I had always lived a privileged life. South Africa, Germany, California, Spain. I saw beautiful places, met incredible people, and learned what opportunity feels like. But I also learned what responsibility feels like.</p>
    <blockquote style={{ margin: "12px 0", padding: "0 0 0 0", textAlign: "center", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: "1.2", color: "#0b0b0c" }} className="pw-hand">PRIVILEGE WITHOUT ACTION IS JUST <span style={{ color: "#c0322a" }}>COMFORT.</span></blockquote>
    <p style={{ margin: "0" }}>During that time in the hospital, I realized something simple, but important: my pain isn't special. But what I do with it can be. I wanted to give back. I wanted to create something that didn't just exist, but helped.</p>
    <p style={{ margin: "0" }}>I didn't have the perfect business plan. I didn't know anything about fashion. I didn't have an investor. I just had one belief:</p>
    <blockquote style={{ margin: "12px 0", textAlign: "center", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: "1.2", color: "#0b0b0c" }} className="pw-hand">MONEY SHOULD HELP PEOPLE, <span style={{ color: "#c0322a" }}>NOT HURT THEM.</span></blockquote>
  </section>

  <section className="pw-iso" aria-label="Why 11.11" style={{ position: "relative", zIndex: "76", maxWidth: "1100px", margin: "24px auto 0", padding: "0 clamp(16px, 4vw, 56px)" }}>
    <div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "32px", padding: "clamp(28px, 4vw, 56px)", display: "flex", flexWrap: "wrap", gap: "36px", alignItems: "center" }}>
      <div style={{ flex: "0 1 260px", textAlign: "center" }}>
        <p style={{ margin: "0", fontWeight: "800", fontSize: "clamp(64px, 8vw, 110px)", letterSpacing: "-0.04em", lineHeight: "0.9", color: "#c0322a" }} className="pw-fat">11.11</p>
        <p style={{ margin: "8px 0 0", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "20px" }}>WHY WE CHANGED</p>
      </div>
      <div style={{ flex: "1 1 420px", fontSize: "18px", lineHeight: "1.6", color: "#2a2a2a", display: "flex", flexDirection: "column", gap: "14px" }}>
        <p style={{ margin: "0" }}>From day one, 100% of profits was the mission behind Perfect World. It was my way of showing that buying and business can exist to help, not to take.</p>
        <p style={{ margin: "0" }}>100% sounded great. But it was abstract, and many of you weren't sure what it actually meant. So from 11.11, every piece gives a fixed amount, shown right next to the price, and the design you pick decides which partner gets it. It's our next step in transparency, and the step that turns a promise into impact you can count.</p>
        <p style={{ margin: "0", fontWeight: "600", color: "#0b0b0c" }}>Because I believe we are stronger together. Change happens and hope grows when we put our efforts together.</p>
        <p style={{ margin: "0", fontWeight: 700 }}>Together. Not Alone. 😉</p>
      </div>
    </div>
  </section>

  <section className="pw-iso" aria-label="Our vision" style={{ position: "relative", zIndex: "75", maxWidth: "1240px", margin: "0 auto", padding: "clamp(64px, 8vw, 110px) clamp(16px, 4vw, 56px) 24px" }}>
    <img className="pw-ico" src="/v2/icons/ic-a60f6b2e.svg" alt="" aria-hidden="true" style={{ left: "95%", top: "50px", width: "90px", transform: "rotate(-6deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-91ae13b8.svg" alt="" aria-hidden="true" style={{ left: "0.5%", top: "70px", width: "96px", transform: "rotate(9deg)" }} />
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-20px" }}><path d="M-60 260 C 160 120, 330 330, 470 250 C 560 200, 520 120, 465 150 C 400 185, 470 330, 640 300 C 820 268, 900 120, 1060 170 C 1160 200, 1150 300, 1080 290 C 1010 280, 1080 140, 1240 130 C 1350 124, 1420 170, 1500 150" stroke="#4cc37f" strokeWidth="7"></path></svg>
    <p style={{ margin: "0", textAlign: "center", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "26px", color: "#c0322a" }} className="pw-hand">our vision</p>
    <h2 style={{ margin: "8px 0 0", textAlign: "center", fontWeight: "800", fontSize: "clamp(34px, 4.4vw, 62px)", letterSpacing: "-0.02em", lineHeight: "1" }} className="pw-fat">We can do better. Together.</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px", marginTop: "40px" }}>
      <div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "24px", padding: "28px" }}><p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "30px" }} className="pw-hand">HUMAN.</p><p style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3a3a3a" }}>Perfect World isn't about clothes. It's about the people wearing them, and the people on the ground doing the work.</p></div>
      <div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "24px", padding: "28px" }}><p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "30px" }} className="pw-hand">HONEST.</p><p style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3a3a3a" }}>A fixed amount on every price. No fine print about what "profit" means.</p></div>
      <div style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "24px", padding: "28px" }}><p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "30px" }} className="pw-hand">CONNECTED.</p><p style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3a3a3a" }}>A way to stand for something, even if you don't always know where to begin. You choose the cause.</p></div>
    </div>
  </section>

  <section className="pw-iso" aria-label="The team" style={{ position: "relative", zIndex: "74", maxWidth: "1240px", margin: "0 auto", padding: "clamp(56px, 7vw, 96px) clamp(16px, 4vw, 56px) 24px" }}>
    <img className="pw-ico" src="/v2/icons/ic-f40a9d4d.svg" alt="" aria-hidden="true" style={{ left: "71%", top: "30px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-1e094dbe.svg" alt="" aria-hidden="true" style={{ left: "95%", top: "30px", width: "84px", transform: "rotate(10deg)" }} />
    
    
    <p style={{ margin: "36px 0 14px", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "42px" }} className="pw-hand">OUR PARTNERS ON THE GROUND</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
      <A href="/project/one-world" style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "18px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/v2/img/logo-care-in-action.png" alt="Care in Action" style={{ maxWidth: "70%", maxHeight: "54px", objectFit: "contain" }} /></A>
      <A href="/project/rich-in-life" style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "18px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/v2/img/logo-mission-positivity.png" alt="Mission Positivity" style={{ maxWidth: "70%", maxHeight: "64px", objectFit: "contain" }} /></A>
      <A href="/project/talk-about-it" style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "18px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/v2/img/logo-mhi.png" alt="Mental Health Initiative" style={{ maxWidth: "70%", maxHeight: "64px", objectFit: "contain" }} /></A>
      <A href="/project/endangered-oceans" style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "18px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/v2/img/logo-secore.png" alt="SECORE International" style={{ maxWidth: "70%", maxHeight: "54px", objectFit: "contain" }} /></A>
      <A href="/project/cool-down" style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "18px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/v2/img/logo-pftp.png" alt="Plant-for-the-Planet" style={{ maxWidth: "70%", maxHeight: "64px", objectFit: "contain" }} /></A>
      <A href="/project/wild-at-heart" style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "18px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/v2/img/logo-efa.png" alt="Elephants for Africa" style={{ maxWidth: "70%", maxHeight: "44px", objectFit: "contain" }} /></A>
    </div>
  </section>

  <section className="pw-iso" aria-label="Sign-off" style={{ position: "relative", zIndex: "73", maxWidth: "820px", margin: "0 auto", padding: "clamp(64px, 8vw, 110px) clamp(16px, 4vw, 56px)", textAlign: "center" }}>
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-170px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#b07e52" strokeWidth="7"></path></svg>
    <p style={{ margin: "0", fontSize: "20px", lineHeight: "1.6", color: "#2a2a2a" }}>I built this movement because I've received more love in my life than I ever deserved. This is my way of giving some of it back.</p>
    <p style={{ margin: "22px 0 0", fontWeight: "800", fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.02em", lineHeight: "1.15" }} className="pw-fat">Perfect World isn't mine anymore. It's ours.</p>
    <p style={{ margin: "22px 0 0", fontSize: "18px", color: "#3a3a3a" }}>Thanks for being here. Truly.</p>
    <p style={{ margin: "14px 0 0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "44px", transform: "rotate(-4deg)" }} className="pw-hand">NICO</p>
    <A href="/shop" style={{ display: "inline-block", marginTop: "30px", background: "#0b0b0c", color: "#ffffff", textDecoration: "none", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "20px", padding: "14px 30px", borderRadius: "999px" }}>SHOP HOPE</A>
  </section>
  <Footer icons={["/v2/icons/ic-931f8328.svg", "/v2/icons/ic-13b34769.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
