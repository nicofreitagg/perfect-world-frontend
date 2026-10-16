import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Moving between pages of the new site: three thin cause-colour swirls glide across the whole
// screen while the next page fades in. A different sweep every time (direction, waves, loops,
// colours). Kept light on purpose (Nico, 13 Oct: "too thick, too intense").
// Not on the very first page load, and not with reduced motion.
let firstPage = true
const SIX = ['#FF8C42', '#5DADE2', '#4cc37f', '#b07e52', '#8e8f94', '#2f6fa8']

type Pt = [number, number]
const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1])

// A smooth curve through the points (Catmull-Rom turned into cubic Béziers).
function smooth(p: Pt[]) {
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i], b = p[i], c = p[i + 1], e = p[i + 2] ?? c
    const c1: Pt = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6]
    const c2: Pt = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${c[0].toFixed(1)} ${c[1].toFixed(1)}`
  }
  return d
}

// Three paths in unit space (0..1 on both axes, a little beyond the edges), then scaled to the screen.
function sweep(w: number, h: number) {
  const kind = ['waves', 'loops', 'diagonal', 'vertical'][Math.floor(Math.random() * 4)]
  const freq = rnd(0.8, 1.6), amp = rnd(0.04, 0.09), phase = rnd(0, Math.PI * 2)
  const loopAt = rnd(0.3, 0.7)
  const flipX = Math.random() < 0.5, flipY = Math.random() < 0.5
  const shift = rnd(-0.12, 0.12)
  const lines = [0, 1, 2].map((i) => {
    const off = shift + (i - 1) * 0.035 // a loose band of three, somewhere near the middle
    const pts: Pt[] = []
    for (let k = 0; k <= 10; k++) {
      const t = -0.08 + (k / 10) * 1.16
      const wave = amp * Math.sin(phase + t * freq * Math.PI * 2 + i * 0.35)
      if (kind === 'vertical') pts.push([0.5 + off * 1.1 + wave, t])
      else if (kind === 'diagonal') pts.push([t, t + off * 1.3 + wave])
      else pts.push([t, 0.5 + off * 1.1 + wave])
      // A loop-the-loop halfway across, like the hand-drawn swirls.
      if (kind === 'loops' && i === 1 && Math.abs(t - loopAt) < 0.06) {
        const [x, y] = pts[pts.length - 1]
        pts.push([x + 0.06, y - 0.1], [x + 0.1, y - 0.02], [x + 0.03, y + 0.05], [x - 0.02, y - 0.02])
      }
    }
    return pts.map(([x, y]): Pt => [(flipX ? 1 - x : x) * w, (flipY ? 1 - y : y) * h])
  })
  return { kind, paths: lines.map(smooth), colours: shuffle(SIX).slice(0, 3), reverse: Math.random() < 0.5 }
}

// Dark pages (Home, Our story) and Natural Raw pages (everything else, Nico 16 Oct): when you cross
// between them, the old ground fades away behind a wide, soft linear gradient that glides across
// the screen. Slow and quiet on purpose (Nico: "elegant, lowkey, fitting with the linear aspect").
// The angle changes a little every time; both ways work the same.
let lastDark: boolean | null = null
// Dark pages by address, so the fade can start before the new page paints.
const isDarkNow = () => ['/', '/about', '/how-giving-works'].includes(window.location.pathname.replace(/\/+$/, '') || '/')
// Did this page change cross between dark and Raw? Asked by both effects below, answered once
// per page change (so React's double effect run in development gives the same answer).
let crossMemo = { key: '', val: false }
function crossed() {
  const key = window.location.href + ':' + JSON.stringify(window.history.state)
  if (key === crossMemo.key) return crossMemo.val
  const dark = isDarkNow()
  crossMemo = { key, val: lastDark !== null && lastDark !== dark }
  lastDark = dark
  return crossMemo.val
}
const DARK = '#13110f', RAW = '#ece3d2'
const WIPE_MS = 900
const FEATHER = 90 // how wide the soft band is, in % of the screen

function Wipe({ from }: { from: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // Mostly top to bottom, sometimes bottom to top, always a little slanted.
    const angle = (Math.random() < 0.7 ? 180 : 0) + rnd(-8, 8)
    const t0 = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const k = Math.min(1, (now - t0) / WIPE_MS)
      const e = 0.5 - Math.cos(Math.PI * k) / 2
      const p = -FEATHER + e * (100 + FEATHER)
      const m = `linear-gradient(${angle.toFixed(1)}deg, transparent ${p.toFixed(2)}%, #000 ${(p + FEATHER).toFixed(2)}%)`
      el.style.maskImage = m
      el.style.webkitMaskImage = m
      if (k < 1) raf = requestAnimationFrame(frame)
    }
    frame(t0)
    return () => cancelAnimationFrame(raf)
  }, [])
  return createPortal(<div ref={ref} className="pw-wipe-nav" style={{ background: from }} aria-hidden="true" />, document.body)
}

export default function PageSwirl() {
  const [wipe, setWipe] = useState<null | { from: string }>(null)
  useLayoutEffect(() => {
    if (!crossed() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setWipe({ from: isDarkNow() ? RAW : DARK })
    const t = setTimeout(() => setWipe(null), WIPE_MS + 60)
    return () => clearTimeout(t)
  }, [])
  const swirlEl = <Swirl />
  return <>{wipe && <Wipe from={wipe.from} />}{swirlEl}</>
}

function Swirl() {
  const [swirl, setSwirl] = useState<null | { w: number; h: number; paths: string[]; colours: string[]; reverse: boolean }>(null)
  useLayoutEffect(() => {
    if (firstPage) { firstPage = false; return }
    // Crossing between dark and Raw pages gets the wipe instead (this runs before PageSwirl's effect).
    if (crossed()) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const w = window.innerWidth, h = window.innerHeight
    root.classList.add('pw-nav')
    setSwirl({ w, h, ...sweep(w, h) })
    const t = setTimeout(() => { root.classList.remove('pw-nav'); setSwirl(null) }, 1800)
    return () => { clearTimeout(t); root.classList.remove('pw-nav') }
  }, [])
  if (!swirl) return null
  const stroke = Math.max(3.5, Math.min(swirl.w, swirl.h) * 0.006)
  // Rendered on <body>, outside the page that is fading in, so the swirls stay fully visible.
  return createPortal(
    <svg className="pw-pageswirl" viewBox={`0 0 ${swirl.w} ${swirl.h}`} aria-hidden="true">
      {swirl.paths.map((d, i) => (
        <path key={i} d={d} pathLength={1000} stroke={swirl.colours[i]} strokeWidth={stroke}
          style={{ '--i': swirl.reverse ? 2 - i : i } as React.CSSProperties} />
      ))}
    </svg>,
    document.body,
  )
}
