// Full multi-room ICF house — block-textured walls, openings, rebar, light slab
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ── Real-world ICF dimensions (meters) ─────────────────────────────────────
const FT = 0.3048
const COURSE_H = (18 / 12) * FT      // 18" course height
const BLOCK_L = (48 / 12) * FT       // 48" block length
const WALL_H = 2.6                    // ~8.5 ft wall
const WALL_T = (8 / 12) * FT          // 8" core wall thickness

// ── Block-grid canvas texture (white blocks, light seams) ──────────────────
function makeBlockTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 96
  const ctx = c.getContext('2d')
  // White block face
  ctx.fillStyle = '#f4f5f6'
  ctx.fillRect(0, 0, 256, 96)
  // Subtle vertical gradient shade
  const g = ctx.createLinearGradient(0, 0, 0, 96)
  g.addColorStop(0, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(200,205,210,0.25)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 96)
  // Seam lines (bottom + left so tiling forms a continuous grid)
  ctx.strokeStyle = '#c4ccd2'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, 95); ctx.lineTo(256, 95)
  ctx.moveTo(1, 0); ctx.lineTo(1, 96)
  ctx.stroke()
  // Faint mid vertical joint
  ctx.strokeStyle = '#d7dde1'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(128, 0); ctx.lineTo(128, 96)
  ctx.stroke()
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

// ── A single textured wall box ──────────────────────────────────────────────
function BlockBox({ baseTex, size, position }) {
  const [w, h, d] = size
  const tex = useMemo(() => {
    const t = baseTex.clone()
    t.needsUpdate = true
    t.repeat.set(Math.max(1, w / BLOCK_L), Math.max(1, h / COURSE_H))
    return t
  }, [baseTex, w, h])
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial map={tex} roughness={0.85} metalness={0} />
    </mesh>
  )
}

// ── Orange buck frame around an opening ─────────────────────────────────────
function Buck({ width, sill, head, t }) {
  const orange = '#c2703a'
  const orangeDark = '#a85a28'
  const jamb = 0.06
  const frameH = head - sill
  return (
    <group>
      {/* Head (lintel) */}
      <mesh position={[0, head, 0]} castShadow>
        <boxGeometry args={[width + jamb * 2, jamb, t + 0.02]} />
        <meshStandardMaterial color={orangeDark} roughness={0.7} />
      </mesh>
      {/* Sill */}
      <mesh position={[0, sill, 0]} castShadow>
        <boxGeometry args={[width + jamb * 2, jamb, t + 0.02]} />
        <meshStandardMaterial color={orange} roughness={0.7} />
      </mesh>
      {/* Jambs */}
      <mesh position={[-width / 2, sill + frameH / 2, 0]} castShadow>
        <boxGeometry args={[jamb, frameH, t + 0.02]} />
        <meshStandardMaterial color={orange} roughness={0.7} />
      </mesh>
      <mesh position={[width / 2, sill + frameH / 2, 0]} castShadow>
        <boxGeometry args={[jamb, frameH, t + 0.02]} />
        <meshStandardMaterial color={orange} roughness={0.7} />
      </mesh>
      {/* Recessed dark glass */}
      <mesh position={[0, sill + frameH / 2, 0]}>
        <boxGeometry args={[width, frameH, t * 0.4]} />
        <meshStandardMaterial color="#243240" roughness={0.2} metalness={0.3} opacity={0.85} transparent />
      </mesh>
    </group>
  )
}

