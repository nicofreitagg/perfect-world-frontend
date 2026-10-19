import { WORN_HOME } from './worn'
import { useCutout } from './cutout'
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
import { PIECES, NEW_PIECES, MIN_DESIGNS, icon, minDesignOf, pieceOf, type CauseKey } from './data'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'
import { useT } from './t'
import { FAQ } from './faq'

const Globe3D = lazy(() => import('./Globe3D'))


// Cold visitors first (Nico's boss, 15 Oct): each Minimal design shown as a real garment, gently moving.
const ALIVE: { slug: string; img: string; piece: string; src?: string }[] = [
  // A different piece per design, so every kind shows up (Nico, 16 Oct): bomber, tee, tote, oversized, women's tee.
  { slug: 'talk-about-it', img: 'talk-bomber', piece: 'Bomber jacket' },
  { slug: 'endangered-oceans', img: 'oceans', piece: 'T-shirt' },
  { slug: 'cool-down', img: 'cool-tote', piece: 'Tote bag' },
  { slug: 'one-world', img: 'one-world-oversized', piece: 'Oversized shirt' },
  // Hoodie in India Ink Grey (Nico, 16 Oct): no local mockup yet, so the Shopify photo is cut out in the browser.
  { slug: 'wild-at-heart', img: 'wild', piece: 'Hoodie', src: 'https://cdn.shopify.com/s/files/1/0862/1110/1009/files/mockup-c715-back_0293fc2a-f3eb-4550-8923-ba3a9a602961.jpg?v=1791818463' },
  { slug: 'rich-in-life', img: 'womens-rich', piece: "Women's T-shirt" },
]
// Three pieces up front, each with only its price and where its amount goes.
const BEST = [
  { slug: 'endangered-oceans', img: 'oceans', kind: 'tshirt', piece: 'T-shirt', price: PIECES.shirt.price, give: PIECES.shirt.give },
  { slug: 'talk-about-it', img: 'talk', kind: 'hoodie', piece: 'Hoodie', price: PIECES.hoodie.price, give: PIECES.hoodie.give },
  { slug: 'cool-down', img: 'cool-tote', kind: 'tote', piece: 'Tote bag', price: PIECES.tote.price, give: PIECES.tote.give },
]
// Answers a stranger's first questions at a glance.
const TRUST = ['Printed in Germany', 'Ships across Europe', 'Six named partners', 'The partner’s amount is already in the price']
// Home shows the three questions a stranger asks first; the rest open on request.
const FIRST_Q = ['How long will delivery take?', 'How do I find my size?', 'How does giving work?']
const HOME_FAQ = [...FIRST_Q.map((q) => FAQ.find((f) => f.q === q)!), ...FAQ.filter((f) => !FIRST_Q.includes(f.q))]
// Friends and customers in their own words (quotes shortened from what they wrote; Nico is asking each for their OK).
const VOICES = [
  { name: 'Sandro Gambardella', img: '/v2/img/voice-sandro.webp', pos: '45% 40%', quote: 'Other than the really cool designs, I love knowing that after I buy something, it goes to a cause that fuels something positive.' },
  { name: 'Shaan Patel', img: '/v2/img/voice-shaan.webp', pos: '50% 30%', quote: "It's not just about clothes. It's about making a difference and being part of something bigger that actually cares about the planet and people." },
  { name: 'Ilai Bachrach', img: '/v2/img/voice-ilai.webp', pos: '50% 18%', quote: 'Perfect World for me is about creating one world where we care for each other and love each other the way we are, as imperfect beings.' },
  { name: 'Nico Higgins', img: '/v2/img/voice-nico.webp', pos: '50% 35%', quote: "It makes it easier for people to make a difference and help charities they may not have heard of." },
]

// The 11.11 card holds for a moment with a slow zoom in before the film runs (Nico 16 Oct: 3 s with a countdown).
const INTRO_MS = 3000

