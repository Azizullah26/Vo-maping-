"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Thermometer, Wind, Droplets, MapPin, Search, Filter, X } from "lucide-react"
import "@/styles/vue-futuristic-alain.css"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"

// Add a new interface for documents
interface ProjectDocument {
  id: string
  name: string
  type: string
  size: string
  date: string
  url: string
  project: string
}

// Add filter options interface
interface DocumentFilters {
  type?: string
  project?: string
  searchTerm?: string
  dateFrom?: string
  dateTo?: string
}

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

interface EnvironmentalData {
  temperature: number
  humidity: number
  pressure: number
  pm25: number
  co2: number
  lightIntensity: number
}

interface ProjectStats {
  personnelTotal: number
  personnelPresent: number
  equipmentTotal: number
  equipmentActive: number
}

interface Project {
  name: string
  description: string
  status: string
  completion: number
}

interface AlAinLeftSliderProps {
  isOpen: boolean
  toggleSlider: () => void
  selectedProject: {
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
  } | null
}

export default function AlAinLeftSlider({ isOpen, toggleSlider, selectedProject }: AlAinLeftSliderProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [chartData, setChartData] = useState([35, 65, 45, 70, 55, 40, 60])
  const [temperature, setTemperature] = useState(32) // Higher temperature for Al Ain
  const [humidity, setHumidity] = useState(45) // Lower humidity for Al Ain
  const [windSpeed, setWindSpeed] = useState(14)
  // Add router inside the component function, right after the state declarations
  const router = useRouter()
  // Add state for documents in the component
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)

  // Add state for document filters
  const [filters, setFilters] = useState<DocumentFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [documentTypes, setDocumentTypes] = useState<string[]>([])
  const [projectNames, setProjectNames] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Add a function to fetch documents from Supabase with filtering
  const fetchDocuments = async (filterOptions: DocumentFilters = {}) => {
    try {
      setLoadingDocuments(true)

      // Check if Supabase credentials are available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase credentials not available, using demo data")
        setDemoDocuments()
        return
      }

      try {
        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Test connection with a simple query first
        const { error: connectionError } = await supabase.from("documents").select("count").limit(1).single()

        if (connectionError) {
          console.warn("Error connecting to Supabase:", connectionError.message)
          setDemoDocuments()
          return
        }

        // Start building the query
        let query = supabase.from("documents").select("*")

        // Apply filters if provided
        if (filterOptions.type) {
          // For document type, we need to check the file extension
          // This assumes the type is stored in a column or can be extracted from the file name
          query = query.ilike("file_name", `%.${filterOptions.type.toLowerCase()}`)
        }

        if (filterOptions.project) {
          query = query.eq("project_name", filterOptions.project)
        }

        if (filterOptions.searchTerm) {
          // Search in name and description
          query = query.or(`name.ilike.%${filterOptions.searchTerm}%,description.ilike.%${filterOptions.searchTerm}%`)
        }

        if (filterOptions.dateFrom) {
          query = query.gte("created_at", filterOptions.dateFrom)
        }

        if (filterOptions.dateTo) {
          query = query.lte("created_at", filterOptions.dateTo)
        }

        // Order by created_at descending
        query = query.order("created_at", { ascending: false })

        // Execute the query
        const { data, error } = await query

        if (error) throw error

        if (data && data.length > 0) {
          // Format documents
          const formattedDocs = data.map((doc) => ({
            id: doc.id,
            name: doc.file_name || doc.name,
            type: (doc.file_name || doc.name).split(".").pop()?.toUpperCase() || "FILE",
            size: doc.size ? formatFileSize(doc.size) : "Unknown",
            date: new Date(doc.created_at || doc.uploaded_at).toLocaleDateString(),
            url: doc.file_url,
            project: doc.project_name,
          }))

          setDocuments(formattedDocs)

          // Extract unique document types and project names for filters
          const types = [...new Set(formattedDocs.map((doc) => doc.type))]
          const projects = [...new Set(formattedDocs.map((doc) => doc.project))]

          setDocumentTypes(types)
          setProjectNames(projects)
        } else {
          // No documents found, set demo data
          setDemoDocuments()
        }
      } catch (supabaseError) {
        console.error("Supabase error:", supabaseError)
        setDemoDocuments()
      }
    } catch (error) {
      console.error("Error in fetchDocuments:", error)
      setDemoDocuments()
    } finally {
      setLoadingDocuments(false)
    }
  }

  // Add a function to set demo documents
  const setDemoDocuments = () => {
    const demoData = [
      {
        id: "1",
        name: "Project Overview.pdf",
        type: "PDF",
        size: "2.4 MB",
        date: "2023-12-15",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطة الساد",
      },
      {
        id: "2",
        name: "Construction Blueprint.pdf",
        type: "PDF",
        size: "5.7 MB",
        date: "2023-12-10",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطة الساد",
      },
      {
        id: "3",
        name: "Site Photos.jpg",
        type: "JPG",
        size: "12.8 MB",
        date: "2023-11-28",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
        project: "مركز شرطة الساد",
      },
      {
        id: "4",
        name: "Budget Report.xlsx",
        type: "XLSX",
        size: "1.2 MB",
        date: "2023-12-05",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطة هيلي",
      },
      {
        id: "5",
        name: "Project Timeline.docx",
        type: "DOCX",
        size: "3.1 MB",
        date: "2023-11-20",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطة هيلي",
      },
    ]

    setDocuments(demoData)

    // Extract unique document types and project names for filters
    const types = [...new Set(demoData.map((doc) => doc.type))]
    const projects = [...new Set(demoData.map((doc) => doc.project))]

    setDocumentTypes(types)
    setProjectNames(projects)
  }

  // Add a helper function to format file sizes
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  // Add a function to apply filters
  const applyFilters = () => {
    fetchDocuments(filters)
  }

  // Add a function to clear filters
  const clearFilters = () => {
    setFilters({})
    setSearchTerm("")
    fetchDocuments()
  }

  // Add a function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, searchTerm })
    fetchDocuments({ ...filters, searchTerm })
  }

  // Projects data specific to Al Ain
  const projects = [
    {
      name: "Al Ain Oasis Renovation",
      description: "Cultural landmark and UNESCO World Heritage site renovation project.",
      status: "In Progress",
      completion: 65,
    },
    {
      name: "Jebel Hafeet Mountain Road",
      description: "Infrastructure improvement and safety enhancements.",
      status: "Under Construction",
      completion: 40,
    },
    {
      name: "Al Ain Zoo Expansion",
      description: "New wildlife conservation areas and visitor facilities.",
      status: "Completed",
      completion: 100,
    },
    {
      name: "Al Ain Mall Extension",
      description: "Commercial and entertainment complex expansion.",
      status: "Operational",
      completion: 90,
    },
    {
      name: "Hazza Bin Zayed Stadium",
      description: "Sports facilities and surrounding development.",
      status: "In Progress",
      completion: 75,
    },
  ]

  // Add this style tag to the component
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = styleBlock
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    // Simulate data updates
    const interval = setInterval(() => {
      setChartData(chartData.map((value) => Math.max(30, Math.min(80, value + (Math.random() * 10 - 5)))))
      setTemperature(Math.max(28, Math.min(36, temperature + (Math.random() * 2 - 1)))) // Higher temperature range for Al Ain
      setHumidity(Math.max(35, Math.min(60, humidity + (Math.random() * 6 - 3)))) // Lower humidity range for Al Ain
      setWindSpeed(Math.max(8, Math.min(18, windSpeed + (Math.random() * 4 - 2))))
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [chartData, temperature, humidity, windSpeed])

  // Update the useEffect to fetch documents and set up realtime subscription
  useEffect(() => {
    // Fetch documents initially
    fetchDocuments(filters)

    // Set up Supabase realtime subscription if credentials are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let subscription
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        subscription = supabase
          .channel("documents-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "documents",
            },
            (payload) => {
              console.log("Change received in left slider!", payload)
              fetchDocuments(filters) // Refresh documents when changes occur, maintaining current filters
            },
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("Successfully subscribed to documents changes")
            } else if (status === "CHANNEL_ERROR") {
              console.error("Failed to subscribe to documents changes")
            }
          })
      } catch (error) {
        console.error("Error setting up Supabase subscription:", error)
      }
    }

    // Listen for document updates from other components
    const handleDocumentUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setDocuments(event.detail)
      }
    }

    window.addEventListener("documentUpdate", handleDocumentUpdate as EventListener)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      window.removeEventListener("documentUpdate", handleDocumentUpdate as EventListener)
    }
  }, [filters]) // Re-run when filters change

  // Filter documents based on current filters
  const filteredDocuments = documents.filter((doc) => {
    let match = true

    if (filters.type && doc.type !== filters.type) {
      match = false
    }

    if (filters.project && doc.project !== filters.project) {
      match = false
    }

    if (filters.searchTerm && !doc.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      match = false
    }

    return match
  })

  return (
    <>
      <button
        onClick={toggleSlider}
        className={`fixed top-1/2 transform -translate-y-1/2 z-50 p-2 bg-[#0a192f]/80 backdrop-blur-sm rounded-r-md hover:bg-[#0a192f] transition-all duration-300 ${
          isOpen ? "left-[320px]" : "left-0"
        }`}
        aria-label={isOpen ? "Hide Dashboard" : "Show Dashboard"}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-cyan-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-cyan-400" />
        )}
      </button>

      <div
        className={cn(
          "fixed top-[5rem] sm:top-16 md:top-[4.5rem] left-0 max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-4.5rem)] w-[90%] sm:w-[320px] transform transition-transform ease-out-expo duration-500 z-40 bg-[#0a192f]/90 backdrop-blur-sm overflow-hidden border-r border-cyan-500/30",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Background grid pattern - z-index adjusted to ensure it doesn't block scrolling */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none z-0"></div>

        {/* Top decorative element */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 z-10"></div>

        {/* Left decorative element */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-cyan-500 z-10"></div>

        {/* Animated corner elements */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 animate-pulse z-10"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 animate-pulse z-10"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 animate-pulse z-10"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 animate-pulse z-10"></div>

        {/* Main content area - scrollable with enhanced vertical scrolling */}
        <div
          className="h-full overflow-y-auto overflow-x-hidden pr-2 no-scrollbar relative z-20"
          style={{ maxHeight: "calc(100vh - 5rem)", overflowY: "auto" }}
        >
          <div className="flex flex-col p-4 space-y-6 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cyan-400">Al Ain 
</h2>
              <div className="text-xs text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/30">
                REAL-TIME
              </div>
            </div>

            {/* Add a new tab for documents */}
            {/* Update the activeTab state to include 'documents' */}
            {/* Modify the tabs section to include a documents tab: */}
            <div className="flex space-x-4 mb-6">
              <button
                className={`px-3 py-2 text-sm rounded-md transition-all ${
                  activeTab === "dashboard"
                    ? "bg-cyan-900/50 text-cyan-300 border border-cyan-500/50"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
              <button
                className={`px-3 py-2 text-sm rounded-md transition-all ${
                  activeTab === "projects"
                    ? "bg-cyan-900/50 text-cyan-300 border border-cyan-500/50"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
                onClick={() => setActiveTab("projects")}
              >
                Projects
              </button>
              <button
                className={`px-3 py-2 text-sm rounded-md transition-all ${
                  activeTab === "documents"
                    ? "bg-cyan-900/50 text-cyan-300 border border-cyan-500/50"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
                onClick={() => setActiveTab("documents")}
              >
                Documents
              </button>
              <button
                className={`px-3 py-2 text-sm rounded-md transition-all ${
                  activeTab === "analytics"
                    ? "bg-cyan-900/50 text-cyan-300 border border-cyan-500/50"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </div>

            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <button className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="text-cyan-400 mb-1 relative z-10">Live</div>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-ping relative z-10"></div>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="text-cyan-400 mb-1 relative z-10">3D</div>
                    <div className="relative z-10">
                      <div className="h-3 w-3 border-2 border-cyan-400 rounded-sm animate-spin"></div>
                      <div className="absolute top-0 left-0 h-3 w-3 border-2 border-cyan-400 rounded-sm animate-ping opacity-30"></div>
                    </div>
                  </button>
                  {/* Update the Docs button to navigate to the documents page when clicked */}
                  <button
                    onClick={() => router.push("/al-ain/documents")}
                    className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="text-cyan-400 mb-1 relative z-10">Docs</div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-0.5 w-3 bg-cyan-400 mb-0.5 animate-pulse"></div>
                      <div
                        className="h-0.5 w-4 bg-cyan-400 mb-0.5 animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div className="h-0.5 w-2 bg-cyan-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all hover:scale-105 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>

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
                </div>

                {/* Project Summary */}
                <div>
                  <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                    Project Summary
                  </h3>
                  <div className="vue-card overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                    <h4 className="text-cyan-300 font-medium border-b border-cyan-900/30 pb-2 mb-3">
                      {selectedProject ? selectedProject.projectNameEn : "Al Ain Police Station Renovation Project"}
                    </h4>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">Start Date:</span>
                        <span className="text-xs text-cyan-300">15th June 2025</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">End Date:</span>
                        <span className="text-xs text-cyan-300">30th December 2025</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">Remaining Days:</span>
                        <span className="text-xs text-cyan-300 font-medium">246 days</span>
                      </div>

                      <div className="h-1 w-full bg-slate-700/50 rounded-full my-2">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                          style={{ width: "28%" }}
                        ></div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">Company:</span>
                        <span className="text-xs text-cyan-300">Al Ain Development</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">Project Manager (Company):</span>
                        <span className="text-xs text-cyan-300">Eng. Mohammed</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-slate-400">Project Manager (Police):</span>
                        <span className="text-xs text-cyan-300">Eng. Khalid Al Shamsi</span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-cyan-900/30 mt-2">
                        <span className="text-xs text-slate-400">Total Cost:</span>
                        <span className="text-xs text-cyan-300 font-medium">AED 12,800,000</span>
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
                          title="Al Ain Police Station"
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

                {/* Environmental Data */}
                <div>
                  <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                    Environmental Data
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="vue-env-card">
                      <div className="vue-env-icon-wrapper">
                        <div className="vue-env-icon-inner">
                          <Thermometer size={20} className="text-cyan-400 mb-1" />
                          <span className="text-xs text-cyan-300">TEMP</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-white">{Math.round(temperature)}°C</div>
                    </div>
                    <div className="vue-env-card">
                      <div className="vue-env-icon-wrapper">
                        <div className="vue-env-icon-inner">
                          <Droplets size={20} className="text-cyan-400 mb-1" />
                          <span className="text-xs text-cyan-300">HUM</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-white">{Math.round(humidity)}%</div>
                    </div>
                    <div className="vue-env-card">
                      <div className="vue-env-icon-wrapper">
                        <div className="vue-env-icon-inner">
                          <Wind size={20} className="text-cyan-400 mb-1" />
                          <span className="text-xs text-cyan-300">WIND</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-white">{Math.round(windSpeed)} km/h</div>
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
                      <div className="text-cyan-300 font-medium">Visitor Traffic</div>
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

                {/* Video Preview (replacing Alerts) */}
                <div>
                  <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                    Video Preview
                  </h3>
                  <div className="vue-card p-0 overflow-hidden">
                    <div className="relative aspect-video w-full bg-black">
                      {/* Auto-playing video */}
                      <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                        <source
                          src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-on-a-sunny-day-41693-large.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>

                      {/* Futuristic overlay elements */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none"></div>
                      <div className="absolute top-0 left-0 w-full h-px bg-cyan-500/20 vue-scan-line pointer-events-none"></div>
                      <div className="absolute inset-0 bg-cyan-900/10 vue-video-noise pointer-events-none"></div>

                      {/* Video title */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                        <div className="text-sm text-white font-medium mb-1">Al Ain Oasis - Aerial View</div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-300">Auto-playing</div>
                          <div className="text-xs text-cyan-300">Live</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Camera Feeds */}
                <div>
                  <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                    Camera Feeds
                  </h3>
                  <div className="vue-video-container h-40 mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm text-cyan-300">Live Feed: Al Ain City Center</div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-px bg-cyan-500/20 vue-scan-line"></div>
                    <div className="absolute top-2 right-2 bg-red-500 h-2 w-2 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-[url('/al-ain-city-traffic.png')] bg-cover bg-center opacity-40"></div>
                    <div className="absolute inset-0 bg-cyan-900/30 vue-video-noise"></div>
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    <div className="vue-camera-thumbnail flex-shrink-0 w-24 relative overflow-hidden">
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/70 z-10"></div>
                        <div className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse z-20"></div>
                        <div className="absolute bottom-1 left-1 text-[8px] text-cyan-300 font-mono z-20">LIVE</div>
                        <div className="absolute bottom-1 right-1 text-[8px] text-cyan-300 font-mono z-20">CAM-01</div>
                        <div className="vue-scan-line absolute top-0 left-0 w-full h-px bg-cyan-500/20 z-20"></div>
                        <div className="absolute inset-0 bg-[url('/al-ain-street-surveillance.png')] bg-cover bg-center animate-pulse"></div>
                        <div className="absolute inset-0 bg-cyan-900/20 vue-video-noise"></div>
                      </div>
                    </div>

                    <div className="vue-camera-thumbnail flex-shrink-0 w-24 relative overflow-hidden">
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/70 z-10"></div>
                        <div className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse z-20"></div>
                        <div className="absolute bottom-1 left-1 text-[8px] text-cyan-300 font-mono z-20">LIVE</div>
                        <div className="absolute bottom-1 right-1 text-[8px] text-cyan-300 font-mono z-20">CAM-02</div>
                        <div className="vue-scan-line absolute top-0 left-0 w-full h-px bg-cyan-500/20 z-20"></div>
                        <div className="absolute inset-0 bg-[url('/al-ain-grand-entrance.png')] bg-cover bg-center animate-pulse"></div>
                        <div className="absolute inset-0 bg-cyan-900/20 vue-video-noise"></div>
                      </div>
                    </div>

                    <div className="vue-camera-thumbnail flex-shrink-0 w-24 relative overflow-hidden">
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/70 z-10"></div>
                        <div className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse z-20"></div>
                        <div className="absolute bottom-1 left-1 text-[8px] text-cyan-300 font-mono z-20">LIVE</div>
                        <div className="absolute bottom-1 right-1 text-[8px] text-cyan-300 font-mono z-20">CAM-03</div>
                        <div className="vue-scan-line absolute top-0 left-0 w-full h-px bg-cyan-500/20 z-20"></div>
                        <div className="absolute inset-0 bg-[url('/al-ain-parking-lot-daytime.png')] bg-cover bg-center animate-pulse"></div>
                        <div className="absolute inset-0 bg-cyan-900/20 vue-video-noise"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add the documents tab content with enhanced filtering */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10 flex justify-between items-center">
                  <span>Project Documents</span>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                  >
                    <Filter size={12} />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                </h3>

                {/* Search and filter section */}
                {showFilters && (
                  <div className="vue-card bg-slate-800/50 space-y-3">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search documents..."
                          className="w-full bg-slate-700/50 border border-cyan-900/30 rounded-md py-1 px-3 pl-8 text-sm text-cyan-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <button
                        type="submit"
                        className="bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 rounded-md px-3 py-1 text-sm hover:bg-cyan-800/50 transition-colors"
                      >
                        Search
                      </button>
                    </form>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Document Type</label>
                        <select
                          value={filters.type || ""}
                          onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                          className="w-full bg-slate-700/50 border border-cyan-900/30 rounded-md py-1 px-2 text-sm text-cyan-100"
                        >
                          <option value="">All Types</option>
                          {documentTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Project</label>
                        <select
                          value={filters.project || ""}
                          onChange={(e) => setFilters({ ...filters, project: e.target.value || undefined })}
                          className="w-full bg-slate-700/50 border border-cyan-900/30 rounded-md py-1 px-2 text-sm text-cyan-100"
                        >
                          <option value="">All Projects</option>
                          {projectNames.map((project) => (
                            <option key={project} value={project}>
                              {project}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={clearFilters}
                        className="text-xs flex items-center gap-1 text-slate-400 hover:text-cyan-300"
                      >
                        <X size={12} />
                        Clear Filters
                      </button>
                      <button
                        onClick={applyFilters}
                        className="bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 rounded-md px-3 py-1 text-xs hover:bg-cyan-800/50 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}

                {loadingDocuments ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="vue-card">
                        <div className="flex items-start space-x-3">
                          <div className="vue-icon-container">
                            <MapPin size={20} className="text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-cyan-300 font-medium mb-1 truncate">{doc.name}</div>
                            <div className="text-xs text-slate-400 mb-2">
                              {doc.type} • {doc.size} • {doc.date}
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-2 py-0.5 bg-cyan-900/30 text-cyan-400 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all"
                              >
                                View
                              </a>
                              <a
                                href={doc.url}
                                download
                                className="text-xs px-2 py-0.5 bg-cyan-900/30 text-cyan-400 rounded-full border border-cyan-500/30 hover:bg-cyan-800/30 transition-all"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-cyan-400 mb-2">No documents found</div>
                    <div className="text-xs text-slate-400">
                      {Object.keys(filters).length > 0
                        ? "Try adjusting your filters or search terms"
                        : "Upload documents from the admin dashboard"}
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => router.push("/al-ain/documents")}
                    className="px-4 py-2 bg-cyan-900/50 text-cyan-300 rounded-md border border-cyan-500/30 hover:bg-cyan-800/50 transition-all text-sm"
                  >
                    View All Documents
                  </button>
                </div>
              </div>
            )}

            {/* Projects tab content remains the same */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                  Featured Projects
                </h3>
                {projects.map((project, index) => (
                  <div key={index} className="vue-card">
                    <div className="flex items-start space-x-3">
                      <div className="vue-icon-container">
                        <MapPin size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-cyan-300 font-medium mb-1">{project.name}</div>
                        <div className="text-xs text-slate-400 mb-2">{project.description}</div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs px-2 py-0.5 bg-cyan-900/30 text-cyan-400 rounded-full border border-cyan-500/30">
                            {project.status}
                          </div>
                          <div className="text-xs text-slate-500">{project.completion}% Complete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Analytics tab content remains the same */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                  Performance Metrics
                </h3>
                <div className="vue-card">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-cyan-300 font-medium">System Resources</div>
                    <div className="text-xs text-cyan-400">Real-time</div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">CPU Usage</span>
                        <span className="text-cyan-300">42%</span>
                      </div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-[42%] vue-progress-animate"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Memory</span>
                        <span className="text-cyan-300">68%</span>
                      </div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-[68%] vue-progress-animate"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Network</span>
                        <span className="text-cyan-300">35%</span>
                      </div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-[35%] vue-progress-animate"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm uppercase text-slate-400 mb-3 sticky top-0 bg-slate-900/80 py-2 backdrop-blur-sm z-10">
                  Traffic Sources
                </h3>
                <div className="vue-card">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-300">Direct</div>
                      <div className="text-xs text-cyan-300">45%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-300">Search</div>
                      <div className="text-xs text-cyan-300">32%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-300">Referral</div>
                      <div className="text-xs text-cyan-300">18%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-300">Social</div>
                      <div className="text-xs text-cyan-300">5%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 pt-4 border-t border-slate-700/50 mt-6">
            <div className="text-xs text-slate-500 flex justify-between">
              <span>v1.2.4</span>
              <span>Last updated: 2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
