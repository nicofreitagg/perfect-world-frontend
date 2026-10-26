import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoWhite from '@/assets/logos/perfect-world-logo-white.png'
import { LAUNCH_AT, joinList } from '../utils/waitlist'

// Waitlist-first home until 11.11 11:11 (Nico, 26 Oct 2026): the email list is the main
// thing on the site, the current shop stays one link away. App.tsx swaps back to Home at launch.
const CAUSE_COLOURS = ['#D4A373', '#5DADE2', '#F4A261', '#2E86C1', '#58D68D', '#A9A9A9']
const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0')

function useCountdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const s = Math.max(0, Math.floor((LAUNCH_AT - now) / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 }
}

export default function PreLaunch() {
  const { t } = useTranslation()
  const left = useCountdown()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  useEffect(() => {
    document.title = 'Perfect World · Something new on 11.11'
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || state === 'sending') return
    setState('sending')
    const ok = await joinList(email, website)
    setState(ok ? 'done' : 'error')
    if (ok) {
      try {
        localStorage.setItem('pw-waitlist-popup', 'joined')
      } catch {
        /* the popup may show again, nothing breaks */
      }
    }
  }

  const units: [number, string][] = [
    [left.d, t('prelaunch.days')],
    [left.h, t('prelaunch.hours')],
    [left.m, t('prelaunch.minutes')],
    [left.s, t('prelaunch.seconds')],
  ]

  return (
    <main className="pw-pre relative min-h-[100svh] overflow-hidden bg-[#0b0b0c] text-[#f5f4f1] flex flex-col">
      <style>{`
        .pw-pre{font-family:'Bricolage Grotesque',system-ui,sans-serif}
        .pw-pre .mono{font-family:'JetBrains Mono',ui-monospace,monospace}
        .pw-pre-glow{position:absolute;width:46vmax;height:46vmax;border-radius:50%;filter:blur(90px);opacity:.22;animation:pw-pre-drift 22s ease-in-out infinite alternate}
        @keyframes pw-pre-drift{to{transform:translate(6vmax,-4vmax) scale(1.12)}}
        @media (prefers-reduced-motion:reduce){.pw-pre-glow{animation:none}}
      `}</style>
      {CAUSE_COLOURS.map((c, i) => (
        <span
          key={c}
          aria-hidden="true"
          className="pw-pre-glow"
          style={{ background: c, left: `${[-12, 62, 70, -8, 30, 85][i]}%`, top: `${[-14, -18, 60, 64, 82, 22][i]}%`, animationDelay: `${i * -3}s` }}
        />
      ))}

      <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 pt-6">
        <img src={logoWhite} alt="Perfect World" className="h-10 sm:h-12 w-auto" />
        <a href="https://www.instagram.com/perfectworld.global" target="_blank" rel="noopener noreferrer" className="mono text-[11px] tracking-[.14em] uppercase text-white/60 hover:text-white">
          @perfectworld.global
        </a>
      </header>

      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 py-14">
        <p className="mono text-[11px] sm:text-xs tracking-[.2em] uppercase text-white/55">{t('prelaunch.kicker')}</p>
        <h1 className="mt-4 font-extrabold leading-[.95] tracking-[-.02em] text-[clamp(40px,9vw,104px)]">
          {t('prelaunch.title')} <span className="text-[#e2453c]">11.11.</span>
        </h1>
        <p className="mt-5 max-w-[34rem] text-[17px] sm:text-lg leading-relaxed text-white/75">{t('prelaunch.body')}</p>

        <div className="mt-8 flex gap-3 sm:gap-5" aria-label={t('prelaunch.countdown')}>
          {units.map(([n, label]) => (
            <div key={label} className="min-w-[64px] sm:min-w-[84px] rounded-2xl border border-white/12 bg-white/[.05] px-3 py-3">
              <div className="text-3xl sm:text-4xl font-bold tabular-nums">{pad(n)}</div>
              <div className="mono mt-1 text-[10px] tracking-[.14em] uppercase text-white/50">{label}</div>
            </div>
          ))}
        </div>

        {state === 'done' ? (
          <div className="mt-9">
            <p className="text-2xl font-bold">{t('waitlist.doneTitle')}</p>
            <p className="mt-2 text-white/70">{t('waitlist.doneBody')}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-9 w-full max-w-[460px]">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:rounded-full sm:border sm:border-white/20 sm:bg-white/[.06] sm:p-1.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('waitlist.placeholder')}
                aria-label={t('waitlist.placeholder')}
                className="flex-1 min-w-0 rounded-full sm:rounded-none border border-white/20 sm:border-0 bg-white/[.06] sm:bg-transparent px-5 py-3.5 text-base text-white placeholder-white/45 outline-none"
              />
              <button type="submit" disabled={state === 'sending'} className="rounded-full bg-[#f5f4f1] text-[#0b0b0c] font-bold px-6 py-3.5 text-[15px] hover:bg-white disabled:opacity-60">
                {state === 'sending' ? t('waitlist.sending') : t('waitlist.button')}
              </button>
            </div>
            {state === 'error' && <p className="mt-2 text-sm text-[#ff8a80]">{t('waitlist.error')}</p>}
            <p className="mt-3 text-xs text-white/45">
              {t('prelaunch.fine')}{' '}
              <Link to="/privacy-policy" className="underline hover:text-white">
                {t('waitlist.privacy')}
              </Link>
            </p>
          </form>
        )}

        <Link to="/shop" className="mt-12 text-sm text-white/60 underline underline-offset-4 hover:text-white">
          {t('prelaunch.shop')} →
        </Link>
      </section>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-10 pb-6 text-xs text-white/45">
        <span>Together. Not Alone.</span>
        <nav className="flex gap-4">
          <Link to="/legal-notice" className="hover:text-white">{t('prelaunch.imprint')}</Link>
          <Link to="/privacy-policy" className="hover:text-white">{t('waitlist.privacy')}</Link>
          <a href="mailto:hello@perfectworld.global" className="hover:text-white">{t('prelaunch.contact')}</a>
        </nav>
      </footer>
    </main>
  )
}