// A small countdown on the 11.11 card (Nico 16 Oct), a ring that empties as the seconds run down.
function IntroCount() {
  const [n, setN] = useState(Math.round(INTRO_MS / 1000))
  useEffect(() => {
    const id = setInterval(() => setN((x) => Math.max(1, x - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="pwl-cine-count" aria-hidden="true">
      <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" /><circle className="is-run" cx="24" cy="24" r="21" pathLength={100} /></svg>
      <b key={n}>{n}</b>
    </span>
  )
}

/** The film fills the hero and plays by itself, muted and looping. It opens on the 11.11 card, then the copy fades in over it. */
function AutoFilm({ src, card, label, children }: { src: string; card: string; label: string; children: React.ReactNode }) {
  const tr = useT()
  const ref = useRef<HTMLVideoElement>(null)
  // The 11.11 card and countdown run for everyone, Reduce Motion included (only the zoom is left out then).
  const [intro, setIntro] = useState(true)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  // The countdown starts only once the 11.11 card is on screen (Nico 16 Oct: on a slow phone the time ran out before it showed).
  const cardRef = useRef<HTMLImageElement>(null)
  const [cardReady, setCardReady] = useState(false)
  useEffect(() => {
    if (cardRef.current?.complete) setCardReady(true)
    const id = setTimeout(() => setCardReady(true), 6000)
    return () => clearTimeout(id)
  }, [])
  // The 11.11 card stays up until the film is really playing (phones on low power never autoplay).
  const [playing, setPlaying] = useState(false)
  const phone = useMemo(() => window.matchMedia('(max-width:700px)').matches, [])
  const sq = card.replace('.webp', '-sq.webp')
  useEffect(() => {
    const v = ref.current
    if (!v) return
    // Browsers only autoplay a film that is muted as an attribute too (React sets just the property).
    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '')
    const go = () => { v.play().catch(() => {}) }
    // If the browser still holds it back (low power mode, data saver), the first touch, scroll or key starts it.
    // The film waits for the intro, then starts from its first frame.
    let ready = false
    const kick = () => { if (stopped.current) return off(); if (!ready) return; go(); if (!v.paused) off() }
    const off = () => ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach((e) => window.removeEventListener(e, kick))
    ;['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach((e) => window.addEventListener(e, kick, { passive: true }))
    // The intro (Nico 16 Oct): the 11.11 card holds with a slow zoom and a countdown, then the film runs from its start.
    if (!cardReady || !introRef.current) return off
    const id = setTimeout(() => { ready = true; v.currentTime = 0; setIntro(false); go() }, INTRO_MS)
    return () => { clearTimeout(id); off() }
  }, [cardReady])
  const introRef = useRef(true)
  useEffect(() => { introRef.current = intro }, [intro])
  // Pause and play (Nico 16 Oct); once paused by hand, nothing restarts it by itself.
  const stopped = useRef(false)
  const toggle = () => { const v = ref.current; if (!v) return; setIntro(false); if (v.paused) { stopped.current = false; v.play().catch(() => {}); setPaused(false) } else { stopped.current = true; v.pause(); setPaused(true) } }
  const sound = () => { const v = ref.current; if (!v) return; v.muted = !muted; setMuted(!muted); setIntro(false); v.play().catch(() => {}) }
  return (
    <div className="pwl-cine-box">
    <div className="pwl-cine-stage">
      <video ref={ref} src={src} poster={phone ? sq : card} muted loop playsInline preload="auto" aria-label={label} className="pwl-autofilm" onClick={toggle} onPlaying={() => setPlaying(true)} />
      <div className="pwl-cine-shade" aria-hidden="true" />
      <picture>
        <source media="(max-width:700px)" srcSet={sq} />
        <img ref={cardRef} onLoad={() => setCardReady(true)} src={card} alt="" aria-hidden="true" className={'pwl-autofilm-card' + (intro && cardReady ? ' is-intro' : '') + (!intro && playing ? ' is-gone' : '')} />
      </picture>
      {intro && cardReady && <IntroCount />}
      <div className="pwl-film-ctrls">
      <button type="button" className="pwl-autofilm-pause" onClick={toggle} aria-label={paused ? tr('Play') : tr('Pause')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{paused ? <path d="M8 5v14l11-7z" fill="currentColor" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />}</svg>
      </button>
      <button type="button" className={'pwl-autofilm-sound' + (muted ? ' is-muted' : '')} onClick={sound} aria-pressed={!muted} aria-label={muted ? tr('Sound on') : tr('Sound off')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />{muted
          ? <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />}</svg>
        <span>{muted ? tr('Turn sound on') : tr('Sound off')}</span>
      </button>
      </div>
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
    const id = setInterval(() => setI((n) => (n + 1) % ALIVE.length), 4200)
    return () => clearInterval(id)
  }, [auto])
  const a = ALIVE[i]
  const c = causeBySlug(a.slug)
  const d = MIN_DESIGNS.find((x) => x.slug === a.slug)!
  return (
    <div className="pwl-stage" style={{ ['--c' as string]: c?.color ?? '#999' }}>
      <div className="pwl-stage-show" key={a.slug} aria-live="polite">
        <img className="pwl-stage-art" src={`/v2/img/art-${a.slug}-w.webp`} alt={`${d.name}, ${tr('artwork')}`} />
        <PieceImg className="pwl-stage-piece" a={a} alt={`${d.name} ${tr(a.piece)}`} />
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
                <span className="pwl-alive-img"><PieceImg a={x} alt="" /></span>
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

/** Phones: once the cover is behind you, SHOP HOPE stays one tap away at the bottom of the screen. */
function ShopBar() {
  const tr = useT()
  const [on, setOn] = useState(false)
  useEffect(() => {
    const check = () => {
      const hero = document.getElementById('top')
      const foot = document.querySelector('footer')
      const past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 700
      const atFoot = foot ? foot.getBoundingClientRect().top < window.innerHeight : false
      setOn(past && !atFoot)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
  return (
    <div className={'pwl-shopbar' + (on ? ' is-on' : '')} aria-hidden={!on}>
      <A href="/shop" className="pwl-btn" tabIndex={on ? 0 : -1}>{tr('SHOP HOPE')}</A>
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
    <AutoFilm src="/assets/videos/home-film-720.mp4" card="/v2/img/hero-thumb-1111.webp" label={tr('Perfect World film: the future exists for those who dare to dream')}>
      <h1 className="pwl-head">
        <span className="pw-hand pwl-head-a">{tr('Wear the world you')}</span>
        <span className="pwl-head-row"><span className="pwl-hope pw-fat">{tr('HOPE')}<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path className="pw-draw pw-loop" pathLength={1000} d="M306 20 C 236 0, 104 4, 44 46 C -2 80, 6 148, 88 176 C 172 204, 318 198, 372 152 C 408 120, 398 60, 330 32 C 282 12, 222 10, 160 22" /></svg></span>
<span className="pw-hand pwl-head-b">{tr('for.')}</span></span>
      </h1>
      <p className="pwl-cine-lede">{tr('Clothing that helps the world: every piece supports a cause.')} <b>{tr('Join the movement.')}</b></p>
      <A href="/shop" className="pwl-btn pwl-cine-btn">{tr('SHOP HOPE')}</A>
    </AutoFilm>
    {/* Trust line: what a stranger wants to know in two seconds */}
    <ul className="pwl-trust" aria-label={tr('Good to know')}>
      <li>{tr('T-shirts from')} €{PIECES.shirt.price}</li>
      {TRUST.map((t) => <li key={t}>{tr(t)}</li>)}
    </ul>
  </section>

  <Lines />

  {/* 2 · New: the Minimal designs, shown as the clothes they are */}
  <section id="minimal" className="pwl-sec pwl-min pw-iso" aria-label={tr('The Minimal Collection')}>
    <div className="pwl-wrap pwl-center">
      <p className="pwl-kicker">{tr('NEW COLLECTION')}</p>
      <h2 className="pwl-min-h"><A href="/shop#shop" className="pwl-min-hlink"><span className="pwl-min-new">{tr('New')}</span><img className="pw-sig" src={darkMin ? "/v2/img/sig-minimal-collection-white.png" : "/v2/img/sig-minimal-collection-black.png"} alt={tr('The Minimal Collection')} /></A></h2>
      <p className="pwl-sub">{tr('Six new designs on T-shirts, hoodies, totes and more. Each one supports its own cause.')}</p>
      <A href="/shop#shop" className="pwl-min-explore">{tr('Explore the collection')} <span aria-hidden="true">→</span></A>
      {WORN_HOME && <figure className="pwl-worn"><img src={WORN_HOME.src} alt={tr(WORN_HOME.alt)} loading="lazy" /></figure>}
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
                <span className="pwl-best-name">{d.name}<br />{tr(b.piece)}<span>€{b.price}</span></span>
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

  {/* 4 · How it works, in three pictures */}
  <section id="how" className="pwl-sec pw-iso" aria-labelledby="how-h">
    <div className="pwl-wrap">
      <h2 id="how-h" className="pw-fat pwl-h2 pwl-center">{tr('How it works')}</h2>
      <HowSteps />
    </div>
  </section>

  {/* 4b · Real people wearing it, in their own words (each has agreed to be shown) */}
  <section id="worn" className="pwl-sec pw-iso" aria-labelledby="worn-h">
    <div className="pwl-wrap">
      <div className="pwl-center">
        <h2 id="worn-h" className="pw-fat pwl-h2">{tr('Why they wear it.')}</h2>
        <p className="pwl-sub">{tr('Real people, in their own words.')}</p>
      </div>
      <ul className="pwl-voices">
        {VOICES.map((v) => (
          <li key={v.name}>
            {/* Quotes only, no photos (Nico, 16 Oct). */}
            <figure>
              <span className="pwl-voice-mark" aria-hidden="true">“</span>
              <blockquote>{tr(v.quote)}</blockquote>
              <figcaption>{v.name}</figcaption>
            </figure>
          </li>
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
            <span className="pwl-cause-name pw-fat">{titleCase(c.name)}</span>
            <span className="pwl-cause-who">{c.partner}<span className="pwl-cause-place">{tr(c.place)}</span></span>
            <span className="pwl-cause-line pw-hand">{tr(c.line)}</span>
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
      {HOME_FAQ.map((f, i) => (
        <details key={f.q} className={i >= 3 ? 'pwl-faq-more' : undefined}><summary>{tr(f.q)}</summary><p>{tr(f.a)}</p></details>
      ))}
      {!allQ && <button type="button" className="pwl-faq-all" onClick={() => setAllQ(true)}>{tr('More questions')} ({FAQ.length - 3})</button>}
      <A href="/how-giving-works" className="pwl-link">{tr('How giving works')} →</A>
    </div>
  </section>

  <ShopBar />
  <Footer icons={["/v2/icons/ic-de6f599f.svg", "/v2/icons/ic-9eab075d.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}

// A stage garment: the local cut-out mockup, or a Shopify photo cut out in the browser (hidden until cut, never a white box).
// How it works, as a tiny demo (Nico, 19 Oct: "more engaging"): pick a piece and the three steps follow it,
// from the artwork to the garment to the amount its partner gets. Steps come in one by one as the section
// scrolls in, the amount counts up, and the pieces cycle by themselves until someone taps one.
const women = NEW_PIECES.find((x) => x.id === 'women')!, bomber = NEW_PIECES.find((x) => x.id === 'bomber')!
const HOW: { label: string; give: string; a: (typeof ALIVE)[number] }[] = [
  { label: 'T-shirt', give: PIECES.shirt.give, a: ALIVE.find((x) => x.piece === 'T-shirt')! },
  { label: 'Hoodie', give: PIECES.hoodie.give, a: ALIVE.find((x) => x.piece === 'Hoodie')! },
  { label: 'Oversized', give: PIECES.oversized.give, a: ALIVE.find((x) => x.piece === 'Oversized shirt')! },
  { label: 'Bomber', give: bomber.give, a: ALIVE.find((x) => x.piece === 'Bomber jacket')! },
  { label: "Women's tee", give: women.give, a: ALIVE.find((x) => x.piece === "Women's T-shirt")! },
  { label: 'Tote', give: PIECES.tote.give, a: ALIVE.find((x) => x.piece === 'Tote bag')! },
]

function CountUp({ to, run }: { to: string; run: boolean }) {
  const target = Number(to)
  const [v, setV] = useState(target)
  useEffect(() => {
    if (!run || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 900)
      setV(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return <>€{v.toFixed(2)}</>
}

function HowSteps() {
  const tr = useT()
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!seen || !auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % HOW.length), 3800)
    return () => clearInterval(id)
  }, [seen, auto])
  const h = HOW[i]
  const c = causeBySlug(h.a.slug)
  const d = MIN_DESIGNS.find((x) => x.slug === h.a.slug)!
  return (
    <div ref={ref} className={'pwl-howx' + (seen ? ' is-in' : '')} style={{ ['--c' as string]: c?.color ?? '#999' }}>
      <div className="pwl-how-pick" role="group" aria-label={tr('Pick a piece')}>
        {HOW.map((x, n) => (
          <button key={x.label} type="button" aria-pressed={n === i} onClick={() => { setI(n); setAuto(false) }}>{tr(x.label)}</button>
        ))}
      </div>
      <ol className="pwl-how">
        <li><span className="pwl-how-pic pwl-how-art"><img key={h.a.slug} className="pwl-how-swap" src={`/v2/img/art-${h.a.slug}-w.webp`} alt={`${d.name}, ${tr('artwork')}`} /></span><span className="pwl-how-n">1</span><b><span className="pwl-how-k">1. </span>{tr('Pick a design')}</b><span>{tr('Each one belongs to one of six causes.')}</span></li>
        <li><span className="pwl-how-pic"><PieceImg key={h.a.img} className="pwl-how-swap" a={h.a} alt={`${d.name} ${tr(h.a.piece)}`} /></span><span className="pwl-how-n">2</span><b><span className="pwl-how-k">2. </span>{tr('We print it for you')}</b><span>{tr('Made to order, so nothing is wasted.')}</span></li>
        <li><span className="pwl-how-pic pwl-how-amt"><span className="pw-fat" aria-live="polite"><CountUp to={h.give} run={seen} /></span>{c && <img key={c.logo} className="pwl-how-swap" src={c.logo} alt={c.partner} loading="lazy" />}</span><span className="pwl-how-n">3</span><b><span className="pwl-how-k">3. </span>{tr('A fixed amount supports the partner')}</b><span>{c ? `${tr('For')} ${c.partner}, ${tr('already in the price.')}` : tr('Already in the price of every piece.')} <A href="/how-giving-works" className="pwl-how-link">{tr('How giving works')}</A></span></li>
      </ol>
    </div>
  )
}

function PieceImg({ a, alt, className }: { a: { img: string; src?: string }; alt: string; className?: string }) {
  const cut = useCutout(a.src)
  const [tight, setTight] = useState<{ from: string; url: string }>({ from: '', url: '' })
  // Trim the empty edges so the photo sits at the same size as the local mockups.
  useEffect(() => {
    if (!cut) return
    let live = true
    trimAlpha(cut).then((url) => { if (live) setTight({ from: cut, url }) })
    return () => { live = false }
  }, [cut])
  if (!a.src) return <img className={className} src={`/v2/img/mm-${a.img}.webp`} alt={alt} loading="lazy" />
  const ready = tight.from === cut && tight.url
  return <img className={className} src={ready || TRANSPARENT} alt={alt} style={ready ? undefined : { opacity: 0 }} />
}
function trimAlpha(src: string): Promise<string> {
  return new Promise((res) => {
    const img = new Image()
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight
      const c = document.createElement('canvas'); c.width = w; c.height = h
      const g = c.getContext('2d'); if (!g) return res(src)
      g.drawImage(img, 0, 0)
      const d = g.getImageData(0, 0, w, h).data
      let x0 = w, y0 = h, x1 = -1, y1 = -1
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
      if (x1 < 0) return res(src)
      const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1
      o.getContext('2d')!.drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height)
      res(o.toDataURL('image/png'))
    }
    img.onerror = () => res(src)
    img.src = src
  })
}
const TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
