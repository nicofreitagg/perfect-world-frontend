import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Moving between pages of the new site: six cause-colour swirls sweep across the whole screen
// while the next page fades in. A different sweep every time (direction, waves, loops, colour
// order). Not on the very first page load, and not with reduced motion.
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

// Six paths in unit space (0..1 on both axes, a little beyond the edges), then scaled to the screen.
function sweep(w: number, h: number) {
  const kind = ['waves', 'loops', 'diagonal', 'vertical'][Math.floor(Math.random() * 4)]
  const freq = rnd(1.2, 2.6), amp = rnd(0.06, 0.16), phase = rnd(0, Math.PI * 2)
  const loopAt = rnd(0.3, 0.7)
  const flipX = Math.random() < 0.5, flipY = Math.random() < 0.5
  const lines = SIX.map((_, i) => {
    const off = (i - 2.5) / 6 // spreads the six lines over the whole screen
    const pts: Pt[] = []
    for (let k = 0; k <= 10; k++) {
      const t = -0.08 + (k / 10) * 1.16
      const wave = amp * Math.sin(phase + t * freq * Math.PI * 2 + i * 0.35)
      if (kind === 'vertical') pts.push([0.5 + off * 1.1 + wave, t])
      else if (kind === 'diagonal') pts.push([t, t + off * 1.3 + wave])
      else pts.push([t, 0.5 + off * 1.1 + wave])
      // A loop-the-loop halfway across, like the hand-drawn swirls.
      if (kind === 'loops' && Math.abs(t - loopAt) < 0.06) {
        const [x, y] = pts[pts.length - 1]
        pts.push([x + 0.06, y - 0.1], [x + 0.1, y - 0.02], [x + 0.03, y + 0.05], [x - 0.02, y - 0.02])
      }
    }
    return pts.map(([x, y]): Pt => [(flipX ? 1 - x : x) * w, (flipY ? 1 - y : y) * h])
  })
  return { kind, paths: lines.map(smooth), colours: shuffle(SIX), reverse: Math.random() < 0.5 }
}

export default function PageSwirl() {
  const [swirl, setSwirl] = useState<null | { w: number; h: number; paths: string[]; colours: string[]; reverse: boolean }>(null)
  useLayoutEffect(() => {
    if (firstPage) { firstPage = false; return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const w = window.innerWidth, h = window.innerHeight
    root.classList.add('pw-nav')
    setSwirl({ w, h, ...sweep(w, h) })
    const t = setTimeout(() => { root.classList.remove('pw-nav'); setSwirl(null) }, 1300)
    return () => { clearTimeout(t); root.classList.remove('pw-nav') }
  }, [])
  if (!swirl) return null
  const stroke = Math.max(10, Math.min(swirl.w, swirl.h) * 0.028)
  // Rendered on <body>, outside the page that is fading in, so the swirls stay fully visible.
  return createPortal(
    <svg className="pw-pageswirl" viewBox={`0 0 ${swirl.w} ${swirl.h}`} aria-hidden="true">
      {swirl.paths.map((d, i) => (
        <path key={i} d={d} pathLength={1000} stroke={swirl.colours[i]} strokeWidth={stroke}
          style={{ '--i': swirl.reverse ? 5 - i : i } as React.CSSProperties} />
      ))}
    </svg>,
    document.body,
  )
}