// ── Vertical rebar sticking up from a wall top ──────────────────────────────
function RebarRow({ length, spacing = 0.42 }) {
  const count = Math.max(2, Math.floor(length / spacing))
  const bars = []
  for (let i = 0; i <= count; i++) {
    const x = -length / 2 + (i / count) * length
    bars.push(x)
  }
  return (
    <group>
      {bars.map((x, i) => (
        <mesh key={i} position={[x, WALL_H + 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.34, 6]} />
          <meshStandardMaterial color="#b0581f" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ── A wall run with optional openings, built along local X ──────────────────
// from/to are [x,z]; openings: { atFrac, w, sill, head }
function WallRun({ baseTex, from, to, openings = [], showRebar = true }) {
  const dx = to[0] - from[0]
  const dz = to[1] - from[1]
  const length = Math.hypot(dx, dz)
  const angle = Math.atan2(dz, dx)
  const cx = (from[0] + to[0]) / 2
  const cz = (from[1] + to[1]) / 2

  // Convert openings to absolute spans along local X (centered at 0)
  const ops = openings
    .map((o) => {
      const center = (o.atFrac - 0.5) * length
      return { ...o, x0: center - o.w / 2, x1: center + o.w / 2 }
    })
    .sort((a, b) => a.x0 - b.x0)

  const boxes = []
  // Solid piers between openings (full height)
  let cursor = -length / 2
  ops.forEach((o) => {
    const pierW = o.x0 - cursor
    if (pierW > 0.02) {
      boxes.push({ size: [pierW, WALL_H, WALL_T], pos: [cursor + pierW / 2, WALL_H / 2, 0] })
    }
    // Sill below opening
    if (o.sill > 0.02) {
      boxes.push({ size: [o.w, o.sill, WALL_T], pos: [(o.x0 + o.x1) / 2, o.sill / 2, 0] })
    }
    // Header above opening
    if (WALL_H - o.head > 0.02) {
      boxes.push({ size: [o.w, WALL_H - o.head, WALL_T], pos: [(o.x0 + o.x1) / 2, o.head + (WALL_H - o.head) / 2, 0] })
    }
    cursor = o.x1
  })
  // Final pier
  const endW = length / 2 - cursor
  if (endW > 0.02) {
    boxes.push({ size: [endW, WALL_H, WALL_T], pos: [cursor + endW / 2, WALL_H / 2, 0] })
  }

  return (
    <group position={[cx, 0, cz]} rotation={[0, -angle, 0]}>
      {boxes.map((b, i) => (
        <BlockBox key={i} baseTex={baseTex} size={b.size} position={b.pos} />
      ))}
      {ops.map((o, i) => (
        <group key={`b${i}`} position={[(o.x0 + o.x1) / 2, 0, 0]}>
          <Buck width={o.w} sill={o.sill} head={o.head} t={WALL_T} />
        </group>
      ))}
      {/* Top plate cap */}
      <mesh position={[0, WALL_H + 0.01, 0]} castShadow>
        <boxGeometry args={[length, 0.03, WALL_T]} />
        <meshStandardMaterial color="#dfe3e6" roughness={0.8} />
      </mesh>
      {showRebar && <RebarRow length={length} />}
    </group>
  )
}

// ── House layout (multi-room footprint) ─────────────────────────────────────
function House() {
  const baseTex = useMemo(() => makeBlockTexture(), [])

  // Footprint corners (meters)
  const W = 5.5   // half width (x)
  const D = 4     // half depth (z)

  const runs = [
    // North (back) exterior — two windows
    { from: [-W, -D], to: [W, -D], openings: [
      { atFrac: 0.3, w: 1.3, sill: 0.9, head: 2.1 },
      { atFrac: 0.72, w: 1.3, sill: 0.9, head: 2.1 },
    ] },
    // South (front) exterior — entry door + window
    { from: [-W, D], to: [W, D], openings: [
      { atFrac: 0.32, w: 1.1, sill: 0.0, head: 2.2 },   // door
      { atFrac: 0.7, w: 1.6, sill: 0.85, head: 2.1 },   // picture window
    ] },
    // West exterior — one window
    { from: [-W, -D], to: [-W, D], openings: [
      { atFrac: 0.5, w: 1.3, sill: 0.9, head: 2.1 },
    ] },
    // East exterior — one window
    { from: [W, -D], to: [W, D], openings: [
      { atFrac: 0.4, w: 1.4, sill: 0.85, head: 2.1 },
    ] },
    // Interior cross wall (along x) — doorway
    { from: [-W, 0], to: [1.5, 0], openings: [
      { atFrac: 0.6, w: 1.0, sill: 0.0, head: 2.1 },
    ], showRebar: false },
    // Interior wall (along z, front-right) — doorway
    { from: [1.5, -D], to: [1.5, 0], openings: [
      { atFrac: 0.5, w: 1.0, sill: 0.0, head: 2.1 },
    ], showRebar: false },
    // Interior wall (along z, front-left) — doorway
    { from: [-2, 0], to: [-2, D], openings: [
      { atFrac: 0.55, w: 1.0, sill: 0.0, head: 2.1 },
    ], showRebar: false },
  ]

  return (
    <group position={[0, 0, 0]}>
      {runs.map((r, i) => (
        <WallRun
          key={i}
          baseTex={baseTex}
          from={r.from}
          to={r.to}
          openings={r.openings}
          showRebar={r.showRebar !== false}
        />
      ))}
    </group>
  )
}

// ── Concrete slab floor (grey) ─────────────────────────────────────────────
function Floor() {
  const concrete = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512; c.height = 512
    const ctx = c.getContext('2d')
    // Dark concrete grey base
    ctx.fillStyle = '#666666'
    ctx.fillRect(0, 0, 512, 512)
    // Subtle texture: darker areas for depth
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`
      ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 40 + 10, Math.random() * 40 + 10)
    }
    // Faint joint lines (slab pattern)
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = 2
    for (let i = 0; i <= 512; i += 128) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(3, 3)
    return t
  }, [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[26, 26]} />
      <meshStandardMaterial map={concrete} roughness={0.95} />
    </mesh>
  )
}

function AutoOrbit({ enabled, radius = 13, height = 8 }) {
  const a = useRef(0.4)
  useFrame((state) => {
    if (!enabled) return
    a.current += 0.0016
    state.camera.position.x = Math.sin(a.current) * radius
    state.camera.position.z = Math.cos(a.current) * radius
    state.camera.position.y = height
    state.camera.lookAt(0, 0.8, 0)
  })
  return null
}

export default function ICFHouseModel({ autoOrbit = true }) {
  return (
    <Canvas
      shadows
      camera={{ position: [11, 8, 11], fov: 38 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#ffffff', '#9aa7b2', 0.5]} />
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.35} color="#bfe9ff" />

      <House />
      <Floor />

      <AutoOrbit enabled={autoOrbit} />
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0.8, 0]}
      />
    </Canvas>
  )
}
