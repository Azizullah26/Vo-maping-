"use client"

import { useRef } from "react"

export default function ThreeJSScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={mountRef}
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none flex items-center justify-center"
    >
      <div className="text-center p-4 bg-white/80 rounded-lg">
        <p className="text-gray-600 text-sm">3D Scene Unavailable</p>
      </div>
    </div>
  )
}
