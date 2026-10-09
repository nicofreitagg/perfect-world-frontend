import { useRef, useState } from 'react'

// A video that starts as its bright poster with our own play button, and only shows the
// browser controls once it plays (the native controls dim a paused video).
// below: the play button sits centred just under the middle of the poster, so it never covers a line of text there.
export default function PosterVideo({ src, poster, label, playLabel, below = false }: { src: string; poster: string; label: string; playLabel: string; below?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const play = () => { setPlaying(true); ref.current?.play().catch(() => {}) }
  return (
    <>
      <video ref={ref} src={src} poster={poster} controls={playing} playsInline preload="none" aria-label={label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#0b0b0c' }} />
      {!playing && (
        <button type="button" onClick={play} aria-label={playLabel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: below ? 'flex-start' : 'center', justifyContent: 'center', padding: below ? '35% 0 0' : 0, boxSizing: 'border-box' }}>
          <span style={{ width: below ? 'clamp(48px, 4.4vw, 68px)' : 'clamp(60px, 6vw, 84px)', height: below ? 'clamp(48px, 4.4vw, 68px)' : 'clamp(60px, 6vw, 84px)', borderRadius: '50%', background: '#ffffff', boxShadow: '0 12px 30px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30%" height="30%" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.5 L12 7 L3.5 12.5 Z" fill="#e2453c" /></svg>
          </span>
        </button>
      )}
    </>
  )
}
