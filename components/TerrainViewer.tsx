"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface TerrainViewerProps {
  onError?: (error: Error) => void
}

export default function TerrainViewer({ onError }: TerrainViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x87ceeb) // Sky blue background
      sceneRef.current = scene

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000,
      )
      camera.position.set(0, 5, 10)
      cameraRef.current = camera

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.shadowMap.enabled = true
      containerRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 5, 5)
      directionalLight.castShadow = true
      scene.add(directionalLight)

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controlsRef.current = controls

      // Create terrain
      const terrainGeometry = new THREE.PlaneGeometry(20, 20, 100, 100)
      const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513, // Sandy brown color
        roughness: 0.8,
        metalness: 0.2,
      })

      // Add height variation to the terrain
      const vertices = terrainGeometry.attributes.position.array
      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = Math.random() * 2 // Random height
      }
      terrainGeometry.attributes.position.needsUpdate = true
      terrainGeometry.computeVertexNormals()

      const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
      terrain.rotation.x = -Math.PI / 2
      terrain.receiveShadow = true
      scene.add(terrain)

      // Add palm trees
      const addPalmTree = (x: number, z: number) => {
        // Simple tree geometry as placeholder
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8)
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2810 })
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
        trunk.position.set(x, 1, z)
        trunk.castShadow = true
        scene.add(trunk)

        // Create palm leaves
        const leavesGeometry = new THREE.ConeGeometry(1, 2, 8)
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 })
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial)
        leaves.position.set(x, 2.5, z)
        leaves.castShadow = true
        scene.add(leaves)
      }

      // Add multiple palm trees
      const treePositions = [
        [-5, -5],
        [5, 5],
        [-5, 5],
        [5, -5],
        [0, 0],
      ]
      treePositions.forEach(([x, z]) => addPalmTree(x, z))

      // Add water feature
      const waterGeometry = new THREE.CircleGeometry(2, 32)
      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.6,
      })
      const water = new THREE.Mesh(waterGeometry, waterMaterial)
      water.rotation.x = -Math.PI / 2
      water.position.y = 0.1
      scene.add(water)

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)
        if (controlsRef.current) {
          controlsRef.current.update()
        }
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }
      animate()

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(width, height)
      }
      window.addEventListener("resize", handleResize)

      setIsLoading(false)

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize)
        if (rendererRef.current && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        if (controlsRef.current) {
          controlsRef.current.dispose()
        }
      }
    } catch (error) {
      console.error("Error initializing 3D viewer:", error)
      onError?.(error instanceof Error ? error : new Error("Failed to initialize 3D viewer"))
    }
  }, [onError])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading 3D terrain viewer...</p>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full h-full" />
}
