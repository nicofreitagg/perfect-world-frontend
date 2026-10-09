// Colour name → swatch hex, shared by the home receipt and the shop.
const HEX: [RegExp, string][] = [
  [/washed/i, '#2a2a2c'], [/black/i, '#1b1b1d'], [/off.?white|white|natural|ecru|cream/i, '#f2efe8'], [/khaki/i, '#8a7d5c'], [/mocha/i, '#6f4e3d'], [/violet/i, '#6b5b95'], [/dusk/i, '#4f5d73'], [/sand|beige/i, '#cdb89a'],
  [/navy/i, '#1d2a44'], [/sky/i, '#9cc3ea'], [/blue/i, '#2f6fa8'], [/olive|green/i, '#6b6f4a'], [/burgundy|bordeaux|wine/i, '#5a2328'],
  [/brown|chocolate|heritage/i, '#5b3a2e'], [/grey|gray|stone|heather/i, '#9a9a96'], [/red/i, '#c0322a'], [/pink/i, '#e9a8b4'], [/orange/i, '#FF8C42'],
]
export const hexOf = (name: string) => HEX.find(([r]) => r.test(name))?.[1] ?? '#c9c6bf'
