"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calculator, Plus, Banknote, Clock, Users } from "lucide-react"

export default function EstimationPage() {
  const router = useRouter()

  const estimates = [
    {
      id: "EST-001",
      project: "Al Ain Hospital Renovation",
      totalCost: 9187500,
      laborCost: 2940000,
      materialCost: 4410000,
      equipmentCost: 1837500,
      duration: "6 months",
      workers: 25,
      status: "Approved",
    },
    {
      id: "EST-002",
      project: "Abu Dhabi Police Station",
      totalCost: 6615000,
      laborCost: 2205000,
      materialCost: 3307500,
      equipmentCost: 1102500,
      duration: "4 months",
      workers: 18,
      status: "Under Review",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Project Estimation</h1>
              <p className="text-sm sm:text-base text-gray-600">Calculate and manage project costs</p>
            </div>
          </div>
          <button className="bg-emerald-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Estimate</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Estimates List */}
      <div className="p-4">
        <div className="space-y-6">
          {estimates.map((estimate) => (
            <div
              key={estimate.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calculator className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{estimate.project}</h3>
                    <p className="text-sm text-gray-600">{estimate.id}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    estimate.status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {estimate.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Banknote className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-medium">TOTAL</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">AED {estimate.totalCost.toLocaleString()}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">LABOR</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700 mt-2">AED {estimate.laborCost.toLocaleString()}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">DURATION</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700 mt-2">{estimate.duration}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-orange-600" />
                    <span className="text-xs text-orange-600 font-medium">WORKERS</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-700 mt-2">{estimate.workers}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Cost Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between sm:block">
                    <span className="text-gray-600">Materials:</span>
                    <span className="font-medium sm:ml-2">AED {estimate.materialCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-gray-600">Equipment:</span>
                    <span className="font-medium sm:ml-2">AED {estimate.equipmentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-gray-600">Labor:</span>
                    <span className="font-medium sm:ml-2">AED {estimate.laborCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
