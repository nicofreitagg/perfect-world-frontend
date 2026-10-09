import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import './v2.css'
import './landing.css'
import Flow from './Flow'
import { Header, Footer } from './Chrome'
import { A } from './A'
import GiveReceipt, { PieceSketch } from './GiveReceipt'
import { CAUSES, TINT, causeTitle as titleCase } from './causes'
import { PIECES, NEW_PIECES, TEE_PATH } from './data'
import { isLaunched } from './launch'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawerV2'
import { usePageTitle } from '../hooks/usePageTitle'
import { useT } from './t'

const Globe3D = lazy(() => import('./Globe3D'))

// Six-colour line, used once, between the hero and the pieces.
const SIX = ['#FF8C42', '#5DADE2', '#4cc37f', '#b07e52', '#8e8f94', '#2f6fa8']

// New pieces launching on 11.11, shown as drawings until the samples are photographed.
const NEW = [
  { id: 'minimal', name: 'Minimal collection', note: 'Small detail, same fixed amounts', price: PIECES.shirt.price, give: PIECES.shirt.give, from: true, split: false },
  ...NEW_PIECES.map((n) => ({ id: n.id, name: n.name, note: n.sub, price: n.price, give: n.give, from: false, split: 'split' in n })),
]

export default function HomeV2() {
  const tr = useT()
  usePageTitle()
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()
  const launched = isLaunched()

  useEffect(() => {
    document.body.style.background = '#f5f4f1'
    return () => { document.body.style.background = '' }
  }, [])

  // The 3D globe only loads when the causes section comes close, and only on larger screens.
  const globeBox = useRef<HTMLDivElement>(null)
  const [show3d, setShow3d] = useState(false)
  const [globe3d, setGlobe3d] = useState(false)
  const onGlobe = useCallback(() => setGlobe3d(true), [])
  useEffect(() => {
    const el = globeBox.current
    if (!el || !window.matchMedia('(min-width: 900px)').matches || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setShow3d(true); io.disconnect() } }, { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const heroLine = (launched
    ? tr('Every design is made with one of six cause partners, and a fixed amount of its price goes to that partner: from €{a} for a tote to €{b} for a hoodie.')
    : tr('Every design is made with one of six cause partners. From 11.11, a fixed amount of its price goes to that partner: from €{a} for a tote to €{b} for a hoodie.')
  ).replace('{a}', PIECES.tote.give).replace('{b}', PIECES.hoodie.give)

  return (
    <>
<div className="pw2 pw-page pw-grain pwl" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: "#0b0b0c" }}>
  <Flow />
  <Header big cartCount={cartCount} openCart={openCart} />

  {/* 1 · Brand hero: worn pieces, the line, the benefit */}
  <section id="top" className="pwl-hero pw-iso">
    <h1 className="pwl-head">
      <span className="pw-hand pwl-head-a">{tr('Wear the world you')}</span>
      <span className="pwl-hope pw-fat">{tr('HOPE')}<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path className="pw-draw pw-loop" pathLength={1000} d="M306 20 C 236 0, 104 4, 44 46 C -2 80, 6 148, 88 176 C 172 204, 318 198, 372 152 C 408 120, 398 60, 330 32 C 282 12, 222 10, 160 22" /></svg></span>
      <span className="pw-hand pwl-head-b">{tr('for.')}</span>
    </h1>
    <figure className="pwl-hero-photo">
      <div className="pwl-photo-box">
      <picture>
        <source media="(max-width: 700px)" srcSet="/v2/img/hero-friends-800.webp" />
        <img src="/v2/img/hero-friends-1400.webp" alt={tr('Four friends on a bench in Perfect World hoodies')} width={1400} height={1308} fetchPriority="high" />
      </picture>
      <figcaption className="pwl-tagline">
        <span className="pwl-tagline-k">{launched ? tr('INCLUDED') : tr('FROM 11.11')}</span>
        <span className="pwl-amount">€{PIECES.hoodie.give}<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 26 4, 60 10, 98 4" /></svg></span>
        <span className="pwl-tagline-t">{tr('of every €{p} hoodie goes to its cause partner').replace('{p}', PIECES.hoodie.price)}</span>
      </figcaption>
      </div>
      <p className="pwl-sign"><span className="pw-fat">{tr('Together.')}</span> <span className="pw-hand">{tr('Not Alone.')}</span></p>
    </figure>
    <div className="pwl-hero-body">
      <p className="pwl-lede"><b>{tr('Clothing that gives.')}</b> {heroLine} <span className="pwl-stroke">{tr('Included in the price, never added on top.')}</span></p>
      <div className="pwl-ctas">
        <A href="/shop" className="pwl-btn">{tr('Shop the pieces')}</A>
        <A href="/how-giving-works" className="pwl-link">{tr('How giving works')} →</A>
      </div>
    </div>
  </section>

  <svg className="pwl-six" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
    {SIX.map((c, i) => <path key={c} d={`M-20 ${30 + i * 8} C 300 ${-10 + i * 8}, 520 ${80 + i * 8}, 760 ${38 + i * 8} S 1200 ${2 + i * 8}, 1460 ${36 + i * 8}`} stroke={c} />)}
  </svg>

  {/* 2 · OG or Minimal: the two collections, as in the earlier version */}
  <section id="loud" className="pwl-sec pw-iso" aria-label={tr('OG or Minimal')}>
    <div className="pwl-wrap">
      <div className="pwl-loud">
        <A href="/shop" className="pwl-loud-og">
          <span className="pwl-loud-k">{tr('SIX CAUSES · SIX BACK PRINTS')}</span>
          <img src="/v2/img/og-talk.webp" alt={tr('Talk About It T-shirt, back print')} className="pwl-loud-a" loading="lazy" />
          <img src="/v2/img/og-rich-700.webp" alt={tr('Rich in Life T-shirt, back print')} className="pwl-loud-b" loading="lazy" />
          <span className="pwl-loud-txt"><span className="pw-fat pwl-loud-h">OG.</span><span className="pwl-loud-s">{tr('A story on your back, for anyone who asks.')}</span><span className="pwl-btn pwl-btn-light">{tr('SHOP THE OG')}</span></span>
        </A>
        <A href="/shop" className="pwl-loud-min">
          <span className="pw-hand pwl-loud-new">{tr('New this November.')}</span>
          <svg width="230" height="220" viewBox="0 0 240 230" aria-label={tr('Minimal black T-shirt')} className="pwl-loud-tee"><path d={TEE_PATH} fill="#1b1b1d" /><circle cx="138" cy="70" r="5" fill="#e2453c" /></svg>
          <span className="pwl-loud-txt pwl-right"><span className="pw-hand pwl-loud-h">{tr('Minimal.')}</span><span className="pwl-loud-s">{tr('A small detail. Nobody has to know. You do.')}</span><span className="pwl-btn">{tr('SHOP THE MINIMAL')}</span></span>
        </A>
      </div>
      <p className="pw-hand pwl-either">{tr('It gives either way.')}</p>
    </div>
  </section>

  {/* 3 · Curated pieces */}
  <section id="pieces" className="pwl-sec pw-iso" aria-labelledby="pieces-h">
    <div className="pwl-wrap">
      <div className="pwl-sechead">
        <div>
          <p className="pwl-kicker">{tr('THE OG COLLECTION · SIX DESIGNS, SIX PARTNERS')}</p>
          <h2 id="pieces-h" className="pw-fat pwl-h2">{tr('Pick a design. It decides who it helps.')}</h2>
        </div>
        <A href="/shop" className="pwl-link">{tr('All pieces')} →</A>
      </div>
      <div className="pwl-pieces">
        <figure className="pwl-worn">
          <img src="/v2/img/og-back-700.webp" alt={tr('Cool Down back print, worn')} width={700} height={1050} loading="lazy" />
          <figcaption>{tr('The story sits on the back. The logo sits small on the front.')}</figcaption>
        </figure>
        {CAUSES.map((c) => (
          <A key={c.id} href={`/design/${c.slug}`} className="pwl-piece" style={{ ['--tint' as string]: TINT[c.id], ['--c' as string]: c.color }}>
            <span className="pwl-piece-img"><img src={c.id === 'rich' ? '/v2/img/og-rich-700.webp' : c.print} alt={`${titleCase(c.name)} ${tr('design, back print')}`} loading="lazy" /></span>
            <span className="pwl-piece-name">{titleCase(c.name)}</span>
            <span className="pwl-piece-meta">{tr('T-shirt')} €{PIECES.shirt.price} · <b>€{PIECES.shirt.give}</b> {tr('to')} {c.partner}</span>
          </A>
        ))}
      </div>

      <div className="pwl-sechead pwl-next-head">
        <div>
          <p className="pwl-kicker">{tr('NEW ON 11.11')}</p>
          <h2 className="pw-fat pwl-h2">{tr('New pieces.')}</h2>
        </div>
      </div>
      <ul className="pwl-new">
        {NEW.map((n) => (
          <li key={n.id} className={n.id === 'minimal' ? 'is-lead' : undefined}>
            <A href="/shop" className="pwl-new-card">
              <span className="pwl-new-img"><PieceSketch id={n.id} /><span className="pwl-tag">{tr('New')}</span></span>
              <span className="pwl-new-name">{tr(n.name)}</span>
              <span className="pwl-new-note">{tr(n.note)}</span>
              <span className="pwl-new-meta">{n.from ? tr('from') + ' ' : ''}€{n.price} · <b>€{n.give}</b> {n.split ? tr('shared by all six partners') : tr('to its partner')}</span>
            </A>
          </li>
        ))}
      </ul>
      <p className="pwl-fine">{tr('Drawings, not product photos. Photos follow once the samples are made.')} {tr('Every piece is made to order, with care. Allow 1.5 to 2 weeks, so wish early.')}</p>
    </div>
  </section>

  {/* 4 · The receipt: price, amount, partner */}
  <section id="giving" className="pwl-sec pwl-paper pw-iso" aria-labelledby="give-h">
    <div className="pwl-wrap">
      <div className="pwl-sechead pwl-center">
        <div>
          <p className="pwl-kicker">{launched ? tr('11:11 · EVERY PIECE GIVES A FIXED AMOUNT') : tr('11:11 · FROM 11.11, EVERY PIECE GIVES A FIXED AMOUNT')}</p>
          <h2 id="give-h" className="pw-fat pwl-h2">{tr('Doing good has never been')} <span className="pw-hand pwl-red">{tr('easier.')}</span></h2>
          <p className="pwl-sub">{tr('Pick a piece and a design. The receipt shows what it costs, what is included for the partner, and who receives it.')}</p>
        </div>
      </div>
      <GiveReceipt />
    </div>
  </section>

  {/* 5 · The six causes and the people behind them */}
  <section id="causes" className="pwl-sec pwl-dark pw-dark pw-iso pw-blend" aria-labelledby="causes-h">
    <div className="pwl-wrap">
      <div className="pwl-causes-top">
        <div>
          <p className="pwl-kicker pwl-kicker-l">{tr('SIX PLACES · ONE HOPE')}</p>
          <h2 id="causes-h" className="pw-fat pwl-h2">{tr('The people doing the work.')}</h2>
          <p className="pwl-sub">{tr('Far from here and right next door, people are already making the wishes come true. Every collection was made with one of them.')}</p>
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
            <span className="pwl-cause-who">{c.partner} · {tr(c.place)}</span>
            <span className="pwl-cause-line">{tr(c.line)}</span>
            <span className="pwl-cause-go">{tr('Meet the project')} →</span>
          </A>
        ))}
      </div>
    </div>
  </section>

  {/* 6 · Founder note at the very end, from existing approved copy */}
  <section id="story" className="pwl-sec pwl-story-sec pw-iso" aria-labelledby="story-h">
    <div className="pwl-wrap pwl-story">
      <figure className="pwl-founder">
        <img src="/v2/img/founder-700.webp" alt={tr('Nico, founder of Perfect World')} width={700} height={1024} loading="lazy" />
      </figure>
      <div className="pwl-story-txt">
        <p className="pwl-kicker pwl-kicker-l">{tr('FROM MUNICH, WITH SIX PARTNERS')}</p>
        <p className="pwl-quote-lead">{tr("I built this movement because I've received more love in my life than I ever deserved. This is my way of giving some of it back.")}</p>
        <h2 id="story-h" className="pw-fat pwl-quote">{tr("Perfect World isn't mine anymore. It's ours.")}</h2>
        <p className="pw-hand pwl-sig">{tr('NICO')}</p>
        <A href="/about" className="pwl-link">{tr('Our story and the video')} →</A>
      </div>
      <div className="pwl-community">
        <img src="/v2/img/park-tees-900.webp" srcSet="/v2/img/park-tees-900.webp 900w, /v2/img/park-tees-1500.webp 1500w" sizes="(max-width: 700px) 100vw, 50vw" alt={tr('Three friends in a park wearing Perfect World tees')} loading="lazy" />
        <img src="/v2/img/two-friends-700.webp" alt={tr('Two friends in Perfect World tees')} loading="lazy" />
        <img src="/v2/img/detail-logo-900.webp" alt={tr('The small embroidered logo, close up')} loading="lazy" />
      </div>
    </div>
  </section>

  <Footer icons={["/v2/icons/ic-de6f599f.svg", "/v2/icons/ic-9eab075d.svg"]} />
</div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
