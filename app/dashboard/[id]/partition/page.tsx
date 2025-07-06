"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Building, Calendar, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import "@/styles/vue-futuristic-alain.css"

interface PartitionTask {
  id: string
  area: string
  type: string
  status: "completed" | "in-progress" | "pending" | "delayed"
  progress: number
  assignedTo: string
  startDate: string
  endDate: string
  material: string
  height: string
  length: number
}

export default function PartitionWorkPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [partitionTasks, setPartitionTasks] = useState<PartitionTask[]>([
    {
      id: "PT001",
      area: "Open Office Division",
      type: "Glass Partition",
      status: "completed",
      progress: 100,
      assignedTo: "Tariq Al Blooshi",
      startDate: "2024-01-05",
      endDate: "2024-01-14",
      material: "Tempered Glass",
      height: "2.4m",
      length: 25,
    },
    {
      id: "PT002",
      area: "Meeting Rooms 1-3",
      type: "Acoustic Partition",
      status: "in-progress",
      progress: 55,
      assignedTo: "Fahad Al Dhaheri",
      startDate: "2024-01-10",
      endDate: "2024-01-26",
      material: "Sound-proof Panels",
      height: "3.0m",
      length: 18,
    },
    {
      id: "PT003",
      area: "Storage Area Separation",
      type: "Drywall Partition",
      status: "in-progress",
      progress: 30,
      assignedTo: "Mansour Al Ketbi",
      startDate: "2024-01-16",
      endDate: "2024-02-02",
      material: "Gypsum Board",
      height: "2.8m",
      length: 32,
    },
    {
      id: "PT004",
      area: "Executive Suite",
      type: "Movable Partition",
      status: "pending",
      progress: 0,
      assignedTo: "Jassim Al Marri",
      startDate: "2024-01-30",
      endDate: "2024-02-10",
      material: "Aluminum Frame",
      height: "2.6m",
      length: 12,
    },
    {
      id: "PT005",
      area: "Server Room",
      type: "Fire-rated Partition",
      status: "delayed",
      progress: 15,
      assignedTo: "Obaid Al Shamsi",
      startDate: "2024-01-20",
      endDate: "2024-02-05",
      material: "Fire-resistant Board",
      height: "3.2m",
      length: 8,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-900/30 border-green-500/30"
      case "in-progress":
        return "text-cyan-400 bg-cyan-900/30 border-cyan-500/30"
      case "pending":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-500/30"
      case "delayed":
        return "text-red-400 bg-red-900/30 border-red-500/30"
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <Calendar className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalProgress = Math.round(partitionTasks.reduce((acc, task) => acc + task.progress, 0) / partitionTasks.length)
  const completedTasks = partitionTasks.filter((task) => task.status === "completed").length
  const totalLength = partitionTasks.reduce((acc, task) => acc + task.length, 0)

  return (
    <div className="min-h-screen bg-black/90 backdrop-blur-sm">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none z-0"></div>

      {/* Main content area */}
      <div className="h-[95%] overflow-y-auto overflow-x-hidden pr-2 no-scrollbar relative z-20 text-white mx-auto max-w-[800px] p-4">
        {/* Breadcrumb navigation */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="text-cyan-400 hover:text-cyan-300 flex items-center cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-6 w-full bg-slate-800/30 rounded-xl border border-cyan-500/10 shadow-inner shadow-cyan-900/20">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center mr-4 shadow-lg shadow-amber-500/20">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-400">Partition Work</h2>
                <p className="text-sm text-amber-300/70">Project #{projectId}</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="vue-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-400">{totalProgress}%</div>
                  <div className="text-sm text-slate-400">Overall Progress</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-900/30 flex items-center justify-center">
                  <Building className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </div>

            <div className="vue-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {completedTasks}/{partitionTasks.length}
                  </div>
                  <div className="text-sm text-slate-400">Tasks Completed</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="vue-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{totalLength}m</div>
                  <div className="text-sm text-slate-400">Total Length</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div>
            <h3 className="text-sm uppercase text-slate-400 mb-4">Partition Tasks</h3>
            <div className="space-y-4">
              {partitionTasks.map((task) => (
                <div key={task.id} className="vue-card hover:border-amber-400/40 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-medium">{task.area}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${getStatusColor(task.status)}`}
                        >
                          {getStatusIcon(task.status)}
                          {task.status.replace("-", " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{task.type}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500">Assigned to:</span>
                          <div className="text-amber-300 font-medium">{task.assignedTo}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Material:</span>
                          <div className="text-amber-300 font-medium">{task.material}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Length:</span>
                          <div className="text-amber-300 font-medium">{task.length}m</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Height:</span>
                          <div className="text-amber-300 font-medium">{task.height}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-400">
                      {task.startDate} - {task.endDate}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-400">{task.progress}%</div>
                      <div className="h-2 w-24 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
