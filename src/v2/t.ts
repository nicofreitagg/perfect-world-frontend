import { useLocale } from '../contexts/LocaleContext'
import DE from './de.json'

// The new site is written in English; German comes from de.json, keyed by the English text.
// Missing entries fall back to English.
const de = DE as Record<string, string>

export function useT() {
  const { language } = useLocale()
  return (en: string) => (language === 'de' ? de[en] ?? en : en)
}
