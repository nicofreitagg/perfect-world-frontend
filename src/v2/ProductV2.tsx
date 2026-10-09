import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CAUSES, causeBySlug, causeFg, causeTeaser } from './causes'
import { PIECES, icon } from './data'
import { getAllProducts } from '../utils/shopify'
import { getCollectionKey, extractProductType, extractColorFromTitle } from '../utils/productGrouping'
import type { ShopifyProduct, ShopifyVariant } from '../types/shopify.types'
import NotFound from '../pages/NotFound'
import { useT } from './t'

type Kind = 'tote' | 'tshirt' | 'oversized' | 'hoodie'
const PIECE_LIST: { id: Kind; name: string; upper: string; give: string; price: string }[] = [
  { id: 'tote', name: 'Tote bag', upper: 'TOTE BAG', give: PIECES.tote.give, price: PIECES.tote.price },
  { id: 'tshirt', name: 'T-shirt', upper: 'T-SHIRT', give: PIECES.shirt.give, price: PIECES.shirt.price },
  { id: 'oversized', name: 'Oversized shirt', upper: 'OVERSIZED SHIRT', give: PIECES.oversized.give, price: PIECES.oversized.price },
  { id: 'hoodie', name: 'Hoodie', upper: 'HOODIE', give: PIECES.hoodie.give, price: PIECES.hoodie.price },
]
const sizeOf = (v: ShopifyVariant) => v.selectedOptions?.find((o) => /size|gr(ö|oe)(ß|ss)e/i.test(o.name))?.value ?? v.title
const money = (n: number) => n.toFixed(2)
import './v2.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import Sustain from './Sustain'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'

