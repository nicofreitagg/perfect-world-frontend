import { Suspense, type ReactNode } from 'react'
import { isNewSiteVisible } from './launch'

/** Renders the 11.11 version of a page once the new site is visible, the current page before. */
export default function Swap({ next, current }: { next: ReactNode; current: ReactNode }) {
  return <Suspense fallback={null}>{isNewSiteVisible() ? next : current}</Suspense>
}
