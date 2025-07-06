"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Presentation, Plus, Play, Edit, Share2, Calendar } from "lucide-react"

export default function PresentationPage() {
  const router = useRouter()

  const presentations = [
    {
      id: "PRES-001",
      title: "Al Ain Hospital Project Overview",
      description: "Comprehensive overview of the hospital renovation project",
      slides: 24,
      duration: "15 min",
      lastModified: "2024-01-08",
      thumbnail: "/placeholder.svg?height=120&width=200&text=Hospital+Project",
    },
    {
      id: "PRES-002",
      title: "Q4 Progress Review",
      description: "Quarterly progress review for all active projects",
      slides: 18,
      duration: "12 min",
      lastModified: "2024-01-05",
      thumbnail: "/placeholder.svg?height=120&width=200&text=Q4+Review",
    },
    {
      id: "PRES-003",
      title: "Safety Protocol Training",
      description: "Safety guidelines and protocols for construction sites",
      slides: 32,
      duration: "20 min",
      lastModified: "2024-01-03",
      thumbnail: "/placeholder.svg?height=120&width=200&text=Safety+Training",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Presentations</h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">Create and manage project presentations</p>
            </div>
          </div>
          <button className="bg-amber-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center text-sm whitespace-nowrap">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">New </span>Presentation
          </button>
        </div>
      </div>

      {/* Presentations Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={presentation.thumbnail || "/placeholder.svg"}
                  alt={presentation.title}
                  className="w-full h-32 object-cover bg-gray-100"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
                    <Play className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Presentation className="h-5 w-5 text-amber-600 mt-1" />
                  <span className="text-xs text-gray-500">{presentation.id}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{presentation.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{presentation.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{presentation.slides} slides</span>
                  <span>{presentation.duration}</span>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  Modified {presentation.lastModified}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-amber-600 text-white py-2 px-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center">
                    <Play className="h-4 w-4 mr-1" />
                    Present
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
