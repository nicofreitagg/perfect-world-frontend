// Same moment as the 11.11 launch gate (src/v2/launch.ts on the 11.11 branch).
export const LAUNCH_AT = Date.parse('2026-11-11T11:11:00+01:00')
export const isLaunched = () => Date.now() >= LAUNCH_AT

// Before 11.11 every signup joins the launch waitlist; afterwards it is the normal newsletter.
export const signupTag = () => (isLaunched() ? 'newsletter' : 'waitlist-wish')

/** Saves the email as a Shopify customer with email consent (see api/waitlist.ts). */
export async function joinList(email: string, website = ''): Promise<boolean> {
  try {
    const r = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tag: signupTag(), website }),
    })
    return r.ok
  } catch {
    return false
  }
}
