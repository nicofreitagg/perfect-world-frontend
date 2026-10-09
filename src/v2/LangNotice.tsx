import { useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'

// The site always opens in English. Visitors from German-speaking countries (or with a
// German browser) get one small, dismissible note that the site is in German too.
const KEY = 'pw-lang-notice'

export default function LangNotice() {
  const { language, suggestedLanguage, setLanguage } = useLocale()
  const [hidden, setHidden] = useState(() => {
    try { return !!localStorage.getItem(KEY) || !!localStorage.getItem('pw-language') } catch { return false }
  })
  if (hidden || language !== 'en' || suggestedLanguage !== 'de') return null
  const close = () => { try { localStorage.setItem(KEY, '1') } catch { /* private mode */ } setHidden(true) }
  return (
    <div className="pw-langnote" role="status" lang="de">
      <span>Perfect World gibt's jetzt auch auf Deutsch 🙂</span>
      <button type="button" className="pw-langnote-go" onClick={() => { close(); setLanguage('de') }}>Auf Deutsch lesen</button>
      <button type="button" className="pw-langnote-x" onClick={close} aria-label="Schließen">×</button>
    </div>
  )
}
