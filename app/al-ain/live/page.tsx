"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Maximize, Minimize, Search, Video, Camera, RefreshCw, Download, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LivePage() {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeCamera, setActiveCamera] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)

  // Camera data
  const cameras = [
    { id: 1, name: "Main Entrance", location: "Al Ain Police HQ", status: "Live", viewers: 12 },
    { id: 2, name: "Parking Area", location: "Al Ain Police HQ", status: "Live", viewers: 8 },
    { id: 3, name: "Reception Hall", location: "Al Ain Police HQ", status: "Live", viewers: 5 },
    { id: 4, name: "Perimeter East", location: "Al Ain Police HQ", status: "Live", viewers: 3 },
    { id: 5, name: "Perimeter West", location: "Al Ain Police HQ", status: "Live", viewers: 2 },
    { id: 6, name: "City Center", location: "Al Ain Downtown", status: "Live", viewers: 24 },
    { id: 7, name: "Traffic Junction A", location: "Al Ain Downtown", status: "Live", viewers: 15 },
    { id: 8, name: "Traffic Junction B", location: "Al Ain Downtown", status: "Live", viewers: 11 },
  ]

  // Filter cameras based on search query
  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeout)
      setShowControls(true)

      timeout = setTimeout(() => {
        if (!isLoading) {
          setShowControls(false)
        }
      }, 5000)
    }

    resetTimer()
    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("click", resetTimer)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("click", resetTimer)
    }
  }, [isLoading])

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
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-cyan-400" />
          </button>
          <h1 className="text-xl font-bold text-cyan-400">Live Camera Feeds</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5 text-cyan-400" />
            ) : (
              <Maximize className="h-5 w-5 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        {/* Main video feed */}
        <div className="lg:col-span-3 bg-slate-800 rounded-lg overflow-hidden border border-cyan-500/20 relative">
          {/* Video container */}
          <div className="relative aspect-video w-full bg-black">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                <div className="text-cyan-400 font-medium">Loading camera feed...</div>
              </div>
            ) : (
              <>
                {/* Video feed */}
                <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                  <source
                    src={
                      activeCamera === 5
                        ? "https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-city-at-night-9559-large.mp4"
                        : activeCamera === 6
                          ? "https://assets.mixkit.co/videos/preview/mixkit-traffic-in-the-city-at-night-4330-large.mp4"
                          : activeCamera === 7
                            ? "https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-rainy-night-4331-large.mp4"
                            : "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-on-a-sunny-day-41693-large.mp4"
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Futuristic overlay elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-cyan-500/20 animate-pulse pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#0c4a6e10_1px,transparent_1px)] bg-[length:20px_20px] opacity-30 pointer-events-none"></div>

                {/* Camera info */}
                <div
                  className={`absolute top-0 left-0 right-0 p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">LIVE</span>
                    </div>
                    <div className="text-xs text-cyan-400 font-mono">
                      {new Date().toLocaleTimeString()} | {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Camera details */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="max-w-[70%]">
                      <h3 className="text-lg font-bold text-white truncate">
                        {cameras[activeCamera]?.name || "Main Camera"}
                      </h3>
                      <p className="text-sm text-gray-300 truncate">
                        {cameras[activeCamera]?.location || "Al Ain"} • {cameras[activeCamera]?.viewers || 0} viewers
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                        aria-label="Refresh feed"
                      >
                        <RefreshCw className="h-5 w-5 text-cyan-400" />
                      </button>
                      <button
                        className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                        aria-label="Download footage"
                      >
                        <Download className="h-5 w-5 text-cyan-400" />
                      </button>
                      <button
                        className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                        aria-label="Share feed"
                      >
                        <Share2 className="h-5 w-5 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* HUD elements */}
                <div className="absolute top-16 right-4 text-xs text-cyan-400 font-mono bg-black/30 px-2 py-1 rounded">
                  CAM-0{activeCamera + 1}
                </div>
                <div className="absolute bottom-16 left-4 text-xs text-cyan-400 font-mono bg-black/30 px-2 py-1 rounded">
                  LAT: 24.2075° N
                </div>
                <div className="absolute bottom-16 right-4 text-xs text-cyan-400 font-mono bg-black/30 px-2 py-1 rounded">
                  LONG: 55.7447° E
                </div>

                {/* Grid lines */}
                <div className="absolute inset-0 border border-cyan-500/10 pointer-events-none"></div>
                <div className="absolute top-1/3 left-0 right-0 h-px bg-cyan-500/10 pointer-events-none"></div>
                <div className="absolute top-2/3 left-0 right-0 h-px bg-cyan-500/10 pointer-events-none"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-cyan-500/10 pointer-events-none"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-cyan-500/10 pointer-events-none"></div>

                {/* Center target */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-8 h-8 border border-cyan-400/30 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Camera list */}
        <div className="bg-slate-800 rounded-lg border border-cyan-500/20 p-4 flex flex-col h-[calc(100vh-16rem)]">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cameras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="flex-1 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-400 py-1 px-3 rounded-lg text-sm font-medium border border-cyan-500/30">
              All
            </button>
            <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-3 rounded-lg text-sm font-medium">
              Indoor
            </button>
            <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-3 rounded-lg text-sm font-medium">
              Outdoor
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-2 space-y-2 force-scrollbar">
            {filteredCameras.length > 0 ? (
              filteredCameras.map((camera, index) => (
                <div
                  key={camera.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    activeCamera === index
                      ? "bg-cyan-900/30 border-cyan-500/50"
                      : "bg-slate-700/50 border-slate-600/50 hover:bg-slate-700"
                  }`}
                  onClick={() => setActiveCamera(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-24 bg-black rounded overflow-hidden flex-shrink-0">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('/al-ain-${
                            index % 5 === 0
                              ? "oasis-cityscape"
                              : index % 5 === 1
                                ? "city-traffic"
                                : index % 5 === 2
                                  ? "street-surveillance"
                                  : index % 5 === 3
                                    ? "grand-entrance"
                                    : "parking-lot-daytime"
                          }.png')`,
                          opacity: 0.7,
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute top-1 right-1 flex items-center">
                        <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse mr-1"></div>
                        <span className="text-[8px] text-white font-medium">LIVE</span>
                      </div>
                      {camera.status === "Live" ? (
                        <Video className="absolute bottom-1 right-1 h-3 w-3 text-cyan-400" />
                      ) : (
                        <Camera className="absolute bottom-1 right-1 h-3 w-3 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">{camera.name}</h3>
                      <p className="text-xs text-slate-400 mb-1">{camera.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-cyan-400">{camera.viewers} viewers</span>
                        <span className="text-[10px] text-slate-500">CAM-0{camera.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                <Search className="h-8 w-8 mb-2 text-slate-500" />
                <p className="text-sm">No cameras found</p>
                <button className="mt-2 text-cyan-400 text-sm hover:underline" onClick={() => setSearchQuery("")}>
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
