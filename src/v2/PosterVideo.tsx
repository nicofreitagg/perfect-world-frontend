import { useRef, useState } from 'react'

// A video that starts as its bright poster with our own play button, and only shows the
// browser controls once it plays (the native controls dim a paused video).
// corner: the play button sits bottom-left, so it never covers text in the middle of the poster.
export default function PosterVideo({ src, poster, label, playLabel, corner = false }: { src: string; poster: string; label: string; playLabel: string; corner?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const play = () => { setPlaying(true); ref.current?.play().catch(() => {}) }
  return (
    <>
      <video ref={ref} src={src} poster={poster} controls={playing} playsInline preload="none" aria-label={label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#0b0b0c' }} />
      {!playing && (
        <button type="button" onClick={play} aria-label={playLabel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: corner ? 'flex-end' : 'center', justifyContent: corner ? 'flex-start' : 'center', padding: corner ? 'clamp(14px, 2vw, 24px)' : 0, boxSizing: 'border-box' }}>
          <span style={{ width: corner ? 'clamp(48px, 4.4vw, 64px)' : 'clamp(60px, 6vw, 84px)', height: corner ? 'clamp(48px, 4.4vw, 64px)' : 'clamp(60px, 6vw, 84px)', borderRadius: '50%', background: '#ffffff', boxShadow: '0 12px 30px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30%" height="30%" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.5 L12 7 L3.5 12.5 Z" fill="#e2453c" /></svg>
          </span>
        </button>
      )}
    </>
  )
}
