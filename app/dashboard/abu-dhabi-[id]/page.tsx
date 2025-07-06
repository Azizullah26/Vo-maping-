"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Film, ArrowLeft, Home, Shield, MapPin, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import "@/styles/vue-futuristic-alain.css"

interface ProjectDocument {
  id: string
  name: string
  type: string
  size: string
  date: string
  url: string
  project: string
}

interface ProjectData {
  id: string
  name: string
  nameAr: string
  description: string
  status: string
  startDate: string
  endDate: string
  completion: number
  budget: string
  company: string
  managerCompany: string
  managerPolice: string
  type: string
  location: string
}

const getProjectTypeIcon = (type: string) => {
  switch (type) {
    case "urgent-point":
      return <AlertTriangle className="h-6 w-6 text-red-400" />
    case "ngc":
      return <Shield className="h-6 w-6 text-blue-400" />
    case "police":
      return <Shield className="h-6 w-6 text-blue-600" />
    case "civil-defense":
      return <Shield className="h-6 w-6 text-orange-400" />
    case "clinic":
      return <Home className="h-6 w-6 text-green-400" />
    default:
      return <MapPin className="h-6 w-6 text-cyan-400" />
  }
}

const getProjectTypeFromId = (id: string): string => {
  if (id.includes("urgent-point")) return "urgent-point"
  if (id.includes("ngc")) return "ngc"
  if (id.includes("police")) return "police"
  if (id.includes("civil-defense")) return "civil-defense"
  if (id.includes("clinic")) return "clinic"
  return "facility"
}

const getProjectDescription = (name: string, type: string): string => {
  switch (type) {
    case "urgent-point":
      return `Emergency response and urgent services facility serving the ${name.replace("Urgent Point - ", "")} area of Abu Dhabi.`
    case "ngc":
      return `National Guard Command facility providing security and emergency services for Abu Dhabi region.`
    case "police":
      return `Police facility providing law enforcement and security services for the local community.`
    case "civil-defense":
      return `Civil Defense facility providing fire safety, emergency response, and disaster management services.`
    case "clinic":
      return `Healthcare facility providing medical services and emergency care for the local community.`
    default:
      return `Government facility providing essential services for Abu Dhabi residents and visitors.`
  }
}

