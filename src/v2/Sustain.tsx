import { useEffect, useRef, type CSSProperties } from 'react'
import { useT } from './t'

// Sustainability promise with the old site's hover effect: the icon glows and the glass card lights up.
const CERTS = [
  { name: 'GOTS', sub: '100% organic cotton', rgb: '52,211,153', icon: <><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" /><path d="m9 12 2 2 4-4" /></> },
  { name: 'OEKO-TEX', sub: 'Standard 100', rgb: '96,165,250', icon: <><path d="M10 2v7.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.586a1 1 0 0 0-.293-.707l-6.414-6.414a1 1 0 0 1-.293-.707V2z" /><path d="M6 14h12" /></> },
  { name: 'PETA-Approved', sub: '100% vegan', rgb: '251,113,133', icon: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /> },
  { name: 'Fair Wear', sub: 'Fair treatment of workers', rgb: '251,191,36', icon: <><rect width="20" height="14" x="2" y="6" rx="2" /><path d="M16 6V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2" /><path d="M12 11h.01" /></> },
]

export default function Sustain() {
  const tr = useT()
  const grid = useRef<HTMLDivElement>(null)

  // On touch screens there is no hover, so the card in the middle of the screen lights up while scrolling.
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches || !grid.current) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-lit', e.isIntersecting)),
      { rootMargin: '-40% 0px -40% 0px' },
    )
    grid.current.querySelectorAll('.pw-cert').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="pw-iso" aria-label={tr("Sustainability promise")} style={{ position: 'relative', zIndex: 72, padding: 'clamp(60px, 7vw, 100px) clamp(16px, 4vw, 56px)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', background: '#0b0b0c', color: '#ffffff', borderRadius: '32px', padding: 'clamp(36px, 5vw, 72px)', textAlign: 'center' }}>
        <p className="pw-hand" style={{ margin: 0, fontSize: 'clamp(40px, 4.6vw, 64px)', lineHeight: 1 }}>{tr("Sustainability promise")}</p>
        <p style={{ margin: '20px auto 0', maxWidth: '720px', fontSize: '18px', lineHeight: 1.6, color: 'rgba(255,255,255,.8)' }}>{tr("Every piece is made on Stanley/Stella garments: GOTS, OEKO-TEX, PETA-Approved Vegan and Fair Wear Foundation certified. Good for the planet and fair to the people who make them, from seed to stitch.")}</p>
        <div ref={grid} style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {CERTS.map((c) => (
            <div key={c.name} className="pw-cert" tabIndex={0} style={{ '--g': c.rgb } as CSSProperties}>
              <span className="pw-cert-ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{c.icon}</svg>
              </span>
              <p className="pw-fat pw-cert-name">{c.name}</p>
              <p style={{ margin: '8px 0 0', fontSize: '16px', color: 'rgba(255,255,255,.7)' }}>{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
