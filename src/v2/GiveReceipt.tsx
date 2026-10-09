import { useEffect, useMemo, useState } from 'react'
import { A } from './A'
import { CAUSES, causeTitle } from './causes'
import { PIECES, NEW_PIECES, type CauseKey } from './data'
import { useT } from './t'
import { isLaunched } from './launch'
import { getAllProducts } from '../utils/shopify'
import { getCollectionKey, extractProductType } from '../utils/productGrouping'
import type { ShopifyProduct } from '../types/shopify.types'

// Home: one piece, its fixed amount and who receives it, side by side.
// Amounts come from PIECES / NEW_PIECES; the partner always follows from the design.
type PieceId = 'tote' | 'tshirt' | 'oversized' | 'hoodie' | 'bomber' | 'beanie'
const bomber = NEW_PIECES.find((n) => n.id === 'bomber')!
const beanie = NEW_PIECES.find((n) => n.id === 'beanie')!
const ROWS: { id: PieceId; label: string; price: string; give: string; soon?: boolean; split?: boolean }[] = [
  { id: 'tshirt', label: 'T-shirt', price: PIECES.shirt.price, give: PIECES.shirt.give },
  { id: 'hoodie', label: 'Hoodie', price: PIECES.hoodie.price, give: PIECES.hoodie.give },
  { id: 'oversized', label: 'Oversized shirt', price: PIECES.oversized.price, give: PIECES.oversized.give },
  { id: 'tote', label: 'Tote bag', price: PIECES.tote.price, give: PIECES.tote.give },
  { id: 'bomber', label: 'Bomber jacket', price: bomber.price, give: bomber.give, soon: true },
  { id: 'beanie', label: 'Beanie', price: beanie.price, give: beanie.give, soon: true, split: true },
]
const eur = (s: string) => '€' + s

