import { isLaunched } from '../v2/launch'

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
