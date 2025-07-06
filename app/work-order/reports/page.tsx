"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileBarChart, Download, Eye, Calendar, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  const router = useRouter()

  const reports = [
    {
      id: "RPT-001",
      title: "Monthly Progress Report",
      type: "Progress",
      date: "2024-01-01",
      status: "Generated",
      size: "2.4 MB",
    },
    {
      id: "RPT-002",
      title: "Cost Analysis Report",
      type: "Financial",
      date: "2024-01-05",
      status: "Generating",
      size: "1.8 MB",
    },
    {
      id: "RPT-003",
      title: "Safety Inspection Report",
      type: "Safety",
      date: "2024-01-03",
      status: "Generated",
      size: "3.2 MB",
    },
  ]

  const stats = [
    { label: "Total Reports", value: "24", change: "+12%", color: "text-blue-600" },
    { label: "This Month", value: "8", change: "+25%", color: "text-green-600" },
    { label: "Pending", value: "3", change: "-15%", color: "text-orange-600" },
    { label: "Completed", value: "21", change: "+18%", color: "text-purple-600" },
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
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600">Generate and manage project reports</p>
            </div>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <FileBarChart className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex items-center ${stat.color}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="p-4">
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileBarChart className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">{report.id}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{report.type}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{report.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.status === "Generated" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Generated on {report.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