export default function ProductV2() {
  const tr = useT()
  usePageTitle('Shop | Perfect World')
  const { cartCount, isCartOpen, openCart, closeCart, addToCart } = useCart()
  const { slug } = useParams()
  const navigate = useNavigate()
  const raw = causeBySlug(slug)
  const [all, setAll] = useState<ShopifyProduct[] | null>(null)
  const [kind, setKind] = useState<Kind>('tshirt')
  const [colour, setColour] = useState('')
  const [size, setSize] = useState('M')
  const [shotIdx, setShot] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => { getAllProducts().then(setAll).catch(() => setAll([])) }, [])
  useEffect(() => { setShot(0); setAdded(false) }, [slug, kind, colour, size])

  // This design's real Shopify products, grouped by piece.
  const mine = useMemo(() => (all ?? []).filter((p) => raw && getCollectionKey(p.title) === raw.name && !/minimal/i.test(p.title)), [all, raw])
  const kinds = PIECE_LIST.filter((k) => mine.some((p) => extractProductType(p.title) === k.id))
  const piece = kinds.find((k) => k.id === kind) ?? kinds[0] ?? PIECE_LIST[1]
  // Shopify can hold two products for the same colour; show each colour once, using the one with most sizes in stock.
  const ofKind = useMemo(() => {
    const byColour = new Map<string, ShopifyProduct>()
    const stock = (p: ShopifyProduct) => p.variants.filter((v) => v.availableForSale).length
    for (const p of mine.filter((m) => extractProductType(m.title) === piece.id)) {
      const key = (extractColorFromTitle(p.title) || p.title).trim().toLowerCase()
      const had = byColour.get(key)
      if (!had || stock(p) > stock(had)) byColour.set(key, p)
    }
    return [...byColour.values()]
  }, [mine, piece.id])
  const colourNames = ofKind.map((p) => (extractColorFromTitle(p.title) || p.title).trim())
  const product = ofKind[Math.max(colourNames.indexOf(colour), 0)]
  const variants = product?.variants ?? []
  const variant = variants.find((v) => sizeOf(v) === size && v.availableForSale) ?? variants.find((v) => v.availableForSale)
  const images = product?.images ?? []
  const photo = images[shotIdx]?.url ?? ''
  const price = variant ? Number(variant.price.amount) : Number(piece.price)

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  if (!raw) return <NotFound />
  const c = { ...raw, icoA: icon(raw.id, 'a'), icoB: icon(raw.id, 'b'), hasPrint: !!raw.print, noPrint: !raw.print, fg: causeFg(raw), partnerLower: raw.partner.toLowerCase(), teaser: causeTeaser(raw) }
  const on = (yes: boolean) => ({ selected: yes, bg: yes ? '#0b0b0c' : '#ffffff', fg: yes ? '#ffffff' : '#0b0b0c' })
  const shownPiece = { ...piece, price: money(price) }
  const help = { partner: raw.partner }
  const designs = CAUSES.map((d) => ({ name: d.name, color: d.color, ring: d.id === raw.id ? '#0b0b0c' : 'transparent', selected: d.id === raw.id, pick: () => navigate(`/design/${d.slug}`) }))
  const pieces = (kinds.length ? kinds : [piece]).map((p) => ({ name: p.name, pick: () => setKind(p.id), ...on(p.id === piece.id) }))
  const colours = colourNames.map((n, k) => ({ label: tr(n), pick: () => setColour(n), disabled: false, ...on(ofKind[k] === product) }))
  const sizes = variants.map((v) => ({ label: sizeOf(v), pick: () => setSize(sizeOf(v)), disabled: !v.availableForSale, ...on(v === variant) }))
  const shownSize = variant ? sizeOf(variant) : ''
  const addLabel = all === null ? tr('LOADING…') : !variant ? tr(all.length ? 'SOLD OUT' : 'SHOP IS OFFLINE, TRY AGAIN SOON') : added ? tr('ADDED. THANK YOU.') : `${tr('ADD TO CART')} · €${money(price)}`
  const add = () => {
    if (!variant || !product) return
    addToCart({ variantId: variant.id, productId: product.id, title: product.title, variant: variant.title, price, image: images[0]?.url ?? raw.print, quantity: 1 })
    setAdded(true)
    openCart()
  }


  return (
    <>

<div className="pw2 pw-grain" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />
  <Header active="/shop" cartCount={cartCount} openCart={openCart} />

  <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "18px clamp(16px, 4vw, 56px) 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
    <p className="pw-mono" style={{ margin: "0", fontSize: "12px", color: "#5c5c5c" }}><A href="/shop" style={{ color: "#5c5c5c" }}>{tr("SHOP")}</A> / {c.name} / {tr(piece.upper)}</p>
    <div role="group" aria-label={tr("Switch design")} style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
      <span className="pw-mono" style={{ fontSize: "11px", color: "#8a8a8a", marginRight: "4px" }}>{tr("DESIGN:")}</span>
      {designs.map((d, dI) => (<Fragment key={dI}>
        <button type="button" onClick={d.pick} aria-pressed={d.selected} title={d.name} style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", background: d.color, border: `2px solid ${d.ring}` }}></button>
      </Fragment>))}
    </div>
  </div>

  <section className="pw-iso" aria-label={tr("Product")} style={{ position: "relative", zIndex: "79", maxWidth: "1320px", margin: "0 auto", padding: "22px clamp(16px, 4vw, 56px) clamp(56px, 7vw, 96px)", display: "flex", flexWrap: "wrap", gap: "clamp(28px, 4vw, 64px)", alignItems: "flex-start" }}>
    <img className="pw-ico" src={c.icoA} alt="" aria-hidden="true" style={{ left: "92%", top: "290px", width: "96px", transform: "rotate(-8deg)" }} /><img className="pw-ico pw-m-hide" src={c.icoB} alt="" aria-hidden="true" style={{ left: "93.5%", top: "910px", width: "84px", transform: "rotate(10deg)" }} />
    <svg className="pw-swirl pw-wide" viewBox="0 0 1440 720" aria-hidden="true" style={{ top: "380px" }}><path d="M-60 260 C 160 120, 330 330, 470 250 C 560 200, 520 120, 465 150 C 400 185, 470 330, 640 300 C 820 268, 900 120, 1060 170 C 1160 200, 1150 300, 1080 290 C 1010 280, 1080 140, 1240 130 C 1350 124, 1420 170, 1500 150" stroke="#FF8C42" strokeWidth="7"></path></svg>

    <div style={{ flex: "1 1 520px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "28px", overflow: "hidden", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
        {photo ? <img src={photo} alt={`${c.name} ${piece.name}`} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} /> : c.hasPrint && (<><img src={c.print} alt={`${c.name} back print`} style={{ position: "relative", width: "74%", height: "74%", objectFit: "contain", filter: "drop-shadow(0 22px 24px rgba(0,0,0,.2))" }} /></>)}
        {c.noPrint && (<><span className="pw-hand" style={{ position: "relative", fontSize: "64px", textAlign: "center", lineHeight: "1" }}>{c.name}</span></>)}
      </div>
      {images.length > 1 && (<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {images.slice(0, 3).map((im, k) => (
          <button type="button" key={im.url} onClick={() => setShot(k)} aria-pressed={k === shotIdx} style={{ aspectRatio: "1 / 1", borderRadius: "18px", background: "#ffffff", border: k === shotIdx ? "2px solid #0b0b0c" : "1px solid #e3e1dc", padding: "0", overflow: "hidden", cursor: "pointer" }}><img src={im.url} alt={im.altText ?? ''} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></button>
        ))}
      </div>)}
    </div>

    <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "26px" }}>
      <div>
        <p className="pw-hand" style={{ margin: "0", fontSize: "28px", color: "#c0322a" }}>{tr("made with")} {c.partnerLower}</p>
        <h1 className="pw-fat" style={{ margin: "8px 0 0", fontSize: "clamp(44px, 5vw, 72px)", lineHeight: ".92" }}>{c.name}<br />{tr(piece.upper)}</h1>
        <p  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", margin: "14px 0 0", fontSize: "22px" }}>{tr(c.line)}</p>
        <p className="pw-mono" style={{ margin: "16px 0 0", fontSize: "22px" }}>€{shownPiece.price}</p>
      </div>

      <div>
        <p className="pw-mono" style={{ margin: "0 0 10px", fontSize: "12px", color: "#5c5c5c" }}>{tr("PIECE")}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {pieces.map((p, pI) => (<Fragment key={pI}>
            <button type="button" className="pw-chip" onClick={p.pick} aria-pressed={p.selected} style={{ fontFamily: "inherit", fontSize: "14px", fontWeight: "600", padding: "0 18px", minHeight: "44px", borderRadius: "999px", border: "1.5px solid #0b0b0c", cursor: "pointer", background: p.bg, color: p.fg }}>{tr(p.name)}</button>
          </Fragment>))}
        </div>
      </div>

