// The 11.11 rework must not be public before the launch moment, so the new
// pages are gated by time. Previews (Vercel branch URLs, localhost) always
// show the new site so it can be reviewed ahead of launch.

/** 11.11.2026 at 11:11 Berlin time (CET, UTC+1). */
export const LAUNCH_AT = Date.parse('2026-11-11T11:11:00+01:00')

const PUBLIC_HOSTS = [
  'perfectworld.global',
  'www.perfectworld.global',
  'perfect-world-frontend.vercel.app',
  'perfect-world-frontend-perfect-world.vercel.app',
  'perfect-world-frontend-ankurprasads-projects.vercel.app',
]

const PREVIEW_KEY = 'pw-preview-1111'

export function isNewSiteVisible(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).get('preview') === '1111') {
      sessionStorage.setItem(PREVIEW_KEY, '1')
    }
    if (sessionStorage.getItem(PREVIEW_KEY) === '1') return true
  } catch {
    // storage can be blocked; fall through to the host and time checks
  }
  if (!PUBLIC_HOSTS.includes(window.location.hostname)) return true
  return Date.now() >= LAUNCH_AT
}

/** True once the 11.11 moment has passed, so copy can say "since 11.11" instead of "from 11.11". */
export const isLaunched = () => Date.now() >= LAUNCH_AT
