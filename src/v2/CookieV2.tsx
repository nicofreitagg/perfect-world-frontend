import { useEffect, useState } from 'react'
import { A } from './A'
import { useT } from './t'

// Same storage keys and event as the old banner, so everything that reads consent keeps working.
type Key = 'functionality' | 'experience' | 'measurement' | 'marketing'
const OPTIONS: { key: Key; label: string; desc: string }[] = [
  { key: 'functionality', label: 'Remember me', desc: 'Your language, region and cart.' },
  { key: 'experience', label: 'Experience', desc: 'How you use the site.' },
  { key: 'measurement', label: 'Measurement', desc: 'Visits and what works.' },
  { key: 'marketing', label: 'Ads', desc: 'Our posts and ads elsewhere.' },
]

const pill = (dark: boolean, small = false) => ({
  fontFamily: 'inherit', fontSize: small ? '13px' : '14px', fontWeight: 700, minHeight: small ? '38px' : '44px', padding: small ? '0 14px' : '0 20px', borderRadius: '999px', cursor: 'pointer',
  border: '1.5px solid #0b0b0c', background: dark ? '#0b0b0c' : 'transparent', color: dark ? '#ffffff' : '#0b0b0c', flex: '1 1 0',
})

export default function CookieV2() {
  const tr = useT()
  const [open, setOpen] = useState(false)
  // Phones get a slim bar so the home film (and its 3-2-1) stays visible (Nico 17 Oct).
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)')
    const on = () => setSmall(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const [choose, setChoose] = useState(false)
  const [prefs, setPrefs] = useState<Record<Key, boolean>>({ functionality: false, experience: false, measurement: false, marketing: false })

  useEffect(() => {
    try {
      if (localStorage.getItem('cookie-consent')) return
    } catch { /* storage blocked: still ask */ }
    const t = setTimeout(() => setOpen(true), 1000)
    return () => clearTimeout(t)
  }, [])

  const save = (status: 'accepted' | 'rejected' | 'custom', p: Record<Key, boolean>) => {
    try {
      localStorage.setItem('cookie-consent', status)
      localStorage.setItem('cookie-preferences', JSON.stringify({ necessary: true, ...p }))
    } catch { /* ignore */ }
    setOpen(false)
    window.dispatchEvent(new Event('pw-cookie-consent'))
  }
  const all = (v: boolean): Record<Key, boolean> => ({ functionality: v, experience: v, measurement: v, marketing: v })

  if (!open) return null
  return (
    <div
      role="dialog"
      aria-label={tr("Cookies")}
      style={{
        position: 'fixed', left: small ? '10px' : '16px', right: small ? '10px' : '16px', bottom: small ? '10px' : '16px', zIndex: 2147483000, maxWidth: '400px',
        background: '#f8f2e7', color: '#0b0b0c', border: '1.5px solid #0b0b0c', borderRadius: small ? '16px' : '22px',
        boxShadow: '0 18px 40px rgba(0,0,0,.18)', padding: small ? '10px 12px' : '18px 18px 16px',
        fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: 500,
      }}
    >
      {!small && <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '.08em', color: '#c0322a' }}>{tr("COOKIES")}</p>}
      <p style={small ? { margin: '0 0 8px', fontSize: '12.5px', lineHeight: 1.4 } : { margin: '8px 0 14px', fontSize: '15px', lineHeight: 1.5 }}>
        {small ? tr("Cookies keep the site running. With your OK, also for stats and ads.") : tr("Some keep the site running. With your OK, we also use them to learn what works and for ads.")}{' '}
        <A href="/cookie-policy" style={{ color: '#0b0b0c' }}>{small ? tr("Policy") : tr("Cookie policy")}</A>
        {small && !choose && (
          <>
            {' · '}
            <button type="button" onClick={() => setChoose(true)} style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: 'inherit', color: '#0b0b0c', textDecoration: 'underline', cursor: 'pointer' }}>
              {tr("Let me choose")}
            </button>
          </>
        )}
      </p>

      {choose && (
        <div style={{ display: 'grid', gap: '8px', margin: small ? '0 0 10px' : '0 0 14px' }}>
          {OPTIONS.map((o) => (
            <label key={o.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" checked={prefs[o.key]} onChange={() => setPrefs((p) => ({ ...p, [o.key]: !p[o.key] }))} style={{ width: '18px', height: '18px', accentColor: '#0b0b0c' }} />
              <span><b>{tr(o.label)}</b> <span style={{ color: '#5c5c5c' }}>{tr(o.desc)}</span></span>
            </label>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        {choose ? (
          <button type="button" onClick={() => save('custom', prefs)} style={pill(true, small)}>{tr("Save my choice")}</button>
        ) : (
          <>
            <button type="button" onClick={() => save('rejected', all(false))} style={pill(false, small)}>{tr("No thanks")}</button>
            <button type="button" onClick={() => save('accepted', all(true))} style={pill(true, small)}>{tr("Yes, please")}</button>
          </>
        )}
      </div>
      {!choose && !small && (
        <button type="button" onClick={() => setChoose(true)} style={{ marginTop: '10px', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: '13px', color: '#5c5c5c', textDecoration: 'underline', cursor: 'pointer' }}>
          {tr("Let me choose")}
        </button>
      )}
    </div>
  )
}
