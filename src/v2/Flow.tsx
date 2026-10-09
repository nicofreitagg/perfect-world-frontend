import { useEffect, useRef } from 'react'

// Soft colour fields behind every v2 page, in the six cause colours. They drift and turn
// slowly as you scroll (a CSS variable carries the scroll progress), and stay still with
// reduced motion.
const BLOBS = [
  { c: '#5DADE2', x: '-12%', y: '-8%', s: '62vmax', dx: 18, dy: 34, r: 40 },
  { c: '#FF8C42', x: '58%', y: '6%', s: '54vmax', dx: -22, dy: 28, r: -30 },
  { c: '#4cc37f', x: '8%', y: '52%', s: '58vmax', dx: 26, dy: -30, r: 25 },
  { c: '#D4A373', x: '62%', y: '58%', s: '50vmax', dx: -18, dy: -24, r: -35 },
  { c: '#2f6fa8', x: '30%', y: '96%', s: '56vmax', dx: 12, dy: -46, r: 20 },
]

export default function Flow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      ref.current?.style.setProperty('--p', String(max > 0 ? window.scrollY / max : 0))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="pw-flow" aria-hidden="true">
      {BLOBS.map((b, i) => (
        <span
          key={i}
          style={{
            left: b.x, top: b.y, width: b.s, height: b.s,
            background: `radial-gradient(closest-side, ${b.c}, transparent)`,
            transform: `translate3d(calc(var(--p, 0) * ${b.dx}vw), calc(var(--p, 0) * ${b.dy}vh), 0) rotate(calc(var(--p, 0) * ${b.r}deg))`,
          }}
        />
      ))}
    </div>
  )
}

// Home: a soft glow on the left and right edges that moves through the six cause
// colours as you scroll (Nico, 9 Oct). Sits above the section backgrounds, never over
// the middle of the page, so text stays clean.
const EDGE = ['#FF8C42', '#5DADE2', '#4cc37f', '#b07e52', '#2f6fa8', '#8e8f94', '#FF8C42']
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (t: number) => {
  const f = Math.min(Math.max(t, 0), 1) * (EDGE.length - 1)
  const i = Math.min(Math.floor(f), EDGE.length - 2)
  const a = rgb(EDGE[i]), b = rgb(EDGE[i + 1]), k = f - i
  return a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(',')
}

export function EdgeGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      ref.current?.style.setProperty('--gl', mix(p))
      ref.current?.style.setProperty('--gr', mix(p + 0.22))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={ref} className="pw-edge" aria-hidden="true" />
}
