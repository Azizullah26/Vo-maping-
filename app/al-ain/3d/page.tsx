"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Maximize2, RotateCcw, Search, ImageIcon } from "lucide-react"

const models = {
  buildings: [
    {
      id: 1,
      name: "Al Ain Police Headquarters",
      thumbnail: "/al-ain-grand-entrance.png",
      type: "info",
      description: "Modern police headquarters with advanced security features",
    },
    {
      id: 2,
      name: "Al Saad Police Station",
      thumbnail: "/al-ain-street-surveillance.png",
      type: "info",
      description: "Community police station serving the Al Saad district",
    },
    {
      id: 3,
      name: "Al Ain Smart City Center",
      thumbnail: "/al-ain-oasis-cityscape.png",
      type: "info",
      description: "Central monitoring facility for city-wide surveillance",
    },
    {
      id: 4,
      name: "Surveillance Command Center",
      thumbnail: "/al-ain-city-traffic.png",
      type: "info",
      description: "Main command center for coordinating security operations",
    },
  ],
  "2d-view": [
    {
      id: 1,
      name: "RoomSketcher Floor Plan",
      thumbnail:
        "https://wpmedia.roomsketcher.com/content/uploads/2021/12/09125223/RoomSketcher-Sample-House-Plan-800x600-1-768x716.jpg",
      url: "https://wpmedia.roomsketcher.com/content/uploads/2021/12/09125223/RoomSketcher-Sample-House-Plan-800x600-1-768x716.jpg",
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
      type: "info",
    },
    {
      id: 7,
      name: "Security Gate",
      thumbnail: "/al-ain-grand-entrance.png",
      type: "info",
    },
  ],
}

export default function ThreeDPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("buildings")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [imageRotation, setImageRotation] = useState(0)

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Get current models based on active tab
  const currentModels = models[activeTab as keyof typeof models] || []

  const isImageModel =
    selectedModel?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    selectedModel?.includes("/al-ain-") ||
    selectedModel?.includes("templacity.com")

  const selectedModelData = selectedModel
    ? Object.values(models)
        .flat()
        .find((model) => model.url === selectedModel)
    : null

  // Set the 2D view as the default active tab and select the floor plan by default
  useEffect(() => {
    if (!selectedModel) {
      setActiveTab("2d-view")
      setSelectedModel(
        "https://wpmedia.roomsketcher.com/content/uploads/2021/12/09125223/RoomSketcher-Sample-House-Plan-800x600-1-768x716.jpg",
      )
    }
    // Reset rotation when model changes
    setImageRotation(0)
  }, [selectedModel])

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-slate-800 p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 md:gap-0 border-b border-cyan-500/30 mx-2 sm:mx-4 md:mx-6 lg:mx-8 rounded-lg shadow-lg mt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-cyan-400" />
          </button>
          <h1 className="text-xl font-bold text-cyan-400">3D Models</h1>
        </div>
        <div className="relative w-full sm:w-auto">
          <div
            className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-full sm:w-48 md:w-64 lg:w-72" : "w-10"}`}
          >
            <input
              type="text"
              placeholder={isSearchExpanded ? "Search models..." : ""}
              className={`bg-slate-700 border border-slate-600 rounded-full py-2 text-sm focus:outline-none focus:border-cyan-500 transition-all duration-300 ease-in-out ${
                isSearchExpanded ? "pl-10 pr-4 w-full opacity-100" : "pl-2 pr-2 w-10 opacity-0 cursor-pointer"
              }`}
              onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
              onBlur={(e) => {
                if (!e.target.value) {
                  setIsSearchExpanded(false)
                }
              }}
            />
            <Search
              className={`absolute top-2.5 h-4 w-4 text-slate-400 transition-all duration-300 cursor-pointer ${
                isSearchExpanded ? "left-3" : "left-3"
              }`}
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* 3D Viewer */}
        <div
          className={`${isFullscreen ? "fixed inset-0 z-50 bg-slate-900" : "w-full md:w-2/3"} bg-slate-800 rounded-lg border border-slate-700 overflow-hidden`}
        >
          <div className="flex justify-between items-center p-3 border-b border-slate-700">
            <h2 className="text-cyan-400 font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {selectedModelData?.name || "Viewer"}
            </h2>
            <div className="flex gap-2">
              <button
                className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                onClick={() => {
                  // For images, rotate by 90 degrees
                  setImageRotation((prev) => prev + 90)
                }}
                title="Rotate Image"
              >
                <RotateCcw className="h-4 w-4 text-cyan-400" />
              </button>
              <button
                className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <Maximize2 className="h-4 w-4 text-cyan-400" />
              </button>
            </div>
          </div>
          <div className="h-[400px] relative">
            <iframe
              width="100%"
              height="100%"
              src="https://gallery.roomsketcher.com/360/?gid=23038496&play=0&logo=1&title=1&toolbar=1"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        {selectedModelData && (
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <h3 className="text-cyan-400 text-sm font-medium mb-1">About this building</h3>
            <p className="text-slate-200 text-xs">{selectedModelData.description || "No description available."}</p>
            <div className="mt-2 text-xs text-slate-400">
              <span className="inline-block px-2 py-0.5 bg-slate-800 rounded mr-2">2D View</span>
            </div>
          </div>
        )}

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
                      <p className="text-xs text-slate-400">{model.type === "image" ? "2D Image" : "Information"}</p>
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
