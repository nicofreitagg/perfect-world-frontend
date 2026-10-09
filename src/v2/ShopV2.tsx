import { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CAUSES, TINT } from './causes'
import { PIECES, NEW_PIECES, icon, type CauseKey } from './data'
import { getAllProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import { useT } from './t'
import { isLaunched } from './launch'

type Kind = 'tote' | 'tee' | 'over' | 'hoodie'
const PIECE_LIST: { id: Kind; label: string; price: string; give: string }[] = [
  { id: 'tote', label: 'Tote', price: PIECES.tote.price, give: PIECES.tote.give },
  { id: 'tee', label: 'T-shirt', price: PIECES.shirt.price, give: PIECES.shirt.give },
  { id: 'over', label: 'Oversized', price: PIECES.oversized.price, give: PIECES.oversized.give },
  { id: 'hoodie', label: 'Hoodie', price: PIECES.hoodie.price, give: PIECES.hoodie.give },
]
// Silhouettes shown until the Minimal pieces exist in Shopify.
const MINIMAL = [
  { id: 'm1', name: 'Minimal Tee', colour: 'Black', kind: 'tee', fill: '#1b1b1d', bg: '#e9e7e2', swatches: ['#1b1b1d', '#f2efe8', '#6b6f4a'] },
  { id: 'm2', name: 'Minimal Tee', colour: 'Off-white', kind: 'tee', fill: '#f4f1ea', bg: '#dedbd4', swatches: ['#1b1b1d', '#f2efe8', '#6b6f4a'] },
  { id: 'm3', name: 'Oversized Tee', colour: 'Washed black', kind: 'over', fill: '#2a2a2c', bg: '#e9e7e2', swatches: ['#2a2a2c', '#f2efe8'] },
  { id: 'm4', name: 'Minimal Hoodie', colour: 'Sand', kind: 'hoodie', fill: '#cdb89a', bg: '#ecebe6', swatches: ['#cdb89a', '#1b1b1d'] },
  { id: 'm5', name: 'Minimal Hoodie', colour: 'Black', kind: 'hoodie', fill: '#1b1b1d', bg: '#e2e0da', swatches: ['#cdb89a', '#1b1b1d'] },
  { id: 'm6', name: 'Minimal Tote', colour: 'Natural', kind: 'tote', fill: '#e8dcc4', bg: '#e9e7e2', swatches: ['#e8dcc4', '#1b1b1d'] },
] as const
const MARK: Record<Kind, [number, number]> = { tee: [178, 92], over: [180, 98], hoodie: [172, 158], tote: [182, 300] }
const kindOf = (title: string): Kind => {
  const t = title.toLowerCase()
  if (t.includes('hoodie')) return 'hoodie'
  if (t.includes('tote')) return 'tote'
  if (t.includes('oversize')) return 'over'
  return 'tee'
}
const SHORT = Object.fromEntries(CAUSES.map((c) => [c.id, c.short])) as Record<CauseKey, string>
import './v2.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import Sustain from './Sustain'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'

export default function ShopV2() {
  const tr = useT()
  // Before 11.11 the ticker says "from 11.11", after it "since 11.11".
  const ticker = tr(isLaunched()
    ? 'SIX CAUSES ✕ ONE HOPE ✕ SINCE 11.11 EVERY PIECE GIVES A FIXED AMOUNT ✕ TOGETHER. NOT ALONE ✕ WEAR WHAT YOU HOPE FOR ✕ YOUR DESIGN DECIDES WHO IT HELPS ✕'
    : 'SIX CAUSES ✕ ONE HOPE ✕ FROM 11.11 EVERY PIECE GIVES A FIXED AMOUNT ✕ TOGETHER. NOT ALONE ✕ WEAR WHAT YOU HOPE FOR ✕ YOUR DESIGN DECIDES WHO IT HELPS ✕').concat(' ').repeat(2)
  usePageTitle('Shop | Perfect World')
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  const location = useLocation()
  const [tab, setTab] = useState<'minimal' | 'og'>(location.hash === '#og' ? 'og' : 'minimal')
  const [piece, setPiece] = useState<'all' | Kind>('all')
  const [cause, setCause] = useState<'all' | CauseKey>('all')
  const [minimalLive, setMinimalLive] = useState<ShopifyProduct[]>([])

  // Real Minimal products replace the silhouettes as soon as they exist in Shopify.
  useEffect(() => {
    getAllProducts().then((all) => setMinimalLive(all.filter((p) => /minimal/i.test(p.title)))).catch(() => {})
  }, [])

  const toShop = () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  const goMinimal = () => { setTab('minimal'); setPiece('all'); toShop() }
  const goOg = () => { setTab('og'); setCause('all'); toShop() }
  const chip = (on: boolean) => ({ selected: on, border: on ? '#0b0b0c' : '#cfccc5', bg: on ? '#0b0b0c' : 'transparent', fg: on ? '#ffffff' : '#0b0b0c' })

  const extra = NEW_PIECES.filter((n) => n.id !== 'women').map((n) => ({ name: n.id === 'beanie' ? 'BEANIE · ALL SIX' : 'BOMBER', price: n.price, give: n.give }))
  const tiles = [...PIECE_LIST.map((p) => ({ name: p.label.toUpperCase(), price: p.price, give: p.give })), ...extra]
  const tabs = ([
    { id: 'minimal', label: 'Minimal', isNew: true },
    { id: 'og', label: 'OG', isNew: false },
  ] as const).map((t) => ({ label: t.label, isNew: t.isNew, selected: t.id === tab, pick: () => setTab(t.id) }))
  const filterLabel = tr(tab === 'minimal' ? 'Filter by piece' : 'Filter by cause')
  const tabNote = tab === 'minimal' ? 'One small 11.11 mark. Made with one of our six partners.' : "Big back print. Each design tells its partner's story."
  const filters = tab === 'minimal'
    ? [{ id: 'all' as const, label: 'All' }, ...PIECE_LIST.map((p) => ({ id: p.id, label: ({ tote: 'Totes', tee: 'T-shirts', over: 'Oversized', hoodie: 'Hoodies' } as const)[p.id] }))].map((f) => ({ label: tr(f.label), hasDot: false, dot: '', ...chip(f.id === piece), pick: () => setPiece(f.id) }))
    : [{ id: 'all' as const, label: 'All', color: '' }, ...CAUSES.map((c) => ({ id: c.id, label: SHORT[c.id], color: c.color }))].map((f) => ({ label: tr(f.label), hasDot: !!f.color, dot: f.color, ...chip(f.id === cause), pick: () => setCause(f.id) }))

  const blank = { ico: '', img: '', grad: '', fill: '', isGarment: false, isPrint: false, isPlaceholderPrint: false, isTee: false, isOver: false, isHoodie: false, isTote: false, markX: 0, markY: 0, isNew: false }
  type Card = typeof blank & { name: string; sub: string; price: string; give: string; bg: string; swatches: { c: string }[]; href: string; addLabel: string }
  let products: Card[]
  if (tab === 'minimal' && minimalLive.length) {
    products = minimalLive.filter((m) => piece === 'all' || kindOf(m.title) === piece).map((m) => {
      const p = PIECE_LIST.find((x) => x.id === kindOf(m.title))!
      return { ...blank, name: m.title, sub: tr('Made with one partner'), price: '€' + p.price, give: '€' + p.give + ' ' + tr('to its partner'), bg: '#e9e7e2', isPrint: !!m.images[0], img: m.images[0]?.url ?? '', isNew: true, swatches: [], href: `/product/${m.handle}`, addLabel: tr('Choose your size') }
    })
  } else if (tab === 'minimal') {
    products = MINIMAL.filter((m) => piece === 'all' || m.kind === piece).map((m) => {
      const p = PIECE_LIST.find((x) => x.id === m.kind)!
      return { ...blank, name: m.name, sub: tr(m.colour), price: '€' + p.price, give: '€' + p.give + ' ' + tr('to its partner'), bg: m.bg, fill: m.fill, isGarment: true, isTee: m.kind === 'tee', isOver: m.kind === 'over', isHoodie: m.kind === 'hoodie', isTote: m.kind === 'tote', markX: MARK[m.kind][0], markY: MARK[m.kind][1], isNew: true, swatches: m.swatches.map((c) => ({ c })), href: '', addLabel: tr('Coming 11.11') }
    })
  } else {
    products = CAUSES.filter((c) => cause === 'all' || c.id === cause).map((c) => ({ ...blank, ico: icon(c.id, 'a'), name: c.name, sub: c.partner + ' · ' + tr(SHORT[c.id]), price: tr('from') + ' €' + PIECES.shirt.price, give: tr('from') + ' €' + PIECES.shirt.give + ' ' + tr('to') + ' ' + c.partner, bg: TINT[c.id], isPrint: !!c.print, isPlaceholderPrint: !c.print, img: c.print, grad: c.bg, swatches: [{ c: '#1b1b1d' }, { c: '#f2efe8' }], href: `/design/${c.slug}`, addLabel: tr('Choose your piece') }))
  }
  const causeTiles = CAUSES.map((c) => ({ icon: icon(c.id, c.id === 'oceans' ? 'wa' : 'a'), name: c.name, logo: c.logo, bg: c.bg, fg: c.id === 'oceans' ? '#ffffff' : '#0b0b0c', pick: () => { setTab('og'); setCause(c.id); toShop() } }))

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

<div className="pw2 pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />
  <Header active="/shop" cartCount={cartCount} openCart={openCart} />

  <div aria-hidden="true" style={{ background: "#e2453c", color: "#0b0b0c", overflow: "hidden", padding: "10px 0" }}>
    <div className="pw-marquee" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", fontSize: "20px", letterSpacing: ".01em", whiteSpace: "nowrap", gap: "36px" }}>
      <span>{ticker}</span>
      <span>{ticker}</span>
    </div>
  </div>

  
  <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1320px", margin: "0 auto", padding: "clamp(48px, 6vw, 88px) clamp(16px, 4vw, 56px) clamp(40px, 5vw, 64px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(32px, 5vw, 72px)" }}>
    <img className="pw-ico" src="/v2/icons/ic-df3d515b.svg" alt="" aria-hidden="true" style={{ left: "57.5%", top: "410px", width: "90px", transform: "rotate(-6deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-745e6390.svg" alt="" aria-hidden="true" style={{ left: "57.5%", top: "50px", width: "96px", transform: "rotate(9deg)" }} />
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ bottom: "-80px" }}><path d="M-60 560 C 200 650, 380 420, 560 520 C 700 600, 770 470, 690 430 C 610 390, 600 570, 770 610 C 990 660, 1160 470, 1500 540" stroke="#FF8C42" strokeWidth="8"></path></svg>
    <div style={{ flex: "1 1 520px" }}>
      <p className="pw-hand" style={{ margin: "0", fontSize: "clamp(24px, 2.4vw, 32px)", color: "#c0322a" }}>{tr("shop hope.")}</p>
      <h1 className="pw-fat" style={{ margin: "10px 0 0", fontSize: "clamp(37px, 7vw, 104px)", lineHeight: ".9" }}>{tr("Wear what")}<br />{tr("you wish for.")}</h1>
      <p style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.5", color: "#3a3a3a", maxWidth: "520px" }}>{tr("Every piece is made with one of six cause partners and gives it a fixed amount. OG or Minimal, the design tells you who it helps.")}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "28px" }}>
        <button type="button" onClick={goMinimal} style={{ fontFamily: "inherit", fontSize: "15px", fontWeight: "600", padding: "14px 24px", minHeight: "48px", border: "none", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", cursor: "pointer" }}>{tr("Shop the Minimal Collection")}</button>
        <button type="button" onClick={goOg} style={{ fontFamily: "inherit", fontSize: "15px", fontWeight: "600", padding: "14px 24px", minHeight: "48px", border: "1.5px solid #0b0b0c", borderRadius: "999px", background: "transparent", color: "#0b0b0c", cursor: "pointer" }}>{tr("Shop by cause")}</button>
      </div>
    </div>
    <div style={{ flex: "0 1 400px", filter: "drop-shadow(0 22px 30px rgba(0,0,0,.12))", transform: "rotate(1.5deg)" }}>
      <div className="pw-mono" style={{ background: "#ffffff", padding: "26px 26px 18px", fontSize: "14px" }}>
        <div style={{ textAlign: "center", borderBottom: "1px dashed #bdbab3", paddingBottom: "14px" }}>
          <img src="/v2/img/logo-black.png" alt="Perfect World" style={{ height: "40px", width: "auto" }} />
          <div style={{ fontSize: "11px", color: "#5c5c5c", marginTop: "4px" }}>{tr("WHAT EVERY PIECE GIVES")}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", columnGap: "18px", rowGap: "12px", padding: "16px 0", borderBottom: "1px dashed #bdbab3" }}>
          <span style={{ fontSize: "11px", color: "#5c5c5c" }}>{tr("PIECE")}</span><span style={{ fontSize: "11px", color: "#5c5c5c", textAlign: "right" }}>{tr("PRICE")}</span><span style={{ fontSize: "11px", color: "#c0322a", textAlign: "right" }}>{tr("GIVES")}</span>
          {tiles.map((t, tI) => (<Fragment key={tI}>
            <span>{tr(t.name)}</span><span style={{ textAlign: "right" }}>€{t.price}</span><span style={{ textAlign: "right", color: "#c0322a", fontWeight: "600" }}>€{t.give}</span>
          </Fragment>))}
        </div>
        <div style={{ paddingTop: "14px", fontSize: "12px", color: "#3a3a3a", lineHeight: "1.6" }}>{tr("THE DESIGN DECIDES THE CAUSE.")}<br />{tr("SHIPPING €5 · MADE TO ORDER")}</div>
      </div>
      <div className="pw-tear" aria-hidden="true"></div>
    </div>
  </section>

  
  <section className="pw-iso" id="shop" aria-label={tr("Products")} style={{ position: "relative", zIndex: "78", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) clamp(40px, 7vw, 72px)" }}>
    <img className="pw-ico" src="/v2/icons/ic-931f8328.svg" alt="" aria-hidden="true" style={{ left: "92%", top: "950px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-13b34769.svg" alt="" aria-hidden="true" style={{ left: "80%", top: "710px", width: "84px", transform: "rotate(10deg)" }} />
    <div className="pw-shopbar">
      <div role="tablist" aria-label={tr("Collections")} className="pw-seg">
        {tabs.map((tb, tbI) => (<Fragment key={tbI}>
          <button type="button" role="tab" aria-selected={tb.selected} onClick={tb.pick}>
            {tr(tb.label)}{tb.isNew && <span className="pw-seg-new">{tr("new")}</span>}
          </button>
        </Fragment>))}
      </div>
      <div role="group" aria-label={filterLabel} className="pw-filters">
        {filters.map((f, fI) => (<Fragment key={fI}>
          <button type="button" onClick={f.pick} aria-pressed={f.selected}>
            {f.hasDot && (<><span aria-hidden="true" style={{ width: "9px", height: "9px", borderRadius: "50%", background: f.dot }}></span></>)}
            {f.label}
          </button>
        </Fragment>))}
      </div>
    </div>
    <p className="pw-shopnote">{tr(tabNote)}</p>

    <div className="pw-m-g2 pw-m-prods" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", columnGap: "24px", rowGap: "44px" }}>
      {products.map((p, pI) => (<Fragment key={pI}>
        <article className="pw-prod" style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div className="pw-media" style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "20px", overflow: "hidden", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.ico && (<><img src={p.ico} alt="" aria-hidden="true" style={{ position: "absolute", left: "16px", bottom: "16px", width: "62px", zIndex: "2", transform: "rotate(-6deg)" }} /></>)}
            {p.isPrint && (<><img src={p.img} alt={`${p.name} back print`} className="pw-art" style={{ width: "78%", height: "78%", objectFit: "contain", filter: "drop-shadow(0 18px 20px rgba(0,0,0,.16))" }} /></>)}
            {p.isPlaceholderPrint && (<><span className="pw-art" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", background: p.grad }}><img src="/v2/img/banner-hands.png" alt="" className="pw-hands" /><span className="pw-hand" style={{ position: "relative", fontSize: "44px", lineHeight: "1", textAlign: "center" }}>{tr(p.name)}</span><span className="pw-mono" style={{ position: "relative", fontSize: "11px" }}>{tr("[BACK PRINT IMAGE]")}</span></span></>)}
            {p.isGarment && (<>
              <svg className="pw-art" width="72%" height="72%" viewBox="0 0 300 340" role="img" aria-label={`${p.name} illustration`} style={{ filter: "drop-shadow(0 20px 22px rgba(0,0,0,.18))" }}>
                {p.isTee && (<><path d="M96 34 L128 22 Q150 42 172 22 L204 34 L262 86 L232 122 L214 106 L214 316 L86 316 L86 106 L68 122 L38 86 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M128 22 Q150 42 172 22" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3"></path></>)}
                {p.isOver && (<><path d="M82 42 L126 26 Q150 46 174 26 L218 42 L280 112 L246 140 L228 126 L230 320 L70 320 L72 126 L54 140 L20 112 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M126 26 Q150 46 174 26" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3"></path></>)}
                {p.isHoodie && (<><path d="M102 64 Q100 18 150 16 Q200 18 198 64 L236 76 L272 252 L242 260 L222 142 L222 322 L78 322 L78 142 L58 260 L28 252 L64 76 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M120 66 Q150 92 180 66" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="3"></path><path d="M138 82 L136 128 M162 82 L164 128" stroke="rgba(0,0,0,.3)" strokeWidth="2.5"></path><path d="M104 236 L196 236 L206 290 L94 290 Z" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2"></path></>)}
                {p.isTote && (<><path d="M112 130 Q112 46 150 46 Q188 46 188 130" fill="none" stroke={p.fill} strokeWidth="12" strokeLinecap="round"></path><path d="M112 130 Q112 46 150 46 Q188 46 188 130" fill="none" stroke="rgba(0,0,0,.14)" strokeWidth="12" strokeLinecap="round" opacity=".5"></path><path d="M66 124 L234 124 L246 324 L54 324 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path></>)}
                <text x={p.markX} y={p.markY} fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#c0322a">11.11</text>
              </svg>
            </>)}
            {p.isNew && (<><span className="pw-mono" style={{ position: "absolute", top: "16px", left: "16px", fontSize: "11px", fontWeight: "600", color: "#ffffff", background: "#c0322a", padding: "6px 11px", borderRadius: "999px" }}>{tr("NEW · 11.11")}</span></>)}
            
            {p.href ? <A href={p.href} className="pw-add" style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", minHeight: "48px", border: "none", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", cursor: "pointer" }}>{tr(p.addLabel)}</A> : <span className="pw-add" style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", minHeight: "48px", border: "none", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", cursor: "pointer" }}>{tr(p.addLabel)}</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", padding: "16px 4px 0" }}>
            <div style={{ minWidth: "0" }}>
              <h3 className="pw-fat" style={{ margin: "0", fontSize: "22px", lineHeight: "1.05" }}>{p.href ? <A href={p.href} style={{ color: "inherit", textDecoration: "none" }}>{tr(p.name)}</A> : p.name}</h3>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#5c5c5c" }}>{tr(p.sub)}</p>
            </div>
            <span className="pw-mono" style={{ fontSize: "16px", whiteSpace: "nowrap", paddingTop: "2px" }}>{tr(p.price)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", margin: "12px 4px 0", paddingTop: "12px", borderTop: "1px dashed #c9c6bf" }}>
            <span className="pw-mono" style={{ fontSize: "13px", color: "#c0322a" }}>{tr(p.give)}</span>
            <span style={{ display: "flex", gap: "6px" }} aria-label={tr("Colours")}>
              {p.swatches.map((sw, swI) => (<Fragment key={swI}><span style={{ width: "14px", height: "14px", borderRadius: "50%", background: sw.c, border: "1px solid rgba(0,0,0,.2)" }}></span></Fragment>))}
            </span>
          </div>
        </article>
      </Fragment>))}
    </div>
  </section>

  
  <section className="pw-iso" aria-label={tr("New pieces")} style={{ position: "relative", zIndex: "77", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) clamp(40px, 7vw, 80px)" }}>
    <p className="pw-hand" style={{ margin: "0", fontSize: "26px", color: "#c0322a" }}>{tr("new on 11.11.")}</p>
    <h2 className="pw-fat" style={{ margin: "6px 0 24px", fontSize: "clamp(24px, 4vw, 56px)", lineHeight: ".95" }}>{tr("New pieces.")}</h2>
    <div className="pw-m-swipe pw-m-s50 pw-m-prods" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
      {NEW_PIECES.map((n) => (
        <article key={n.id} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "20px", overflow: "hidden", background: n.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="70%" height="70%" viewBox="0 0 300 340" role="img" aria-label={tr(n.name)} style={{ filter: "drop-shadow(0 20px 22px rgba(0,0,0,.18))" }}>
              {n.id === 'women' && (<><path d="M100 70 L132 58 Q150 76 168 58 L200 70 L260 112 L238 144 L210 128 Q198 200 218 272 L82 272 Q102 200 90 128 L62 144 L40 112 Z" fill={n.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5" /><path d="M132 58 Q150 76 168 58" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2" /><text x="168" y="112" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#e2453c">11.11</text></>)}
              {n.id === 'bomber' && (<><path d="M108 40 L134 30 L166 30 L192 40 L256 98 L244 280 L218 282 L214 150 L214 298 L86 298 L86 150 L82 282 L56 280 L44 98 Z" fill={n.fill} stroke="rgba(0,0,0,.18)" strokeWidth="1.5" /><path d="M134 30 Q150 48 166 30" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="5" /><path d="M150 44 V298" stroke="rgba(255,255,255,.45)" strokeWidth="2" /><path d="M86 286 H214 M58 268 L82 270 M218 270 L242 268" stroke="rgba(255,255,255,.3)" strokeWidth="5" /><rect x="64" y="128" width="12" height="26" rx="3" fill="rgba(255,255,255,.35)" /><text x="160" y="96" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#e2453c">11.11</text></>)}
              {n.id === 'beanie' && (<><path d="M84 214 Q80 92 150 88 Q220 92 216 214 Z" fill={n.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5" /><path d="M110 210 Q108 120 126 100 M150 210 V92 M190 210 Q192 120 174 100" stroke="rgba(0,0,0,.12)" strokeWidth="3" fill="none" /><rect x="72" y="200" width="156" height="58" rx="10" fill={n.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5" /><path d="M84 206 V252 M98 206 V252 M112 206 V252 M126 206 V252 M174 206 V252 M188 206 V252 M202 206 V252 M216 206 V252" stroke="rgba(0,0,0,.14)" strokeWidth="2" /><rect x="134" y="216" width="32" height="26" rx="3" fill="#f5f4f1" /><text x="150" y="233" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#0b0b0c">PW</text></>)}
            </svg>
            <span className="pw-mono" style={{ position: "absolute", top: "16px", left: "16px", fontSize: "11px", fontWeight: "600", color: "#ffffff", background: "#e2453c", padding: "6px 11px", borderRadius: "999px" }}>{tr("NEW")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", padding: "16px 4px 0" }}>
            <div style={{ minWidth: "0" }}>
              <h3 className="pw-fat" style={{ margin: "0", fontSize: "22px", lineHeight: "1.05" }}>{tr(n.name)}</h3>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#5c5c5c" }}>{tr(n.sub)}</p>
            </div>
            <span className="pw-mono" style={{ fontSize: "16px", whiteSpace: "nowrap", paddingTop: "2px" }}>€{n.price}</span>
          </div>
          <div style={{ margin: "12px 4px 0", paddingTop: "12px", borderTop: "1px dashed #c9c6bf" }}>
            <span className="pw-mono" style={{ fontSize: "13px", color: "#c0322a" }}>€{n.give} {tr('split' in n ? "shared by all six partners" : "to its partner")}</span>
          </div>
        </article>
      ))}
    </div>
  </section>

  <section className="pw-iso" aria-label={tr("The six causes")} style={{ position: "relative", zIndex: "77", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) clamp(40px, 7vw, 80px)" }}>
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "-60px" }}><path d="M-60 130 C 240 40, 310 270, 520 190 C 650 140, 610 40, 545 80 C 470 125, 620 310, 900 245 C 1150 190, 1250 60, 1500 115" stroke="#5DADE2" strokeWidth="7"></path></svg>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "12px", marginBottom: "20px" }}>
      <h2 className="pw-fat" style={{ margin: "0", fontSize: "clamp(24px, 4vw, 56px)", lineHeight: ".95" }}>{tr("Six causes. You pick one.")}</h2>
      <A href="/projects" style={{ fontSize: "15px", fontWeight: "600", color: "#0b0b0c" }}>{tr("Meet all the projects →")}</A>
    </div>
    <div className="pw-six" style={{ display: "grid", gap: "14px" }}>
      {causeTiles.map((ct, ctI) => (<Fragment key={ctI}>
        <button type="button" onClick={ct.pick} style={{ position: "relative", overflow: "hidden", minHeight: "220px", border: "none", borderRadius: "24px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: ct.bg, color: ct.fg }}>
          <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" /><img src={ct.icon} alt="" aria-hidden="true" style={{ position: "absolute", right: "12px", top: "12px", width: "76px", height: "76px", transform: "rotate(6deg)", opacity: ".9" }} />
          <span style={{ position: "relative", width: "60px", height: "60px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={ct.logo} alt="" style={{ maxWidth: "44px", maxHeight: "38px", objectFit: "contain" }} /></span>
          <span style={{ position: "relative" }}><span className="pw-hand" style={{ display: "block", fontSize: "24px", lineHeight: "1" }}>{ct.name}</span><span style={{ display: "block", marginTop: "6px", fontSize: "13px", fontWeight: "600" }}>{tr("Shop this cause →")}</span></span>
        </button>
      </Fragment>))}
    </div>
  </section>

  
  <section className="pw-iso pw-lightband" aria-label={tr("How your order works")} style={{ position: "relative", zIndex: "76" }}>
    <img className="pw-ico" src="/v2/icons/ic-c7d1f8ac.svg" alt="" aria-hidden="true" style={{ left: "92%", top: "10px", width: "104px", transform: "rotate(6deg)" }} /><img className="pw-ico pw-m-hide" src="/v2/icons/ic-beae2a27.svg" alt="" aria-hidden="true" style={{ left: "71%", top: "30px", width: "90px", transform: "rotate(-10deg)" }} />
    <div className="pw-m-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "clamp(40px, 6vw, 88px) clamp(16px, 4vw, 56px)" }}>
      <h2 className="pw-fat" style={{ margin: "0", fontSize: "clamp(26px, 4.4vw, 60px)", lineHeight: ".95" }}>{tr("How your order works")}</h2>
      <div className="pw-m-steps" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "28px", marginTop: "40px" }}>
        <div style={{ borderTop: "1px solid rgba(11,11,12,.25)", paddingTop: "18px" }}><span className="pw-hand" style={{ fontSize: "44px", color: "#e2453c" }}>01</span><p className="pw-fat" style={{ margin: "8px 0 0", fontSize: "24px" }}>{tr("Pick a piece")}</p><p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.55", color: "#3a3a3a" }}>{tr("Minimal or OG. Every piece gives a fixed amount.")}</p></div>
        <div style={{ borderTop: "1px solid rgba(11,11,12,.25)", paddingTop: "18px" }}><span className="pw-hand" style={{ fontSize: "44px", color: "#e2453c" }}>02</span><p className="pw-fat" style={{ margin: "8px 0 0", fontSize: "24px" }}>{tr("It goes to its partner")}</p><p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.55", color: "#3a3a3a" }}>{tr("Every design is made with one partner. The fixed amount always goes to them.")}</p></div>
        <div style={{ borderTop: "1px solid rgba(11,11,12,.25)", paddingTop: "18px" }}><span className="pw-hand" style={{ fontSize: "44px", color: "#e2453c" }}>03</span><p className="pw-fat" style={{ margin: "8px 0 0", fontSize: "24px" }}>{tr("We pass it on")}</p><p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.55", color: "#3a3a3a" }}>{tr("The full amount goes to the cause you picked. Your piece is made just for you and arrives in about 1½ to 2 weeks.")}</p></div>
      </div>
    </div>
  </section>

  
  <section className="pw-iso" aria-label={tr("Our promise")} style={{ position: "relative", zIndex: "75", borderBottom: "1px solid #e3e1dc" }}>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "28px clamp(16px, 4vw, 56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }} className="pw-m-g2 pw-m-facts">
      <div><p  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", margin: "0", fontSize: "20px" }}>{tr("MADE TO ORDER")}</p><p style={{ margin: "4px 0 0", fontSize: "14px", color: "#3a3a3a" }}>{tr("No piles of unsold stock.")}</p></div>
      <div><p  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", margin: "0", fontSize: "20px" }}>{tr("ORGANIC COTTON")}</p><p style={{ margin: "4px 0 0", fontSize: "14px", color: "#3a3a3a" }}>{tr("100% organic cotton. 100% vegan.")}</p></div>
      <div><p  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", margin: "0", fontSize: "20px" }}>{tr("SHIPPING €5")}</p><p style={{ margin: "4px 0 0", fontSize: "14px", color: "#3a3a3a" }}>{tr("About 1½ to 2 weeks, depending on where you live.")}</p></div>
      <div><p  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", margin: "0", fontSize: "20px" }}>{tr("YOU CHOOSE")}</p><p style={{ margin: "4px 0 0", fontSize: "14px", color: "#3a3a3a" }}>{tr("Every design belongs to one partner.")}</p></div>
    </div>
  </section>

  <Sustain />
  <Footer icons={["/v2/icons/ic-f40a9d4d.svg", "/v2/icons/ic-1e094dbe.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
