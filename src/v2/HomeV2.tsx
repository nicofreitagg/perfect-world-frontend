import { useEffect, useState } from 'react'
import './v2.css'
import { A } from './A'
import { CollectionCarousel, CollectionTabs } from './Collections'
import { WishTags } from './WishTags'
import { useCart } from '../contexts/CartContext'
import CartDrawer from '../components/Cart/CartDrawer'
import { usePageTitle } from '../hooks/usePageTitle'

// Set to the film's file URL once it exists; the film section stays hidden until then.
const FILM_URL: string = ''

export default function HomeV2() {
  usePageTitle()
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()
  const [tab, setTab] = useState<'minimal' | 'og'>('minimal')
  const colKicker = tab === 'og' ? 'Six stories, worn on your back.' : 'Quiet pieces. New this November.'
  const colTitle = tab === 'og' ? 'The OG Collections' : 'The Minimal Collection'

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>


<div className="pw2 pw-page pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>

  <header style={{ position: "relative", zIndex: "2", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "22px clamp(16px, 4vw, 56px)" }}>
    <A href="#top" aria-label="Perfect World, home" style={{ display: "block", lineHeight: "0" }}><img src="/v2/img/logo-black.png" alt="Perfect World" style={{ height: "40px", width: "auto" }} /></A>
    <nav aria-label="Main" style={{ display: "flex", flexWrap: "wrap", gap: "26px", fontSize: "14px", fontWeight: "600" }}>
      <A href="/shop" style={{ color: "#0b0b0c", textDecoration: "none" }}>Shop</A>
      <A href="/projects" style={{ color: "#0b0b0c", textDecoration: "none" }}>Causes</A>
      <A href="/how-giving-works" style={{ color: "#0b0b0c", textDecoration: "none" }}>How giving works</A>
      <A href="/about" style={{ color: "#0b0b0c", textDecoration: "none" }}>Our story</A>
    </nav>
    <button type="button" onClick={openCart} style={{ color: "#0b0b0c", fontSize: 14, fontWeight: 600, padding: "12px 18px", border: "1px solid rgba(11,11,12,.3)", borderRadius: 999, background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>Cart ({cartCount})</button>
  </header>

  <section id="top" className="pw-iso" style={{ position: "relative", zIndex: "79", display: "flex", flexWrap: "wrap-reverse", alignItems: "center", justifyContent: "space-between", gap: "40px", padding: "clamp(40px, 5vw, 80px) clamp(16px, 4vw, 56px) clamp(90px, 8vw, 130px)", maxWidth: "1400px", margin: "0 auto" }}>
    <svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "auto", bottom: "-70px" }}><path d="M-60 560 C 220 470, 420 640, 700 560 S 1180 470, 1500 540" stroke="#FF8C42" strokeWidth="5"></path><path d="M-60 573 C 220 483, 420 653, 700 573 S 1180 483, 1500 553" stroke="#5DADE2" strokeWidth="5"></path><path d="M-60 586 C 220 496, 420 666, 700 586 S 1180 496, 1500 566" stroke="#4cc37f" strokeWidth="5"></path><path d="M-60 599 C 220 509, 420 679, 700 599 S 1180 509, 1500 579" stroke="#b07e52" strokeWidth="5"></path><path d="M-60 612 C 220 522, 420 692, 700 612 S 1180 522, 1500 592" stroke="#8e8f94" strokeWidth="5"></path><path d="M-60 625 C 220 535, 420 705, 700 625 S 1180 535, 1500 605" stroke="#2f6fa8" strokeWidth="5"></path></svg>
    <div style={{ flex: "1 1 560px", minWidth: "0" }}>
      <p style={{ margin: "0", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", fontSize: "clamp(15px, 1.3vw, 19px)", letterSpacing: ".12em", color: "#c0322a" }}>MAKE A WISH · FROM 11.11 · SIX CAUSES · ONE HOPE</p>
      <h1 style={{ margin: "26px 0 0", fontFamily: "'Hand', cursive", fontWeight: "400", fontSize: "clamp(40px, 4.2vw, 62px)", lineHeight: "1", letterSpacing: ".01em" }} className="pw-hand">Wear the world you<br /><span style={{ position: "relative", display: "inline-block", margin: ".1em .2em .06em .06em", WebkitTextStroke: "0", fontWeight: "800", fontSize: "clamp(150px, 15.2vw, 220px)", lineHeight: ".82", letterSpacing: "-0.02em" }} className="pw-fat pw-hope">HOPE<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", left: "-8%", top: "-18%", width: "116%", height: "136%", overflow: "visible", transform: "rotate(-2deg)" }}><path className="pw-draw" d="M200 6 C 322 6, 394 48, 394 100 C 394 152, 322 194, 200 194 C 78 194, 6 152, 6 100 C 6 48, 78 6, 200 6 Z" stroke="#e2453c" strokeWidth="5" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke"></path></svg></span>for.</h1>
      <p style={{ margin: "30px 0 0", maxWidth: "480px", fontSize: "20px", lineHeight: "1.5" }}>Clothing that gives. Every piece is made with one of six cause partners and gives it a <b>fixed amount</b>, from €7.77 for a tote to €33.33 for a hoodie. You see the amount next to the price.</p>
      <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <A href="/shop" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "17px", color: "#ffffff", background: "#0b0b0c", textDecoration: "none", padding: "12px 30px", borderRadius: "999px" }}>SHOP IMPACT</A>
        <A href="/how-giving-works" style={{ display: "flex", alignItems: "center", color: "#0b0b0c", textDecoration: "none", fontWeight: "600", fontSize: "15px", padding: "12px 22px", border: "1.5px solid rgba(11,11,12,.4)", borderRadius: "999px", background: "#f5f4f1" }}>How giving works</A>
      </div>
    </div>
    <div className="pw-globewrap" style={{ position: "relative", width: "560px", height: "500px", flex: "0 0 auto", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="pw-globe" role="img" aria-label="Spinning globe with the six causes marked"></div>
      <span className="pw-pin" style={{ top: "56px", left: "30px" }}>UKRAINE<span className="pw-line"></span><span className="pw-dot"></span></span>
      <span className="pw-pin" style={{ top: "160px", left: "0" }}>MUNICH<span className="pw-line"></span><span className="pw-dot"></span></span>
      <span className="pw-pin" style={{ top: "310px", left: "10px" }}>BOTSWANA<span className="pw-line"></span><span className="pw-dot"></span></span>
      <span className="pw-pin" style={{ top: "80px", right: "6px" }}><span className="pw-dot"></span><span className="pw-line"></span>CARIBBEAN</span>
      <span className="pw-pin" style={{ top: "230px", right: "-22px" }}><span className="pw-dot"></span><span className="pw-line"></span>COLOMBIA</span>
      <span className="pw-pin" style={{ top: "380px", right: "20px" }}><span className="pw-dot"></span><span className="pw-line"></span>TUTZING</span>
    
      <div className="pw-herophoto" style={{ position: "absolute", left: "-150px", bottom: "-150px", width: "210px", zIndex: "3", transform: "rotate(-3deg)" }}><img src="/v2/img/hero-friends.jpg" alt="Four friends wearing Perfect World hoodies and tees" style={{ display: "block", width: "100%", aspectRatio: "5 / 4", objectFit: "cover", borderRadius: "18px", border: "5px solid #ffffff", boxShadow: "0 18px 36px rgba(0,0,0,.2)" }} /><div style={{ marginTop: "-14px", marginLeft: "40px", display: "inline-flex", alignItems: "center", gap: "10px", background: "#ffffff", borderRadius: "14px", padding: "10px 14px", boxShadow: "0 12px 26px rgba(0,0,0,.14)" }}><span style={{ fontWeight: "800", fontSize: "24px", lineHeight: "1", color: "#c0322a" }} className="pw-fat">€33.33</span><span style={{ fontSize: "12px", lineHeight: "1.3", fontWeight: "600", whiteSpace: "nowrap" }}>from every hoodie<br />to its partner</span></div></div>
    </div>
  </section>

  <section id="giving" className="pw-dark pw-iso" aria-label="Every piece gives a fixed amount" style={{ position: "relative", zIndex: "78", padding: "clamp(80px, 9vw, 130px) clamp(16px, 4vw, 56px) clamp(60px, 6vw, 90px)", textAlign: "center" }}>
    <img className="pw-ico" src="/v2/icons/ic-c7d1f8ac.svg" alt="" aria-hidden="true" style={{ left: "2%", top: "60px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-beae2a27.svg" alt="" aria-hidden="true" style={{ right: "2.5%", top: "45%", width: "84px", transform: "rotate(10deg)" }} />
    <svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-150px" }}><path d="M-60 300 C 300 90, 420 530, 700 420 C 870 355, 830 210, 745 245 C 640 290, 760 530, 1010 480 C 1210 440, 1300 190, 1500 260" stroke="#4cc37f" strokeWidth="7"></path></svg>
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <p style={{ margin: "0", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", letterSpacing: ".12em", color: "rgba(255,255,255,.6)" }}>11.11.2026 · 11:11 AM</p>
      <p aria-label="11:11" style={{ margin: "14px 0 0", fontWeight: "800", fontSize: "clamp(84px, 10vw, 150px)", lineHeight: ".82", color: "#ffffff" }} className="pw-fat">11<span className="pw-twinkle" style={{ color: "#e2453c" }}>:</span>11</p>
      <h2 style={{ margin: "30px 0 0", fontWeight: "800", fontSize: "clamp(40px, 5vw, 72px)", lineHeight: ".95", color: "#ffffff" }} className="pw-fat">Every piece gives a fixed amount.</h2><p style={{ margin: "20px auto 0", maxWidth: "640px", fontSize: "20px", lineHeight: "1.55", color: "rgba(255,255,255,.85)" }}>Not a share of profit you can never check. A set amount per piece, printed next to the price, the same on every order. Since 11.11.</p>
      <div style={{ marginTop: "48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", textAlign: "left" }}><div className="pw-glass" style={{ padding: "0 22px 20px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0", overflow: "visible", paddingTop: "20px" }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", color: "rgba(255,255,255,.55)" }}>TOTE BAG · €27.77</span><span style={{ position: "relative", alignSelf: "flex-start", fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", color: "#ffffff" }}>€7.77</span><span style={{ fontSize: "14px", color: "rgba(255,255,255,.7)" }}>to its cause partner</span></div><div className="pw-glass" style={{ padding: "0 22px 20px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0", overflow: "visible", paddingTop: "20px" }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", color: "rgba(255,255,255,.55)" }}>T-SHIRT · €33.33</span><span style={{ position: "relative", alignSelf: "flex-start", fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", color: "#e2453c" }}>€11.11<svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", left: "-12px", top: "-8px", width: "148px", height: "58px", overflow: "visible" }}><path className="pw-draw" d="M150 12 C 110 2, 30 6, 12 34 C -2 58, 60 74, 120 70 C 170 66, 196 46, 182 24 C 172 10, 140 6, 118 8" stroke="#e2453c" strokeWidth="2.5" fill="none" strokeLinecap="round"></path></svg></span><span style={{ fontSize: "14px", color: "rgba(255,255,255,.7)" }}>to its cause partner</span></div><div className="pw-glass" style={{ padding: "0 22px 20px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0", overflow: "visible", paddingTop: "20px" }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", color: "rgba(255,255,255,.55)" }}>OVERSIZED · €55.55</span><span style={{ position: "relative", alignSelf: "flex-start", fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", color: "#ffffff" }}>€22.22</span><span style={{ fontSize: "14px", color: "rgba(255,255,255,.7)" }}>to its cause partner</span></div><div className="pw-glass" style={{ padding: "0 22px 20px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0", overflow: "visible", paddingTop: "20px" }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", color: "rgba(255,255,255,.55)" }}>HOODIE · €77.77</span><span style={{ position: "relative", alignSelf: "flex-start", fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", color: "#ffffff" }}>€33.33</span><span style={{ fontSize: "14px", color: "rgba(255,255,255,.7)" }}>to its cause partner</span></div></div>
      <A href="/shop" style={{ display: "inline-block", marginTop: "30px", fontWeight: "600", fontSize: "16px", color: "#ffffff", textDecoration: "none", borderBottom: "1.5px solid #e2453c", paddingBottom: "3px" }}>Shop every piece →</A> <A href="/how-giving-works" style={{ display: "inline-block", margin: "30px 0 0 22px", fontWeight: "600", fontSize: "16px", color: "#ffffff", textDecoration: "none", borderBottom: "1.5px solid rgba(255,255,255,.5)", paddingBottom: "3px" }}>How giving works →</A>
    </div>
  </section>

  {FILM_URL && (
<section id="film" aria-label="The 11.11 film" className="pw-dark" style={{ position: "relative", zIndex: "77", padding: "0 clamp(12px, 2.5vw, 32px) clamp(70px, 7vw, 110px)" }}>
    <div style={{ position: "relative", maxWidth: "1600px", margin: "0 auto", borderRadius: "clamp(28px, 3vw, 40px)", overflow: "hidden", minHeight: "580px", boxShadow: "none", border: "1px solid rgba(255,255,255,.12)", background: "#151517" }}>
      <img src="/v2/img/film-still.jpg" alt="Still from the Perfect World film" className="pw-still" style={{ position: "absolute", inset: "0", filter: "grayscale(1) contrast(1.08)" }} />
      <div style={{ position: "absolute", inset: "0", background: "linear-gradient(0deg, rgba(11,11,12,.9) 0%, rgba(11,11,12,0) 55%)" }}></div>
      
      <button type="button" aria-label="Play film with sound" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "92px", height: "92px", borderRadius: "50%", border: "2px solid #ffffff", background: "rgba(255,255,255,.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="28" height="28" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5 L12 7 L3 12.5 Z" fill="#ffffff"></path></svg>
      </button>
      <div style={{ position: "absolute", left: "clamp(20px, 4vw, 56px)", bottom: "clamp(20px, 4vw, 48px)", right: "20px" }}>
        <p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "clamp(30px, 3.8vw, 56px)", lineHeight: "1.1", color: "#ffffff" }} className="pw-hand">Don't just hope. <span style={{ color: "#e2453c" }}>Wear it.</span></p>
        <p style={{ margin: "10px 0 0", fontSize: "16px", color: "#dcdcdc", maxWidth: "560px" }}>Hope is something we make together. Sixty seconds on how it begins.</p>
      </div>
    </div>
  </section>
)}

  <section id="collections" className="pw-iso" style={{ position: "relative", zIndex: "76", color: "#0b0b0c", padding: "clamp(64px, 8vw, 120px) 0 clamp(48px, 6vw, 80px)" }}>
    <img className="pw-ico" src="/v2/icons/ic-a60f6b2e.svg" alt="" aria-hidden="true" style={{ right: "2.5%", top: "70px", width: "84px", transform: "rotate(8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-91ae13b8.svg" alt="" aria-hidden="true" style={{ left: "2.5%", bottom: "60px", width: "104px", transform: "rotate(-6deg)" }} /><svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "10px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#b07e52" strokeWidth="7"></path></svg>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px)" }}>
      <p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "26px", color: "#c0322a", textAlign: "center" }} className="pw-hand">{colKicker}</p>
      <h2 style={{ margin: "6px 0 0", fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.02em", fontWeight: "800", textAlign: "center" }} className="pw-fat">{colTitle}</h2>
      <CollectionTabs tab={tab} onPick={setTab} />
    </div>
    <CollectionCarousel tab={tab} />
  </section>

  <section className="pw-iso" id="causes" aria-label="The causes" style={{ position: "relative", zIndex: "75", color: "#0b0b0c", padding: "clamp(24px, 4vw, 56px) 0 clamp(40px, 5vw, 64px)" }}>
    <img className="pw-ico" src="/v2/icons/ic-f40a9d4d.svg" alt="" aria-hidden="true" style={{ left: "92%", top: "10px", width: "104px", transform: "rotate(6deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-1e094dbe.svg" alt="" aria-hidden="true" style={{ left: "74%", top: "170px", width: "90px", transform: "rotate(-10deg)" }} />
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "clamp(40px, 5vw, 72px) clamp(16px, 4vw, 56px) 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" }}>
      <div>
        <p style={{ margin: "0", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "26px", color: "#c0322a" }} className="pw-hand">Six places. One hope.</p>
        <h2 style={{ margin: "6px 0 0", fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.02em", fontWeight: "800" }} className="pw-fat">The people doing the work.</h2>
        <p style={{ margin: "12px 0 0", maxWidth: "560px", fontSize: "17px", lineHeight: "1.5", color: "#3a3a3a" }}>Far from here and right next door, people are already making the wishes come true. Every collection was made with one of them.</p>
      </div>
      <A href="/projects" style={{ color: "#0b0b0c", fontWeight: "600", fontSize: "15px" }}>All six causes →</A>
    </div>
    <div className="pw-reel" style={{ overflowX: "auto", marginTop: "28px", padding: "6px 0 24px" }}>
      <div style={{ display: "flex", gap: "22px", padding: "0 clamp(16px, 4vw, 56px)", width: "max-content" }}>
        <A href="/project/one-world" className="pw-banner" style={{ flex: "0 0 auto", width: "min(560px, 86vw)", minHeight: "360px", borderRadius: "28px", textDecoration: "none", color: "#0b0b0c", background: "radial-gradient(ellipse at 22% 30%, #bfe0f5 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #2b86c4 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, #ffffff 0%, transparent 45%), #5DADE2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 32px", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.14)" }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", width: "92px", height: "92px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src="/v2/img/logo-care-in-action.png" alt="Care in Action logo" style={{ maxWidth: "70px", maxHeight: "60px", objectFit: "contain" }} /></span>
          <span style={{ position: "relative", marginTop: "18px", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "38px", lineHeight: "1.05" }} className="pw-hand">ONE WORLD</span>
          <span style={{ position: "relative", marginTop: "8px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "19px" }}>HOPE FOR CHILDREN FACING THE REALITIES OF WAR.</span>
          <span style={{ position: "relative", marginTop: "14px", fontSize: "11px", fontWeight: "600", letterSpacing: ".16em" }}>CARE IN ACTION · IN COLLABORATION WITH PERFECT WORLD</span>
          <span style={{ position: "relative", marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <span style={{ background: "#0b0b0c", color: "#ffffff", fontSize: "14px", fontWeight: "600", padding: "11px 18px", borderRadius: "999px" }}>Learn about the project →</span>
          </span>
        </A>
        <A href="/project/rich-in-life" className="pw-banner" style={{ flex: "0 0 auto", width: "min(560px, 86vw)", minHeight: "360px", borderRadius: "28px", textDecoration: "none", color: "#0b0b0c", background: "radial-gradient(ellipse at 22% 30%, #f0dcc4 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #b07e52 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, #ffffff 0%, transparent 45%), #D4A373", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 32px", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.14)" }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", width: "92px", height: "92px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src="/v2/img/logo-mission-positivity.png" alt="Mission Positivity logo" style={{ maxWidth: "70px", maxHeight: "60px", objectFit: "contain" }} /></span>
          <span style={{ position: "relative", marginTop: "18px", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "38px", lineHeight: "1.05" }} className="pw-hand">RICH IN LIFE</span>
          <span style={{ position: "relative", marginTop: "8px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "19px" }}>RETHINKING WHAT WEALTH TRULY MEANS.</span>
          <span style={{ position: "relative", marginTop: "14px", fontSize: "11px", fontWeight: "600", letterSpacing: ".16em" }}>MISSION POSITIVITY · IN COLLABORATION WITH PERFECT WORLD</span>
          <span style={{ position: "relative", marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <span style={{ background: "#0b0b0c", color: "#ffffff", fontSize: "14px", fontWeight: "600", padding: "11px 18px", borderRadius: "999px" }}>Learn about the project →</span>
          </span>
        </A>
        <A href="/project/talk-about-it" className="pw-banner" style={{ flex: "0 0 auto", width: "min(560px, 86vw)", minHeight: "360px", borderRadius: "28px", textDecoration: "none", color: "#0b0b0c", background: "radial-gradient(ellipse at 22% 30%, #ffd2b0 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #e06a1d 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, #ffffff 0%, transparent 45%), #FF8C42", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 32px", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.14)" }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", width: "92px", height: "92px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src="/v2/img/logo-mhi.png" alt="Mental Health Initiative logo" style={{ maxWidth: "70px", maxHeight: "60px", objectFit: "contain" }} /></span>
          <span style={{ position: "relative", marginTop: "18px", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "38px", lineHeight: "1.05" }} className="pw-hand">TALK ABOUT IT</span>
          <span style={{ position: "relative", marginTop: "8px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "19px" }}>BREAKING THE SILENCE ON MENTAL HEALTH.</span>
          <span style={{ position: "relative", marginTop: "14px", fontSize: "11px", fontWeight: "600", letterSpacing: ".16em" }}>MENTAL HEALTH INITIATIVE · IN COLLABORATION WITH PERFECT WORLD</span>
          <span style={{ position: "relative", marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <span style={{ background: "#0b0b0c", color: "#ffffff", fontSize: "14px", fontWeight: "600", padding: "11px 18px", borderRadius: "999px" }}>Learn about the project →</span>
          </span>
        </A>
        <A href="/project/endangered-oceans" className="pw-banner" style={{ flex: "0 0 auto", width: "min(560px, 86vw)", minHeight: "360px", borderRadius: "28px", textDecoration: "none", color: "#0b0b0c", background: "radial-gradient(ellipse at 22% 30%, #9cc4e6 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #002147 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, #ffffff 0%, transparent 45%), #2f6fa8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 32px", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.14)" }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", width: "92px", height: "92px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src="/v2/img/logo-secore.png" alt="SECORE International logo" style={{ maxWidth: "70px", maxHeight: "60px", objectFit: "contain" }} /></span>
          <span style={{ position: "relative", marginTop: "18px", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "38px", lineHeight: "1.05" }} className="pw-hand">ENDANGERED OCEANS</span>
          <span style={{ position: "relative", marginTop: "8px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "19px" }}>SAVING OUR OCEANS, ONE CORAL AT A TIME.</span>
          <span style={{ position: "relative", marginTop: "14px", fontSize: "11px", fontWeight: "600", letterSpacing: ".16em" }}>SECORE INTERNATIONAL · IN COLLABORATION WITH PERFECT WORLD</span>
          <span style={{ position: "relative", marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <span style={{ background: "#0b0b0c", color: "#ffffff", fontSize: "14px", fontWeight: "600", padding: "11px 18px", borderRadius: "999px" }}>Learn about the project →</span>
          </span>
        </A>
        <A href="/project/cool-down" className="pw-banner" style={{ flex: "0 0 auto", width: "min(560px, 86vw)", minHeight: "360px", borderRadius: "28px", textDecoration: "none", color: "#0b0b0c", background: "radial-gradient(ellipse at 22% 30%, #bfe8cd 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #1e8a4a 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, #ffffff 0%, transparent 45%), #4cc37f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 32px", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.14)" }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", width: "92px", height: "92px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src="/v2/img/logo-pftp.png" alt="Plant-for-the-Planet logo" style={{ maxWidth: "70px", maxHeight: "60px", objectFit: "contain" }} /></span>
          <span style={{ position: "relative", marginTop: "18px", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "38px", lineHeight: "1.05" }} className="pw-hand">COOL DOWN</span>
          <span style={{ position: "relative", marginTop: "8px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "19px" }}>FIGHTING FOR CLIMATE JUSTICE, ONE TREE AT A TIME.</span>
          <span style={{ position: "relative", marginTop: "14px", fontSize: "11px", fontWeight: "600", letterSpacing: ".16em" }}>PLANT-FOR-THE-PLANET · IN COLLABORATION WITH PERFECT WORLD</span>
          <span style={{ position: "relative", marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <span style={{ background: "#0b0b0c", color: "#ffffff", fontSize: "14px", fontWeight: "600", padding: "11px 18px", borderRadius: "999px" }}>Learn about the project →</span>
          </span>
        </A>
        <A href="/project/wild-at-heart" className="pw-banner" style={{ flex: "0 0 auto", width: "min(560px, 86vw)", minHeight: "360px", borderRadius: "28px", textDecoration: "none", color: "#0b0b0c", background: "radial-gradient(ellipse at 22% 30%, #e3dccd 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #6D5F4D 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, #ffffff 0%, transparent 45%), #a8997f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 32px", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.14)" }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
          <span style={{ position: "relative", width: "92px", height: "92px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}><img src="/v2/img/logo-efa.png" alt="Elephants for Africa logo" style={{ maxWidth: "70px", maxHeight: "60px", objectFit: "contain" }} /></span>
          <span style={{ position: "relative", marginTop: "18px", fontFamily: "'Hand', cursive", letterSpacing: ".01em", fontSize: "38px", lineHeight: "1.05" }} className="pw-hand">WILD AT HEART</span>
          <span style={{ position: "relative", marginTop: "8px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "19px" }}>TOGETHER FOR GIANTS. TOGETHER FOR HOPE.</span>
          <span style={{ position: "relative", marginTop: "14px", fontSize: "11px", fontWeight: "600", letterSpacing: ".16em" }}>ELEPHANTS FOR AFRICA · IN COLLABORATION WITH PERFECT WORLD</span>
          <span style={{ position: "relative", marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <span style={{ background: "#0b0b0c", color: "#ffffff", fontSize: "14px", fontWeight: "600", padding: "11px 18px", borderRadius: "999px" }}>Learn about the project →</span>
          </span>
        </A>
      </div>
    </div>
    
  </section>

  <section id="wishes" className="pw-iso" aria-label="Doing good has never been easier" style={{ position: "relative", zIndex: "74", padding: "clamp(70px, 8vw, 120px) clamp(16px, 4vw, 56px) clamp(80px, 8vw, 120px)" }}>
    <img className="pw-ico" src="/v2/icons/ic-df3d515b.svg" alt="" aria-hidden="true" style={{ left: "92%", top: "250px", width: "90px", transform: "rotate(-6deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-745e6390.svg" alt="" aria-hidden="true" style={{ left: "92%", top: "2070px", width: "96px", transform: "rotate(9deg)" }} />
    <svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "900px" }}><path d="M-60 260 C 160 120, 330 330, 470 250 C 560 200, 520 120, 465 150 C 400 185, 470 330, 640 300 C 820 268, 900 120, 1060 170 C 1160 200, 1150 300, 1080 290 C 1010 280, 1080 140, 1240 130 C 1350 124, 1420 170, 1500 150" stroke="#2f6fa8" strokeWidth="7"></path></svg>
    <svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "1700px" }}><path d="M-60 200 C 260 320, 520 60, 760 160 C 880 210, 860 330, 790 310 C 720 290, 780 150, 980 130 C 1180 110, 1300 260, 1500 200" stroke="#8e8f94" strokeWidth="6"></path></svg>
    <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: "0", fontWeight: "800", fontSize: "72px", lineHeight: ".92", textWrap: "balance", width: "1240px", height: "155px" }} className="pw-fat">Doing good has never been <br /><span style={{ fontFamily: "Hand, cursive", fontWeight: "400", color: "rgb(192, 50, 42)" }} className="pw-hand">easier.</span></h2>
        <p style={{ margin: "18px auto 0", maxWidth: "600px", fontSize: "18px", lineHeight: "1.5", color: "#3a3a3a" }}>Every design is made with one partner. Pick the one you love. Your wish lands with the people doing the work.</p><div style={{ margin: "44px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", maxWidth: "1100px" }}><img src="/v2/img/photo-park-tees.jpg" alt="Three friends in a park wearing Perfect World tees" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: "22px" }} /><img src="/v2/img/photo-og-back.jpg" alt="An OG back print, worn" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: "22px" }} /><img src="/v2/img/photo-hoodies-forest.jpg" alt="Friends in Perfect World hoodies in the forest" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: "22px" }} /><img src="/v2/img/photo-two-friends.jpg" alt="Two friends in Perfect World tees" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: "22px" }} /></div>
      </div>
      <div style={{ margin: "50px -56px 0", transform: "rotate(-.6deg)" }}><svg viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "16px", overflow: "visible" }}><path className="pw-draw" d="M0 11.2 Q56 14.1 111 13.3 Q167 16.9 222 15.9 Q278 9.9 333 11.6 Q389 6.6 444 8.0 Q500 12.3 556 11.1 Q611 13.4 667 12.8 Q722 13.7 778 13.4 Q833 9.9 889 10.9 Q944 5.5 1000 7.1" stroke="#e2453c" strokeWidth="2.5" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke"></path></svg></div>
      <div style={{ marginTop: "62px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "90px 34px", alignItems: "start" }}>
        <WishTags />
      </div>
      <p style={{ margin: "70px 0 0", textAlign: "center", fontSize: "15px", color: "#3a3a3a" }}>Every piece is made to order, with care. Allow 1.5 to 2 weeks, so wish early.</p>
      
    </div>
  </section>

  <section id="loud" className="pw-iso" aria-label="OG or Minimal" style={{ position: "relative", zIndex: "73", padding: "clamp(80px, 8vw, 120px) clamp(16px, 4vw, 56px) clamp(70px, 7vw, 110px)" }}>
    <img className="pw-ico" src="/v2/icons/ic-931f8328.svg" alt="" aria-hidden="true" style={{ left: "2%", top: "930px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-13b34769.svg" alt="" aria-hidden="true" style={{ left: "75.5%", top: "930px", width: "84px", transform: "rotate(10deg)" }} />
    <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "0", borderRadius: "28px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.16)" }}>
      <A href="/shop" style={{ position: "relative", isolation: "isolate", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "680px", padding: "38px", background: "#0b0b0c", color: "#ffffff", textDecoration: "none", overflow: "hidden" }}>
        <svg viewBox="0 0 620 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: "-1" }}><g fill="none" strokeLinecap="round" strokeWidth="7"><path d="M-30 120 C 120 40, 220 220, 330 150 C 410 100, 380 30, 330 60 C 270 95, 380 260, 650 190" stroke="#FF8C42"></path><path d="M-30 300 C 140 380, 260 200, 380 280 C 450 330, 420 410, 370 390 C 310 365, 420 250, 650 330" stroke="#5DADE2"></path><path d="M-30 470 C 90 420, 180 560, 300 500 C 380 460, 350 390, 300 420 C 240 455, 360 600, 650 520" stroke="#4cc37f"></path><path d="M-30 610 C 160 560, 330 690, 650 600" stroke="#b07e52"></path></g></svg>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", fontSize: "13px", letterSpacing: ".1em" }}>SIX CAUSES · SIX BACK PRINTS</span>
        <img src="/v2/img/og-talk.webp" alt="Talk About It T-shirt, back print" style={{ position: "absolute", right: "-70px", top: "50px", width: "62%", transform: "rotate(8deg)", filter: "drop-shadow(0 30px 30px rgba(0,0,0,.5))" }} />
        <img src="/v2/img/og-rich.png" alt="Rich in Life T-shirt, back print" style={{ position: "absolute", right: "120px", top: "160px", width: "52%", transform: "rotate(-6deg)", filter: "drop-shadow(0 30px 30px rgba(0,0,0,.5))" }} />
        <span style={{ position: "relative" }}><span style={{ display: "block", fontWeight: "800", fontSize: "clamp(120px, 13vw, 200px)", lineHeight: ".8", letterSpacing: "-0.02em" }} className="pw-fat">OG.</span><span style={{ display: "block", marginTop: "14px", fontSize: "20px", fontWeight: "600", maxWidth: "330px" }}>A story on your back, for anyone who asks.</span><span style={{ display: "inline-block", marginTop: "20px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "17px", background: "#ffffff", color: "#0b0b0c", padding: "10px 26px", borderRadius: "999px" }}>SHOP THE OG</span></span>
      </A>
      <A href="/shop" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "680px", padding: "38px", background: "#ffffff", color: "#0b0b0c", textDecoration: "none", overflow: "hidden" }}>
        <span style={{ fontFamily: "'Hand', cursive", fontSize: "clamp(34px, 3.2vw, 46px)", lineHeight: "1", letterSpacing: ".01em", color: "#c0322a", textAlign: "right" }} className="pw-hand">New this November.</span>
        <svg width="230" height="220" viewBox="0 0 240 230" aria-label="Minimal black T-shirt" style={{ alignSelf: "center", filter: "drop-shadow(0 18px 18px rgba(0,0,0,.14))" }}><path d="M60 20 L95 8 Q120 26 145 8 L180 20 L218 62 L190 86 L176 72 L176 214 L64 214 L64 72 L50 86 L22 62 Z" fill="#1b1b1d"></path><circle cx="138" cy="70" r="5" fill="#e2453c"></circle></svg>
        <span style={{ textAlign: "right" }}><span style={{ display: "block", fontFamily: "'Hand', cursive", fontSize: "clamp(96px, 10vw, 150px)", lineHeight: ".85", letterSpacing: ".005em" }} className="pw-hand">Minimal.</span><span style={{ display: "block", margin: "14px 0 0 auto", fontSize: "20px", fontWeight: "600", maxWidth: "340px" }}>A small detail. Nobody has to know. You do.</span><span style={{ display: "inline-block", marginTop: "20px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "17px", background: "#0b0b0c", color: "#ffffff", padding: "10px 26px", borderRadius: "999px" }}>SHOP THE MINIMAL</span></span>
      </A>
    </div>
    <p style={{ margin: "40px 0 0", textAlign: "center", fontFamily: "'Hand', cursive", fontSize: "clamp(34px, 3.6vw, 52px)", letterSpacing: ".01em" }} className="pw-hand">It gives either way.</p>
  </section>

  <footer className="pw-dark pw-iso" style={{ position: "relative", zIndex: "72", overflow: "hidden", padding: "clamp(40px, 5vw, 80px) clamp(16px, 4vw, 56px) 48px", textAlign: "center" }}>
    <img className="pw-ico" src="/v2/icons/ic-de6f599f.svg" alt="" aria-hidden="true" style={{ right: "2.5%", top: "70px", width: "84px", transform: "rotate(8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-9eab075d.svg" alt="" aria-hidden="true" style={{ left: "92%", top: "570px", width: "104px", transform: "rotate(-6deg)" }} />
    <svg className="pw-swirl" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-100px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#5DADE2" strokeWidth="7"></path></svg>
    
    <img src="/v2/img/logo-white.png" alt="Perfect World" style={{ height: "52px", width: "auto" }} />
    <p style={{ margin: "18px 0 0", fontWeight: "800", fontSize: "clamp(64px, 8vw, 120px)", lineHeight: ".9" }} className="pw-fat">Together.</p>
    <p style={{ margin: "4px 0 0", fontFamily: "'Hand', cursive", fontSize: "clamp(54px, 6.6vw, 100px)", lineHeight: "1", letterSpacing: ".01em" }} className="pw-hand">Not Alone.</p>
    <A href="/shop" style={{ display: "inline-block", marginTop: "34px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "17px", color: "#0b0b0c", background: "#f5f4f1", textDecoration: "none", padding: "12px 30px", borderRadius: "999px" }}>SHOP IMPACT</A>
    {/* Email sign-up form returns once the email tool is decided */}
    <p style={{ margin: "18px 0 0", fontSize: "14px", color: "rgba(255,255,255,.6)" }}>Or comment HOPE on any post at @perfectworld.global, and we'll find you.</p>
    <nav aria-label="Footer" style={{ margin: "64px auto 0", maxWidth: "1100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "28px", textAlign: "left", paddingTop: "36px", borderTop: "1px solid rgba(255,255,255,.14)" }}><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>SHOP</p><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>All pieces</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Minimal</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>OG collections</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Size guide</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>GIVING</p><A href="/how-giving-works" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>How giving works</A><A href="/projects" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>The six causes</A><A href="/how-giving-works#payouts" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>When it's paid</A><A href="/about" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Our story</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>HELP</p><A href="/shipping-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Shipping and delivery</A><A href="/refund-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Returns and exchanges</A><A href="/how-giving-works#faq" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>FAQ</A><A href="mailto:hello@perfectworld.global" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Contact</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>LEGAL</p><A href="/legal-notice" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Imprint</A><A href="/privacy-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Privacy</A><A href="/terms-of-service" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Terms</A><A href="/refund-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>Right of withdrawal</A></div></nav><p style={{ margin: "40px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", color: "rgba(255,255,255,.4)" }}>MUNICH · SIX CAUSES, ONE HOPE · PRINTED ON DEMAND IN GERMANY · SHIPS IN 1.5 TO 2 WEEKS · @PERFECTWORLD.GLOBAL</p>
  </footer>
</div>


      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
