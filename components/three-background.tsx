"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Stars } from "@react-three/drei"

export default function ThreeBackground() {
  return (
    <Canvas className="fixed inset-0 z-0" camera={{ position: [0, 0, 15], fov: 60 }}>
      <color attach="background" args={["#050510"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3366ff" />

      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />

      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}

// Optimized particle field animation

// Debounced resize handler

// Tab visibility check
