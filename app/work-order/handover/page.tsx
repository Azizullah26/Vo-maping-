"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, HandHeart, Plus, CheckCircle, Clock, AlertTriangle, FileText, Calendar } from "lucide-react"

export default function HandoverPage() {
  const router = useRouter()

  const handovers = [
    {
      id: "HO-001",
      project: "Al Ain Hospital Renovation",
      client: "Al Ain Municipality",
      status: "Completed",
      handoverDate: "2024-01-10",
      completionRate: 100,
      documentsCount: 24,
      checklistItems: 18,
      completedItems: 18,
    },
    {
      id: "HO-002",
      project: "Abu Dhabi Police Station",
      client: "Abu Dhabi Police",
      status: "In Progress",
      handoverDate: "2024-01-25",
      completionRate: 75,
      documentsCount: 20,
      checklistItems: 16,
      completedItems: 12,
    },
    {
      id: "HO-003",
      project: "Dubai Metro Extension",
      client: "Dubai Metro Authority",
      status: "Pending",
      handoverDate: "2024-02-15",
      completionRate: 45,
      documentsCount: 32,
      checklistItems: 22,
      completedItems: 10,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "Pending":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <HandHeart className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return "bg-green-600"
    if (rate >= 50) return "bg-yellow-600"
    return "bg-red-600"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Site Handover</h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                Manage site handover processes and documentation
              </p>
            </div>
          </div>
          <button className="bg-slate-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center text-sm whitespace-nowrap">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="sm:hidden">Handover</span>
            <span className="hidden sm:inline">New Handover</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-slate-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">76</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Handovers List */}
      <div className="p-4">
        <div className="space-y-6">
          {handovers.map((handover) => (
            <div
              key={handover.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {getStatusIcon(handover.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{handover.project}</h3>
                    <p className="text-sm text-gray-600">{handover.client}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(handover.status)}`}>
                    {handover.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{handover.id}</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{handover.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(handover.completionRate)}`}
                    style={{ width: `${handover.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">DOCUMENTS</span>
                  </div>
                  <p className="text-xl font-bold text-blue-700 mt-1">{handover.documentsCount}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">CHECKLIST</span>
                  </div>
                  <p className="text-xl font-bold text-green-700 mt-1">
                    {handover.completedItems}/{handover.checklistItems}
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">HANDOVER DATE</span>
                  </div>
                  <p className="text-lg font-bold text-purple-700 mt-1">{handover.handoverDate}</p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <HandHeart className="h-5 w-5 text-orange-600" />
                    <span className="text-xs text-orange-600 font-medium">STATUS</span>
                  </div>
                  <p className="text-lg font-bold text-orange-700 mt-1">{handover.status}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                  View Details
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Download Package
                </button>
                {handover.status !== "Completed" && (
                  <button className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                    Update Progress
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
