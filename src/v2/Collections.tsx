import { useEffect, useState } from 'react'
import { A } from './A'
import { HOODIE_PATH, MINIMAL, OG, TEE_PATH } from './data'
import { useT } from './t'

type Tab = 'minimal' | 'og'

const tabStyle = (on: boolean) => ({
  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
  fontWeight: 700,
  letterSpacing: '.01em',
  fontSize: 18,
  padding: '10px 22px',
  minHeight: 44,
  borderRadius: 999,
  border: '1.5px solid #0b0b0c',
  cursor: 'pointer',
  background: on ? '#0b0b0c' : '#ffffff',
  color: on ? '#ffffff' : '#0b0b0c',
})

const arrowStyle = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  border: '1px solid #d7d5d0',
  background: '#ffffff',
  cursor: 'pointer',
  fontSize: 20,
  color: '#0b0b0c',
} as const

export function CollectionTabs({ tab, onPick }: { tab: Tab; onPick: (t: Tab) => void }) {
  const tr = useT()
  return (
    <div role="tablist" aria-label={tr("Collections")} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
      <button type="button" role="tab" aria-selected={tab === 'og'} onClick={() => onPick('og')} style={tabStyle(tab === 'og')}>{tr("OG COLLECTIONS")}</button>
      <button type="button" role="tab" aria-selected={tab === 'minimal'} onClick={() => onPick('minimal')} style={tabStyle(tab === 'minimal')}>{tr("MINIMAL COLLECTION")}</button>
    </div>
  )
}

export function CollectionCarousel({ tab }: { tab: Tab }) {
  const tr = useT()
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const isOg = tab === 'og'
  const n = isOg ? OG.length : MINIMAL.length

  useEffect(() => setIdx(0), [tab])

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setIdx((i) => i + 1), 3000)
    return () => clearInterval(t)
  }, [paused])

  const cur = ((idx % n) + n) % n
  const items = isOg ? OG : MINIMAL
  const current = items[cur]

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div aria-roledescription="carousel" aria-label={isOg ? 'OG collections' : 'Minimal collection'} style={{ position: 'relative', height: 470, marginTop: 28, overflow: 'hidden' }}>
        {items.map((it, i) => {
          let o = i - cur
          if (o > n / 2) o -= n
          if (o < -n / 2) o += n
          const a = Math.abs(o)
          const minimal = !isOg ? (it as (typeof MINIMAL)[number]) : null
          const og = isOg ? (it as (typeof OG)[number]) : null
          return (
            <A
              key={it.label}
              href="/shop"
              className="pw-car"
              aria-hidden={a > 1}
              tabIndex={a > 1 ? -1 : 0}
              style={{
                position: 'absolute', left: '50%', top: 20, width: 330, height: 400, marginLeft: -165, borderRadius: 28,
                textDecoration: 'none', background: 'rgba(255,255,255,.72)', border: '1px solid rgba(255,255,255,.9)',
                boxShadow: '0 30px 50px rgba(0,0,0,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `translateX(${o * 300}px) scale(${a === 0 ? 1 : a === 1 ? 0.82 : 0.66})`,
                opacity: a > 2 ? 0 : a === 2 ? 0.45 : a === 1 ? 0.8 : 1,
                zIndex: 10 - a,
              }}
            >
              {minimal?.isNew && (
                <span style={{ position: 'absolute', top: 18, left: 18, fontSize: 12, fontWeight: 700, color: '#ffffff', background: '#c0322a', padding: '6px 12px', borderRadius: 999 }}>{tr("NEW")}</span>
              )}
              {og && (
                <img src={og.img} alt={og.label} style={{ width: '88%', height: '80%', objectFit: 'contain', filter: 'drop-shadow(0 18px 18px rgba(0,0,0,.18))' }} />
              )}
              {minimal && (
                <>
                  <svg width="240" height="240" viewBox="0 0 240 230" aria-hidden="true" style={{ filter: 'drop-shadow(0 18px 18px rgba(0,0,0,.18))' }}>
                    <path d={minimal.kind === 'tee' ? TEE_PATH : HOODIE_PATH} fill={minimal.color} stroke="rgba(0,0,0,.18)" strokeWidth="1.5" />
                    <circle cx="138" cy="70" r="5" fill={minimal.mark} />
                  </svg>
                  <span style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#5c5c5c' }}>{tr("PHOTO SOON")}</span>
                </>
              )}
            </A>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 8 }}>
        <button type="button" onClick={() => setIdx(cur - 1 + n)} aria-label={tr("Previous piece")} style={arrowStyle}>‹</button>
        <div style={{ textAlign: 'center', minWidth: 220 }} aria-live="polite">
          <p className="pw-hand" style={{ margin: 0, letterSpacing: '.01em', fontSize: 28, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {'ico' in current && current.ico && <img src={current.ico} alt="" aria-hidden="true" style={{ width: 40, height: 40 }} />}
            {current.label}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 14, color: '#5c5c5c' }}>{tr(current.sub)}</p>
        </div>
        <button type="button" onClick={() => setIdx(cur + 1)} aria-label={tr("Next piece")} style={arrowStyle}>›</button>
      </div>
    </div>
  )
}
