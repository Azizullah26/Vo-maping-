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

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center p-4">
        {scene ? (
          <primitive ref={modelRef} object={scene} scale={0.01} />
        ) : (
          <>
            <p className="text-gray-600">3D Model Viewer Unavailable</p>
            <p className="text-xs text-gray-400 mt-2">Model: {url.split("/").pop()}</p>
          </>
        )}
      </div>
    </div>
  )
}
