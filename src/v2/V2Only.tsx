import { lazy, Suspense, type ReactNode } from 'react'
import { isNewSiteVisible } from './launch'

const NotFound = lazy(() => import('../pages/NotFound'))

/** Pages that only exist in the 11.11 rework: a 404 on the public site until launch. */
export default function V2Only({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{isNewSiteVisible() ? children : <NotFound />}</Suspense>
}
