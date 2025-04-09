"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Canvas, useThree } from "@react-three/fiber"
import { Text3D, Center, Environment } from "@react-three/drei"
import type { Group } from "three"

function Logo() {
  const group = useRef<Group>(null)
  const { viewport } = useThree()

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  return (
    <group ref={group}>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.6}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          VS
          <meshStandardMaterial
            color="#ff3d00"
            emissive="#ff3d00"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  )
}

export default function VogueScriptLogo() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Logo />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
