import { useEffect, useRef } from 'react'

// Parallel cause-colour lines laid on the seam between two blocks, instead of a soft gradient.
// They draw themselves in, line by line, when they scroll into view.
const SIX = ['#FF8C42', '#5DADE2', '#4cc37f', '#b07e52', '#8e8f94', '#2f6fa8']

export function Lines({ colors = SIX, flip = false, className = '' }: { colors?: string[]; flip?: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('pw-draw-wait')
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { el.classList.add('pw-draw-on'); io.disconnect() } }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <svg ref={ref} className={`pwl-lines ${className}`} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {colors.map((c, i) => <path key={c} pathLength={1000} style={{ '--i': i } as React.CSSProperties} d={`M-20 ${30 + i * 8} C 300 ${-6 + i * 8}, 520 ${74 + i * 8}, 760 ${38 + i * 8} S 1200 ${6 + i * 8}, 1460 ${34 + i * 8}`} stroke={c} />)}
    </svg>
  )
}