export default function AbuDhabiProjectDashboard({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectName = searchParams.get("name") || "Abu Dhabi Project"
  const projectNameAr = searchParams.get("nameAr") || ""
  const projectId = params.id

  const [chartData, setChartData] = useState([35, 65, 45, 70, 55, 40, 60])
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)

  const projectType = getProjectTypeFromId(projectId)
  const [projectData, setProjectData] = useState<ProjectData>({
    id: projectId,
    name: projectName,
    nameAr: projectNameAr,
    description: getProjectDescription(projectName, projectType),
    status: "Operational",
    startDate: "1st January 2020",
    endDate: "Ongoing Operations",
    completion: 100,
    budget: `AED ${(Math.random() * 50 + 10).toFixed(1)},000,000`,
    company: "Abu Dhabi Government",
    managerCompany: "Eng. Ahmed Al Mansouri",
    managerPolice: "Col. Khalid Al Shamsi",
    type: projectType,
    location: "Abu Dhabi, UAE",
  })

  // Set demo documents
  useEffect(() => {
    const demoData = [
      {
        id: "1",
        name: `${projectName} Operations Manual.pdf`,
        type: "PDF",
        size: "3.2 MB",
        date: "2024-01-15",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: projectNameAr,
      },
      {
        id: "2",
        name: "Facility Layout Plans.pdf",
        type: "PDF",
        size: "5.7 MB",
        date: "2024-01-10",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: projectNameAr,
      },
      {
        id: "3",
        name: "Facility Photos.jpg",
        type: "JPG",
        size: "8.3 MB",
        date: "2024-01-05",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5.jpg",
        project: projectNameAr,
      },
    ]

    setDocuments(demoData)
  }, [projectName, projectNameAr])

  useEffect(() => {
    // Simulate data updates
    const interval = setInterval(() => {
      setChartData(chartData.map((value) => Math.max(30, Math.min(80, value + (Math.random() * 10 - 5)))))
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [chartData])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [selectedImage])

  return (
    <div className="min-h-screen bg-black/90 backdrop-blur-sm">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none z-0"></div>

      {/* Main content area */}
      <div className="min-h-screen overflow-x-hidden relative z-20 text-white mx-auto max-w-[800px] p-4 pb-24">
        {/* Breadcrumb navigation */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="text-cyan-400 hover:text-cyan-300 flex items-center cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Abu Dhabi Map
          </button>
        </div>

        <div className="flex flex-col p-4 pb-8 space-y-6 w-full bg-slate-800/30 rounded-xl border border-cyan-500/10 shadow-inner shadow-cyan-900/20">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {getProjectTypeIcon(projectType)}
              <div className="ml-3">
                <h2 className="text-xl font-bold text-cyan-400">
                  {projectData.name}
                  <span className="text-sm ml-2 text-cyan-300/70">#{projectId}</span>
                </h2>
                <p className="text-sm text-slate-400">{projectData.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {/* Docs button */}
              <button
                onClick={() => {
                  try {
                    console.log("Navigating to documents page...")
                    router.push(`/al-ain/documents?project=${encodeURIComponent(projectData.name)}&id=${projectId}`)
                  } catch (error) {
                    console.error("Navigation error:", error)
                    router.push("/al-ain/documents")
                  }
                }}
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/50 hover:border-cyan-400/50 transition-all hover:scale-105 group relative overflow-hidden"
                aria-label="View documents"
              >
                <div className="text-cyan-400 mb-1 relative z-10">Docs</div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-0.5 w-3 bg-cyan-400 mb-0.5 animate-pulse"></div>
                  <div className="h-0.5 w-4 bg-cyan-400 mb-0.5 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-0.5 w-2 bg-cyan-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </button>

              {/* Media button */}
              <button
                onClick={() => {
                  try {
                    console.log("Navigating to media page...")
                    router.push("/al-ain/media")
                  } catch (error) {
                    console.error("Navigation error:", error)
                  }
                }}
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/50 hover:border-cyan-400/50 transition-all hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-cyan-500 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-cyan-500 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-cyan-500 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-cyan-500 animate-pulse"></div>

                <div className="text-cyan-400 mb-1 relative z-10">Media</div>
                <div className="relative z-10">
                  <div className="h-3 w-3 bg-cyan-400 rounded-sm animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-1 bg-white rounded-full"></div>
                </div>
              </button>

              {/* 3D button */}
              <button
                onClick={() => {
                  try {
                    console.log("Navigating to 3D page...")
                    router.push("/al-ain/3d")
                  } catch (error) {
                    console.error("Navigation error:", error)
                  }
                }}
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/50 hover:border-cyan-400/50 transition-all hover:scale-105 group relative overflow-hidden"
              >
                <div className="text-cyan-400 mb-1 relative z-10">3D</div>
                <div className="relative z-10">
                  <div className="h-3 w-3 border-2 border-cyan-400 rounded-sm animate-spin"></div>
                  <div className="absolute top-0 left-0 h-3 w-3 border-2 border-cyan-400 rounded-sm animate-ping opacity-30"></div>
                </div>
              </button>

              {/* Live button */}
              <button
                onClick={() => {
                  try {
                    console.log("Navigating to live page...")
                    router.push("/al-ain/live")
                  } catch (error) {
                    console.error("Navigation error:", error)
                  }
                }}
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/50 hover:border-cyan-400/50 transition-all hover:scale-105 group relative overflow-hidden"
              >
                <div className="text-cyan-400 mb-1 relative z-10">Live</div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-ping relative z-10"></div>
              </button>
            </div>

            {/* Project Summary */}
            <div>
              <h3 className="text-sm uppercase bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                Facility Summary
              </h3>
              <div className="vue-card overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 shadow-lg shadow-cyan-900/20">
                <h4 className="text-white font-medium pb-2 mb-3 relative">
                  {projectData.name}
                  {projectData.nameAr && <span className="text-sm text-cyan-300/70 ml-2">{projectData.nameAr}</span>}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500 via-blue-400 to-purple-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500 via-blue-400 to-purple-500 blur-[2px]"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500 via-blue-400 to-purple-500 blur-[4px] opacity-50"></div>
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Facility Name:
                    </span>
                    <span className="text-xs font-medium text-cyan-300 group-hover:text-white transition-colors">
                      {projectData.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Facility ID:
                    </span>
                    <span className="text-xs font-medium text-cyan-300 group-hover:text-white transition-colors">
                      {projectId.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">Type:</span>
                    <span className="text-xs font-medium text-cyan-300 group-hover:text-white transition-colors">
                      {projectType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">Status:</span>
                    <span className="text-xs font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
                      {projectData.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Location:
                    </span>
                    <span className="text-xs font-medium text-amber-300 group-hover:text-amber-200 transition-colors">
                      {projectData.location}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Operational Since:
                    </span>
                    <span className="text-xs font-medium bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                      {projectData.startDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Managing Authority:
                    </span>
                    <span className="text-xs font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                      {projectData.company}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-700/50 rounded-full my-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full relative"
                      style={{ width: `${projectData.completion}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Operational Status:
                    </span>
                    <span className="text-xs font-medium text-green-300 group-hover:text-green-200 transition-colors">
                      {projectData.completion}% Active
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Facility Manager:
                    </span>
                    <span className="text-xs font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">
                      {projectData.managerPolice}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Operations Manager:
                    </span>
                    <span className="text-xs font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
                      {projectData.managerCompany}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-cyan-900/30 mt-2 items-center group hover:bg-[#8B0000]/20 p-1 rounded-md transition-all bg-[#8B0000]/10">
                    <span className="text-xs text-white/80 group-hover:text-white transition-colors font-medium">
                      Annual Budget:
                    </span>
                    <span className="text-xs font-bold text-white">{projectData.budget}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operations Summary */}
            <div>
              <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                Operations Overview
              </h3>
              <div className="vue-card">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-cyan-300 font-medium">Facility Operations</div>
                  <div className="text-xs text-cyan-400">24/7 Active</div>
                </div>

                <div className="flex flex-col space-y-3 mt-4">
                  <div className="group flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/40 to-slate-700/40 hover:from-slate-700/60 hover:to-slate-600/60 rounded-lg border border-slate-500/30 hover:border-slate-400/70 transition-all duration-300 overflow-hidden relative">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mr-3 shadow-lg shadow-green-500/20">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                        Emergency Services
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-16 bg-slate-700/70 rounded-full overflow-hidden mr-3">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                      <span className="text-green-400 text-sm font-medium">Active</span>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-slate-500 via-slate-400 to-transparent"></div>
                  </div>

                  <div className="group flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/40 to-slate-700/40 hover:from-slate-700/60 hover:to-slate-600/60 rounded-lg border border-slate-500/30 hover:border-slate-400/70 transition-all duration-300 overflow-hidden relative">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                        Public Services
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-16 bg-slate-700/70 rounded-full overflow-hidden mr-3">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                      <span className="text-blue-400 text-sm font-medium">95%</span>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-slate-500 via-slate-400 to-transparent"></div>
                  </div>

                  <div className="group flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/40 to-slate-700/40 hover:from-slate-700/60 hover:to-slate-600/60 rounded-lg border border-slate-500/30 hover:border-slate-400/70 transition-all duration-300 overflow-hidden relative">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                        Maintenance
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-16 bg-slate-700/70 rounded-full overflow-hidden mr-3">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                      <span className="text-purple-400 text-sm font-medium">88%</span>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-slate-500 via-slate-400 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D View */}
            <div>
              <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                Facility View
              </h3>
              <div className="vue-card p-0 overflow-hidden">
                <div className="relative h-64 w-full bg-gradient-to-b from-slate-900 to-slate-800 perspective-container">
                  {/* Placeholder for 3D Model */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        {getProjectTypeIcon(projectType)}
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{projectData.name}</h4>
                      <p className="text-sm text-slate-400">{projectData.description}</p>
                    </div>
                  </div>

                  {/* Horizon line */}
                  <div className="absolute left-0 right-0 h-px bg-cyan-500/30 top-1/3"></div>

                  {/* HUD elements */}
                  <div className="absolute top-2 left-2 text-xs text-cyan-400 font-mono">STATUS: ACTIVE</div>
                  <div className="absolute top-2 right-2 text-xs text-cyan-400 font-mono">VIEW: FACILITY</div>
                  <div className="absolute bottom-2 left-2 text-xs text-cyan-400 font-mono">LAT: 24.4539° N</div>
                  <div className="absolute bottom-2 right-2 text-xs text-cyan-400 font-mono">LONG: 54.3773° E</div>

                  {/* Center target */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 border-2 border-cyan-400/50 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div>
              <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10 flex items-center gap-2">
                <Film className="h-4 w-4 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold">
                  Media Gallery
                </span>
              </h3>
              <div className="relative h-40 overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-900/50">
                <style jsx>{`
                  @keyframes slideLeft {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                  }
                  .photo-slider {
                    display: flex;
                    animation: slideLeft 20s linear infinite;
                  }
                  .photo-slider:hover {
                    animation-play-state: paused;
                  }
                `}</style>

                {/* Overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/80 z-10 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-cyan-500/20 vue-scan-line z-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-cyan-900/10 vue-video-noise pointer-events-none"></div>

                {/* Futuristic corner elements */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/50 z-20"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/50 z-20"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/50 z-20"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50 z-20"></div>

                {/* Photo slider */}
                <div className="photo-slider h-full">
                  <div
                    className="flex-shrink-0 h-full w-48 relative mx-1 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() =>
                      setSelectedImage({
                        url: "/abu-dhabi-corniche-traffic.png",
                        title: `${projectData.name} - View 1`,
                      })
                    }
                  >
                    <div className="absolute inset-0 bg-[url('/abu-dhabi-corniche-traffic.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 1</div>
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 h-full w-48 relative mx-1 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() =>
                      setSelectedImage({ url: "/modern-city-building.png", title: `${projectData.name} - View 2` })
                    }
                  >
                    <div className="absolute inset-0 bg-[url('/modern-city-building.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 2</div>
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 h-full w-48 relative mx-1 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() =>
                      setSelectedImage({
                        url: "/building-entrance-security.png",
                        title: `${projectData.name} - View 3`,
                      })
                    }
                  >
                    <div className="absolute inset-0 bg-[url('/building-entrance-security.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 3</div>
                    </div>
                  </div>
                </div>

                {/* Controls indicator */}
                <div className="absolute bottom-2 right-2 flex space-x-1 z-20">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                Facility Documents
              </h3>
              <div className="vue-card">
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center p-2 bg-slate-800/50 rounded-md hover:bg-slate-700/50 transition-colors cursor-pointer"
                      onClick={() => window.open(doc.url, "_blank")}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-cyan-900/50 rounded-md flex items-center justify-center text-cyan-400 text-xs font-bold">
                          {doc.type}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-white">{doc.name}</div>
                          <div className="text-xs text-slate-400">
                            {doc.size} • {doc.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-cyan-400 text-xs">View</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 pt-4 border-t border-slate-700/50 mt-6">
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Facility ID: {projectId}</span>
              <span>Last updated: 1h ago</span>
            </div>
          </div>
        </div>

        {/* Image Popup Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-900/80 hover:bg-slate-800 rounded-full flex items-center justify-center text-cyan-400 hover:text-white transition-all border border-cyan-500/30 hover:border-cyan-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image container */}
              <div className="relative bg-slate-900/50 rounded-lg border border-cyan-500/30 overflow-hidden">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />

                {/* Image title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-cyan-300 font-medium">{selectedImage.title}</h3>
                  <p className="text-slate-400 text-sm">Click outside or press ESC to close</p>
                </div>

                {/* Futuristic corner elements */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
