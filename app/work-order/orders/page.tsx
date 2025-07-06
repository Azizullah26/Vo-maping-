"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Search, Filter, ClipboardList, Calendar, User, MapPin } from "lucide-react"

export default function WorkOrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const workOrders = [
    {
      id: "WO-001",
      title: "Al Ain Hospital Renovation",
      status: "In Progress",
      priority: "High",
      assignee: "Ahmed Al Mansouri",
      location: "Al Ain",
      dueDate: "2024-01-15",
      progress: 65,
    },
    {
      id: "WO-002",
      title: "Abu Dhabi Police Station Upgrade",
      status: "Pending",
      priority: "Medium",
      assignee: "Sara Al Zahra",
      location: "Abu Dhabi",
      dueDate: "2024-01-20",
      progress: 25,
    },
    {
      id: "WO-003",
      title: "Dubai Metro Extension",
      status: "Completed",
      priority: "High",
      assignee: "Omar Hassan",
      location: "Dubai",
      dueDate: "2024-01-10",
      progress: 100,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-orange-100 text-orange-800"
      case "Low":
        return "bg-green-100 text-green-800"
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
              <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
              <p className="text-gray-600">Manage and track all work orders</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="p-4">
        <div className="space-y-4">
          {workOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {order.assignee}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {order.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due: {order.dueDate}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{order.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <span className="text-lg font-bold text-gray-900">{order.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
