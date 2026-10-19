import { useEffect, useRef, useState } from 'react'
import { A } from './A'
import { CAUSES } from './causes'
import { icon, type CauseKey } from './data'

// Replacements for the home globe (Nico, 19 Oct: globe "too serious"); he picked the map:
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
  { id: 'rich', lon: -72.43, lat: 5.63, lx: 380, ly: 660, side: 'r' },
  { id: 'oceans', lon: -68.98, lat: 12.17, lx: 420, ly: 410, side: 'r' },
  { id: 'cool', lon: 11.28, lat: 47.9, lx: 1100, ly: 255, side: 'l' },
  { id: 'talk', lon: 11.58, lat: 48.14, lx: 1100, ly: 125, side: 'l' },
  { id: 'one-world', lon: 24.03, lat: 49.84, lx: 1260, ly: 35, side: 'l' },
  { id: 'wild', lon: 24, lat: -22, lx: 1230, ly: 900, side: 'l' },
]

export function SketchMap() {
  const [ref, seen] = useInView()
  const p = Object.fromEntries(SPOTS.map((s) => [s.id, xy(s.lon, s.lat)])) as Record<CauseKey, readonly [number, number]>
  const thread = `M${p.rich} Q300,520 ${p.oceans} Q760,90 ${p.cool} Q1150,120 ${p.talk} Q1230,80 ${p['one-world']} Q1470,470 ${p.wild}`
  // Homelier (Nico 19 Oct): lines "boil" like a hand drawing, the thread is stitched,
  // a small heart keeps travelling along it, pins breathe and the labels carry the cause icons.
  return (
    <div ref={ref} className={`pwl-obj pwl-map${seen ? ' is-in' : ''}`}>
      <svg viewBox="0 0 1500 1000" className="pwl-map-svg" aria-hidden="true">
        <defs>
          {[3, 7].map((seed) => (
            <filter key={seed} id={`pwl-boil-${seed}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={seed} />
              <feDisplacementMap in="SourceGraphic" scale={5} />
            </filter>
          ))}
          <mask id="pwl-thread-draw" maskUnits="userSpaceOnUse">
            <path d={thread} pathLength={1} className="pwl-map-draw" />
          </mask>
        </defs>
        <image href="/v2/img/map-sketch.webp" width="1500" height="1000" filter="url(#pwl-boil-3)" className="pwl-map-img is-a" />
        <image href="/v2/img/map-sketch.webp" width="1500" height="1000" filter="url(#pwl-boil-7)" className="pwl-map-img is-b" />
        <path d={thread} className="pwl-map-thread" mask="url(#pwl-thread-draw)" />
        <g className="pwl-map-heart">
          <path d="M0,6 C-14,-6 -8,-18 0,-10 C8,-18 14,-6 0,6 Z" />
          {seen && <animateMotion dur="9s" begin="3.4s" repeatCount="indefinite" path={thread} rotate="0" />}
        </g>
        {SPOTS.map((s, i) => {
          const [x, y] = p[s.id]
          return (
            <g key={s.id} style={{ ['--d' as string]: `${0.4 + i * 0.35}s` }} className="pwl-map-pin">
              <line x1={x} y1={y} x2={s.lx + (s.side === 'l' ? 12 : s.side === 'r' ? -12 : 0)} y2={s.ly} className="pwl-map-lead" />
              <circle cx={x} cy={y} r={14} fill={byId(s.id).color} className="pwl-map-ring" />
              <circle cx={x} cy={y} r={11} fill={byId(s.id).color} stroke="#f2ebdf" strokeWidth={3} />
            </g>
          )
        })}
      </svg>
      {SPOTS.map((s, i) => {
        const c = byId(s.id)
        return (
          <A key={s.id} href={`/project/${c.slug}`} className={`pwl-map-label is-${s.side}`} style={{ left: `${s.lx / 15}%`, top: `${s.ly / 10}%`, ['--c' as string]: c.color, ['--d' as string]: `${0.5 + i * 0.35}s` }}>
            <img src={icon(c.id, 'a')} alt="" className="pwl-map-ico" />
            <span>
              <span className="pw-hand">{c.partner}</span>
              <small>{c.place}</small>
            </span>
          </A>
        )
      })}
    </div>
  )
}

export function SixSwirls({ tr }: { tr: (s: string) => string }) {
  const [ref, seen] = useInView()
  const [on, setOn] = useState<CauseKey | null>(null)
  const C = 300
  const at = (deg: number, r: number) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)].map((n) => Math.round(n))
  const swirl = (i: number) => {
    const a = -90 + i * 60
    const [sx, sy] = at(a, 240)
    const [ax, ay] = at(a + 55, 225)
    const [bx, by] = at(a + 120, 120)
    const [ex, ey] = at(a + 190, 34)
    return `M${sx},${sy} C${ax},${ay} ${bx},${by} ${ex},${ey}`
  }
  const hot = on ? byId(on) : null
  // Homelier and livelier (Nico 19 Oct): the strokes wobble like ink, the whole swirl slowly turns,
  // little drops keep flowing from every cause into a beating heart, the icons ride along upright.
  return (
    <div ref={ref} className={`pwl-obj pwl-swirls${seen ? ' is-in' : ''}${on ? ' has-on' : ''}`}>
      <div className="pwl-swirl-rot">
      <svg viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <filter id="pwl-ink" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4}>
              <animate attributeName="seed" values="4;9;4" dur="0.8s" calcMode="discrete" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={4} />
          </filter>
        </defs>
        <g>
          <g filter="url(#pwl-ink)">
            {CAUSES.map((c, i) => (
              <g key={c.id} className={`pwl-swirl-arm${on === c.id ? ' is-on' : ''}`}>
                <path d={swirl(i)} pathLength={1} stroke={c.color} className="pwl-swirl-glow" style={{ ['--d' as string]: `${i * 0.18}s` }} />
                <path d={swirl(i)} pathLength={1} stroke={c.color} className="pwl-swirl-path" style={{ ['--d' as string]: `${i * 0.18}s` }} />
              </g>
            ))}
          </g>
          {seen && CAUSES.map((c, i) => [0, 1.4, 2.8].map((b) => (
            <circle key={c.id + b} r={5} fill={c.color} className="pwl-swirl-drop">
              <animateMotion dur="4.2s" begin={`${2.6 + b + i * 0.23}s`} repeatCount="indefinite" path={swirl(i)} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".5 0 .7 1" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="4.2s" begin={`${2.6 + b + i * 0.23}s`} repeatCount="indefinite" />
            </circle>
          )))}
          {CAUSES.map((c, i) => {
            const [x, y] = at(-90 + i * 60, 240)
            return (
              <g key={c.id} transform={`translate(${x} ${y})`}>
                <g className="pwl-swirl-upright">
                  <g className="pwl-swirl-badge" style={{ ['--d' as string]: `${i * 0.18}s` }}>
                    <circle r={34} fill="#f2ebdf" />
                    <circle r={34} fill="none" stroke={c.color} strokeWidth={3} className="pwl-swirl-badge-ring" />
                    <image href={icon(c.id, 'a')} x={-22} y={-22} width={44} height={44} />
                  </g>
                </g>
              </g>
            )
          })}
        </g>
      </svg>
      {CAUSES.map((c, i) => {
        const [x, y] = at(-90 + i * 60, 240)
        return (
          <A key={c.id} href={`/project/${c.slug}`} className="pwl-swirl-hit" style={{ left: `${x / 6}%`, top: `${y / 6}%` }}
            onMouseEnter={() => setOn(c.id)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(c.id)} onBlur={() => setOn(null)} aria-label={c.partner} />
        )
      })}
      </div>
      <svg viewBox="0 0 600 600" className="pwl-swirl-mid" aria-hidden="true">
        <g transform={`translate(${C} ${C})`}>
          <g className="pwl-swirl-heart">
            <path d="M0,20 C-36,-6 -24,-38 0,-18 C24,-38 36,-6 0,20 Z" />
          </g>
        </g>
      </svg>
      <p className="pwl-swirl-line">
        {hot ? <><span className="pw-hand" style={{ color: hot.color }}>{hot.partner}</span><small>{tr(hot.place)}</small></> : <span className="pw-hand">{tr('Together. Not Alone.')}</span>}
      </p>
    </div>
  )
}
