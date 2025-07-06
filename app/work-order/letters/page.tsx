"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Plus, Send, Archive, Star, Calendar } from "lucide-react"

export default function LettersPage() {
  const router = useRouter()

  const letters = [
    {
      id: "LTR-001",
      subject: "Project Approval Request - Al Ain Hospital",
      recipient: "Ministry of Health",
      sender: "Project Manager",
      date: "2024-01-08",
      status: "Sent",
      priority: "High",
      type: "Official",
    },
    {
      id: "LTR-002",
      subject: "Safety Compliance Certificate",
      recipient: "Abu Dhabi Municipality",
      sender: "Safety Officer",
      date: "2024-01-06",
      status: "Draft",
      priority: "Medium",
      type: "Compliance",
    },
    {
      id: "LTR-003",
      subject: "Contract Amendment Proposal",
      recipient: "Legal Department",
      sender: "Contract Manager",
      date: "2024-01-05",
      status: "Sent",
      priority: "High",
      type: "Legal",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
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
              <h1 className="text-2xl font-bold text-gray-900">Letters</h1>
              <p className="text-gray-600">Manage official correspondence</p>
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Compose Letter
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-6">
          <button className="text-indigo-600 border-b-2 border-indigo-600 pb-2 font-medium">All Letters</button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">Drafts</button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">Sent</button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">Archived</button>
        </div>
      </div>

      {/* Letters List */}
      <div className="p-4">
        <div className="space-y-4">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-indigo-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{letter.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(letter.status)}`}>
                        {letter.status}
                      </span>
                      <Star className={`h-4 w-4 ${getPriorityColor(letter.priority)}`} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">To:</span> {letter.recipient}
                      </div>
                      <div>
                        <span className="font-medium">From:</span> {letter.sender}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {letter.type}
                      </div>
                    </div>

                    <div className="flex items-center mt-3 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {letter.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm font-medium text-gray-900">{letter.id}</span>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                      <Archive className="h-4 w-4" />
                    </button>
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
