"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, ImageIcon, Video, FileText, Eye } from "lucide-react"

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
    thumbnail:
      "https://images.pexels.com/photos/32826199/pexels-photo-32826199.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    size: 2048576, // 2MB
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
    thumbnail:
      "https://images.pexels.com/photos/6473973/pexels-photo-6473973.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    size: 15728640, // 15MB
    uploadDate: "2024-01-12",
    project: "7-projects",
    tags: ["construction", "progress", "timelapse"],
    description: "Weekly construction progress documentation",
  },
  {
    id: "3",
    name: "Project Specifications Document",
    type: "document",
    url: "/placeholder-document.pdf",
    thumbnail:
      "https://images.pexels.com/photos/32886453/pexels-photo-32886453.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    size: 1048576, // 1MB
    uploadDate: "2024-01-10",
    project: "2-projects",
    tags: ["specifications", "technical", "planning"],
    description: "Detailed project specifications and requirements",
  },
  {
    id: "4",
    name: "Al Ain Oasis Aerial Photography",
    type: "image",
    url: "https://images.pexels.com/photos/27251844/pexels-photo-27251844.png",
    thumbnail:
      "https://images.pexels.com/photos/27251844/pexels-photo-27251844.png?auto=compress&cs=tinysrgb&w=300&h=200",
    size: 3145728, // 3MB
    uploadDate: "2024-01-08",
    project: "1-project",
    tags: ["aerial", "oasis", "landscape"],
    description: "Drone photography of Al Ain Oasis showing the natural landscape",
  },
  {
    id: "5",
    name: "Police Station Interior Design",
    type: "image",
    url: "https://images.pexels.com/photos/32898130/pexels-photo-32898130.jpeg",
    thumbnail:
      "https://images.pexels.com/photos/32898130/pexels-photo-32898130.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    size: 1572864, // 1.5MB
    uploadDate: "2024-01-05",
    project: "al-saad-police",
    tags: ["interior", "police", "design"],
    description: "Interior design concept for Al Saad Police Center",
  },
]

export default function MediaPage() {
  const router = useRouter()
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems)
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(mockMediaItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-blue-100 text-blue-800"
      case "document":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-950 via-slate-900 to-[#0b1020] text-white pb-20 md:pb-6">
      {/* Header */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.08),transparent_60%)] pointer-events-none z-0"></div>
      <div className="relative z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-cyan-100 hover:bg-cyan-600/20 border border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Al Ain
            </Button>
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-center sm:text-left">
                Media Gallery
              </h1>
              <p className="text-cyan-300 text-sm sm:text-base text-center sm:text-left">
                Browse project media and documents
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        {/* Filters */}
        <Card className="mb-4 sm:mb-6 bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_10px_40px_-15px_rgba(14,165,233,0.25)]">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Search */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <Input
                    placeholder="Search media..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 sm:h-9 bg-white/10 border-white/10 text-white placeholder-white/60 focus:border-cyan-400 focus:ring-cyan-400 transition-all duration-300 text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="w-full sm:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 sm:h-9 bg-white/10 border-white/10 text-white hover:border-cyan-400/40 transition-all duration-300 text-base sm:text-sm">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/90 backdrop-blur-md border-white/10">
                    <SelectItem value="all" className="text-white hover:bg-white/10 text-base sm:text-sm">
                      All Types
                    </SelectItem>
                    <SelectItem value="image" className="text-white hover:bg-white/10 text-base sm:text-sm">
                      Images
                    </SelectItem>
                    <SelectItem value="video" className="text-white hover:bg-white/10 text-base sm:text-sm">
                      Videos
                    </SelectItem>
                    <SelectItem value="document" className="text-white hover:bg-white/10 text-base sm:text-sm">
                      Documents
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Filter */}
              <div className="w-full md:w-48">{/* Project filter implementation goes here */}</div>
            </div>
          </CardContent>
        </Card>

        {/* Media Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="bg-white/5 backdrop-blur-md ring-1 ring-white/10 hover:ring-cyan-400/40 shadow-[0_10px_40px_-15px_rgba(14,165,233,0.35)] transition-all duration-300"
            >
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-start sm:items-center gap-2 text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text font-bold text-sm sm:text-base leading-tight">
                  <span className="flex-shrink-0 mt-1 sm:mt-0">{getTypeIcon(item.type)}</span>
                  <span className="break-words">{item.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                {/* Thumbnail */}
                {item.thumbnail && (
                  <div className="mb-3 sm:mb-4">
                    <div className="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=300&text=Image+Not+Found"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-cyan-300">Uploaded on {item.uploadDate}</p>
                    <p className="text-xs sm:text-sm text-cyan-300">Size: {formatFileSize(item.size)}</p>
                    {item.project && <p className="text-xs sm:text-sm text-purple-300">Project: {item.project}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 p-3 rounded-xl bg-gradient-to-br from-white/10 via-cyan-500/5 to-blue-500/10 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(14,165,233,0.15)]">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-400 shadow-md shadow-cyan-400/30 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 text-xs px-2 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-9 sm:h-8 bg-gradient-to-r from-cyan-600 to-blue-600 border-white/10 text-white hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
