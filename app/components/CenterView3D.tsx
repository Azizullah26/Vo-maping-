"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import * as THREE from "three"
import { X, RotateCw } from "lucide-react"
import Image from "next/image"

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext("2d")
    if (context) {
      context.fillStyle = "#808080"
      context.fillRect(0, 0, 256, 256)
      for (let i = 0; i < 1000; i++) {
        context.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`
        context.fillRect(Math.random() * 256, Math.random() * 256, 2, 2)
      }
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture
        child.material.needsUpdate = true
      }
    })
  }, [scene, texture])

  return <primitive object={scene} scale={0.01} />
}

interface CenterView3DProps {
  project: {
    name: string
    glbFile: string
  }
  onClose: () => void
}

export function CenterView3D({ project, onClose }: CenterView3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [is360View, setIs360View] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const toggle360View = () => {
    setIs360View(!is360View)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={containerRef} className="relative w-[80vw] h-[80vh] bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>
        <button
          onClick={toggle360View}
          className="absolute top-4 right-16 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <RotateCw className="w-6 h-6" />
          <span className="sr-only">{is360View ? "Disable" : "Enable"} 360° View</span>
        </button>
        <button
          className="absolute top-4 right-28 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 cursor-not-allowed"
          title="VR mode (coming soon)"
        >
          <Image
            src="/images/design-mode/vr.png"
            alt="VR Mode"
            width={24}
            height={24}
          />
          <span className="sr-only">VR Mode (coming soon)</span>
        </button>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} onCreated={() => setIsLoading(false)}>
          <Environment preset="sunset" background />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Model url={project.glbFile} />
          {is360View ? (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableDamping
              dampingFactor={0.2}
              autoRotate
              autoRotateSpeed={-1}
            />
          ) : (
            <OrbitControls />
          )}
        </Canvas>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <p className="text-lg font-semibold">Loading 3D model...</p>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-md shadow-md">
          <h3 className="text-lg font-semibold">{project.name}</h3>
        </div>
      </div>
    </div>
  )
}
