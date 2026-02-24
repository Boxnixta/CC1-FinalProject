import { Canvas } from '@react-three/fiber'
import SootSprite from './SootSprite'
import Star from './Star'

export default function CursorCanvas() {
  return (
    <Canvas
      orthographic
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      camera={{ zoom: 200, position: [0, 0, 100] }}
      gl={{ antialias: true, toneMapping: 0 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={5} />
      <SootSprite />
      <Star />
    </Canvas>
  )
}