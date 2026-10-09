import { useLocale } from '../contexts/LocaleContext'
import { A } from './A'
import { useT } from './t'
import { Lines } from './Seams'

// Shared header and footer for every page of the new site.
const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/how-giving-works', label: 'How giving works' },
  { href: '/projects', label: 'Causes' },
  { href: '/about', label: 'Our story' },
]

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { language, setLanguage } = useLocale()
  const lang = language === 'de' ? 'de' : 'en'
  const ink = dark ? '#ffffff' : '#0b0b0c'
  const paper = dark ? '#0b0b0c' : '#ffffff'
  return (
    <div role="group" aria-label="Language" style={{ display: "flex", border: `1px solid ${dark ? 'rgba(255,255,255,.35)' : 'rgba(11,11,12,.3)'}`, borderRadius: "999px", padding: "3px" }}>
      {(['en', 'de'] as const).map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => { if (lang !== l) setLanguage(l) }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700, minWidth: "38px", minHeight: "36px", borderRadius: "999px", border: "none", cursor: "pointer", background: lang === l ? ink : "transparent", color: lang === l ? paper : ink }}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

/** `dark` = the header sits on a dark block, so it switches to white text and the white logo. `big` = larger logo (home). */
export function Header({ active, cartCount, openCart, dark = false, big = false }: { active?: string; cartCount: number; openCart: () => void; dark?: boolean; big?: boolean }) {
  const t = useT()
  const ink = dark ? '#ffffff' : '#0b0b0c'
  const line = dark ? 'rgba(255,255,255,.35)' : 'rgba(11,11,12,.3)'
  return (
  <header className="pw-hdr" style={{ position: "relative", zIndex: 80, color: ink, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px clamp(16px, 4vw, 56px)" }}>
    <A href="/" aria-label="Perfect World, home" style={{ display: "block", lineHeight: "0" }}><img src={dark ? "/v2/img/logo-white.png" : "/v2/img/logo-black.png"} alt="Perfect World" style={{ height: big ? "clamp(48px, 5vw, 68px)" : "40px", width: "auto", display: "block" }} /></A>
    <nav aria-label="Main" className="pw-hdr-nav" style={{ display: "flex", flexWrap: "wrap", gap: "26px", fontSize: "14px", fontWeight: "600" }}>
      {NAV.map((l) => <A key={l.href} href={l.href} style={{ color: ink, textDecoration: "none", ...(active === l.href ? { borderBottom: "2px solid #e2453c", paddingBottom: "2px" } : {}) }}>{t(l.label)}</A>)}
    </nav>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <LangToggle dark={dark} />
      <button type="button" onClick={openCart} style={{ color: ink, fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 18px", border: `1px solid ${line}`, borderRadius: "999px" , background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>{t("Cart")} ({cartCount})</button>
    </div>
  </header>
  )
}

export function Footer({ icons = ['/v2/icons/ic-df3d515b.svg', '/v2/icons/ic-745e6390.svg'], seam = ['#b07e52', '#e2453c', '#5DADE2'] }: { icons?: [string, string]; seam?: string[] }) {
  const t = useT()
  return (
  <>
  <Lines colors={seam} className="pwl-hardfoot" />
  <footer className="pw-dark pw-iso pw-foot" style={{ position: "relative", zIndex: "76", overflow: "hidden", padding: "clamp(60px, 6vw, 96px) clamp(16px, 4vw, 56px) 44px", textAlign: "center" }}>
    <img className="pw-ico" src={icons[0]} alt="" aria-hidden="true" style={{ right: "2.5%", top: "70px", width: "84px", transform: "rotate(8deg)" }} /><img className="pw-ico pw-m-hide" src={icons[1]} alt="" aria-hidden="true" style={{ left: "92%", top: "570px", width: "104px", transform: "rotate(-6deg)" }} />
    
    <img src="/v2/img/logo-white.png" alt="Perfect World" style={{ height: "48px", width: "auto", display: "block", margin: "0 auto" }} />
    <p style={{ margin: "16px 0 0", fontWeight: "800", fontSize: "clamp(40px, 4.6vw, 68px)", lineHeight: ".9" }} className="pw-fat">Together.</p>
    <p style={{ margin: "4px 0 0", fontFamily: "'Hand', cursive", fontSize: "clamp(54px, 6.6vw, 100px)", lineHeight: "1", letterSpacing: ".01em" }} className="pw-hand">Not Alone.</p>
    <A href="/shop" style={{ display: "inline-block", marginTop: "30px", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", letterSpacing: ".01em", fontSize: "17px", color: "#0b0b0c", background: "#f5f4f1", textDecoration: "none", padding: "12px 30px", borderRadius: "999px" }}>{t("SHOP IMPACT")}</A>
    <p style={{ margin: "22px 0 0", fontSize: "14px", color: "rgba(255,255,255,.6)" }}>{t("Comment HOPE on any post at @perfectworld.global, and we'll find you.")}</p>
    <nav aria-label="Footer" style={{ margin: "64px auto 0", maxWidth: "1100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "28px", textAlign: "left", paddingTop: "36px", borderTop: "1px solid rgba(255,255,255,.14)" }}><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>{t("SHOP")}</p><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("All pieces")}</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Minimal")}</A><A href="/shop" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("OG collections")}</A><A href="/size-guide" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Size guide")}</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>{t("GIVING")}</p><A href="/how-giving-works" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("How giving works")}</A><A href="/projects" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("The six causes")}</A><A href="/how-giving-works#payouts" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("When it's paid")}</A><A href="/about" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Our story")}</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>{t("HELP")}</p><A href="/shipping-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Shipping and delivery")}</A><A href="/refund-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Returns and exchanges")}</A><A href="/#faq" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("FAQ")}</A><A href="mailto:hello@perfectworld.global" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Contact")}</A></div><div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}><p style={{ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#ffffff" }}>{t("LEGAL")}</p><A href="/legal-notice" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Imprint")}</A><A href="/privacy-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Privacy")}</A><A href="/terms-of-service" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Terms")}</A><A href="/refund-policy" style={{ color: "rgba(255,255,255,.62)", textDecoration: "none", fontSize: "15px" }}>{t("Right of withdrawal")}</A></div></nav><p style={{ margin: "40px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", color: "rgba(255,255,255,.4)" }}>{t("MUNICH \u00b7 SIX CAUSES, ONE HOPE \u00b7 PRINTED ON DEMAND IN GERMANY \u00b7 SHIPS IN 1.5 TO 2 WEEKS \u00b7 @PERFECTWORLD.GLOBAL")}</p>
  </footer>
  </>
  )
}
