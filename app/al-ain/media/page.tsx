"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InteractiveMediaGallery } from "@/components/ui/interactive-media-gallery"

interface MediaItem {
  id: string
  name: string
  type: "image" | "video" | "document"
  url: string
  thumbnail?: string
  size: number
  uploadDate: string
  project?: string
  tags: string[]
  description?: string
}

const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    name: "Al Ain Cultural Center - Exterior View",
    type: "image",
    url: "https://images.pexels.com/photos/32826199/pexels-photo-32826199.jpeg",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=400&fit=crop",
    size: 2048576,
    uploadDate: "2024-01-15",
    project: "16-projects",
    tags: ["architecture", "exterior", "cultural-center"],
    description: "Exterior architectural view of the Al Ain Cultural Center showing modern design elements",
  },
  {
    id: "2",
    name: "Construction Progress Video - Week 12",
    type: "video",
    url: "/placeholder-video.mp4",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=400&fit=crop",
    size: 15728640,
    uploadDate: "2024-01-12",
    project: "7-projects",
    tags: ["construction", "progress", "timelapse"],
    description: "Weekly construction progress documentation showing ongoing development",
  },
  {
    id: "3",
    name: "Project Specifications Document",
    type: "document",
    url: "/placeholder-document.pdf",
    thumbnail: "https://images.unsplash.com/photo-1554224311-beee415c15cb?w=500&h=400&fit=crop",
    size: 1048576,
    uploadDate: "2024-01-10",
    project: "2-projects",
    tags: ["specifications", "technical", "planning"],
    description: "Detailed project specifications and technical requirements documentation",
  },
  {
    id: "4",
    name: "Al Ain Oasis Aerial Photography",
    type: "image",
    url: "https://images.pexels.com/photos/27251844/pexels-photo-27251844.png",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
    size: 3145728,
    uploadDate: "2024-01-08",
    project: "1-project",
    tags: ["aerial", "oasis", "landscape"],
    description: "Drone photography of Al Ain Oasis showing the natural landscape and environmental features",
  },
  {
    id: "5",
    name: "Police Station Interior Design",
    type: "image",
    url: "https://images.pexels.com/photos/32898130/pexels-photo-32898130.jpeg",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=400&fit=crop",
    size: 1572864,
    uploadDate: "2024-01-05",
    project: "al-saad-police",
    tags: ["interior", "police", "design"],
    description: "Interior design concept for Al Saad Police Center with modern security features",
  },
]

export default function MediaPage() {
  const router = useRouter()
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems)
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(mockMediaItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")

  useEffect(() => {
    let filtered = mediaItems

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter)
    }

    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter((item) => item.project === projectFilter)
    }

    setFilteredItems(filtered)
  }, [searchTerm, typeFilter, projectFilter, mediaItems])

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_60%)] pointer-events-none z-0"></div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 z-10"></div>

      {/* Header */}
      <div className="relative z-20 sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800/50 border border-cyan-500/30 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Media Gallery
              </h1>
              <p className="text-cyan-300 text-sm sm:text-base">Browse project media and documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative z-20 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col gap-3 sm:gap-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md ring-1 ring-white/10 border border-cyan-500/20 shadow-lg shadow-cyan-900/20 p-4 rounded-lg">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-9 bg-slate-800/50 border-cyan-500/30 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:ring-cyan-400/50"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 sm:h-9 bg-slate-800/50 border-cyan-500/30 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-md border-cyan-500/30">
                  <SelectItem value="all" className="text-white">
                    All Types
                  </SelectItem>
                  <SelectItem value="image" className="text-white">
                    Images
                  </SelectItem>
                  <SelectItem value="video" className="text-white">
                    Videos
                  </SelectItem>
                  <SelectItem value="document" className="text-white">
                    Documents
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="h-10 sm:h-9 bg-slate-800/50 border-cyan-500/30 text-white">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-md border-cyan-500/30">
                  <SelectItem value="all" className="text-white">
                    All Projects
                  </SelectItem>
                  <SelectItem value="1-project" className="text-white">
                    1 Project
                  </SelectItem>
                  <SelectItem value="2-projects" className="text-white">
                    2 Projects
                  </SelectItem>
                  <SelectItem value="7-projects" className="text-white">
                    7 Projects
                  </SelectItem>
                  <SelectItem value="16-projects" className="text-white">
                    16 Projects
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="relative z-10">
        <InteractiveMediaGallery items={filteredItems} onItemSelect={() => {}} />
      </div>
    </div>
  )
}