export default function GiveReceipt() {
  const t = useT()
  const [piece, setPiece] = useState<PieceId>('tshirt')
  const [design, setDesign] = useState<CauseKey>('talk')
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  useEffect(() => { getAllProducts().then(setProducts).catch(() => {}) }, [])

  const row = ROWS.find((r) => r.id === piece)!
  const cause = CAUSES.find((c) => c.id === design)!
  const product = useMemo(() => products.find((p) => !/minimal/i.test(p.title) && getCollectionKey(p.title) === cause.name && extractProductType(p.title) === piece), [products, cause.name, piece])
  const photo = row.soon ? '' : product?.images[0]?.url || (cause.id === 'rich' ? '/v2/img/og-rich-700.webp' : cause.print)
  const each = (Number(row.give) / CAUSES.length).toFixed(2)
  const key = `${piece}-${row.split ? 'all' : design}`

  return (
    <div className="pwl-give">
      <div className="pwl-give-controls">
        <div role="group" aria-label={t('Piece')}>
          <p className="pwl-label">{t('1 · PICK A PIECE')}</p>
          <div className="pwl-chips">
            {ROWS.map((r) => (
              <button key={r.id} type="button" className="pwl-chip" aria-pressed={r.id === piece} onClick={() => setPiece(r.id)}>
                {t(r.label)}{r.soon && <span className="pwl-chip-soon">{t('soon')}</span>}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-label={t('Design')}>
          <p className="pwl-label">{t('2 · PICK A DESIGN')}</p>
          {row.split ? (
            <p className="pwl-note">{t('The beanie only carries the logo, so its amount is shared equally by all six partners.')}</p>
          ) : (
            <div className="pwl-chips">
              {CAUSES.map((c) => (
                <button key={c.id} type="button" className="pwl-chip" aria-pressed={c.id === design} onClick={() => setDesign(c.id)}>
                  <span className="pwl-dot" style={{ background: c.color }} aria-hidden="true" />{causeTitle(c.name)}
                </button>
              ))}
            </div>
          )}
          {!row.split && <p className="pwl-note">{t('The design decides the partner. Each design was made with one of them.')}</p>}
        </div>
      </div>

      <div className="pwl-give-stage" aria-live="polite">
        <figure className="pwl-give-media" key={'m' + key}>
          {photo ? (
            <img src={photo} alt={`${t(row.label)}, ${causeTitle(cause.name)}`} loading="lazy" />
          ) : (
            <PieceSketch id={piece} />
          )}
          <figcaption>{photo ? (product ? t('Product photo') : t('Design artwork')) : t('Sketch · photos follow')}</figcaption>
        </figure>

        <svg className="pwl-give-line" viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden="true" key={'l' + key}>
          <path d="M2 34 C 22 26, 38 40, 58 30 S 96 22, 112 30" pathLength={1000} />
          <circle cx="114" cy="30" r="4" />
        </svg>

        <div className="pwl-receipt" key={'r' + key}>
          <div className="pwl-receipt-head">
            <img src="/v2/img/logo-black.png" alt="Perfect World" />
            <span>{t('11:11 · WHAT THIS PIECE GIVES')}</span>
          </div>
          <dl>
            <div><dt>{t('PIECE')}</dt><dd>{row.split ? t('Logo beanie') : `${causeTitle(cause.name)} · ${t(row.label)}`}</dd></div>
            <div><dt>{t('PRICE')}</dt><dd>{eur(row.price)}</dd></div>
            <div className="pwl-receipt-give">
              <dt>{t('INCLUDED FOR')} {row.split ? t('ALL SIX PARTNERS') : cause.partner.toUpperCase()}</dt>
              <dd><span className="pwl-amount">{eur(row.give)}<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 26 4, 60 10, 98 4" /></svg></span></dd>
            </div>
          </dl>
          {row.split ? (
            <div className="pwl-receipt-partners">
              <div className="pwl-logos">{CAUSES.map((c) => <span key={c.id}><img src={c.logo} alt={c.partner} /></span>)}</div>
              <p>{t('About')} €{each} {t('to each partner')}</p>
            </div>
          ) : (
            <div className="pwl-receipt-partner">
              <span><img src={cause.logo} alt="" /></span>
              <p><b>{cause.partner}</b><br />{t(cause.place)}</p>
            </div>
          )}
          <p className="pwl-receipt-foot">{t('Included in the price. Nothing is added at checkout.')}{!isLaunched() && <><br />{t('Fixed amounts apply from 11.11.')}</>}{row.soon && <><br />{t('Coming soon · price not final yet.')}</>}</p>
          {!row.soon && <A href={`/design/${cause.slug}`} className="pwl-receipt-cta">{t('See this piece')} →</A>}
          <div className="pw-tear" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

/** Simple line drawings for pieces without photos yet, clearly not product shots. */
export function PieceSketch({ id }: { id: string }) {
  const stroke = { fill: 'none', stroke: '#0b0b0c', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label="Sketch" className="pwl-sketch">
      {id === 'beanie' && (<><path d="M84 190 Q80 70 150 66 Q220 70 216 190" {...stroke} /><rect x="72" y="180" width="156" height="58" rx="10" {...stroke} /><path d="M92 186 V232 M112 186 V232 M188 186 V232 M208 186 V232" {...stroke} strokeWidth={2} /><rect x="134" y="196" width="32" height="24" rx="3" fill="#e2453c" /></>)}
      {id === 'bomber' && (<><path d="M108 40 L134 30 L166 30 L192 40 L256 98 L244 260 L218 262 L214 140 L214 276 L86 276 L86 140 L82 262 L56 260 L44 98 Z" {...stroke} /><path d="M150 40 V276 M86 264 H214" {...stroke} strokeWidth={2} /><path d="M164 92 h18" stroke="#e2453c" strokeWidth={4} strokeLinecap="round" /></>)}
      {id === 'women' && (<><path d="M100 50 L132 38 Q150 56 168 38 L200 50 L260 92 L238 124 L210 108 Q198 180 218 252 L82 252 Q102 180 90 108 L62 124 L40 92 Z" {...stroke} /><path d="M164 96 h18" stroke="#e2453c" strokeWidth={4} strokeLinecap="round" /></>)}
      {id === 'minimal' && (<><path d="M96 46 L128 34 Q150 54 172 34 L204 46 L262 98 L232 134 L214 118 L214 270 L86 270 L86 118 L68 134 L38 98 Z" {...stroke} /><path d="M164 100 h18" stroke="#e2453c" strokeWidth={4} strokeLinecap="round" /></>)}
    </svg>
  )
}
