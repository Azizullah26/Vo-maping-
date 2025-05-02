"use client"

import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Group } from "three"

export default function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5
    }
  })

  return <primitive ref={modelRef} object={scene} scale={0.01} />
}
