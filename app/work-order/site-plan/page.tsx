"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Map, Plus, Download, Eye, Layers, ZoomIn } from "lucide-react"

export default function SitePlanPage() {
  const router = useRouter()

  const sitePlans = [
    {
      id: "SP-001",
      title: "Al Ain Hospital Site Layout",
      project: "Hospital Renovation",
      version: "v2.1",
      lastModified: "2024-01-08",
      size: "4.2 MB",
      type: "Layout Plan",
      thumbnail: "/placeholder.svg?height=150&width=200&text=Hospital+Layout",
    },
    {
      id: "SP-002",
      title: "Abu Dhabi Police Station Floor Plan",
      project: "Station Upgrade",
      version: "v1.5",
      lastModified: "2024-01-06",
      size: "3.8 MB",
      type: "Floor Plan",
      thumbnail: "/placeholder.svg?height=150&width=200&text=Police+Station",
    },
    {
      id: "SP-003",
      title: "Dubai Metro Extension Route",
      project: "Metro Extension",
      version: "v3.0",
      lastModified: "2024-01-05",
      size: "6.1 MB",
      type: "Route Plan",
      thumbnail: "/placeholder.svg?height=150&width=200&text=Metro+Route",
    },
  ]

  const planTypes = [
    { name: "All Plans", count: 3, active: true },
    { name: "Layout Plans", count: 1, active: false },
    { name: "Floor Plans", count: 1, active: false },
    { name: "Route Plans", count: 1, active: false },
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Site Plans</h1>
              <p className="text-gray-600">View and manage site plans and layouts</p>
            </div>
          </div>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Upload Plan
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-6">
          {planTypes.map((type) => (
            <button
              key={type.name}
              className={`pb-2 font-medium ${
                type.active ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {type.name} ({type.count})
            </button>
          ))}
        </div>
      </div>

      {/* Site Plans Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitePlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={plan.thumbnail || "/placeholder.svg"}
                  alt={plan.title}
                  className="w-full h-40 object-cover bg-gray-100"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium">{plan.type}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Map className="h-5 w-5 text-pink-600 mt-1" />
                  <span className="text-xs text-gray-500">{plan.id}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{plan.project}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{plan.version}</span>
                  <span>{plan.size}</span>
                </div>

                <p className="text-xs text-gray-500 mb-4">Modified {plan.lastModified}</p>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Layers className="h-4 w-4" />
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