{colours.length > 1 && (
      <div>
        <p className="pw-mono" style={{ margin: "0 0 10px", fontSize: "12px", color: "#5c5c5c" }}>{tr("COLOUR")}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {colours.map((z, zI) => (<Fragment key={zI}>
            <button type="button" className="pw-chip" onClick={z.pick} aria-pressed={z.selected} disabled={z.disabled} style={{ fontSize: "14px", minWidth: "52px", minHeight: "44px", borderRadius: "12px", border: "1.5px solid #0b0b0c", cursor: "pointer", background: z.bg, color: z.fg }}>{z.label}</button>
          </Fragment>))}
        </div>
      </div>
      )}
      <div>
        <p className="pw-mono" style={{ margin: "0 0 10px", fontSize: "12px", color: "#5c5c5c", display: "flex", justifyContent: "space-between", gap: "12px" }}><span>{tr("SIZE")}</span><A href={`/size-guide#${kind}`} style={{ color: "#0b0b0c" }}>{tr("Size guide")}</A></p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {sizes.map((z, zI) => (<Fragment key={zI}>
            <button type="button" className="pw-chip pw-mono" onClick={z.pick} aria-pressed={z.selected} disabled={z.disabled} style={{ fontSize: "14px", minWidth: "52px", minHeight: "44px", borderRadius: "12px", border: "1.5px solid #0b0b0c", cursor: "pointer", background: z.bg, color: z.fg }}>{z.label}</button>
          </Fragment>))}
        </div>
      </div>

      <div style={{ filter: "drop-shadow(0 18px 26px rgba(0,0,0,.12))", transform: "rotate(-.8deg)" }}>
        <div className="pw-mono" style={{ background: "#ffffff", padding: "22px 24px 18px", fontSize: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#5c5c5c", borderBottom: "1px dashed #bdbab3", paddingBottom: "12px" }}><span>{tr("PERFECT WORLD")}</span><span>{tr("WHAT THIS PIECE GIVES")}</span></div>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#5c5c5c" }}>{tr("WHO IT HELPS")}</p><p style={{ margin: "0", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", lineHeight: "1.45", color: "#0b0b0c" }}>{tr("This design was made with")} <b>{c.partner}</b>{tr(", so its amount always goes to them.")} <A href="/projects" style={{ color: "#c0322a" }}>{tr("Meet all six partners.")}</A></p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed #bdbab3", paddingTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><span>{c.name} {tr(piece.upper)} · {shownSize}</span><span>€{shownPiece.price}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", color: "#5c5c5c" }}><span>{tr("Shipping")}</span><span>€5.00</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontWeight: "600" }}><span>→ {help.partner}</span><span style={{ color: "#c0322a" }}>€{piece.give}</span></div>
          </div>
          <p  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", margin: "0", fontSize: "22px", lineHeight: "1.2", color: "#0b0b0c" }}>€{piece.give} {tr("goes to")} {help.partner}{tr(". Same amount, every time.")}</p>
        </div>
        <div className="pw-tear" aria-hidden="true"></div>
      </div>

      <button type="button" onClick={add} disabled={!variant}  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: "700", fontSize: "17px", minHeight: "60px", border: "none", borderRadius: "999px", background: "#0b0b0c", color: "#ffffff", cursor: "pointer" }}>{addLabel}</button>

      <div className="pw-mono" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "12px", color: "#3a3a3a", lineHeight: "1.5" }}>
        <span style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "14px", padding: "12px 14px" }}>{tr("MADE TO ORDER")}<br /><span style={{ color: "#5c5c5c" }}>{tr("Printed just for you")}</span></span>
        <span style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "14px", padding: "12px 14px" }}>{tr("ABOUT 1½ TO 2 WEEKS")}<br /><span style={{ color: "#5c5c5c" }}>{tr("Depends on where you live")}</span></span>
        <span style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "14px", padding: "12px 14px" }}>{tr("SHIPPING €5")}<br /><span style={{ color: "#5c5c5c" }}>{tr("On every order")}</span></span>
        <span style={{ background: "#ffffff", border: "1px solid #e3e1dc", borderRadius: "14px", padding: "12px 14px" }}>{tr("ORGANIC COTTON")}<br /><span style={{ color: "#5c5c5c" }}>{tr("Stanley/Stella, GOTS certified")}</span></span>
      </div>
    </div>
  </section>

  <section className="pw-iso" aria-label={tr("The story behind the design")} style={{ position: "relative", zIndex: "78", padding: "0 clamp(12px, 2.5vw, 32px) clamp(48px, 6vw, 80px)" }}>
    <div style={{ position: "relative", overflow: "hidden", maxWidth: "1400px", margin: "0 auto", borderRadius: "36px", background: c.bg, color: c.fg, padding: "clamp(32px, 5vw, 72px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "36px" }}>
      <img src="/v2/img/banner-hands.png" alt="" className="pw-hands" />
      <span style={{ position: "relative", width: "120px", height: "120px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px rgba(0,0,0,.14)", flex: "0 0 auto" }}><img src={c.logo} alt={`${c.partner} logo`} style={{ maxWidth: "88px", maxHeight: "76px", objectFit: "contain" }} /></span>
      <div style={{ position: "relative", flex: "1 1 460px" }}>
        <p className="pw-hand" style={{ margin: "0", fontSize: "26px" }}>{tr("the story behind the design")}</p>
        <p className="pw-fat" style={{ margin: "8px 0 0", fontSize: "clamp(32px, 3.6vw, 52px)", lineHeight: ".95" }}>{c.name} · {tr(c.place)}</p>
        <p style={{ margin: "14px 0 0", fontSize: "17px", lineHeight: "1.55", maxWidth: "640px" }}>{tr(c.teaser)}</p>
        <A href={`/project/${c.slug}`} style={{ display: "inline-block", marginTop: "20px", background: "#0b0b0c", color: "#ffffff", textDecoration: "none", fontWeight: "600", fontSize: "15px", padding: "13px 22px", borderRadius: "999px" }}>{tr("Meet")} {c.partner} →</A>
      </div>
    </div>
  </section>

  <Sustain />
  <Footer icons={[c.icoA, c.icoB]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
