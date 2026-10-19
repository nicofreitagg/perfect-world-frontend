import { useEffect, useRef, useState } from 'react'
import { A } from './A'
import { CAUSES } from './causes'
import { icon, type CauseKey } from './data'

// Trial replacements for the home globe (Nico, 19 Oct: globe "too serious", try A + B):
// ?obj=map    a hand-drawn map, six pins, one red thread drawing itself between them
// ?obj=swirls six cause-colour swirls flowing in and knotting into one
const useInView = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}

const byId = (id: CauseKey) => CAUSES.find((c) => c.id === id)!

// Map frame: lon -105..45, lat 62..-38, 10 units per degree (matches map-sketch.webp).
const xy = (lon: number, lat: number) => [(lon + 105) * 10, (62 - lat) * 10] as const
const SPOTS: { id: CauseKey; lon: number; lat: number; lx: number; ly: number; side: 'l' | 'r' | 'c' }[] = [
  { id: 'rich', lon: -72.43, lat: 5.63, lx: 300, ly: 650, side: 'l' },
  { id: 'oceans', lon: -68.98, lat: 12.17, lx: 330, ly: 420, side: 'l' },
  { id: 'cool', lon: 11.28, lat: 47.9, lx: 1110, ly: 260, side: 'l' },
  { id: 'talk', lon: 11.58, lat: 48.14, lx: 1110, ly: 40, side: 'l' },
  { id: 'one-world', lon: 24.03, lat: 49.84, lx: 1330, ly: 30, side: 'c' },
  { id: 'wild', lon: 24, lat: -22, lx: 1230, ly: 900, side: 'l' },
]

export function SketchMap() {
  const [ref, seen] = useInView()
  const p = Object.fromEntries(SPOTS.map((s) => [s.id, xy(s.lon, s.lat)])) as Record<CauseKey, readonly [number, number]>
  const thread = `M${p.rich} Q300,520 ${p.oceans} Q760,90 ${p.cool} Q1150,120 ${p.talk} Q1230,80 ${p['one-world']} Q1470,470 ${p.wild}`
  return (
    <div ref={ref} className={`pwl-obj pwl-map${seen ? ' is-in' : ''}`}>
      <img src="/v2/img/map-sketch.webp" alt="" aria-hidden="true" className="pwl-map-img" />
      <svg viewBox="0 0 1500 1000" className="pwl-map-svg" aria-hidden="true">
        <path d={thread} pathLength={1} className="pwl-map-thread" />
        {SPOTS.map((s, i) => {
          const [x, y] = p[s.id]
          return (
            <g key={s.id} style={{ ['--d' as string]: `${0.4 + i * 0.35}s` }} className="pwl-map-pin">
              <line x1={x} y1={y} x2={s.lx + (s.side === 'l' ? 12 : s.side === 'r' ? -12 : 0)} y2={s.ly} className="pwl-map-lead" />
              <circle cx={x} cy={y} r={22} fill={byId(s.id).color} opacity={0.25} />
              <circle cx={x} cy={y} r={11} fill={byId(s.id).color} stroke="#f2ebdf" strokeWidth={3} />
            </g>
          )
        })}
      </svg>
      {SPOTS.map((s, i) => {
        const c = byId(s.id)
        return (
          <A key={s.id} href={`/project/${c.slug}`} className={`pwl-map-label is-${s.side}`} style={{ left: `${s.lx / 15}%`, top: `${s.ly / 10}%`, ['--c' as string]: c.color, ['--d' as string]: `${0.5 + i * 0.35}s` }}>
            <span className="pw-hand">{c.partner}</span>
            <small>{c.place}</small>
          </A>
        )
      })}
    </div>
  )
}

export function SixSwirls({ tr }: { tr: (s: string) => string }) {
  const [ref, seen] = useInView()
  const C = 300
  const at = (deg: number, r: number) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)].map((n) => Math.round(n))
  return (
    <div ref={ref} className={`pwl-obj pwl-swirls${seen ? ' is-in' : ''}`}>
      <svg viewBox="0 0 600 600" aria-hidden="true">
        {CAUSES.map((c, i) => {
          const a = -90 + i * 60
          const [sx, sy] = at(a, 255)
          const [ax, ay] = at(a + 55, 230)
          const [bx, by] = at(a + 120, 120)
          const [ex, ey] = at(a + 190, 26)
          return <path key={c.id} d={`M${sx},${sy} C${ax},${ay} ${bx},${by} ${ex},${ey}`} pathLength={1} stroke={c.color} className="pwl-swirl-path" style={{ ['--d' as string]: `${i * 0.18}s` }} />
        })}
        <circle cx={C} cy={C} r={26} pathLength={1} className="pwl-swirl-knot" />
      </svg>
      {CAUSES.map((c, i) => {
        const [x, y] = at(-90 + i * 60, 255)
        return (
          <A key={c.id} href={`/project/${c.slug}`} className="pwl-swirl-ico" style={{ left: `${x / 6}%`, top: `${y / 6}%`, ['--d' as string]: `${i * 0.18}s` }} aria-label={c.partner}>
            <img src={icon(c.id, 'a')} alt="" />
          </A>
        )
      })}
      <p className="pwl-swirl-line pw-hand">{tr('Together. Not Alone.')}</p>
    </div>
  )
}
