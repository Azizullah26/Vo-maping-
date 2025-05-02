"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { CuboidIcon as Cube, Radio, FileText } from "lucide-react"
import styles from "@/styles/saadiyat-view.module.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const images = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saa1-NkZAQnNzz2YzyUhZhNsdjFPb8BzQND.png",
    alt: "Louvre Abu Dhabi",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saa2-erCkjj1UQbZs2RUmFUlu8kr3GKg2g0.png",
    alt: "Modern architectural wall",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad3-ZwTbRl501bMabKi9Sgc70ipIt6cEjv.png",
    alt: "Luxury residential development",
  },
]

interface SaadiyatViewProps {
  className?: string
  isVisible: boolean
}

export function SaadiyatView({ className, isVisible }: SaadiyatViewProps) {
  const [showingImage, setShowingImage] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [modelLoaded, setModelLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  const initThreeJS = () => {
    if (!canvasRef.current) return

    console.log("Initializing Three.js scene")

    try {
      const width = canvasRef.current.clientWidth
      const height = canvasRef.current.clientHeight

      // Scene setup
      const scene = new THREE.Scene()
      sceneRef.current = scene
      scene.background = new THREE.Color(0xf0f0f0)

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      cameraRef.current = camera
      camera.position.set(0, 5, 10)

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
      rendererRef.current = renderer
      renderer.setSize(width, height)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(5, 10, 7.5)
      scene.add(directionalLight)

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controlsRef.current = controls
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.screenSpacePanning = false
      controls.minDistance = 3
      controls.maxDistance = 50
      controls.maxPolarAngle = Math.PI / 2

      // Load 3D model
      const loader = new GLTFLoader()
      loader.load(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ImageToStl.com_conceptual%20building-wGqV9KgOZZFe7w0dZ4hQP5FT5BC3NL.glb",
        (gltf) => {
          console.log("3D model loaded successfully")
          modelRef.current = gltf.scene
          scene.add(gltf.scene)

          // Center the model
          const box = new THREE.Box3().setFromObject(gltf.scene)
          const center = box.getCenter(new THREE.Vector3())
          gltf.scene.position.sub(center)

          // Scale the model to fit the view
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 5 / maxDim
          gltf.scene.scale.multiplyScalar(scale)

          // Adjust model position
          gltf.scene.position.y = -2.5

          setModelLoaded(true)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
        },
        (error) => console.error("An error occurred loading the 3D model:", error),
      )

      // Animation loop
      const animate = () => {
        if (controlsRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
          requestAnimationFrame(animate)
          controlsRef.current.update()
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }
      animate()
    } catch (error) {
      console.error("Error initializing Three.js scene:", error)
      setModelLoaded(false)
    }
  }

  useEffect(() => {
    if (!showingImage) {
      initThreeJS()
    }
    return () => {
      if (rendererRef.current) {
        console.log("Disposing of Three.js renderer")
        rendererRef.current.dispose()
      }
      if (modelRef.current && sceneRef.current) {
        console.log("Removing 3D model from scene")
        sceneRef.current.remove(modelRef.current)
      }
      if (controlsRef.current) {
        console.log("Disposing of OrbitControls")
        controlsRef.current.dispose()
      }
    }
  }, [showingImage]) // Removed initThreeJS from dependencies

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && rendererRef.current && cameraRef.current) {
        try {
          const width = canvasRef.current.clientWidth
          const height = canvasRef.current.clientHeight
          rendererRef.current.setSize(width, height)
          cameraRef.current.aspect = width / height
          cameraRef.current.updateProjectionMatrix()
        } catch (error) {
          console.error("Error resizing Three.js scene:", error)
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleView = () => {
    console.log("Toggling view. Current state:", showingImage)
    setShowingImage((prev) => !prev)
  }

  if (!isVisible) return null

  return (
    <div className={cn("fixed left-4 top-4 z-40 w-[400px] bg-white rounded-lg shadow-lg", className)}>
      <Card>
        <CardContent className="p-4">
          <Carousel className="w-full" onSelect={(index) => setActiveIndex(index)}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                    {showingImage ? (
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 400px) 100vw, 400px"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <canvas ref={canvasRef} className="w-full h-full" />
                        {!modelLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
                            <p className="text-gray-800 font-semibold">Loading 3D model...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          <div className="mt-4 space-y-2">
            <h2 className="text-2xl font-bold">Saadiyat Island</h2>
            <p className="text-sm text-muted-foreground">
              Saadiyat Island is a natural island and a tourism-cultural environmentally friendly project for Emirati
              heritage and culture that is located in Abu Dhabi, United Arab Emirates. The project is located in a
              large, low-lying island, 500 metres off the coast of Abu Dhabi island.
            </p>
          </div>
          <ul className={styles.iconList}>
            <li className={styles.iconItem} onClick={toggleView}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <Cube className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>3D/360o</p>
            </li>
            <li className={styles.iconItem}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <Radio className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>Live</p>
            </li>
            <li className={styles.iconItem}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <FileText className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>Documents</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
