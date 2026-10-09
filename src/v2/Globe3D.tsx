import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { latLonToVector3 } from '../utils/animations'

// The causes globe, with the red line from the logo around the equator. Skins (all in public/v2/img):
//   wire = see-through ball of hand-drawn, imperfect grid lines, like the One World print (default, globe-wire.webp)
//   ink  = ink-black land on off-white (globe-pw.webp), preview with ?globe=ink
//   hand = drawn coastlines on a grid (globe-hand.webp), preview with ?globe=hand
// Six cause pills open their project page.
export type GlobeSkin = 'wire' | 'ink' | 'hand'
const SKINS: Record<GlobeSkin, string> = { wire: '/v2/img/globe-wire.webp', ink: '/v2/img/globe-pw.webp', hand: '/v2/img/globe-hand.webp' }
const globeSkin = (): GlobeSkin => {
  const q = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('globe') : null
  return q === 'ink' || q === 'hand' ? q : 'wire'
}

const PINS = [
  { slug: 'one-world', name: 'One World', color: '#5DADE2', lat: 49.84, lon: 24.03, lift: 0.24 },
  { slug: 'talk-about-it', name: 'Talk About It', color: '#FF8C42', lat: 48.14, lon: 11.58 },
  { slug: 'wild-at-heart', name: 'Wild at Heart', color: '#8e8f94', lat: -20.3, lon: 23.6 },
  { slug: 'endangered-oceans', name: 'Endangered Oceans', color: '#2f6fa8', lat: 12.17, lon: -68.98 },
  { slug: 'rich-in-life', name: 'Rich in Life', color: '#b07e52', lat: 5.63, lon: -72.43 },
  { slug: 'cool-down', name: 'Cool Down', color: '#4cc37f', lat: 18.5, lon: -90.0 },
]

const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function Pin({ pin, onOpen }: { pin: (typeof PINS)[number]; onOpen: (slug: string) => void }) {
  const pos = useMemo(() => latLonToVector3(pin.lat, pin.lon, 1.01), [pin.lat, pin.lon])
  const dot = useRef<THREE.Mesh>(null)
  const label = useRef<HTMLButtonElement>(null)
  const { camera } = useThree()
  const world = useMemo(() => new THREE.Vector3(), [])
  const centre = useMemo(() => new THREE.Vector3(), [])
  const toCam = useMemo(() => new THREE.Vector3(), [])

  // Hide pills on the far side of the globe.
  useFrame(() => {
    if (!dot.current || !label.current) return
    dot.current.getWorldPosition(world)
    dot.current.parent?.getWorldPosition(centre)
    toCam.copy(camera.position).sub(centre).normalize()
    const facing = world.sub(centre).normalize().dot(toCam)
    const show = facing > 0.12
    label.current.style.opacity = show ? String(Math.min(1, (facing - 0.12) * 5)) : '0'
    label.current.style.pointerEvents = show ? 'auto' : 'none'
    label.current.tabIndex = show ? 0 : -1
    // Dots on the far side would show through the see-through ball.
    ;(dot.current.material as THREE.MeshBasicMaterial).opacity = show ? 1 : 0
  })

  return (
    <mesh ref={dot} position={[pos.x, pos.y, pos.z]}>
      <sphereGeometry args={[0.035, 16, 16]} />
      <meshBasicMaterial color={pin.color} transparent />
      <Html center position={[0, ('lift' in pin ? pin.lift : undefined) ?? 0.12, 0]} zIndexRange={[60, 0]}>
        <button ref={label} type="button" className="pw-gpin" onClick={() => onOpen(pin.slug)} style={{ ['--c' as string]: pin.color }}>
          <span aria-hidden="true" />{pin.name}
        </button>
      </Html>
    </mesh>
  )
}

function Earth({ onOpen, onReady, skin }: { onOpen: (slug: string) => void; onReady: () => void; skin: GlobeSkin }) {
  const map = useTexture(SKINS[skin])
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 4
  const group = useRef<THREE.Group>(null)
  const drag = useRef<{ x: number; t: number } | null>(null)
  const velocity = useRef(0)
  const perPx = 0.006

  useEffect(() => { onReady() }, [onReady])

  useFrame((_, delta) => {
    if (!group.current || drag.current) return
    velocity.current *= 0.93
    if (Math.abs(velocity.current) > 0.02) group.current.rotation.y += velocity.current * delta
    else if (!still) group.current.rotation.y -= 0.06 * delta
  })

  return (
    // Start with Europe and Africa facing the viewer.
    <group ref={group} rotation={[0.28, -1.92, 0]} scale={1.85}>
      <mesh
        onPointerDown={(e) => { e.stopPropagation(); drag.current = { x: e.clientX, t: performance.now() }; velocity.current = 0; (e.target as Element).setPointerCapture?.(e.pointerId) }}
        onPointerMove={(e) => {
          if (!drag.current || !group.current) return
          const now = performance.now()
          const dx = e.clientX - drag.current.x
          group.current.rotation.y += dx * perPx
          velocity.current = (dx * perPx * 1000) / Math.max(now - drag.current.t, 1)
          drag.current = { x: e.clientX, t: now }
        }}
        onPointerUp={(e) => { drag.current = null; velocity.current = Math.max(-2.5, Math.min(2.5, velocity.current)); (e.target as Element).releasePointerCapture?.(e.pointerId) }}
        onPointerCancel={() => { drag.current = null }}
      >
        <sphereGeometry args={[1, 96, 96]} />
        {skin === 'wire'
          ? <meshBasicMaterial map={map} transparent depthWrite={false} side={THREE.FrontSide} />
          : <meshStandardMaterial map={map} roughness={1} metalness={0} />}
      </mesh>
      {/* See-through skin: the far side of the ball shows faintly through the middle. */}
      {skin === 'wire' && (
        <mesh renderOrder={-1}>
          <sphereGeometry args={[1, 96, 96]} />
          <meshBasicMaterial map={map} transparent opacity={0.28} depthWrite={false} side={THREE.BackSide} />
        </mesh>
      )}
      {PINS.map((p) => <Pin key={p.slug} pin={p} onOpen={onOpen} />)}
    </group>
  )
}

export default function Globe3D({ onReady, skin = globeSkin() }: { onReady: () => void; skin?: GlobeSkin }) {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => { if (ready) onReady() }, [ready, onReady])
  const markReady = useMemo(() => () => setReady(true), [])

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // Canvas reaches past the box so pills near the edge are not cut off.
      style={{ position: 'absolute', inset: '-60px -50px', width: 'auto', height: 'auto', touchAction: 'pan-y', opacity: ready ? 1 : 0, transition: 'opacity .8s ease' }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.domElement.style.touchAction = 'pan-y' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      {/* The drawn skin wants flatter light, like paper. */}
      <ambientLight intensity={skin === 'hand' ? 2.2 : 1.6} />
      <directionalLight position={[-3, 3, 5]} intensity={skin === 'hand' ? 0.9 : 1.4} />
      <Suspense fallback={null}>
        <Earth skin={skin} onOpen={(slug) => navigate(`/project/${slug}`)} onReady={markReady} />
      </Suspense>
    </Canvas>
  )
}
