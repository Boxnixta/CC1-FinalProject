import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useMouse } from '../useMouse'

export default function SootSprite() {
  const groupRef = useRef()
  const leftPupilRef = useRef()
  const rightPupilRef = useRef()
  const { viewport } = useThree()
  const mouse = useMouse()
  const squareRefs = useRef(Array.from({ length: 9 }, () => React.createRef()))
  const lastUpdate = useRef(0)
  const lastMousePos = useRef({ x: 0, y: 0 })

  const squareOffsets = useMemo(() => [
    { x: -0.20, y:  0.10, z:  0.02 },
    { x:  0.12, y: -0.03, z: -0.01 },
    { x: -0.05, y: -0.07, z:  0.03 },
    { x:  0.18, y:  0.12, z: -0.02 },
    { x: -0.18, y: -0.05, z:  0.01 },
    { x:  0.05, y:  0.18, z: -0.03 },
    { x:  0.00, y: -0.05, z:  0.02 },
    { x: -0.10, y:  0.15, z: -0.01 },
    { x:  0.20, y: -0.06, z:  0.00 },
  ], [])

  useFrame(() => {
    const targetX = (mouse.current.x * viewport.width) / 2
    const targetY = (mouse.current.y * viewport.height) / 2

    if (groupRef.current) {
      groupRef.current.position.x += ((targetX + 0.1) - groupRef.current.position.x) * 0.1
      groupRef.current.position.y += ((targetY - 0.1) - groupRef.current.position.y) * 0.1
    }

    if (leftPupilRef.current && rightPupilRef.current) {
      const pupilRange = 0.03
      const starLocalX = (targetX - groupRef.current.position.x) / 0.4
      const starLocalY = (targetY - groupRef.current.position.y) / 0.4
      const leftEyeX = -0.15
      const leftEyeY = 0.1
      const leftDx = starLocalX - leftEyeX
      const leftDy = starLocalY - leftEyeY
      const leftDist = Math.sqrt(leftDx * leftDx + leftDy * leftDy)
      leftPupilRef.current.position.x = leftEyeX + (leftDx / leftDist) * Math.min(leftDist, pupilRange)
      leftPupilRef.current.position.y = leftEyeY + (leftDy / leftDist) * Math.min(leftDist, pupilRange)

      const rightEyeX = 0.15
      const rightEyeY = 0.1
      const rightDx = starLocalX - rightEyeX
      const rightDy = starLocalY - rightEyeY
      const rightDist = Math.sqrt(rightDx * rightDx + rightDy * rightDy)
      rightPupilRef.current.position.x = rightEyeX + (rightDx / rightDist) * Math.min(rightDist, pupilRange)
      rightPupilRef.current.position.y = rightEyeY + (rightDy / rightDist) * Math.min(rightDist, pupilRange)
    }

    const now = Date.now()
    const mouseMoved = 
      Math.abs(mouse.current.x - lastMousePos.current.x) > 0.001 ||
      Math.abs(mouse.current.y - lastMousePos.current.y) > 0.001

    if (mouseMoved && now - lastUpdate.current > 100) {
      lastUpdate.current = now
      lastMousePos.current = { x: mouse.current.x, y: mouse.current.y }
      squareRefs.current.forEach((ref, i) => {
        if (ref.current) {
          ref.current.position.x = squareOffsets[i].x + (Math.random() - 0.5) * 0.25
          ref.current.position.y = squareOffsets[i].y + (Math.random() - 0.5) * 0.25
        }
      })
    }
  })

  return (
    <group ref={groupRef} scale={[0.4, 0.4, 0.4]}>
      {squareOffsets.map((offset, i) => (
        <mesh key={i} ref={squareRefs.current[i]} position={[offset.x, offset.y, offset.z]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshBasicMaterial color="#0000ff" toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[-0.15, 0.1, 0.2]}>
        <circleGeometry args={[0.09, 32]} />
        <meshBasicMaterial color="white" toneMapped={false} />
      </mesh>
      <mesh ref={leftPupilRef} position={[-0.15, 0.1, 0.25]}>
        <circleGeometry args={[0.05, 32]} />
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>
      <mesh position={[0.15, 0.1, 0.2]}>
        <circleGeometry args={[0.09, 32]} />
        <meshBasicMaterial color="white" toneMapped={false} />
      </mesh>
      <mesh ref={rightPupilRef} position={[0.15, 0.1, 0.25]}>
        <circleGeometry args={[0.05, 32]} />
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>
    </group>
  )
}