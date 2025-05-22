"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Film, ArrowLeft } from "lucide-react"
import "@/styles/vue-futuristic-alain.css"
import Link from "next/link"

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
}

export default function ProjectDashboard({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectName = searchParams.get("name") || "Project"
  const projectNameAr = searchParams.get("nameAr") || ""
  const projectId = params.id

  const [chartData, setChartData] = useState([35, 65, 45, 70, 55, 40, 60])
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [projectData, setProjectData] = useState<ProjectData>({
    id: projectId,
    name: projectName,
    nameAr: projectNameAr,
    description: "Major renovation and expansion project",
    status: "In Progress",
    startDate: "15th June 2025",
    endDate: "30th December 2025",
    completion: 28 + (Number.parseInt(projectId) % 5) * 15,
    budget: `AED ${(Number.parseInt(projectId) * 1.5 + 8).toFixed(1)},000,000`,
    company: "Al Ain Development",
    managerCompany: "Eng. Mohammed",
    managerPolice: "Eng. Khalid Al Shamsi",
  })

  // Add this style block
  const styleBlock = `
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  .animate-scan {
    animation: scan 4s linear infinite;
  }

  .perspective-container {
    perspective: 800px;
    transform-style: preserve-3d;
  }

  .transform-gpu {
    transform: translateZ(0);
  }

  .translate-z-8 {
    transform: translateZ(8px);
  }

  .translate-z-12 {
    transform: translateZ(12px);
  }

  .translate-z-16 {
    transform: translateZ(16px);
  }

  /* Hide scrollbar but keep scrolling functionality */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }

  @media (max-width: 640px) {
    .vue-card {
      padding: 0.75rem;
    }
    
    .vue-env-card {
      padding: 0.5rem;
    }
    
    .vue-video-container {
      height: 8rem;
    }
  }

  .content-container {
    max-width: 100%;
    overflow-x: hidden;
  }

  .text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Ensure proper scrolling */
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }

  /* Force scrollbar to be visible on some browsers */
  .force-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(8, 145, 178, 0.5) transparent;
  }

  .force-scrollbar::-webkit-scrollbar {
    width: 5px;
  }

  .force-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .force-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(8, 145, 178, 0.5);
    border-radius: 6px;
  }
  `

  // Add this style tag to the component
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = styleBlock
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Set demo documents
  useEffect(() => {
    const demoData = [
      {
        id: "1",
        name: `${projectName} Overview.pdf`,
        type: "PDF",
        size: "2.4 MB",
        date: "2023-12-15",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: projectNameAr,
      },
      {
        id: "2",
        name: "Construction Blueprint.pdf",
        type: "PDF",
        size: "5.7 MB",
        date: "2023-12-10",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: projectNameAr,
      },
      {
        id: "3",
        name: "Site Photos.jpg",
        type: "JPG",
        size: "12.8 MB",
        date: "2023-11-28",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
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

  return (
    <div className="min-h-screen bg-black/90 backdrop-blur-sm">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none z-0"></div>

      {/* Main content area */}
      <div
        className="h-[95%] overflow-y-auto overflow-x-hidden pr-2 no-scrollbar relative z-20 text-white mx-auto max-w-[800px] p-4"
        style={{
          maxHeight: "calc(100vh - 6rem)",
          overflowY: "auto",
        }}
      >
        {/* Breadcrumb navigation */}
        <div className="mb-6 flex items-center">
          <Link href="/projects-details" className="text-cyan-400 hover:text-cyan-300 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
        </div>

        <div className="flex flex-col p-4 space-y-6 w-full bg-slate-800/30 rounded-xl border border-cyan-500/10 shadow-inner shadow-cyan-900/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-cyan-400">
              {projectData.name}
              <span className="text-sm ml-2 text-cyan-300/70">#{projectId}</span>
            </h2>
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
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden"
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
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden"
              >
                {/* Add corner elements similar to the slider panel */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-cyan-500 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-cyan-500 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-cyan-500 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-cyan-500 animate-pulse"></div>

                <div className="text-cyan-400 mb-1 relative z-10">Media</div>
                <div className="relative z-10">
                  <div className="h-3 w-3 bg-cyan-400 rounded-sm animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-1 bg-white rounded-full animate-ping"></div>
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
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden"
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
                className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden"
              >
                <div className="text-cyan-400 mb-1 relative z-10">Live</div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-ping relative z-10"></div>
              </button>
            </div>

            {/* Project Summary */}
            <div>
              <h3 className="text-sm uppercase bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                Project Summary
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
                      Project ID:
                    </span>
                    <span className="text-xs font-medium text-cyan-300 group-hover:text-white transition-colors">
                      PRJ-{projectId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Start Date:
                    </span>
                    <span className="text-xs font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
                      {projectData.startDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      End Date:
                    </span>
                    <span className="text-xs font-medium text-amber-300 group-hover:text-amber-200 transition-colors">
                      {projectData.endDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Remaining Days:
                    </span>
                    <span className="text-xs font-medium bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                      246 days
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
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">Company:</span>
                    <span className="text-xs font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                      {projectData.company}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Project Manager (Company):
                    </span>
                    <span className="text-xs font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
                      {projectData.managerCompany}
                    </span>
                  </div>

                  <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                    <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                      Project Manager (Police):
                    </span>
                    <span className="text-xs font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">
                      {projectData.managerPolice}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-cyan-900/30 mt-2 items-center group hover:bg-[#8B0000]/20 p-1 rounded-md transition-all bg-[#8B0000]/10">
                    <span className="text-xs text-white/80 group-hover:text-white transition-colors font-medium">
                      Total Cost:
                    </span>
                    <span className="text-xs font-bold text-white">{projectData.budget}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D View */}
            <div>
              <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                3D View
              </h3>
              <div className="vue-card p-0 overflow-hidden">
                <div className="relative h-64 w-full bg-gradient-to-b from-slate-900 to-slate-800 perspective-container">
                  {/* Sketchfab 3D Model */}
                  <div className="sketchfab-embed-wrapper absolute inset-0 z-10">
                    <iframe
                      title={`${projectData.name} 3D Model`}
                      frameBorder="0"
                      allowFullScreen
                      mozallowfullscreen="true"
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      xr-spatial-tracking="true"
                      execution-while-out-of-viewport="true"
                      execution-while-not-rendered="true"
                      web-share="true"
                      src="https://sketchfab.com/models/ed1a9fcda1264310a6d3b60ba6cbda22/embed?autospin=1"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>

                  {/* Horizon line */}
                  <div className="absolute left-0 right-0 h-px bg-cyan-500/30 top-1/3"></div>

                  {/* Animated elements */}
                  <div className="absolute left-1/3 top-1/3 w-2 h-2 bg-cyan-400/80 rounded-full animate-pulse"></div>

                  <div
                    className="absolute right-1/3 top-1/4 w-2 h-2 bg-cyan-400/80 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute left-1/2 top-2/5 w-1 h-1 bg-cyan-400/80 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>

                  {/* Scanning effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full animate-scan"></div>

                  {/* HUD elements */}
                  <div className="absolute top-2 left-2 text-xs text-cyan-400 font-mono">GRID: ACTIVE</div>
                  <div className="absolute top-2 right-2 text-xs text-cyan-400 font-mono">ZOOM: 1.5x</div>
                  <div className="absolute bottom-2 left-2 text-xs text-cyan-400 font-mono">LAT: 24.2075° N</div>
                  <div className="absolute bottom-2 right-2 text-xs text-cyan-400 font-mono">LONG: 55.7447° E</div>

                  {/* Center target */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 border-2 border-cyan-400/50 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Controls overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-900/90 to-transparent">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button className="px-2 py-0.5 bg-cyan-900/50 text-cyan-400 text-xs rounded border border-cyan-500/30 hover:bg-cyan-800/50">
                          Rotate
                        </button>
                        <button className="px-2 py-0.5 bg-cyan-900/50 text-cyan-400 text-xs rounded border border-cyan-500/30 hover:bg-cyan-800/50">
                          Pan
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-2 py-0.5 bg-cyan-900/50 text-cyan-400 text-xs rounded border border-cyan-500/30 hover:bg-cyan-800/50">
                          +
                        </button>
                        <button className="px-2 py-0.5 bg-cyan-900/50 text-cyan-400 text-xs rounded border border-cyan-500/30 hover:bg-cyan-800/50">
                          -
                        </button>
                      </div>
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
                  Media
                </span>
              </h3>
              <div className="relative h-40 overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-900/50">
                {/* Add a style block for the animation */}
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
                  <div className="flex-shrink-0 h-full w-48 relative mx-1">
                    <div className="absolute inset-0 bg-[url('/al-ain-oasis-cityscape.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 1</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-full w-48 relative mx-1">
                    <div className="absolute inset-0 bg-[url('/al-ain-city-traffic.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 2</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-full w-48 relative mx-1">
                    <div className="absolute inset-0 bg-[url('/al-ain-street-surveillance.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 3</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-full w-48 relative mx-1">
                    <div className="absolute inset-0 bg-[url('/al-ain-grand-entrance.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 4</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-full w-48 relative mx-1">
                    <div className="absolute inset-0 bg-[url('/al-ain-parking-lot-daytime.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 5</div>
                    </div>
                  </div>

                  {/* Duplicate the first few images to make the loop seamless */}
                  <div className="flex-shrink-0 h-full w-48 relative mx-1">
                    <div className="absolute inset-0 bg-[url('/al-ain-oasis-cityscape.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 1</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-full w-48 relative mx-1">
                    <div className="absolute inset-0 bg-[url('/al-ain-city-traffic.png')] bg-cover bg-center"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs text-cyan-300">{projectData.name} - View 2</div>
                    </div>
                  </div>
                </div>

                {/* Controls indicator */}
                <div className="absolute bottom-2 right-2 flex space-x-1 z-20">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Analytics Chart */}
            <div>
              <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                Analytics
              </h3>
              <div className="vue-card">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-cyan-300 font-medium">Project Progress</div>
                  <div className="text-xs text-cyan-400">Last 7 Days</div>
                </div>
                <div className="flex items-end h-32 space-x-2">
                  {chartData.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-sm vue-bar-animate"
                        style={{
                          height: `${value}%`,
                          animationDelay: `${index * 0.1}s`,
                        }}
                      ></div>
                      <div className="text-xs text-slate-500 mt-1">D{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                Project Documents
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
              <span>Project ID: {projectId}</span>
              <span>Last updated: 2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
