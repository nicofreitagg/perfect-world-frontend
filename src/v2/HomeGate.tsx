import { lazy, Suspense, useEffect, useState } from 'react'
import { isNewSiteVisible, LAUNCH_AT } from './launch'

// Until 11:11 the live home is the waitlist-first prelaunch page (live since 26 Oct).
const PreLaunch = lazy(() => import('../pages/PreLaunch'))
const HomeV2 = lazy(() => import('./HomeV2'))

/** Shows the prelaunch homepage until the 11.11 launch moment (or in previews), then the new one. */
export default function HomeGate() {
  const [visible, setVisible] = useState(isNewSiteVisible)

  useEffect(() => {
    if (visible) return
    const wait = LAUNCH_AT - Date.now()
    if (wait <= 0 || wait > 2 ** 31 - 1) return
    const t = setTimeout(() => setVisible(true), wait)
    return () => clearTimeout(t)
  }, [visible])

  return <Suspense fallback={null}>{visible ? <HomeV2 /> : <PreLaunch />}</Suspense>
}
