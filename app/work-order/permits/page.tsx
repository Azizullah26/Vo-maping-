"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileCheck, Plus, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function PermitsPage() {
  const router = useRouter()

  const permits = [
    {
      id: "PRM-001",
      title: "Building Construction Permit",
      project: "Al Ain Hospital Renovation",
      authority: "Al Ain Municipality",
      status: "Approved",
      applicationDate: "2023-12-15",
      approvalDate: "2024-01-05",
      expiryDate: "2024-12-31",
      type: "Construction",
    },
    {
      id: "PRM-002",
      title: "Environmental Impact Assessment",
      project: "Abu Dhabi Police Station",
      authority: "Environment Authority",
      status: "Under Review",
      applicationDate: "2024-01-01",
      approvalDate: null,
      expiryDate: "2024-06-30",
      type: "Environmental",
    },
    {
      id: "PRM-003",
      title: "Fire Safety Certificate",
      project: "Dubai Metro Extension",
      authority: "Civil Defense",
      status: "Expired",
      applicationDate: "2023-06-01",
      approvalDate: "2023-07-15",
      expiryDate: "2024-01-01",
      type: "Safety",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "Under Review":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "Expired":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <FileCheck className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Construction":
        return "bg-blue-100 text-blue-800"
      case "Environmental":
        return "bg-green-100 text-green-800"
      case "Safety":
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
              <h1 className="text-2xl font-bold text-gray-900">Building Permits</h1>
              <p className="text-gray-600">Track permits and approvals</p>
            </div>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Apply for Permit
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Under Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Expired</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <FileCheck className="h-8 w-8 text-teal-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permits List */}
      <div className="p-4">
        <div className="space-y-4">
          {permits.map((permit) => (
            <div
              key={permit.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {getStatusIcon(permit.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{permit.title}</h3>
                    <p className="text-sm text-gray-600">{permit.project}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(permit.status)}`}>
                    {permit.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(permit.type)}`}>
                    {permit.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Authority:</span>
                  <p className="font-medium text-gray-900">{permit.authority}</p>
                </div>

                <div>
                  <span className="text-gray-600">Applied:</span>
                  <p className="font-medium text-gray-900">{permit.applicationDate}</p>
                </div>

                <div>
                  <span className="text-gray-600">Approved:</span>
                  <p className="font-medium text-gray-900">{permit.approvalDate || "Pending"}</p>
                </div>

                <div>
                  <span className="text-gray-600">Expires:</span>
                  <p className="font-medium text-gray-900">{permit.expiryDate}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{permit.id}</span>

                {permit.status === "Expired" && (
                  <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Renew Permit
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
