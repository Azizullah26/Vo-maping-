"use client"

import { useState } from "react"
import { ChevronLeft, Film, ImageIcon, Video, FileVideo, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MediaPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos" | "3d">("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample media data
  const mediaItems = [
    {
      id: 1,
      type: "image",
      title: "Al Ain Oasis Aerial View",
      thumbnail: "/al-ain-oasis-cityscape.png",
      date: "2023-12-15",
      size: "4.2 MB",
    },
    {
      id: 2,
      type: "video",
      title: "Al Ain City Traffic Timelapse",
      thumbnail: "/al-ain-city-traffic.png",
      date: "2023-11-28",
      duration: "00:45",
      size: "28.7 MB",
    },
    {
      id: 3,
      type: "image",
      title: "Police Station Entrance",
      thumbnail: "/al-ain-grand-entrance.png",
      date: "2023-12-10",
      size: "3.8 MB",
    },
    {
      id: 4,
      type: "video",
      title: "Surveillance System Overview",
      thumbnail: "/al-ain-street-surveillance.png",
      date: "2023-12-05",
      duration: "01:22",
      size: "42.1 MB",
    },
    {
      id: 5,
      type: "image",
      title: "Parking Lot Security",
      thumbnail: "/al-ain-parking-lot-daytime.png",
      date: "2023-11-20",
      size: "2.9 MB",
    },
    {
      id: 6,
      type: "3d",
      title: "Police Station 3D Model",
      thumbnail: "/al-ain-grand-entrance.png",
      date: "2023-12-01",
      size: "15.6 MB",
    },
  ]

  // Filter media based on active tab and search term
  const filteredMedia = mediaItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24">
      {/* Header - positioned below map button and logo */}
      <div
        className="bg-slate-800 p-4 flex items-center justify-between border-b border-cyan-500/30 mx-4 rounded-lg shadow-lg"
        style={{ marginTop: "30px" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-cyan-400" />
          </button>
          <h1 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Film className="h-5 w-5" />
            Media Library
          </h1>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-700 rounded-md border border-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 p-4 flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
          }`}
        >
          All Media
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
            activeTab === "images"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
          }`}
        >
          <ImageIcon className="h-4 w-4" /> Images
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
            activeTab === "videos"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
          }`}
        >
          <Video className="h-4 w-4" /> Videos
        </button>
        <button
          onClick={() => setActiveTab("3d")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
            activeTab === "3d"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
          }`}
        >
          <div className="h-4 w-4 border border-current rounded-sm flex items-center justify-center text-[8px]">3D</div>{" "}
          3D Models
        </button>
      </div>

      {/* Media Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-900/20 group"
            >
              <div className="relative aspect-video bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.thumbnail})` }}
                ></div>

                {/* Overlay with type indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {item.type === "video" && (
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 text-cyan-400 text-xs px-2 py-1 rounded flex items-center gap-1">
                    <FileVideo className="h-3 w-3" />
                    {item.duration}
                  </div>
                )}

                {item.type === "3d" && (
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 text-cyan-400 text-xs px-2 py-1 rounded">
                    3D Model
                  </div>
                )}

                {/* Play button for videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                      <div className="h-0 w-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-cyan-400 ml-1"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-white mb-1">{item.title}</h3>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{item.date}</span>
                  <span>{item.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Search className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No media found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
