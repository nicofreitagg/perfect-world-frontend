import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './v2.css'
import './landing.css'
import Flow from './Flow'
import { Lines } from './Seams'

import { Header, Footer } from './Chrome'
import { A } from './A'
import { getAllProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import { CAUSES, causeBySlug, causeTitle as titleCase } from './causes'
import { PIECES, MIN_DESIGNS, icon, minDesignOf, pieceOf, type CauseKey } from './data'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'
import { useT } from './t'
import { FAQ } from './faq'

const Globe3D = lazy(() => import('./Globe3D'))


// Cold visitors first (Nico's boss, 15 Oct): each Minimal design shown as a real garment, gently moving.
const ALIVE = [
  { slug: 'talk-about-it', img: 'talk', piece: 'Hoodie' },
  { slug: 'endangered-oceans', img: 'oceans', piece: 'T-shirt' },
  { slug: 'cool-down', img: 'cool', piece: 'T-shirt' },
  { slug: 'one-world', img: 'one-world-oversized', piece: 'Oversized shirt' },
  { slug: 'wild-at-heart', img: 'wild', piece: 'T-shirt' },
  { slug: 'rich-in-life', img: 'rich', piece: 'T-shirt' },
]
// Three pieces up front, each with only its price and where its amount goes.
const BEST = [
  { slug: 'endangered-oceans', img: 'oceans', kind: 'tshirt', piece: 'T-shirt', price: PIECES.shirt.price, give: PIECES.shirt.give },
  { slug: 'talk-about-it', img: 'talk', kind: 'hoodie', piece: 'Hoodie', price: PIECES.hoodie.price, give: PIECES.hoodie.give },
  { slug: 'cool-down', img: 'cool-tote', kind: 'tote', piece: 'Tote bag', price: PIECES.tote.price, give: PIECES.tote.give },
]
// Real photos of the pieces being worn; the lake shoot (24 Oct) can replace them.
const WORN = [
  { src: '/v2/img/hero-friends-800.webp', alt: 'Four friends on a bench wearing Perfect World hoodies', cap: 'Out with friends' },
  { src: '/v2/img/park-tees-900.webp', alt: 'Friends in a park wearing Perfect World T-shirts', cap: 'Sundays in the park' },
  { src: '/v2/img/two-friends-700.webp', alt: 'Two friends at sunset in Perfect World T-shirts', cap: 'Golden hour' },
  { src: '/v2/img/photo-og-back.jpg', alt: 'The back print of a Perfect World T-shirt', cap: 'Every day' },
]

/** The film fills the hero and plays by itself, muted and looping. It opens on the 11.11 card, then the copy fades in over it. */
function AutoFilm({ src, poster, card, label, children }: { src: string; poster: string; card: string; label: string; children: React.ReactNode }) {
  const tr = useT()
  const ref = useRef<HTMLVideoElement>(null)
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [intro, setIntro] = useState(!still)
  const [muted, setMuted] = useState(true)
  useEffect(() => {
    if (still) return
    const id = setTimeout(() => { setIntro(false); ref.current?.play().catch(() => {}) }, 2200)
    return () => clearTimeout(id)
  }, [still])
  const sound = () => { const v = ref.current; if (!v) return; v.muted = !muted; setMuted(!muted); setIntro(false); v.play().catch(() => {}) }
  return (
    <div className="pwl-cine-box">
    <div className="pwl-cine-stage">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="auto" aria-label={label} className="pwl-autofilm" />
      <div className="pwl-cine-shade" aria-hidden="true" />
      <img src={card} alt="" aria-hidden="true" className={'pwl-autofilm-card' + (intro ? '' : ' is-gone')} />
      <button type="button" className="pwl-autofilm-sound" onClick={sound} aria-pressed={!muted}>{muted ? tr('Sound on') : tr('Sound off')}</button>
    </div>
    {/* On wide screens the copy sits on the film; narrower, it sits under it so it never meets the film's own captions. */}
    <div className={'pwl-cine-over' + (intro ? '' : ' is-in')}>{children}</div>
    </div>
  )
}

/** The six Minimal designs: the artwork draws itself, then the piece it's printed on floats in. Cycles until someone picks one. */
function DesignStage() {
  const tr = useT()
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % ALIVE.length), 5200)
    return () => clearInterval(id)
  }, [auto])
  const a = ALIVE[i]
  const c = causeBySlug(a.slug)
  const d = MIN_DESIGNS.find((x) => x.slug === a.slug)!
  return (
    <div className="pwl-stage" style={{ ['--c' as string]: c?.color ?? '#999' }}>
      <div className="pwl-stage-show" key={a.slug} aria-live="polite">
        <img className="pwl-stage-art" src={`/v2/img/art-${a.slug}-w.webp`} alt={`${d.name}, ${tr('artwork')}`} />
        <img className="pwl-stage-piece" src={`/v2/img/mm-${a.img}.webp`} alt={`${d.name} ${tr(a.piece)}`} />
        <div className="pwl-stage-cap">
          <span className="pwl-tag">{tr('New')}</span>
          <p className="pwl-stage-name pw-fat">{d.name}</p>
          <p className="pwl-stage-who">{tr('Supports')} {c?.partner}{c ? `, ${tr(c.place)}` : ''}</p>
          <A href={`/shop?design=${a.slug}`} className="pwl-link">{tr('Shop this design')} →</A>
        </div>
      </div>
      <ul className="pwl-alive" aria-label={tr('The six designs')}>
        {ALIVE.map((x, n) => {
          const dx = MIN_DESIGNS.find((y) => y.slug === x.slug)!
          const cx = causeBySlug(x.slug)
          return (
            <li key={x.slug} style={{ ['--c' as string]: cx?.color ?? '#999', ['--d' as string]: `${n * -0.9}s` }}>
              <button type="button" className="pwl-alive-card" aria-pressed={n === i} onClick={() => { setI(n); setAuto(false) }}>
                <span className="pwl-alive-img"><img src={`/v2/img/mm-${x.img}.webp`} alt="" loading="lazy" /></span>
                <span className="pwl-alive-name">{dx.name}</span>
                <span className="pwl-alive-cause">{cx ? titleCase(cx.name) : ''}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Ico({ c, w = false, style }: { c: CauseKey; w?: boolean; style: React.CSSProperties }) {
  return <img className="pwl-ico" src={icon(c, w ? 'wa' : 'a')} alt="" aria-hidden="true" style={style} />
}

const LOOKS = ['now', 'raw', 'dark', 'mix'] as const
type Look = typeof LOOKS[number]
const LOOK_GROUND: Record<Look, string> = { now: '#f5f4f1', raw: '#ece3d2', dark: '#13110f', mix: '#ece3d2' }
const LOOK_NAMES: [string, string][] = [['now', 'Now'], ['raw', 'Natural Raw'], ['dark', 'Dark'], ['mix', 'Raw + dark']]

// Floating switch between the trial looks (only shown when a look is in the link).
function LookSwitch({ look }: { look: string }) {
  return (
    <nav className="pwl-lookswitch" aria-label="Colour look">
      {LOOK_NAMES.map(([k, name]) => <a key={k} href={`/?look=${k}`} aria-current={look === k ? 'true' : undefined}>{name}</a>)}
    </nav>
  )
}

export default function HomeV2() {
  const tr = useT()
  usePageTitle()
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()

  // Dark is the home look (Nico, 14 Oct); ?look= still shows the others for comparison.
  const asked = useMemo(() => { const l = new URLSearchParams(window.location.search).get('look') ?? ''; return (LOOKS as readonly string[]).includes(l) ? l as Look : null }, [])
  const look: Look = asked ?? 'dark'
  const darkMin = look === 'dark' || look === 'mix'
  useEffect(() => {
    document.body.style.background = LOOK_GROUND[look]
    return () => { document.body.style.background = '' }
  }, [look])

  // Links like /#faq (footer) land on that section.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
  }, [])

  // The 3D globe only loads when the causes section comes close, and only on larger screens.
  const globeBox = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState<ShopifyProduct[]>([])
  useEffect(() => { getAllProducts().then((all) => setLive(all.filter((p) => /minimal/i.test(p.title) && p.images.length))).catch(() => {}) }, [])
  const [show3d, setShow3d] = useState(false)
  const [allQ, setAllQ] = useState(false)
  const [globe3d, setGlobe3d] = useState(false)
  const onGlobe = useCallback(() => setGlobe3d(true), [])
  useEffect(() => {
    const el = globeBox.current
    if (!el || !window.matchMedia('(min-width: 900px)').matches || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setShow3d(true); io.disconnect() } }, { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
<div className={'pw2 pw-page pw-grain pwl look-' + look} style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "var(--ink)" }}>
  <Flow />
  <Header big dark={look === 'dark'} active="/" cartCount={cartCount} openCart={openCart} />
  {asked && <LookSwitch look={look} />}

  {/* 1 · Hero: the film fills the first screen; it opens on the 11.11 card, then the line and SHOP HOPE come in */}
  <section id="top" className="pwl-cine pw-iso">
    <AutoFilm src="/assets/videos/home-film-720.mp4" poster="/v2/img/hero-film-poster.webp" card="/v2/img/hero-thumb-1111.webp" label={tr('Perfect World film: the future exists for those who dare to dream')}>
      <h1 className="pwl-head">
        <span className="pw-hand pwl-head-a">{tr('Wear the world you')}</span>
        <span className="pwl-head-row"><span className="pwl-hope pw-fat">{tr('HOPE')}<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path className="pw-draw pw-loop" pathLength={1000} d="M306 20 C 236 0, 104 4, 44 46 C -2 80, 6 148, 88 176 C 172 204, 318 198, 372 152 C 408 120, 398 60, 330 32 C 282 12, 222 10, 160 22" /></svg></span>
<span className="pw-hand pwl-head-b">{tr('for.')}</span></span>
      </h1>
      <p className="pwl-cine-lede">{tr('Clothing that helps the world: every piece supports a cause.')} <b>{tr('Join the movement.')}</b></p>
      <A href="/shop" className="pwl-btn pwl-cine-btn">{tr('SHOP HOPE')}</A>
    </AutoFilm>
  </section>

  <Lines />

  {/* 2 · New: the Minimal designs, shown as the clothes they are */}
  <section id="minimal" className="pwl-sec pwl-min pw-iso" aria-label={tr('The Minimal Collection')}>
    <div className="pwl-wrap pwl-center">
      <p className="pwl-kicker">{tr('NEW COLLECTION')}</p>
      <h2 className="pwl-min-h"><A href="/shop#shop" className="pwl-min-hlink"><span className="pwl-min-new">{tr('New')}</span><img className="pw-sig" src={darkMin ? "/v2/img/sig-minimal-collection-white.png" : "/v2/img/sig-minimal-collection-black.png"} alt={tr('The Minimal Collection')} /></A></h2>
      <p className="pwl-sub">{tr('Six new designs on T-shirts, hoodies, totes and more. Each one supports its own cause.')}</p>
      <DesignStage />
      <div className="pwl-ctas pwl-ctas-c">
        <A href="/shop#shop" className="pwl-btn">{tr('Shop the collection')}</A>
      </div>
    </div>
  </section>

  {/* 3 · Best sellers: the piece, its price, and simply where the money goes */}
  <section id="best" className="pwl-sec pw-iso" aria-labelledby="best-h">
    <div className="pwl-wrap">
      <h2 id="best-h" className="pw-fat pwl-h2 pwl-center">{tr('Best sellers')}</h2>
      <ul className="pwl-best">
        {BEST.map((b) => {
          const c = causeBySlug(b.slug)!
          const d = MIN_DESIGNS.find((x) => x.slug === b.slug)!
          const ph = live.find((p) => minDesignOf(p.title)?.slug === b.slug && pieceOf(p.title) === b.kind)
          return (
            <li key={b.img}>
              <A href={ph ? `/product/${ph.handle}` : `/shop?design=${b.slug}`} className="pwl-best-card">
                <span className="pwl-best-img" style={{ ['--c' as string]: c.color }}><img src={`/v2/img/mm-${b.img}.webp`} alt={`${d.name} ${tr(b.piece)}`} loading="lazy" /></span>
                <span className="pwl-best-name">{d.name} · {tr(b.piece)}<span>€{b.price}</span></span>
                <span className="pwl-best-give">
                  <span className="pwl-best-logo"><img src={c.logo} alt="" /></span>
                  <span><b className="pw-fat">€{b.give}</b> {tr('goes to')} {c.partner}</span>
                </span>
              </A>
            </li>
          )
        })}
      </ul>
      <p className="pwl-fine pwl-center">{tr('Already included in the price, never added on top.')} <A href="/how-giving-works" className="pwl-link">{tr('See every piece')} →</A></p>
    </div>
  </section>

  {/* 4 · Worn in real life */}
  <section id="worn" className="pwl-sec pw-iso" aria-labelledby="worn-h">
    <div className="pwl-wrap">
      <div className="pwl-center">
        <h2 id="worn-h" className="pw-fat pwl-h2">{tr('Made to be worn.')}</h2>
        <p className="pwl-sub">{tr('Soft, everyday clothes. Your cause comes with you.')}</p>
      </div>
      <ul className="pwl-life">
        {WORN.map((w) => (
          <li key={w.src}><img src={w.src} alt={tr(w.alt)} loading="lazy" /><span>{tr(w.cap)}</span></li>
        ))}
      </ul>
    </div>
  </section>

  {/* 5 · The six causes and the people behind them */}
  <section id="causes" className="pwl-sec pwl-earth pw-iso" aria-labelledby="causes-h">
    <div className="pwl-wrap">
      <div className="pwl-causes-top">
        <div>
          <p className="pwl-kicker pwl-kicker-l">{tr('SIX PLACES · ONE HOPE')}</p>
          <h2 id="causes-h" className="pw-fat pwl-h2">{tr('The people doing the work.')}</h2>
          <p className="pwl-sub">{tr('Far away and right next door, people are already making these wishes come true. Every collection was made with one of them.')}</p>
          <A href="/projects" className="pwl-link pwl-link-l">{tr('All six causes')} →</A>
        </div>
        <div ref={globeBox} className={globe3d ? 'pwl-globe is-3d' : 'pwl-globe'}>
          <div className="pwl-globe-flat" role="img" aria-label={tr('Globe with the six causes marked')} />
          {show3d && <Suspense fallback={null}><Globe3D onReady={onGlobe} /></Suspense>}
        </div>
      </div>
      <div className="pwl-causes">
        {CAUSES.map((c) => (
          <A key={c.id} href={`/project/${c.slug}`} className="pwl-cause" style={{ ['--c' as string]: c.color }}>
            <span className="pwl-cause-logo"><img src={c.logo} alt="" loading="lazy" /></span>
            <span className="pwl-cause-name">{titleCase(c.name)}</span>
            <span className="pwl-cause-who">{c.partner} · <span className="pwl-nowrap">{tr(c.place)}</span></span>
            <span className="pwl-cause-line">{tr(c.line)}</span>
            <span className="pwl-cause-go">{tr('Meet the project')} →</span>
          </A>
        ))}
      </div>
    </div>
  </section>

  {/* 6 · Founder note at the very end, from existing approved copy */}
  <section id="story" className="pwl-sec pwl-story-sec pw-iso" aria-labelledby="story-h">
    <Ico c="oceans" style={{ right: '8%', top: '30px', transform: 'rotate(-6deg)' }} />
    <div className="pwl-wrap pwl-story pwl-story-s">
      <figure className="pwl-founder-c">
        <img src="/v2/img/founder-700.webp" alt={tr('Nico, founder of Perfect World')} width={700} height={1024} loading="lazy" />
        <svg viewBox="0 0 200 200" aria-hidden="true"><path d="M150 24 C 112 2, 46 10, 22 58 C 2 100, 22 162, 84 182 C 146 200, 192 160, 190 104 C 188 58, 160 30, 118 22 C 96 18, 76 22, 64 28" /></svg>
      </figure>
      <div className="pwl-story-txt">
        <p className="pwl-kicker pwl-kicker-l">{tr('FROM MUNICH, WITH SIX PARTNERS')}</p>
        <p className="pwl-quote-lead">{tr("I built this movement because I've received more love in my life than I ever deserved. This is my way of giving some of it back.")}</p>
        <h2 id="story-h" className="pw-fat pwl-quote">{tr("Perfect World isn't mine anymore. It's ours.")}</h2>
        <p className="pw-hand pwl-sig">{tr('NICO')}</p>
        <A href="/about" className="pwl-link pwl-link-s">{tr('Find out more about the vision')} →</A>
      </div>
    </div>
  </section>

  {/* 7 · Questions, at the very end */}
  <section id="faq" className={'pwl-sec pwl-faq pw-iso' + (allQ ? ' is-all' : '')} aria-labelledby="faq-h">
    <div className="pwl-wrap">
      <h2 id="faq-h" className="pw-fat pwl-h2">{tr('Questions')}</h2>
      {FAQ.map((f, i) => (
        <details key={f.q} className={i >= 5 ? 'pwl-faq-more' : undefined}><summary>{tr(f.q)}</summary><p>{tr(f.a)}</p></details>
      ))}
      {!allQ && <button type="button" className="pwl-faq-all" onClick={() => setAllQ(true)}>{tr('More questions')} ({FAQ.length - 5})</button>}
      <A href="/how-giving-works" className="pwl-link">{tr('How giving works')} →</A>
    </div>
  </section>

  <Footer icons={["/v2/icons/ic-de6f599f.svg", "/v2/icons/ic-9eab075d.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
