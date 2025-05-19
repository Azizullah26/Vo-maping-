"use client"

import React from "react"

import { useState, Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CuboidIcon as Cube,
  Download,
  Maximize2,
  RotateCcw,
  Search,
  AlertCircle,
  ImageIcon,
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei"

// Custom Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Fixed 3D Model component that properly uses the useGLTF hook
function Model({ url }: { url: string }) {
  const { scene, nodes, materials } = useGLTF(url)
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
}

// Fallback component to display when model loading fails
function ModelFallback() {
  return (
    <>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#0891b2" wireframe />
      </mesh>
      <Html position={[0, 0, 0]} center>
        <div className="bg-red-900/80 text-white p-3 rounded-md text-center w-48">
          <AlertCircle className="h-5 w-5 mx-auto mb-2" />
          <p className="text-sm">Error loading model</p>
        </div>
      </Html>
    </>
  )
}

export default function ThreeDPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("buildings")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [modelLoadError, setModelLoadError] = useState<string | null>(null)

  // Update the models to use built-in duck.glb with different scales and positions
  const models = {
    buildings: [
      {
        id: 1,
        name: "Modern Office Building",
        thumbnail: "/al-ain-grand-entrance.png",
        url: "/assets/3d/duck.glb",
        type: "glb",
        scale: 2.0,
        position: [0, -1, 0],
      },
      {
        id: 2,
        name: "Police Station",
        thumbnail: "/al-ain-street-surveillance.png",
        url: "/assets/3d/duck.glb",
        type: "glb",
        scale: 1.5,
        position: [0, -1, 0],
      },
      {
        id: 3,
        name: "City Building",
        thumbnail: "/al-ain-oasis-cityscape.png",
        url: "/assets/3d/duck.glb",
        type: "glb",
        scale: 2.5,
        position: [0, -1, 0],
      },
    ],
    "2d-view": [
      {
        id: 1,
        name: "Detailed Floor Plan",
        thumbnail: "https://templacity.com/wp-content/uploads/2025/03/2d-to-3d-floorplan-scaled.jpg",
        url: "https://templacity.com/wp-content/uploads/2025/03/2d-to-3d-floorplan-scaled.jpg",
        type: "image",
      },
      {
        id: 2,
        name: "Police Station Blueprint",
        thumbnail: "/al-ain-street-surveillance.png",
        url: "/al-ain-street-surveillance.png",
        type: "image",
      },
      {
        id: 3,
        name: "City Layout",
        thumbnail: "/al-ain-oasis-cityscape.png",
        url: "/al-ain-oasis-cityscape.png",
        type: "image",
      },
    ],
    equipment: [
      {
        id: 6,
        name: "Security Camera",
        thumbnail: "/al-ain-street-surveillance.png",
        url: "/assets/3d/duck.glb",
        type: "glb",
        scale: 0.8,
        position: [0, -1, 0],
      },
      {
        id: 7,
        name: "Security Gate",
        thumbnail: "/al-ain-grand-entrance.png",
        url: "/assets/3d/duck.glb",
        type: "glb",
        scale: 1.7,
        position: [0, -1, 0],
      },
    ],
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Get current models based on active tab
  const currentModels = models[activeTab as keyof typeof models] || []

  // Check if the selected model is a Sketchfab model or an image
  const isSketchfabModel = selectedModel?.includes("sketchfab.com")
  const isImageModel =
    selectedModel?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    selectedModel?.includes("/al-ain-") ||
    selectedModel?.includes("templacity.com")

  const selectedModelData = selectedModel
    ? Object.values(models)
        .flat()
        .find((model) => model.url === selectedModel)
    : null

  // Function to handle model loading errors
  const handleModelError = (error: Error) => {
    console.error("Model loading error:", error)
    setModelLoadError(error.message)
  }

  // Create a fallback for when model loading fails
  const ViewerFallback = (
    <div className="w-full h-full flex items-center justify-center bg-slate-800">
      <div className="bg-red-900/20 backdrop-blur-sm p-4 rounded-lg border border-red-500/30 text-center w-64">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-white text-sm">Failed to load 3D model</p>
        <p className="text-red-300 text-xs mt-2">{modelLoadError || "Unknown error"}</p>
      </div>
    </div>
  )

  // Set the 2D view as the default active tab and select the floor plan by default
  useEffect(() => {
    if (!selectedModel) {
      setActiveTab("2d-view")
      setSelectedModel("https://templacity.com/wp-content/uploads/2025/03/2d-to-3d-floorplan-scaled.jpg")
    }
  }, [selectedModel])

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24">
      {/* Header */}
      <div
        className="bg-slate-800 p-4 flex items-center justify-between border-b border-cyan-500/30 mx-4 rounded-lg shadow-lg"
        style={{ marginTop: "30px" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-cyan-400" />
          </button>
          <h1 className="text-xl font-bold text-cyan-400">3D Models</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search models..."
            className="bg-slate-700 border border-slate-600 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 w-64"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* 3D Viewer */}
        <div
          className={`${isFullscreen ? "fixed inset-0 z-50 bg-slate-900" : "w-full md:w-2/3"} bg-slate-800 rounded-lg border border-slate-700 overflow-hidden`}
        >
          <div className="flex justify-between items-center p-3 border-b border-slate-700">
            <h2 className="text-cyan-400 font-medium flex items-center gap-2">
              {isImageModel ? <ImageIcon className="h-4 w-4" /> : <Cube className="h-4 w-4" />}
              {selectedModelData?.name || "Viewer"}
            </h2>
            <div className="flex gap-2">
              <button className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors">
                <RotateCcw className="h-4 w-4 text-cyan-400" />
              </button>
              <button
                className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="h-4 w-4 text-cyan-400" />
              </button>
              {selectedModel && (
                <button className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors">
                  <Download className="h-4 w-4 text-cyan-400" />
                </button>
              )}
            </div>
          </div>
          <div className="h-[400px] relative">
            {selectedModel ? (
              isSketchfabModel ? (
                <div className="w-full h-full">
                  <iframe
                    className="w-full h-full"
                    allowFullScreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    xr-spatial-tracking="true"
                    execution-while-out-of-viewport="true"
                    execution-while-not-rendered="true"
                    web-share="true"
                    src={selectedModel}
                  ></iframe>
                </div>
              ) : isImageModel ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 overflow-auto">
                  <img
                    src={selectedModel || "/placeholder.svg"}
                    alt={selectedModelData?.name || "2D View"}
                    className="max-w-full max-h-full object-contain"
                    style={{ cursor: "zoom-in" }}
                    onClick={() => toggleFullscreen()}
                  />
                </div>
              ) : (
                <div className="w-full h-full">
                  <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <Suspense fallback={<ModelFallback />}>
                      <ErrorBoundary fallback={<ModelFallback />}>
                        <Model url={selectedModel} />
                      </ErrorBoundary>
                    </Suspense>
                    <OrbitControls enableZoom={true} />
                    <Environment preset="city" />
                  </Canvas>
                </div>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30 text-center w-64">
                  <Cube className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-white text-sm">Select a model or image from the library to view it here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Model Library */}
        <div
          className={`${isFullscreen ? "hidden" : "w-full md:w-1/3"} bg-slate-800 rounded-lg border border-slate-700 overflow-hidden`}
        >
          <div className="border-b border-slate-700">
            <div className="flex">
              <button
                className={`py-3 px-4 text-sm font-medium ${activeTab === "buildings" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setActiveTab("buildings")}
              >
                Buildings
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${activeTab === "2d-view" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setActiveTab("2d-view")}
              >
                2D View
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${activeTab === "equipment" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setActiveTab("equipment")}
              >
                Equipment
              </button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
            <div className="grid grid-cols-1 gap-3">
              {currentModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-2 rounded-lg border ${selectedModel === model.url ? "border-cyan-500 bg-slate-700" : "border-slate-700 hover:border-slate-500"} cursor-pointer transition-all`}
                  onClick={() => setSelectedModel(model.url)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-700 rounded overflow-hidden">
                      <img
                        src={model.thumbnail || "/placeholder.svg"}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{model.name}</h3>
                      <p className="text-xs text-slate-400">
                        {model.type === "image" ? "2D Image" : `3D Model • ${model.type.toUpperCase()}`}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-xs text-green-400">Ready to view</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
