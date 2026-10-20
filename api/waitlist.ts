// Vercel serverless function: store a signup as a Shopify customer who agreed to emails.
// Before 11.11 the popup and footer send tag "waitlist-wish"; after launch "newsletter".
//
// Best route: SHOPIFY_ADMIN_TOKEN (a custom app in Shopify admin with write_customers),
// which also sets the tag. Without it we fall back to the Storefront API: the email is still
// saved with marketing consent, only without the tag.

type Req = { method?: string; body?: unknown }
type Res = {
  setHeader: (k: string, v: string) => void
  status: (code: number) => { json: (body: unknown) => void }
}

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || ''
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || ''
const STOREFRONT_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
const TAGS = new Set(['waitlist-wish', 'newsletter'])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function gql(url: string, headers: Record<string, string>, query: string, variables: object) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ query, variables }) })
  const j = (await r.json()) as { data?: Record<string, unknown>; errors?: unknown }
  if (!r.ok || j.errors) throw new Error(`Shopify ${r.status}: ${JSON.stringify(j.errors ?? '')}`)
  return j.data as Record<string, { userErrors?: { message: string }[]; customerUserErrors?: { code?: string; message: string }[] } & Record<string, unknown>>
}

const CONSENT = { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' }

async function viaAdmin(email: string, tag: string) {
  const url = `https://${DOMAIN}/admin/api/2024-10/graphql.json`
  const h = { 'X-Shopify-Access-Token': ADMIN_TOKEN }
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

async function viaStorefront(email: string) {
  const url = `https://${DOMAIN}/api/2024-01/graphql.json`
  const password = crypto.randomUUID() + 'Aa1!'
  const d = await gql(url, { 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN }, `mutation($input: CustomerCreateInput!) { customerCreate(input: $input) { customer { id } customerUserErrors { code message } } }`, {
    input: { email, password, acceptsMarketing: true },
  })
  const errs = d.customerCreate.customerUserErrors ?? []
  // An existing customer is fine: the email is already in Shopify.
  if (errs.length && !errs.every((e) => e.code === 'TAKEN' || e.code === 'CUSTOMER_DISABLED')) throw new Error(errs.map((e) => e.message).join('; '))
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ ok: false })
  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as { email?: string; tag?: string; website?: string }
  if (body.website) return res.status(200).json({ ok: true }) // honeypot: bots fill every field
  const email = String(body.email ?? '').trim().toLowerCase()
  const tag = TAGS.has(String(body.tag)) ? String(body.tag) : 'newsletter'
  if (!EMAIL.test(email) || email.length > 254) return res.status(400).json({ ok: false, error: 'email' })
  if (!DOMAIN || (!ADMIN_TOKEN && !STOREFRONT_TOKEN)) return res.status(500).json({ ok: false, error: 'config' })
  try {
    if (ADMIN_TOKEN) await viaAdmin(email, tag)
    else await viaStorefront(email)
    res.status(200).json({ ok: true, tagged: !!ADMIN_TOKEN })
  } catch (e) {
    console.error('waitlist signup failed', e)
    res.status(502).json({ ok: false })
  }
}
