"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, DraftingCompassIcon as Drafting, Plus, Download, Eye, Edit, Calendar } from "lucide-react"

export default function DrawingPage() {
  const router = useRouter()

  const drawings = [
    {
      id: "DRW-001",
      title: "Hospital Structural Blueprint",
      project: "Al Ain Hospital Renovation",
      category: "Structural",
      version: "Rev 3",
      scale: "1:100",
      lastModified: "2024-01-08",
      size: "8.4 MB",
      format: "DWG",
      thumbnail: "/placeholder.svg?height=150&width=200&text=Structural+Blueprint",
    },
    {
      id: "DRW-002",
      title: "Electrical Wiring Diagram",
      project: "Abu Dhabi Police Station",
      category: "Electrical",
      version: "Rev 2",
      scale: "1:50",
      lastModified: "2024-01-06",
      size: "5.2 MB",
      format: "PDF",
      thumbnail: "/placeholder.svg?height=150&width=200&text=Electrical+Diagram",
    },
    {
      id: "DRW-003",
      title: "HVAC System Layout",
      project: "Dubai Metro Extension",
      category: "Mechanical",
      version: "Rev 1",
      scale: "1:75",
      lastModified: "2024-01-05",
      size: "6.8 MB",
      format: "DWG",
      thumbnail: "/placeholder.svg?height=150&width=200&text=HVAC+Layout",
    },
  ]

  const categories = [
    { name: "All Drawings", count: 3, active: true },
    { name: "Structural", count: 1, active: false },
    { name: "Electrical", count: 1, active: false },
    { name: "Mechanical", count: 1, active: false },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Structural":
        return "bg-blue-100 text-blue-800"
      case "Electrical":
        return "bg-yellow-100 text-yellow-800"
      case "Mechanical":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case "DWG":
        return "bg-orange-100 text-orange-800"
      case "PDF":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Technical Drawings</h1>
              <p className="text-gray-600">Access technical drawings and blueprints</p>
            </div>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Upload Drawing
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-6">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`pb-2 font-medium ${
                category.active ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Drawings Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drawings.map((drawing) => (
            <div
              key={drawing.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={drawing.thumbnail || "/placeholder.svg"}
                  alt={drawing.title}
                  className="w-full h-40 object-cover bg-gray-100"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Category and Format Badges */}
                <div className="absolute top-2 left-2 flex space-x-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(drawing.category)}`}>
                    {drawing.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormatColor(drawing.format)}`}>
                    {drawing.format}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Drafting className="h-5 w-5 text-orange-600 mt-1" />
                  <span className="text-xs text-gray-500">{drawing.id}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{drawing.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{drawing.project}</p>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Version:</span> {drawing.version}
                  </div>
                  <div>
                    <span className="font-medium">Scale:</span> {drawing.scale}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {drawing.size}
                  </div>
                  <div>
                    <span className="font-medium">Format:</span> {drawing.format}
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  Modified {drawing.lastModified}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
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
