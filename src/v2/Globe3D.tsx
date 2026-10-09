import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import Globe from '../components/3D/Globe'
import { latLonToVector3 } from '../utils/animations'

// The old site's 3D globe, in the new look: no space background, no stars,
// six cause pills that open their project page.
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
  const pos = useMemo(() => latLonToVector3(pin.lat, pin.lon, 1.02), [pin.lat, pin.lon])
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
  })

  return (
    <mesh ref={dot} position={[pos.x, pos.y, pos.z]}>
      <sphereGeometry args={[0.035, 16, 16]} />
      <meshBasicMaterial color={pin.color} />
      <Html center position={[0, ('lift' in pin ? pin.lift : undefined) ?? 0.12, 0]} zIndexRange={[60, 0]}>
        <button ref={label} type="button" className="pw-gpin" onClick={() => onOpen(pin.slug)} style={{ ['--c' as string]: pin.color }}>
          <span aria-hidden="true" />{pin.name}
        </button>
      </Html>
    </mesh>
  )
}

function Spinning({ onOpen, onReady }: { onOpen: (slug: string) => void; onReady: () => void }) {
  const group = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const velocity = useRef(0)
  const perPx = 0.006

  useFrame((_, delta) => {
    if (!group.current || dragging.current) return
    velocity.current *= 0.93
    if (Math.abs(velocity.current) > 0.02) group.current.rotation.y += velocity.current * delta
    else if (!still) group.current.rotation.y -= 0.06 * delta
  })

  return (
    // Start with Europe and Africa facing the viewer.
    <group ref={group} rotation={[0.28, -1.92, 0]} scale={1.85}>
      <Globe
        onReady={onReady}
        onDragStart={() => { dragging.current = true; velocity.current = 0 }}
        onDragMove={(dx) => { if (group.current) group.current.rotation.y += dx * perPx }}
        onDragEnd={(v) => { dragging.current = false; velocity.current = Math.max(-2.5, Math.min(2.5, v * 1000 * perPx)) }}
      />
      {PINS.map((p) => <Pin key={p.slug} pin={p} onOpen={onOpen} />)}
    </group>
  )
}

export default function Globe3D({ onReady }: { onReady: () => void }) {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => { if (ready) onReady() }, [ready, onReady])

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // Canvas reaches past the box so pills near the edge are not cut off.
      style={{ position: 'absolute', inset: '-60px -50px', width: 'auto', height: 'auto', touchAction: 'pan-y', opacity: ready ? 1 : 0, transition: 'opacity 1s ease' }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.domElement.style.touchAction = 'pan-y' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 4, 5]} intensity={2.1} />
      <pointLight position={[-5, -4, -5]} intensity={0.8} />
      <Suspense fallback={null}>
        <Spinning onOpen={(slug) => navigate(`/project/${slug}`)} onReady={() => setReady(true)} />
      </Suspense>
    </Canvas>
  )
}
