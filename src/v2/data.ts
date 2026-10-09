// Fixed donation per piece, confirmed for the 11.11 model.
export const PIECES = {
  tote: { name: 'Tote bag', price: '27.77', give: '7.77' },
  shirt: { name: 'T-shirt', price: '33.33', give: '11.11' },
  oversized: { name: 'Oversized shirt', price: '55.55', give: '22.22' },
  hoodie: { name: 'Hoodie', price: '77.77', give: '33.33' },
} as const

// New pieces, shown as "coming soon" placeholders. Prices are Claude's suggestion (9 Oct), not confirmed by Nico yet.
export const NEW_PIECES = [
  { id: 'women', name: "Women's T-shirt", sub: 'Fitted cut · made with one partner', price: '33.33', give: '11.11', fill: '#1b1b1d', bg: '#e9e7e2' },
  { id: 'bomber', name: 'Bomber jacket', sub: 'Made with one partner', price: '111.11', give: '44.44', fill: '#1d2a44', bg: '#dedbd4' },
  { id: 'beanie', name: 'Beanie', sub: 'Just the logo', price: '33.33', give: '7.77', fill: '#b8572d', bg: '#ecebe6' },
] as const

export type CauseKey = 'rich' | 'one-world' | 'talk' | 'oceans' | 'cool' | 'wild'

export const icon = (cause: CauseKey, variant: 'a' | 'b' | 'wa' | 'wb') =>
  `/v2/icons/${cause}-${variant}.svg`

export interface OgPiece {
  label: string
  img: string
  sub: string
  ico: string
}

export const OG: OgPiece[] = [
  { label: 'RICH IN LIFE', img: '/v2/img/og-rich.png', sub: 'Mission Positivity · from €11.11 to the cause', ico: icon('rich', 'a') },
  { label: 'ONE WORLD', img: '/v2/img/og-one-world.webp', sub: 'Care in Action · from €11.11 to the cause', ico: icon('one-world', 'a') },
  { label: 'ENDANGERED OCEANS', img: '/v2/img/og-oceans.webp', sub: 'SECORE International · from €11.11 to the cause', ico: icon('oceans', 'a') },
  { label: 'TALK ABOUT IT', img: '/v2/img/og-talk.webp', sub: 'Mental Health Initiative · from €11.11 to the cause', ico: icon('talk', 'a') },
  { label: 'COOL DOWN', img: '/v2/img/og-cool.webp', sub: 'Plant-for-the-Planet · from €11.11 to the cause', ico: icon('cool', 'a') },
  { label: 'WILD AT HEART', img: '/v2/img/og-wild.webp', sub: 'Elephants for Africa · from €11.11 to the cause', ico: icon('wild', 'a') },
]

export interface MinimalPiece {
  label: string
  color: string
  mark: string
  kind: 'tee' | 'hoodie'
  sub: string
  isNew?: boolean
}

// Drawn silhouettes until the Minimal samples are photographed.
export const MINIMAL: MinimalPiece[] = [
  { label: 'MINIMAL TEE · BLACK', color: '#1b1b1d', mark: '#e2453c', kind: 'tee', sub: '€33.33 · €11.11 to your cause', isNew: true },
  { label: 'MINIMAL TEE · OFF-WHITE', color: '#f2efe8', mark: '#0b0b0c', kind: 'tee', sub: '€33.33 · €11.11 to your cause' },
  { label: 'MINIMAL HOODIE · SAND', color: '#cdb89a', mark: '#0b0b0c', kind: 'hoodie', sub: '€77.77 · €33.33 to your cause' },
  { label: 'MINIMAL TEE · OLIVE', color: '#6b6f4a', mark: '#f2efe8', kind: 'tee', sub: '€33.33 · €11.11 to your cause' },
  { label: 'MINIMAL HOODIE · BURGUNDY', color: '#5a2328', mark: '#f2efe8', kind: 'hoodie', sub: '€77.77 · €33.33 to your cause' },
  { label: 'MINIMAL TEE · STONE', color: '#9a9a96', mark: '#0b0b0c', kind: 'tee', sub: '€33.33 · €11.11 to your cause' },
  { label: 'MINIMAL HOODIE · NAVY', color: '#1d2a44', mark: '#e2453c', kind: 'hoodie', sub: '€77.77 · €33.33 to your cause' },
]

export const TEE_PATH = 'M60 20 L95 8 Q120 26 145 8 L180 20 L218 62 L190 86 L176 72 L176 214 L64 214 L64 72 L50 86 L22 62 Z'
export const HOODIE_PATH = 'M78 44 Q120 -6 162 44 L198 58 L228 192 L202 198 L184 104 L184 218 L56 218 L56 104 L38 198 L12 192 L42 58 Z'

export interface WishTag {
  loud: boolean
  ico: string
  name: string
  partner: string
  wish: string
  piece: string
  price: string
  give: string
  rot: number
  // OG (loud) tags
  img?: string
  bg?: string
  btnFg?: string
  // Minimal (quiet) tags
  lc?: string
  path?: string
  color?: string
  mark?: string
}

// Wish lines are drafts: each partner approves their own before launch.
export const TAGS: WishTag[] = [
  { loud: true, ico: icon('talk', 'wa'), name: 'TALK ABOUT IT', partner: 'MHI', wish: 'someone to talk to, for everyone.', piece: 'T-shirt', price: '€33.33', give: '€11.11', img: '/v2/img/og-talk.webp', bg: 'linear-gradient(160deg,#f5862e,#d65a0f)', btnFg: '#d65a0f', rot: -2 },
  { loud: false, ico: icon('one-world', 'a'), lc: '#2b86c4', name: 'ONE WORLD', partner: 'Care in Action', wish: 'nobody faces the hard times alone.', piece: 'Minimal tee, black', price: '€33.33', give: '€11.11', path: TEE_PATH, color: '#1b1b1d', mark: '#e2453c', rot: 1.6 },
  { loud: true, ico: icon('cool', 'wa'), name: 'COOL DOWN', partner: 'Plant-for-the-Planet', wish: 'more trees than we can count.', piece: 'Hoodie', price: '€77.77', give: '€33.33', img: '/v2/img/og-cool.webp', bg: 'linear-gradient(160deg,#4fae63,#2a7140)', btnFg: '#2a7140', rot: -1.2 },
  { loud: false, ico: icon('rich', 'a'), lc: '#9a6a40', name: 'RICH IN LIFE', partner: 'Mission Positivity', wish: 'every child in Paya keeps learning.', piece: 'Minimal tee, off-white', price: '€33.33', give: '€11.11', path: TEE_PATH, color: '#f2efe8', mark: '#0b0b0c', rot: 2 },
  { loud: true, ico: icon('wild', 'wa'), name: 'WILD AT HEART', partner: 'Elephants for Africa', wish: 'room for elephants and people.', piece: 'T-shirt', price: '€33.33', give: '€11.11', img: '/v2/img/og-wild.webp', bg: 'linear-gradient(160deg,#8e8f94,#2e3a5a)', btnFg: '#2e3a5a', rot: -1.6 },
  { loud: false, ico: icon('oceans', 'a'), lc: '#2f6fa8', name: 'ENDANGERED OCEANS', partner: 'SECORE', wish: 'reefs that grow back.', piece: 'Minimal hoodie, sand', price: '€77.77', give: '€33.33', path: HOODIE_PATH, color: '#cdb89a', mark: '#0b0b0c', rot: 1.2 },
]
