// Vercel serverless function: save a signup as a Shopify email subscriber, WITHOUT a customer account.
// Before 11.11 the popup and footer send tag "waitlist-wish"; after launch "newsletter".
//
// Uses the Admin API, which creates a plain customer record with email consent: no password,
// no account, and no account email linking to the old shop. (The old Storefront fallback
// created a full customer account, so it is gone.)
//
// Credentials, one of:
//   SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET  (Dev Dashboard app with write_customers, installed
//                                               on the store; we fetch a 24h token ourselves)
//   SHOPIFY_ADMIN_TOKEN                        (an older custom app's Admin API token)

type Req = { method?: string; body?: unknown }
type Res = {
  setHeader: (k: string, v: string) => void
  status: (code: number) => { json: (body: unknown) => void }
}

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || ''
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || ''
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || ''
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || ''
const TAGS = new Set(['waitlist-wish', 'newsletter'])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function gql(url: string, headers: Record<string, string>, query: string, variables: object) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ query, variables }) })
  const j = (await r.json()) as { data?: Record<string, unknown>; errors?: unknown }
  if (!r.ok || j.errors) throw new Error(`Shopify ${r.status}: ${JSON.stringify(j.errors ?? '')}`)
  return j.data as Record<string, { userErrors?: { message: string }[]; customerUserErrors?: { code?: string; message: string }[] } & Record<string, unknown>>
}

const CONSENT = { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' }

// Client credentials tokens last 24h: keep one per warm function instance, refresh 5 min early.
let cached: { token: string; until: number } | null = null
async function adminToken() {
  if (ADMIN_TOKEN) return ADMIN_TOKEN
  if (cached && cached.until > Date.now()) return cached.token
  const r = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  })
  const j = (await r.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string }
  if (!r.ok || !j.access_token) throw new Error(`token ${r.status}: ${j.error ?? ''}`)
  cached = { token: j.access_token, until: Date.now() + ((j.expires_in ?? 86399) - 300) * 1000 }
  return j.access_token
}

async function subscribe(email: string, tag: string) {
  const url = `https://${DOMAIN}/admin/api/2024-10/graphql.json`
  const h = { 'X-Shopify-Access-Token': await adminToken() }
  const created = await gql(url, h, `mutation($input: CustomerInput!) { customerCreate(input: $input) { customer { id } userErrors { message } } }`, {
    input: { email, tags: [tag], emailMarketingConsent: CONSENT },
  })
  const errs = created.customerCreate.userErrors ?? []
  if (!errs.length) return
  if (!errs.some((e) => /taken/i.test(e.message))) throw new Error(errs.map((e) => e.message).join('; '))
  // Already a customer: add the tag and switch email consent on.
  const found = await gql(url, h, `query($q: String!) { customers(first: 1, query: $q) { edges { node { id } } } }`, { q: `email:"${email}"` })
  const id = (found.customers as unknown as { edges: { node: { id: string } }[] }).edges[0]?.node.id
  if (!id) throw new Error('customer exists but was not found')
  await gql(url, h, `mutation($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`, { id, tags: [tag] })
  await gql(url, h, `mutation($input: CustomerEmailMarketingConsentUpdateInput!) { customerEmailMarketingConsentUpdate(input: $input) { userErrors { message } } }`, {
    input: { customerId: id, emailMarketingConsent: CONSENT },
  })
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ ok: false })
  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as { email?: string; tag?: string; website?: string }
  if (body.website) return res.status(200).json({ ok: true }) // honeypot: bots fill every field
  const email = String(body.email ?? '').trim().toLowerCase()
  const tag = TAGS.has(String(body.tag)) ? String(body.tag) : 'newsletter'
  if (!EMAIL.test(email) || email.length > 254) return res.status(400).json({ ok: false, error: 'email' })
  if (!DOMAIN || (!ADMIN_TOKEN && !(CLIENT_ID && CLIENT_SECRET))) return res.status(500).json({ ok: false, error: 'config' })
  try {
    await subscribe(email, tag)
    res.status(200).json({ ok: true })
  } catch (e) {
    console.error('waitlist signup failed', e)
    res.status(502).json({ ok: false })
  }
}
