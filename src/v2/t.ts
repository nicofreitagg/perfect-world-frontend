import { useLocale } from '../contexts/LocaleContext'
import DE from './de.json'

// The new site is written in English; German comes from de.json, keyed by the English text.
// Missing entries fall back to English.
const de = DE as Record<string, string>

// Keep the last two words together so no single word ends up alone on a line (Nico, 9 Oct).
// Only for real sentences (4+ words); short labels and buttons are left as they are.
const keepLastPair = (s: string) => (s.split(' ').length >= 4 ? s.replace(/ (\S+)\s*$/, '\u00a0$1') : s)

export function useT() {
  const { language } = useLocale()
  return (en: string) => keepLastPair(language === 'de' ? de[en] ?? en : en)
}
