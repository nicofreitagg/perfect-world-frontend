import { useEffect, useRef, useState } from 'react'
import { A } from './A'
import { CAUSES } from './causes'
import { icon, type CauseKey } from './data'

// Replacements for the home globe (Nico, 19 Oct: globe "too serious"); the swirls are on home:
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
// What each cause is about, in a word or two (Nico 19 Oct: the topic, not the collection name).
// Three words or more: keep the last two together, so it breaks as "Children / in crisis".
const keepEnd = (t: string) => (t.split(' ').length > 2 ? t.replace(/ (\S+) (\S+)$/, ' $1\u00a0$2') : t)
const TOPIC: Record<CauseKey, string> = { rich: 'Opportunity', 'one-world': 'Children in crisis', talk: 'Mental health', oceans: 'Oceans', cool: 'Climate', wild: 'Wildlife' }

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

// Clean arms (Nico 19 Oct v4: home must feel elegant, not handwritten): a smooth logarithmic spiral
// from each cause into the centre; a slightly more twisted copy lets the arms breathe.
const curve = (pts: number[][]) => {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let k = 0; k < pts.length - 1; k++) {
    const p0 = pts[Math.max(k - 1, 0)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(k + 2, pts.length - 1)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}
const arm = (i: number, twist: number) => {
  const pts: number[][] = []
  for (let k = 0; k <= 16; k++) {
    const t = k / 16
    const r = 236 * Math.pow(30 / 236, t)
    const a = ((-90 + i * 60 + twist * t) * Math.PI) / 180
    pts.push([300 + r * Math.cos(a), 300 + r * Math.sin(a)])
  }
  return curve(pts)
}

export function SixSwirls({ tr }: { tr: (s: string) => string }) {
  const [ref, seen] = useInView()
  const [on, setOn] = useState<CauseKey | null>(null)
  const C = 300
  const at = (deg: number, r: number) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)].map((n) => Math.round(n))
  const hot = on ? byId(on) : null
  return (
    <div ref={ref} className={`pwl-obj pwl-swirls pwl-swirls-3 pwl-swirls-4${seen ? ' is-in' : ''}${on ? ' has-on' : ''}`}>
      <svg viewBox="0 0 600 600" aria-hidden="true">
        {CAUSES.map((c, i) => {
          const d0 = arm(i, 210), d1 = arm(i, 232)
          return (
            <g key={c.id} className={`pwl-swirl-arm${on === c.id ? ' is-on' : ''}`}>
              <path d={d0} pathLength={1} stroke={c.color} className="pwl-swirl-path" style={{ ['--d' as string]: `${i * 0.18}s` }}>
                {seen && <animate attributeName="d" values={`${d0};${d1};${d0}`} dur="9s" begin="2.6s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" />}
              </path>
              {seen && [0, 2].map((b) => (
                <circle key={b} r={2.6} fill={c.color} className="pwl-swirl-drop">
                  <animateMotion dur="4.6s" begin={`${2.6 + b + i * 0.27}s`} repeatCount="indefinite" path={d0} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".5 0 .7 1" />
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="4.6s" begin={`${2.6 + b + i * 0.27}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )
        })}
        <g transform={`translate(${C} ${C})`}>
          <g className="pwl-swirl-heart">
            <path d="M0,16 C-30,-5 -20,-31 0,-15 C20,-31 30,-5 0,16 Z" />
          </g>
        </g>
      </svg>
      {CAUSES.map((c, i) => {
        const [x, y] = at(-90 + i * 60, 240)
        return (
          <A key={c.id} href={`/project/${c.slug}`} className="pwl-swirl-ico" style={{ left: `${x / 6}%`, top: `${y / 6}%`, ['--d' as string]: `${i * 0.18}s`, ['--c' as string]: c.color }}
            onMouseEnter={() => setOn(c.id)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(c.id)} onBlur={() => setOn(null)} aria-label={c.partner}>
            <img src={icon(c.id, 'a')} alt="" />
            <span className={`pwl-swirl-name is-${['t', 'r', 'r', 'b', 'l', 'l'][i]}`}>{keepEnd(tr(TOPIC[c.id]))}</span>
          </A>
        )
      })}
      <p className="pwl-swirl-line">
        {hot ? <><span className="pw-hand" style={{ color: hot.color }}>{hot.partner}</span><small>{tr(hot.place)}</small></> : <span className="pw-hand">{tr('Together. Not Alone.')}</span>}
      </p>
    </div>
  )
}
