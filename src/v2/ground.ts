import { useEffect } from 'react'
import { causeGround } from './data'

// Tints the fixed page ground (.pw-flow) with a cause's colours while a design is on screen;
// the drifting six-colour blobs step back so the design's own colours lead.
export function useCauseGround(slug: string | undefined) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--pw-ground', causeGround(slug))
    root.classList.toggle('pw-tinted', !!slug)
    return () => { root.style.removeProperty('--pw-ground'); root.classList.remove('pw-tinted') }
  }, [slug])
}
