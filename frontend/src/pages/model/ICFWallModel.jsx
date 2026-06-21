import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// Single ICF block: two foam panels + concrete core
function ICFBlock({ position, coreInches = 6, color = '#14b8a6' }) {
  const coreM = (coreInches / 12) * 0.3048       // convert to meters
  const foamM = (2.625 / 12) * 0.3048
  const totalW = coreM + foamM * 2
  const blockH = (18 / 12) * 0.3048
  const blockL = (96 / 12) * 0.3048

  return (
    <group position={position}>
      {/* Left foam */}
      <mesh position={[-(coreM / 2 + foamM / 2), 0, 0]} castShadow>
        <boxGeometry args={[foamM, blockH - 0.01, blockL - 0.01]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.9} metalness={0} />
      </mesh>
      {/* Right foam */}
      <mesh position={[(coreM / 2 + foamM / 2), 0, 0]} castShadow>
        <boxGeometry args={[foamM, blockH - 0.01, blockL - 0.01]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.9} metalness={0} />
      </mesh>
      {/* Concrete core (glass-like) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[coreM, blockH - 0.02, blockL - 0.02]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.4} metalness={0.1} transparent opacity={0.7} />
      </mesh>
      {/* Web ties */}
      {[-blockL * 0.35, 0, blockL * 0.35].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[0, 0, 0]}>
          <boxGeometry args={[totalW, 0.008, 0.008]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// Rebar rod
function Rebar({ start, end, radius = 0.008 }) {
  const dir = new THREE.Vector3().subVectors(
    new THREE.Vector3(...end),
    new THREE.Vector3(...start)
  )
  const length = dir.length()
  const mid = new THREE.Vector3(
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  )
  const quaternion = new THREE.Quaternion()
  dir.normalize()
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)

  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color="#b45309" roughness={0.6} metalness={0.8} />
    </mesh>
  )
}

// Full ICF wall section (4 courses × 3 blocks wide)
function ICFWall({ coreInches = 6, tealColor = '#14b8a6', showRebar = true }) {
  const blockH = (18 / 12) * 0.3048
  const blockL = (96 / 12) * 0.3048
  const courses = 4
  const blocksWide = 3

  const blocks = useMemo(() => {
    const result = []
    for (let c = 0; c < courses; c++) {
      for (let b = 0; b < blocksWide; b++) {
        // Offset every other course by half a block (running bond)
        const xOffset = c % 2 === 0 ? 0 : blockL / 2
        result.push({
          key: `${c}-${b}`,
          pos: [0, c * blockH, b * blockL - blockL + xOffset],
        })
      }
    }
    return result
  }, [blockH, blockL])

  // Rebar runs: horizontal every course, vertical every 24"
  const rebarH = useMemo(() => {
    const bars = []
    const wallZ = blocksWide * blockL
    for (let c = 0; c < courses; c++) {
      const y = c * blockH + blockH * 0.25
      bars.push({ start: [0, y, -blockL * 0.5], end: [0, y, wallZ - blockL * 0.5] })
      bars.push({ start: [0, y + blockH * 0.5, -blockL * 0.5], end: [0, y + blockH * 0.5, wallZ - blockL * 0.5] })
    }
    return bars
  }, [courses, blockH, blockL, blocksWide])

  const rebarV = useMemo(() => {
    const bars = []
    const totalH = courses * blockH
    const spacing = blockL
    for (let i = 0; i < blocksWide * 2; i++) {
      const z = i * spacing * 0.5 - blockL * 0.5
      bars.push({ start: [0, 0, z], end: [0, totalH, z] })
    }
    return bars
  }, [courses, blockH, blockL, blocksWide])

  return (
    <group>
      {blocks.map(({ key, pos }) => (
        <ICFBlock key={key} position={pos} coreInches={coreInches} color={tealColor} />
      ))}
      {showRebar && rebarH.map((r, i) => (
        <Rebar key={`rh-${i}`} start={r.start} end={r.end} />
      ))}
      {showRebar && rebarV.map((r, i) => (
        <Rebar key={`rv-${i}`} start={r.start} end={r.end} radius={0.006} />
      ))}
    </group>
  )
}

// Animated camera orbit on initial load
function AutoOrbit({ enabled }) {
  const ref = useRef(0)
  useFrame((state) => {
    if (!enabled) return
    ref.current += 0.003
    state.camera.position.x = Math.sin(ref.current) * 4
    state.camera.position.z = Math.cos(ref.current) * 4
    state.camera.lookAt(0, 0.6, 0)
  })
  return null
}

export default function ICFWallModel({ coreInches = 6, autoOrbit = false }) {
  return (
    <Canvas
      shadows
      camera={{ position: [3.5, 2.5, 3.5], fov: 45 }}
      gl={{ antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 4, -3]} intensity={0.4} color="#00d4c8" />

      <ICFWall coreInches={coreInches} />

      <Grid
        position={[0, -0.02, 0]}
        args={[10, 10]}
        cellColor="#1a2633"
        sectionColor="#14b8a6"
        sectionSize={3}
        fadeDistance={12}
      />

      <Environment preset="city" />
      <AutoOrbit enabled={autoOrbit} />
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0.6, 0]}
      />
    </Canvas>
  )
}
