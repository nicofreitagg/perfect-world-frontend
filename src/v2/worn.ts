import { getCollectionKey, extractProductType } from '../utils/productGrouping'
import { WOMEN } from './data'

// Photos of people wearing the pieces, from the 24 Oct shoot (Nico, 18 Oct). Until a photo is added
// here every slot stays hidden, so the site looks exactly as it does without them.
// Files go in public/v2/worn/. Keys: 'minimal' or 'og', the design, the piece, e.g.
// 'minimal/TALK ABOUT IT/hoodie'. A '*' piece covers every piece of that design.

// One wide photo in the Minimal section on home.
export const WORN_HOME: { src: string; alt: string } | null = null

export const WORN: Record<string, string> = {}

const pieceOf = (title: string) => /bomber/i.test(title) ? 'bomber' : /beanie/i.test(title) ? 'beanie' : WOMEN.test(title) ? 'women' : extractProductType(title)

export function wornFor(title: string): string {
  const line = /minimal/i.test(title) ? 'minimal' : 'og'
  const design = getCollectionKey(title)
  if (!design) return ''
  return WORN[`${line}/${design}/${pieceOf(title)}`] ?? WORN[`${line}/${design}/*`] ?? ''
}
