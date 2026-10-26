import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { isLaunched, joinList } from '../../utils/waitlist'

// Replaces the old "10% off" popup, which never stored the email (Oct 2026).
// Before 11.11 it collects the launch waitlist; afterwards it is a plain newsletter signup.
const KEY = isLaunched() ? 'pw-newsletter-popup' : 'pw-waitlist-popup'

export default function WaitlistPopup() {
  const { t } = useTranslation()
  const after = isLaunched()
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  useEffect(() => {
    // The prelaunch home is the signup itself; no popup on top of it.
    if (!isLaunched() && window.location.pathname === '/') return
    try {
      if (localStorage.getItem(KEY)) return
    } catch {
      return
    }

    let timer: ReturnType<typeof setTimeout>
    const show = () => {
      timer = setTimeout(() => setIsVisible(true), 1200)
    }

    // Don't stack on top of the cookie banner — wait until consent is decided.
    if (localStorage.getItem('cookie-consent')) {
      show()
    } else {
      const onConsent = () => {
        window.removeEventListener('pw-cookie-consent', onConsent)
        show()
      }
      window.addEventListener('pw-cookie-consent', onConsent)
      return () => {
        window.removeEventListener('pw-cookie-consent', onConsent)
        clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  const remember = (v: string) => {
    try {
      localStorage.setItem(KEY, v)
    } catch {
      /* private mode: the popup may show again, nothing breaks */
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    if (state !== 'done') remember('dismissed')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || state === 'sending') return
    setState('sending')
    const ok = await joinList(email, website)
    setState(ok ? 'done' : 'error')
    if (ok) remember('joined')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-labelledby="pw-waitlist-title"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-[1000] sm:w-full max-w-[400px] mx-auto sm:mx-0 p-6 rounded-3xl bg-[#0b0b0c]/95 backdrop-blur-xl border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label={t('waitlist.close')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {state !== 'done' ? (
            <form onSubmit={handleSubmit} className="pr-6">
              <h3 id="pw-waitlist-title" className="text-2xl font-bold leading-tight">
                {after ? (
                  t('waitlist.titleAfter')
                ) : (
                  <>
                    {t('waitlist.title').replace('11.11.', '')}
                    <span className="text-[#e2453c]">11.11.</span>
                  </>
                )}
              </h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">{after ? t('waitlist.bodyAfter') : t('waitlist.body')}</p>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
              <div className="mt-4 flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('waitlist.placeholder')}
                  aria-label={t('waitlist.placeholder')}
                  className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="w-full px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-60"
                >
                  {state === 'sending' ? t('waitlist.sending') : after ? t('waitlist.buttonAfter') : t('waitlist.button')}
                </button>
              </div>
              {state === 'error' && <p className="mt-2 text-xs text-red-400">{t('waitlist.error')}</p>}
              <p className="mt-3 text-[11px] text-gray-400">
                {t('waitlist.fine')}{' '}
                <a href="/privacy-policy" className="underline hover:text-white">
                  {t('waitlist.privacy')}
                </a>
              </p>
            </form>
          ) : (
            <div className="pr-6">
              <h3 className="text-2xl font-bold leading-tight">{t('waitlist.doneTitle')}</h3>
              <p className="mt-2 text-sm text-gray-300">{after ? t('waitlist.doneBodyAfter') : t('waitlist.doneBody')}</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
