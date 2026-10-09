// Parallel cause-colour lines laid on the seam between two blocks, instead of a soft gradient.
const SIX = ['#FF8C42', '#5DADE2', '#4cc37f', '#b07e52', '#8e8f94', '#2f6fa8']

export function Lines({ colors = SIX, flip = false, className = '' }: { colors?: string[]; flip?: boolean; className?: string }) {
  return (
    <svg className={`pwl-lines ${className}`} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {colors.map((c, i) => <path key={c} d={`M-20 ${30 + i * 8} C 300 ${-6 + i * 8}, 520 ${74 + i * 8}, 760 ${38 + i * 8} S 1200 ${6 + i * 8}, 1460 ${34 + i * 8}`} stroke={c} />)}
    </svg>
  )
}
