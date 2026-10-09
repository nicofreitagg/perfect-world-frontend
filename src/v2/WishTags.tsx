import { A } from './A'
import { TAGS } from './data'
import { useT } from './t'

export function WishTags() {
  const tr = useT()
  return (
    <div style={{ marginTop: 62, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '90px 34px', alignItems: 'start' }}>
      {TAGS.map((t) => {
        const fg = t.loud ? '#ffffff' : '#1b1b1d'
        return (
          <div
            key={t.name}
            className="pw-tag"
            style={{
              background: t.loud ? t.bg : '#ffffff',
              color: fg,
              border: t.loud ? '0' : '1px solid #e4e1da',
              transform: `rotate(${t.rot}deg)`,
              minHeight: 520,
              justifyContent: 'space-between',
            }}
          >
            <img src={t.ico} alt="" aria-hidden="true" style={{ position: 'absolute', left: 20, top: 74, width: 68, transform: 'rotate(-6deg)' }} />
            {t.loud ? (
              <>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
                  <span className="pw-fat" style={{ fontSize: 34, lineHeight: 1 }}>OG.</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.1em', opacity: 0.85 }}>{tr("BACK PRINT")}</span>
                </span>
                <img src={t.img} alt={t.piece} style={{ width: '100%', height: 250, objectFit: 'contain', filter: 'drop-shadow(0 20px 22px rgba(0,0,0,.35))' }} />
                <span className="pw-fat" style={{ fontSize: 40, lineHeight: 0.9 }}>{t.name}</span>
              </>
            ) : (
              <>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
                  <span className="pw-hand" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '.01em' }}>{tr("Minimal.")}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14, letterSpacing: '.1em', color: '#c0322a' }}>{tr("NEW")}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250 }}>
                  <svg width="210" height="200" viewBox="0 0 240 230" role="img" aria-label={t.piece} style={{ filter: 'drop-shadow(0 16px 16px rgba(0,0,0,.16))' }}>
                    <path d={t.path} fill={t.color} stroke="rgba(0,0,0,.15)" strokeWidth="1.5" />
                    <circle cx="138" cy="70" r="5" fill={t.mark} />
                  </svg>
                </span>
                <span className="pw-fat" style={{ fontSize: 40, lineHeight: 0.9, color: t.lc }}>{t.name}</span>
              </>
            )}
            <span style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.35 }}>{tr("My wish:")} {tr(t.wish)}</span>
            <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 14, borderTop: `1px solid ${t.loud ? 'rgba(255,255,255,.35)' : '#e4e1da'}` }}>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{tr(t.piece)} · {tr(t.price)}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, opacity: 0.85 }}>{tr("gives")} {t.give} {tr("to")} {t.partner}</span>
              </span>
              <A
                href="/shop"
                style={{
                  fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '11px 20px', borderRadius: 999,
                  background: t.loud ? '#ffffff' : 'transparent',
                  color: t.loud ? t.btnFg : '#1b1b1d',
                  border: t.loud ? '0' : '1px solid #1b1b1d',
                }}
              >
                {t.loud ? 'Give it' : 'Give it →'}
              </A>
            </span>
          </div>
        )
      })}
    </div>
  )
}
