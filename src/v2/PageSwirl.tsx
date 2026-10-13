import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Moving between pages of the new site: six cause-colour swirls sweep across the screen
// while the next page fades in. Not on the very first page load, and not with reduced motion.
let firstPage = true
const SIX = ['#FF8C42', '#5DADE2', '#4cc37f', '#b07e52', '#8e8f94', '#2f6fa8']

export default function PageSwirl() {
  const [on, setOn] = useState(false)
  useLayoutEffect(() => {
    if (firstPage) { firstPage = false; return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    root.classList.add('pw-nav')
    setOn(true)
    const t = setTimeout(() => { root.classList.remove('pw-nav'); setOn(false) }, 1100)
    return () => { clearTimeout(t); root.classList.remove('pw-nav') }
  }, [])
  if (!on) return null
  // Rendered on <body>, outside the page that is fading in, so the swirls stay fully visible.
  return createPortal(
    <svg className="pw-pageswirl" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
      {SIX.map((c, i) => (
        <path key={c} pathLength={1000} stroke={c} style={{ '--i': i } as React.CSSProperties}
          d={`M-40 ${150 + i * 18} C 220 ${40 + i * 18}, 380 ${300 + i * 14}, 620 ${200 + i * 12} C 760 ${140 + i * 10}, 800 ${260 + i * 10}, 720 ${250 + i * 10} C 650 ${240 + i * 10}, 700 ${110 + i * 14}, 880 ${140 + i * 14} C 1080 ${170 + i * 14}, 1200 ${300 + i * 10}, 1480 ${180 + i * 16}`} />
      ))}
    </svg>,
    document.body,
  )
}
