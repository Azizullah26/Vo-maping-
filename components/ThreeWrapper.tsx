"use client"

import { useEffect } from "react"
import type React from "react" // Added import for React

interface ThreeWrapperProps {
  modelUrl: string
  map: any
  modelOrigin: [number, number]
  modelAltitude: number
  modelRotate: [number, number, number]
}

const ThreeWrapper: React.FC<ThreeWrapperProps> = () => {
  useEffect(() => {
    console.warn(
      "ThreeWrapper: Three.js has been removed from dependencies to reduce build size. Please add 'three' to package.json if you need 3D functionality.",
    )
  }, [])

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800 text-sm">
        3D functionality is currently unavailable. Three.js was removed to reduce deployment size.
      </p>
    </div>
  )
}

export default ThreeWrapper
