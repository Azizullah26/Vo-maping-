"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Home, Calendar, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import "@/styles/vue-futuristic-alain.css"

interface CeilingTask {
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
  sqMeters: number
}

export default function CeilingWorkPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [ceilingTasks, setCeilingTasks] = useState<CeilingTask[]>([
    {
      id: "C001",
      area: "Main Reception Area",
      type: "Suspended Ceiling",
      status: "completed",
      progress: 100,
      assignedTo: "Hassan Al Rashid",
      startDate: "2024-01-10",
      endDate: "2024-01-18",
      material: "Gypsum Board",
      height: "3.2m",
      sqMeters: 85,
    },
    {
      id: "C002",
      area: "Office Wing A",
      type: "Grid Ceiling System",
      status: "in-progress",
      progress: 60,
      assignedTo: "Saeed Al Maktoum",
      startDate: "2024-01-15",
      endDate: "2024-01-30",
      material: "Mineral Fiber",
      height: "2.8m",
      sqMeters: 150,
    },
    {
      id: "C003",
      area: "Conference Hall",
      type: "Acoustic Ceiling",
      status: "in-progress",
      progress: 40,
      assignedTo: "Rashid Al Nuaimi",
      startDate: "2024-01-20",
      endDate: "2024-02-10",
      material: "Perforated Metal",
      height: "4.5m",
      sqMeters: 120,
    },
    {
      id: "C004",
      area: "Corridor System",
      type: "Linear Ceiling",
      status: "pending",
      progress: 0,
      assignedTo: "Majid Al Shamsi",
      startDate: "2024-02-05",
      endDate: "2024-02-15",
      material: "Aluminum Strips",
      height: "2.6m",
      sqMeters: 200,
    },
    {
      id: "C005",
      area: "Executive Office",
      type: "Coffered Ceiling",
      status: "delayed",
      progress: 25,
      assignedTo: "Khalifa Al Mansouri",
      startDate: "2024-01-25",
      endDate: "2024-02-08",
      material: "Wood Veneer",
      height: "3.5m",
      sqMeters: 40,
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

  const totalProgress = Math.round(ceilingTasks.reduce((acc, task) => acc + task.progress, 0) / ceilingTasks.length)
  const completedTasks = ceilingTasks.filter((task) => task.status === "completed").length
  const totalSqMeters = ceilingTasks.reduce((acc, task) => acc + task.sqMeters, 0)

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
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-400">Ceiling Work</h2>
                <p className="text-sm text-purple-300/70">Project #{projectId}</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="vue-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{totalProgress}%</div>
                  <div className="text-sm text-slate-400">Overall Progress</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Home className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="vue-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {completedTasks}/{ceilingTasks.length}
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
                  <div className="text-2xl font-bold text-cyan-400">{totalSqMeters.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Total Sq. Meters</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div>
            <h3 className="text-sm uppercase text-slate-400 mb-4">Ceiling Tasks</h3>
            <div className="space-y-4">
              {ceilingTasks.map((task) => (
                <div key={task.id} className="vue-card hover:border-purple-400/40 transition-all duration-300">
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
                          <div className="text-purple-300 font-medium">{task.assignedTo}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Material:</span>
                          <div className="text-purple-300 font-medium">{task.material}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Area:</span>
                          <div className="text-purple-300 font-medium">{task.sqMeters} m²</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Height:</span>
                          <div className="text-purple-300 font-medium">{task.height}</div>
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
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-300"
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
