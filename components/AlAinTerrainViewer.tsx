"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, RotateCcw, ZoomIn, ZoomOut, Home, Play, Pause } from "lucide-react"
import * as THREE from "three"

interface AlAinTerrainViewerProps {
  className?: string
}

export default function AlAinTerrainViewer({ className = "" }: AlAinTerrainViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("Initializing 3D viewer...")
  const [isPlaying, setIsPlaying] = useState(false)

  const initializeThreeJSViewer = async () => {
    if (!viewerRef.current) return

    try {
      setLoadingMessage("Setting up 3D scene...")

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x87ceeb)

      const camera = new THREE.PerspectiveCamera(
        75,
        viewerRef.current.clientWidth / viewerRef.current.clientHeight,
        0.1,
        1000,
      )
      camera.position.set(0, 50, 100)
      camera.lookAt(0, 0, 0)

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      viewerRef.current.appendChild(renderer.domElement)

      const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(50, 50, 50)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      scene.add(directionalLight)

      setLoadingMessage("Creating terrain...")

      const terrainGeometry = new THREE.PlaneGeometry(200, 200, 50, 50)
      const vertices = terrainGeometry.attributes.position.array

      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i]
        const z = vertices[i + 2]
        vertices[i + 1] = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5 + Math.random() * 2
      }

      terrainGeometry.attributes.position.needsUpdate = true
      terrainGeometry.computeVertexNormals()

      const terrainMaterial = new THREE.MeshLambertMaterial({
        color: 0x8b7355,
        wireframe: false,
      })

      const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
      terrain.rotation.x = -Math.PI / 2
      terrain.receiveShadow = true
      scene.add(terrain)

      setLoadingMessage("Adding 3D structures...")

      for (let i = 0; i < 10; i++) {
        const buildingGeometry = new THREE.BoxGeometry(
          Math.random() * 5 + 2,
          Math.random() * 10 + 5,
          Math.random() * 5 + 2,
        )
        const buildingMaterial = new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.1, 0.5, 0.7),
        })
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial)

        building.position.set(
          (Math.random() - 0.5) * 80,
          buildingGeometry.parameters.height / 2,
          (Math.random() - 0.5) * 80,
        )
        building.castShadow = true
        building.receiveShadow = true
        scene.add(building)
      }

      sceneRef.current = scene
      rendererRef.current = renderer
      cameraRef.current = camera

      const animate = () => {
        requestAnimationFrame(animate)

        if (isPlaying) {
          camera.position.x = Math.sin(Date.now() * 0.001) * 100
          camera.position.z = Math.cos(Date.now() * 0.001) * 100
          camera.lookAt(0, 0, 0)
        }

        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        if (viewerRef.current && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = viewerRef.current.clientWidth / viewerRef.current.clientHeight
          cameraRef.current.updateProjectionMatrix()
          rendererRef.current.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight)
        }
      }
      window.addEventListener("resize", handleResize)

      setIsLoading(false)
      setError(null)
    } catch (err) {
      console.error("Error initializing Three.js viewer:", err)
      setError("Failed to initialize 3D viewer. Please try again.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initViewer = async () => {
      try {
        await initializeThreeJSViewer()
      } catch (err) {
        console.error("Error initializing Three.js viewer:", err)
        setError("Failed to load 3D viewer. Please refresh the page.")
        setIsLoading(false)
      }
    }

    initViewer()

    return () => {
      if (rendererRef.current && viewerRef.current) {
        viewerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
      sceneRef.current = null
      rendererRef.current = null
      cameraRef.current = null
    }
  }, [])

  const handleZoomIn = () => {
    if (cameraRef.current) {
      const camera = cameraRef.current
      const direction = new THREE.Vector3()
      camera.getWorldDirection(direction)
      camera.position.add(direction.multiplyScalar(5))
    }
  }

  const handleZoomOut = () => {
    if (cameraRef.current) {
      const camera = cameraRef.current
      const direction = new THREE.Vector3()
      camera.getWorldDirection(direction)
      camera.position.add(direction.multiplyScalar(-5))
    }
  }

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 50, 100)
      cameraRef.current.lookAt(0, 0, 0)
    }
  }

  const handleHome = () => {
    handleReset()
  }

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
  }

  if (error) {
    return (
      <Card className={`w-full h-[600px] ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`relative w-full h-[600px] ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Card className="p-6">
            <CardContent className="flex items-center space-x-4">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>{loadingMessage}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <div ref={viewerRef} className="w-full h-full" />

      {!isLoading && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <Button size="sm" variant="secondary" onClick={handleZoomIn} className="bg-white/90 hover:bg-white">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleZoomOut} className="bg-white/90 hover:bg-white">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleReset} className="bg-white/90 hover:bg-white">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleHome} className="bg-white/90 hover:bg-white">
            <Home className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleAnimation} className="bg-white/90 hover:bg-white">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {!isLoading && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-white/90">
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm">Al Ain 3D Terrain</h3>
              <p className="text-xs text-gray-600">Interactive 3D visualization</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
