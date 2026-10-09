import { getPreferredColorForCollection } from '../utils/productGrouping'

// Colour name → swatch hex (Stanley/Stella names first, then generic words).
// Specific names come before the words they contain ("worker blue" before "blue").
const HEX: [RegExp, string][] = [
  [/fiesta/i, '#e2553c'], [/worker blue/i, '#2445a3'], [/sky blue/i, '#a7c9ea'], [/light blue/i, '#bcd6ee'], [/royal blue/i, '#2f55c2'], [/blue soul/i, '#4f86c6'],
  [/french navy|navy/i, '#1d2a44'], [/indian grey/i, '#4a5664'], [/heather grey|heather/i, '#b4b4b2'], [/anthracite|charcoal/i, '#3b3d40'],
  [/green bay/i, '#5f9e8a'], [/glazed green|light green/i, '#a8c9a0'], [/kelly green/i, '#3a9a4a'], [/forest green|dark green/i, '#2c4a35'], [/olive/i, '#6b6f4a'],
  [/red.?brown/i, '#5a2a26'], [/heather red/i, '#b5474b'], [/burgundy|bordeaux|wine|maroon/i, '#5a2328'],
  [/washed/i, '#2a2a2c'], [/black/i, '#1b1b1d'], [/off.?white|white|natural|ecru|cream|ivory/i, '#f2efe8'], [/khaki/i, '#8a7d5c'], [/mocha/i, '#6f4e3d'], [/violet|purple/i, '#6b5b95'], [/dusk/i, '#4f5d73'], [/sand|beige/i, '#cdb89a'],
  [/blue/i, '#2f6fa8'], [/green/i, '#4a8a5a'], [/brown|chocolate|heritage/i, '#5b3a2e'], [/grey|gray|stone/i, '#9a9a96'],
  [/orange/i, '#f07a3a'], [/red/i, '#c0322a'], [/pink/i, '#e9a8b4'], [/yellow/i, '#f1c84b'],
]
export const hexOf = (name: string) => HEX.find(([r]) => r.test(name))?.[1] ?? '#c9c6bf'

/** Order a design's colours: its signature colour first, then other colours, then black, then white. */
export function rankColours<T>(design: string, items: T[], nameOf: (t: T) => string): T[] {
  const lead = getPreferredColorForCollection(design)
  const score = (n: string) => {
    const l = n.toLowerCase()
    if (l === lead) return 0
    if (/white|natural|cream|ivory/.test(l)) return 3
    if (/black/.test(l)) return 2
    return 1
  }
  return [...items].sort((a, b) => score(nameOf(a)) - score(nameOf(b)))
}
