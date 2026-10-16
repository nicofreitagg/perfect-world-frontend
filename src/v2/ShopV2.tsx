import { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CAUSES, TINT } from './causes'
import { PIECES, NEW_PIECES, MIN_DESIGNS, WOMEN, BEANIE_MOCKUP, minDesignOf, icon, type CauseKey, RAW_GROUND } from './data'
import { useDesignPairOrGuess } from './printSide'
import { getAllProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import { useT } from './t'
import { hexOf, rankColours, variantColours } from './colours'
import { getCollectionKey, extractProductType, extractColorFromTitle, formatDisplayTitle } from '../utils/productGrouping'

type Kind = 'tote' | 'tee' | 'women' | 'over' | 'hoodie' | 'bomber' | 'beanie'
const np = (id: string) => NEW_PIECES.find((n) => n.id === id)!
const PIECE_LIST: { id: Kind; label: string; filter: string; price: string; give: string; split?: boolean }[] = [
  { id: 'tee', label: 'T-shirt', filter: 'T-shirts', price: PIECES.shirt.price, give: PIECES.shirt.give },
  { id: 'women', label: "Women's T-shirt", filter: "Women's", price: np('women').price, give: np('women').give },
  { id: 'over', label: 'Oversized', filter: 'Oversized', price: PIECES.oversized.price, give: PIECES.oversized.give },
  { id: 'hoodie', label: 'Hoodie', filter: 'Hoodies', price: PIECES.hoodie.price, give: PIECES.hoodie.give },
  { id: 'bomber', label: 'Bomber', filter: 'Bombers', price: np('bomber').price, give: np('bomber').give },
  { id: 'tote', label: 'Tote', filter: 'Totes', price: PIECES.tote.price, give: PIECES.tote.give },
  { id: 'beanie', label: 'Beanie', filter: 'Beanies', price: np('beanie').price, give: np('beanie').give, split: true },
]
// The logo beanie has no design, so it shows as a drawing until it is listed (black + natural, Nico 9 Oct).
const MINIMAL = [
  { id: 'k1', name: 'Logo Beanie', colour: 'Black', kind: 'beanie', fill: '#1b1b1d', bg: '#e9e7e2' },
  { id: 'k2', name: 'Logo Beanie', colour: 'Natural', kind: 'beanie', fill: '#e8dcc4', bg: '#dedbd4' },
] as const
const kindOf = (title: string): Kind => {
  const t = title.toLowerCase()
  if (t.includes('hoodie')) return 'hoodie'
  if (t.includes('tote')) return 'tote'
  if (t.includes('oversize')) return 'over'
  if (t.includes('bomber')) return 'bomber'
  if (t.includes('beanie')) return 'beanie'
  if (WOMEN.test(t)) return 'women'
  return 'tee'
}
// Which colour a Minimal card opens on (Nico 12 Oct): T-shirts and hoodies on the design's own
// cause colour; bombers, women's tees and oversized rotate through their colours design by design.
const CAUSE_COLOUR: Record<string, string> = { 'one-world': 'blue soul', 'cool-down': 'green bay', 'endangered-oceans': 'bright blue', 'talk-about-it': 'lavender', 'wild-at-heart': 'india ink', 'rich-in-life': 'red brown' }
const leadColour = (kind: Kind, slug: string, cols: string[]) => {
  const i = Math.max(0, MIN_DESIGNS.findIndex((d) => d.slug === slug))
  if (kind === 'tee' || kind === 'hoodie') {
    const own = cols.find((x) => CAUSE_COLOUR[slug] && x.toLowerCase().includes(CAUSE_COLOUR[slug]))
    if (own) return own
  }
  if ((kind === 'bomber' || kind === 'women' || kind === 'over') && cols.length) return cols[i % cols.length]
  return cols[0]
}
// Which piece each design shows in the Minimal overview, with the cut-out mockup used until the listing has photos.
const MIX: { kind: Kind; img: string; fk?: Kind }[] = [{ kind: 'over', img: 'one-world-oversized' }, { kind: 'tote', img: 'cool-tote' }, { kind: 'tee', img: 'oceans' }, { kind: 'bomber', img: 'talk-bomber' }, { kind: 'hoodie', img: 'wild', fk: 'tee' }, { kind: 'women', img: 'womens-rich' }]
// Warm Natural Raw behind the pieces that support all six.
const ALL_BG = 'linear-gradient(170deg, #f4ede1 0%, #e4d5bd 100%)'
const SHORT = Object.fromEntries(CAUSES.map((c) => [c.id, c.short])) as Record<CauseKey, string>
import './v2.css'
import { useCauseGround } from './ground'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import Sustain from './Sustain'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'

export default function ShopV2() {
  const tr = useT()
  usePageTitle('Shop | Perfect World')
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  const location = useLocation()
  const [tab, setTab] = useState<'minimal' | 'og'>(location.hash === '#og' ? 'og' : 'minimal')
  const [piece, setPiece] = useState<'all' | Kind>('all')
  const [cause, setCause] = useState<'all' | CauseKey>('all')
  // Minimal: the six designs first; picking one shows that design's pieces (?design=slug).
  const [minDesign, setMinDesign] = useState<string>(() => new URLSearchParams(location.search).get('design') ?? 'all')
  useCauseGround(minDesign === 'all' ? undefined : minDesign)
  const pickDesign = (slug: string) => {
    setMinDesign(slug); setPiece('all')
    const u = new URL(window.location.href)
    if (slug === 'all') u.searchParams.delete('design'); else u.searchParams.set('design', slug)
    window.history.replaceState(null, '', u.toString())
    // Land on the design name so the swirl draws in view.
    setTimeout(() => (document.querySelector('.pw-designbar') ?? document.getElementById('shop'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }
  // Arriving from the home page: a design opens on its pieces, "#shop" on the collection grid.
  useEffect(() => {
    const target = new URLSearchParams(location.search).get('design') ? '.pw-designbar' : location.hash === '#shop' ? '#shop' : ''
    if (!target) return
    const t = setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Phones: slide the design switcher so the current design's chip is in view.
  useEffect(() => {
    const on = document.querySelector<HTMLElement>('.pw-designswitch [aria-current]')
    on?.parentElement?.scrollTo({ left: Math.max(0, on.offsetLeft - 16), behavior: 'smooth' })
  }, [minDesign])
  const [minimalLive, setMinimalLive] = useState<ShopifyProduct[]>([])
  const [ogLive, setOgLive] = useState<ShopifyProduct[]>([])
  const [embLive, setEmbLive] = useState<ShopifyProduct[]>([])

  // Real Minimal products replace the silhouettes as soon as they exist in Shopify.
  useEffect(() => {
    getAllProducts().then((all) => { setMinimalLive(all.filter((p) => /minimal/i.test(p.title))); setOgLive(all.filter((p) => !/minimal/i.test(p.title) && extractProductType(p.title) === 'tshirt')); setEmbLive(all.filter((p) => /embroider/i.test(p.title) && p.availableForSale)) }).catch(() => {})
  }, [])


  const toShop = () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })

  const blank = { ico: '', img: '', photos: [] as { url: string }[], colourUrl: '', pick: undefined as undefined | (() => void), small: false, isPhoto: false, isDesign: false, grad: '', fill: '', isGarment: false, isPrint: false, isPlaceholderPrint: false, isTee: false, isWomen: false, isOver: false, isHoodie: false, isBomber: false, isTote: false, isBeanie: false, isFront: false, markX: 0, markY: 0, isNew: false }
  type Card = typeof blank & { name: string; sub: string; price: string; give: string; bg: string; swatches: { c: string; href?: string; label?: string }[]; href: string; addLabel: string }
  let products: Card[]
  const liveShown = minimalLive
    .filter((m) => (piece === 'all' || kindOf(m.title) === piece) && (minDesign === 'all' || minDesignOf(m.title)?.slug === minDesign))
    .sort((x, y) => PIECE_LIST.findIndex((q) => q.id === kindOf(x.title)) - PIECE_LIST.findIndex((q) => q.id === kindOf(y.title)) || MIN_DESIGNS.indexOf(minDesignOf(x.title)!) - MIN_DESIGNS.indexOf(minDesignOf(y.title)!))
  if (tab === 'minimal' && piece === 'all' && minDesign === 'all') {
    // The six designs as a mix of real pieces, like the OG grid (Nico, 16 Oct): each design shows a different piece; the card opens all its pieces.
    products = MIN_DESIGNS.map((d, i) => {
      const c = CAUSES.find((x) => x.slug === d.slug)!
      const mine = minimalLive.filter((m) => minDesignOf(m.title)?.slug === d.slug)
      const want = MIX[i]
      const m = mine.find((x) => kindOf(x.title) === want.kind) ?? mine.find((x) => kindOf(x.title) !== 'beanie')
      const kind = m ? kindOf(m.title) : want.fk ?? want.kind
      const p = PIECE_LIST.find((x) => x.id === kind)!
      const base = { ...blank, small: true, name: d.name, sub: tr(p.label) + ' · ' + c.partner, price: '€' + p.price, give: '€' + p.give + ' ' + tr('to its partner'), bg: `linear-gradient(170deg, ${TINT[c.id]} 0%, color-mix(in srgb, ${c.color} 26%, ${TINT[c.id]}) 100%)`, isNew: true, swatches: [], href: '', pick: () => pickDesign(d.slug), addLabel: mine.length ? tr('See the pieces') + ` (${mine.length})` : tr('See the pieces') }
      if (!m) return { ...base, isDesign: true, img: `/v2/img/mm-${want.img}.webp` }
      const cols = rankColours(c.name, variantColours(m.variants), (x) => x)
      const lead = leadColour(kind, d.slug, cols)
      const colourUrl = m.variants.find((v) => v.selectedOptions?.some((o) => o.value === lead))?.image?.url ?? ''
      return { ...base, isPhoto: !!m.images[0], photos: m.images, colourUrl, isDesign: !m.images[0], img: `/v2/img/mm-${want.img}.webp` }
    })
  } else if (tab === 'minimal' && liveShown.length) {
    // Real listings: one card per product on its lead colour, the design side first, the front on hover.
    products = liveShown.map((m) => {
      const kind = kindOf(m.title)
      const p = PIECE_LIST.find((x) => x.id === kind)!
      const d = minDesignOf(m.title)
      const c = CAUSES.find((x) => (d && x.slug === d.slug) || x.name === getCollectionKey(m.title))
      const cols = rankColours(c?.name ?? '', variantColours(m.variants), (x) => x)
      const lead = leadColour(kind, d?.slug ?? '', cols)
      const order = lead ? [lead, ...cols.filter((x) => x !== lead)] : cols
      const colourUrl = m.variants.find((v) => v.selectedOptions?.some((o) => o.value === lead))?.image?.url ?? ''
      const link = (x: string) => `/product/${m.handle}?colour=${encodeURIComponent(x)}`
      // Inside one design the piece is the headline; across designs the design name is.
      const one = minDesign !== 'all'
      return { ...blank, name: one ? tr(p.label) : d?.name ?? formatDisplayTitle(m.title), sub: one ? (c?.partner ?? '') : tr(p.label) + (c ? ' · ' + c.partner : ''), price: '€' + p.price, give: '€' + p.give + ' ' + tr(p.split ? 'shared by all six partners' : 'to its partner'), bg: '#ecebe6', isPhoto: !!m.images[0], photos: m.images, colourUrl, isNew: true, swatches: order.map((x) => ({ c: hexOf(x), label: x, href: link(x) })), href: lead ? link(lead) : `/product/${m.handle}`, addLabel: tr('Choose your size') }
    })
  } else if (tab === 'minimal' && piece !== 'beanie') {
    // Pieces not listed yet: the designs as artwork on their partner's tint.
    const p = PIECE_LIST.find((x) => x.id === piece)
    products = MIN_DESIGNS.filter((d) => minDesign === 'all' || d.slug === minDesign).map((d) => {
      const c = CAUSES.find((x) => x.slug === d.slug)!
      return { ...blank, name: d.name, sub: c.partner + (p ? ' · ' + tr(p.label) : ''), price: p ? '€' + p.price : tr('from') + ' €' + PIECES.tote.price, give: (p ? '' : tr('from') + ' ') + '€' + (p ? p.give : PIECES.tote.give) + ' ' + tr('to its partner'), bg: TINT[c.id], isDesign: true, img: `/v2/img/min-${d.img}.webp`, isNew: true, swatches: [], href: '', addLabel: tr('Coming 11.11') }
    })
  } else if (tab === 'minimal') {
    // The logo beanie has no design. Until its Shopify listing exists: one card with the mockup, both colours.
    const p = PIECE_LIST.find((x) => x.id === 'beanie')!
    const kinds = MINIMAL.filter((m) => m.kind === 'beanie')
    products = [{ ...blank, name: kinds[0].name, sub: kinds.map((m) => tr(m.colour)).join(' · '), price: '€' + p.price, give: '€' + p.give + ' ' + tr('shared by all six partners'), bg: ALL_BG, isPhoto: true, photos: [{ url: BEANIE_MOCKUP }], isNew: true, swatches: kinds.map((m) => ({ c: m.fill })), href: '', addLabel: tr('Coming 11.11') }]
  } else {
    // T-shirt colours per design from Shopify, each opening the product page on that colour.
    const coloursOf = (name: string) => {
      const seen = new Map<string, ShopifyProduct>()
      for (const p of ogLive.filter((x) => getCollectionKey(x.title) === name)) {
        const c = extractColorFromTitle(p.title).trim()
        if (c && !seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), p)
      }
      return rankColours(name, [...seen.values()].map((p) => ({ name: extractColorFromTitle(p.title).trim(), img: p.images[0]?.url ?? '', photos: p.images })), (x) => x.name)
    }
    const card = (c: (typeof CAUSES)[number]) => ({ ...blank, ico: icon(c.id, 'a'), name: c.name, sub: c.partner + ' · ' + tr(SHORT[c.id]), price: tr('from') + ' €' + PIECES.shirt.price, give: tr('from') + ' €' + PIECES.shirt.give + ' ' + tr('to') + ' ' + c.partner, bg: TINT[c.id], isPrint: !!c.print, isPlaceholderPrint: !c.print, img: c.print, grad: c.bg, swatches: [{ c: '#1b1b1d' }, { c: '#f2efe8' }] as { c: string; href?: string; label?: string }[], href: `/design/${c.slug}`, addLabel: tr('Choose your piece') })
    products = CAUSES.filter((c) => cause === 'all' || c.id === cause).flatMap((c) => {
      const cols = coloursOf(c.name)
      const link = (n: string) => `/design/${c.slug}?colour=${encodeURIComponent(n)}`
      if (!cols.length) return [card(c)]
      const swatches = cols.map((x) => ({ c: hexOf(x.name), href: link(x.name), label: tr(x.name) }))
      // A picked cause splits into one card per colour, like the Minimal filters.
      if (cause !== 'all') return cols.map((x) => ({ ...card(c), sub: tr(x.name) + ' · ' + c.partner, img: x.img || c.print, isPrint: !!(x.img || c.print), isPlaceholderPrint: !(x.img || c.print), photos: x.photos, swatches: [{ c: hexOf(x.name) }], href: link(x.name) }))
      // The card itself opens the lead colour, which is the one its picture shows.
      return [{ ...card(c), sub: cols.map((x) => tr(x.name)).join(' · '), swatches, href: link(cols[0].name) }]
    })
  }
  const card = (p: Card, pI: number) => (<Fragment key={pI}>
        <article className={p.small ? 'pw-prod pw-prod-sm' : 'pw-prod'} style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div className="pw-media" style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "20px", overflow: "hidden", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.ico && (<><img src={p.ico} alt="" aria-hidden="true" style={{ position: "absolute", left: "16px", bottom: "16px", width: "62px", zIndex: "2", transform: "rotate(-6deg)" }} /></>)}
            {p.isPhoto && <DesignPhotos images={p.photos} colourUrl={p.colourUrl || undefined} alt={p.name} />}
            {p.isFront && <img src={p.img} alt={p.name} className="pw-photo" loading="lazy" />}
            {p.isDesign && (<><img src={p.img} alt={p.name} className="pw-art pw-design" loading="lazy" /></>)}
            {p.href && <A href={p.href} className="pw-cardlink" aria-hidden="true" tabIndex={-1}><span /></A>}
            {p.pick && <button type="button" className="pw-cardlink" onClick={p.pick} aria-label={`${p.name}: ${p.addLabel}`} />}
            {p.isPrint && (p.photos.length ? <OgShot photos={p.photos} alt={`${p.name}, ${p.sub}`} /> : <><img src={p.img} alt={`${p.name} back print`} className="pw-art" style={{ width: "78%", height: "78%", objectFit: "contain", filter: "drop-shadow(0 18px 20px rgba(0,0,0,.16))" }} /></>)}
            {p.isPlaceholderPrint && (<><span className="pw-art" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", background: p.grad }}><img src="/v2/img/banner-hands.png" alt="" className="pw-hands" /><span className="pw-hand" style={{ position: "relative", fontSize: "44px", lineHeight: "1", textAlign: "center" }}>{tr(p.name)}</span><span className="pw-mono" style={{ position: "relative", fontSize: "11px" }}>{tr("[BACK PRINT IMAGE]")}</span></span></>)}
            {p.isGarment && (<>
              <svg className="pw-art" width="72%" height="72%" viewBox="0 0 300 340" role="img" aria-label={`${p.name} illustration`} style={{ filter: "drop-shadow(0 20px 22px rgba(0,0,0,.18))" }}>
                {p.isTee && (<><path d="M96 34 L128 22 Q150 42 172 22 L204 34 L262 86 L232 122 L214 106 L214 316 L86 316 L86 106 L68 122 L38 86 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M128 22 Q150 42 172 22" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3"></path></>)}
                {p.isOver && (<><path d="M82 42 L126 26 Q150 46 174 26 L218 42 L280 112 L246 140 L228 126 L230 320 L70 320 L72 126 L54 140 L20 112 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M126 26 Q150 46 174 26" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3"></path></>)}
                {p.isHoodie && (<><path d="M102 64 Q100 18 150 16 Q200 18 198 64 L236 76 L272 252 L242 260 L222 142 L222 322 L78 322 L78 142 L58 260 L28 252 L64 76 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M120 66 Q150 92 180 66" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="3"></path><path d="M138 82 L136 128 M162 82 L164 128" stroke="rgba(0,0,0,.3)" strokeWidth="2.5"></path><path d="M104 236 L196 236 L206 290 L94 290 Z" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2"></path></>)}
                {p.isTote && (<><path d="M112 130 Q112 46 150 46 Q188 46 188 130" fill="none" stroke={p.fill} strokeWidth="12" strokeLinecap="round"></path><path d="M112 130 Q112 46 150 46 Q188 46 188 130" fill="none" stroke="rgba(0,0,0,.14)" strokeWidth="12" strokeLinecap="round" opacity=".5"></path><path d="M66 124 L234 124 L246 324 L54 324 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path></>)}
                {p.isWomen && (<><path d="M100 70 L132 58 Q150 76 168 58 L200 70 L260 112 L238 144 L210 128 Q198 200 218 272 L82 272 Q102 200 90 128 L62 144 L40 112 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M132 58 Q150 76 168 58" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3"></path></>)}
                {p.isBomber && (<><path d="M108 40 L134 30 L166 30 L192 40 L256 98 L244 280 L218 282 L214 150 L214 298 L86 298 L86 150 L82 282 L56 280 L44 98 Z" fill={p.fill} stroke="rgba(0,0,0,.18)" strokeWidth="1.5"></path><path d="M134 30 Q150 48 166 30" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="5"></path><path d="M150 44 V298" stroke="rgba(255,255,255,.45)" strokeWidth="2"></path><path d="M86 286 H214 M58 268 L82 270 M218 270 L242 268" stroke="rgba(255,255,255,.3)" strokeWidth="5"></path></>)}
                {p.isBeanie && (<><path d="M84 214 Q80 92 150 88 Q220 92 216 214 Z" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></path><path d="M110 210 Q108 120 126 100 M150 210 V92 M190 210 Q192 120 174 100" stroke="rgba(0,0,0,.12)" strokeWidth="3" fill="none"></path><rect x="72" y="200" width="156" height="58" rx="10" fill={p.fill} stroke="rgba(0,0,0,.16)" strokeWidth="1.5"></rect><path d="M84 206 V252 M98 206 V252 M112 206 V252 M126 206 V252 M174 206 V252 M188 206 V252 M202 206 V252 M216 206 V252" stroke="rgba(0,0,0,.14)" strokeWidth="2"></path><rect x="134" y="216" width="32" height="26" rx="3" fill={p.fill === '#1b1b1d' ? '#f5f4f1' : '#1b1b1d'}></rect><text x="150" y="233" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill={p.fill === '#1b1b1d' ? '#0b0b0c' : '#f5f4f1'}>PW</text></>)}
                {!p.isBeanie && <text x={p.markX} y={p.markY} fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#c0322a">11.11</text>}
              </svg>
            </>)}
            {p.isNew && (<><span className="pw-mono" style={{ position: "absolute", top: "16px", left: "16px", fontSize: "11px", fontWeight: "600", color: "#ffffff", background: "#c0322a", padding: "6px 11px", borderRadius: "999px" }}>{tr("NEW")}</span></>)}
            
            {p.pick ? <button type="button" onClick={p.pick} className="pw-add pw-add-h" style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", minHeight: "48px", border: "none", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", cursor: "pointer" }}>{p.addLabel}</button> : p.href ? <A href={p.href} className="pw-add pw-add-h" style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", minHeight: "48px", border: "none", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", cursor: "pointer" }}>{tr(p.addLabel)}</A> : <span className="pw-add" style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", minHeight: "48px", border: "none", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", cursor: "pointer" }}>{tr(p.addLabel)}</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", padding: "16px 4px 0" }}>
            <div style={{ minWidth: "0" }}>
              <h3 className="pw-fat" style={{ margin: "0", fontSize: "22px", lineHeight: "1.05" }}>{p.href ? <A href={p.href} style={{ color: "inherit", textDecoration: "none" }}>{tr(p.name)}</A> : p.name}</h3>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#5c5c5c" }}>{tr(p.sub)}</p>
            </div>
            <span className="pw-mono" style={{ fontSize: "16px", whiteSpace: "nowrap", paddingTop: "2px" }}>{tr(p.price)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", margin: "10px 4px 0" }}>
            <span className="pw-mono" style={{ fontSize: "13px", color: "#c0322a" }}>{tr(p.give)}</span>
            <span style={{ display: "flex", gap: "6px" }} aria-label={tr("Colours")}>
              {p.swatches.map((sw, swI) => (<Fragment key={swI}>{sw.href
                ? <A href={sw.href} className="pw-sw" aria-label={sw.label} title={sw.label} style={{ background: sw.c }} />
                : <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: sw.c, border: "1px solid rgba(0,0,0,.2)" }}></span>}</Fragment>))}
            </span>
          </div>
        </article>
  </Fragment>)
  const causeTiles = CAUSES.map((c) => ({ icon: icon(c.id, c.id === 'oceans' ? 'wa' : 'a'), name: c.name, logo: c.logo, bg: c.bg, fg: c.id === 'oceans' ? '#ffffff' : '#0b0b0c', pick: () => { setTab('og'); setCause(c.id); toShop() } }))

  useEffect(() => {
    document.body.style.background = RAW_GROUND
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <>

<div className="pw2 pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />
  <Header active="/shop" cartCount={cartCount} openCart={openCart} />


  
  <section className="pw-iso" id="top" style={{ position: "relative", zIndex: "79", maxWidth: "1320px", margin: "0 auto", padding: "clamp(32px, 4vw, 64px) clamp(16px, 4vw, 56px) clamp(24px, 3vw, 40px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(32px, 5vw, 72px)" }}>
    <img className="pw-ico pw-m-hide" src="/v2/icons/ic-745e6390.svg" alt="" aria-hidden="true" style={{ left: "57.5%", top: "50px", width: "96px", transform: "rotate(9deg)" }} />
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ bottom: "-80px" }}><path d="M-60 560 C 200 650, 380 420, 560 520 C 700 600, 770 470, 690 430 C 610 390, 600 570, 770 610 C 990 660, 1160 470, 1500 540" stroke="#FF8C42" strokeWidth="8"></path></svg>
    <div style={{ flex: "1 1 520px" }}>
      <p className="pw-hand" style={{ margin: "0", fontSize: "clamp(24px, 2.4vw, 32px)", color: "#c0322a" }}>{tr("shop hope.")}</p>
      <h1 className="pw-fat" style={{ margin: "10px 0 0", fontSize: "clamp(37px, 6vw, 84px)", lineHeight: "1" }}>{tr("Wear what")}<br />{tr("you wish for.")}</h1>
      <p style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.5", color: "#3a3a3a", maxWidth: "520px" }}>{tr("Every piece supports a cause. The design decides which one.")}</p>
      <p className="pw-mono pw-shoptrust">{tr("T-shirts from")} €{PIECES.shirt.price} · {tr("Printed in Germany")} · {tr("€5 shipping")}</p>
    </div>
  </section>

  
  <section className="pw-iso" id="shop" aria-label={tr("Products")} style={{ position: "relative", zIndex: "78", maxWidth: "1320px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 56px) clamp(40px, 7vw, 72px)" }}>
    
    <div className="pw-shopbar">
      {/* Same cause, two styles: the Oceans tee in each collection shows the difference at a glance. */}
      <div role="tablist" aria-label={tr("Collections")} className="pw-split">
        <button type="button" role="tab" aria-selected={tab === 'minimal'} className="pw-split-min" onClick={() => setTab('minimal')}>
          <img className="pw-split-img" src="/v2/img/mm-oceans.webp" alt="" />
          <span className="pw-split-txt">
            <span className="pw-split-tag">{tr('NEW')}</span>
            <img className="pw-split-sig" src="/v2/img/sig-minimal-collection-white.png" alt={tr('The Minimal Collection')} />
            <span className="pw-split-line">{tr('Doing good never looked so clean.')}</span>
            <span className="pw-split-go">{tab === 'minimal' ? tr('Showing') + ' ✓' : tr('See Minimal') + ' →'}</span>
          </span>
        </button>
        <button type="button" role="tab" aria-selected={tab === 'og'} className="pw-split-og" onClick={() => setTab('og')}>
          <img className="pw-split-img" src="/v2/img/og-oceans.webp" alt="" />
          <span className="pw-split-txt">
            <span className="pw-split-tag pw-split-tag-og">{tr('THE ORIGINALS')}</span>
            <span className="pw-fat pw-split-og-t">{tr('OG collection')}</span>
            <span className="pw-split-line">{tr('Big, bold back prints.')}</span>
            <span className="pw-split-go">{tab === 'og' ? tr('Showing') + ' ✓' : tr('See OG') + ' →'}</span>
          </span>
        </button>
      </div>
      {/* One quiet way to find a piece type (Nico, 14 Oct: "searching for a tote bag only"). */}
      {tab === 'minimal' && (
        <label className="pw-piecepick">
          <span className="pw-mono">{tr('PIECE')}</span>
          <select value={piece} onChange={(e) => setPiece(e.target.value as 'all' | Kind)}>
            <option value="all">{tr('All pieces')}</option>
            {PIECE_LIST.map((p) => <option key={p.id} value={p.id}>{tr(p.filter)}</option>)}
          </select>
        </label>
      )}
    </div>

    {tab === 'minimal' && minDesign !== 'all' && (
      <div className="pw-designbar">
        <button type="button" onClick={() => pickDesign('all')}>← {tr('All designs')}</button>
        <span className="pw-fat">{MIN_DESIGNS.find((d) => d.slug === minDesign)?.name}</span>
        {/* A swirl in the design's cause colour draws itself each time a design is picked. */}
        <PickSwirl key={minDesign} color={CAUSES.find((c) => c.slug === minDesign)?.color ?? '#e2453c'} />
      </div>
    )}
    {products.some((p) => p.small) ? (
    <>
    {/* 3x3: the six designs, then a last row for pieces that support all six partners at once (Nico, 16 Oct). */}
    <div className="pw-designgrid">
      {products.map(card)}
      <div className="pw-allrow">
        <div className="pw-allintro">
          <span className="pw-mono">{tr('ONE PIECE, SIX PARTNERS')}</span>
          <h2 className="pw-fat">{tr('Support all causes in one')}</h2>
          <p>{tr('No single design. These carry our logo and support all six partners together.')}</p>
          <span className="pw-allicons" aria-hidden="true">{CAUSES.map((c) => <img key={c.id} src={icon(c.id, 'a')} alt="" />)}</span>
        </div>
        {(() => {
          const beanie = minimalLive.find((m) => kindOf(m.title) === 'beanie')
          const p = PIECE_LIST.find((x) => x.id === 'beanie')!
          return card({ ...blank, small: true, name: tr('Logo beanie'), sub: tr('Printed logo'), price: '€' + p.price, give: '€' + p.give + ' ' + tr('shared by all six'), bg: ALL_BG, isPhoto: true, photos: [{ url: BEANIE_MOCKUP }], isNew: true, swatches: [], href: beanie ? `/product/${beanie.handle}` : '', addLabel: beanie ? tr('See the beanie') : tr('Coming 11.11') }, 99)
        })()}
        {/* Embroidered logo pieces that are live in Shopify; sold-out or hidden ones stay away. */}
        {embLive.map((m, i) => {
          // Same model as the designs, split across all six (Nico, 16 Oct). Only the front is shown: there is no back print.
          const give = /hoodie/i.test(m.title) ? PIECES.hoodie.give : /shirt|tee/i.test(m.title) ? PIECES.shirt.give : ''
          const imgs = m.images.map((x) => x.url)
          const front = imgs.find((u) => /front|vorne/i.test(u)) ?? imgs.find((u) => !/back|hinten|rueck|rück/i.test(u)) ?? imgs[0] ?? ''
          const name = formatDisplayTitle(m.title).replace(/embroidered logo\s*/i, '').replace(/organic\s*/i, '')
          return card({ ...blank, small: true, name, sub: tr('Embroidered logo'), price: '€' + Number(m.priceRange.minVariantPrice.amount).toFixed(2), give: give ? '€' + give + ' ' + tr('shared by all six') : tr('For all six partners'), bg: ALL_BG, isFront: !!front, img: front, swatches: [], href: `/product/${m.handle}`, addLabel: tr('Choose your size') }, 100 + i)
        })}
      </div>
    </div>
    </>
    ) : (
    <div key={minDesign + piece} className="pw-m-g2 pw-m-prods" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", columnGap: "24px", rowGap: "44px" }}>
      {products.map(card)}
    </div>)}
    {tab === 'minimal' && minDesign !== 'all' && (() => {
      // Previous and next design at the end of the pieces, so the designs read as one loop.
      const i = MIN_DESIGNS.findIndex((d) => d.slug === minDesign)
      const prev = MIN_DESIGNS[(i + MIN_DESIGNS.length - 1) % MIN_DESIGNS.length], next = MIN_DESIGNS[(i + 1) % MIN_DESIGNS.length]
      const tile = (d: typeof prev, dir: 'prev' | 'next') => (
        <button type="button" className={`pw-designnext is-${dir}`} onClick={() => pickDesign(d.slug)} style={{ '--c': CAUSES.find((c) => c.slug === d.slug)?.color } as React.CSSProperties}>
          <img src={`/v2/img/min-${d.img}.webp`} alt="" />
          <span><span className="pw-mono">{dir === 'prev' ? '← ' + tr('PREVIOUS DESIGN') : tr('NEXT DESIGN') + ' →'}</span><span className="pw-fat">{d.name}</span></span>
        </button>
      )
      return <div className="pw-designnav">{tile(prev, 'prev')}{tile(next, 'next')}</div>
    })()}
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

// The design side leads; hovering shows the front with the small logo.
// On phones (no hover) each card flips once from the front logo to the design as it scrolls in.
function DesignPhotos({ images, colourUrl, alt }: { images: { url: string }[]; colourUrl?: string; alt: string }) {
  const pair = useDesignPairOrGuess(images, colourUrl)
  const ref = useRef<HTMLImageElement>(null)
  const lead = pair?.[0]
  useEffect(() => {
    const media = ref.current?.parentElement
    if (!media || !('IntersectionObserver' in window) || !window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { media.classList.add('pw-flip'); io.disconnect() } }, { threshold: 0.55 })
    io.observe(media)
    return () => io.disconnect()
  }, [lead])
  if (!pair) return null
  return (<>
    <img ref={ref} src={pair[0]} alt={alt} className="pw-photo" loading="lazy" />
    {pair[1] !== pair[0] && <img src={pair[1]} alt="" aria-hidden="true" className="pw-photo pw-photo2" loading="lazy" />}
  </>)
}

// A swirl in the picked design's cause colour; it draws itself once it is on screen (phones included).
function PickSwirl({ color }: { color: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { el.classList.add('is-on'); return }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { el.classList.add('is-on'); io.disconnect() } }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <svg ref={ref} className="pw-pickswirl" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength={1000} d="M-20 96 C 140 20, 260 130, 420 70 C 540 26, 600 118, 540 112 C 470 104, 500 18, 640 34 C 820 56, 880 132, 1040 84 C 1150 50, 1180 14, 1130 22 C 1080 30, 1110 108, 1240 92 C 1330 82, 1400 40, 1460 52" stroke={color} />
    </svg>
  )
}

// An OG colour's own product photo, back print first (Shopify often lists the front first).
function OgShot({ photos, alt }: { photos: { url: string }[]; alt: string }) {
  const pair = useDesignPairOrGuess(photos)
  return pair ? <img src={pair[0]} alt={alt} loading="lazy" className="pw-art" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} /> : null
}
