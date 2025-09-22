"use client"

import type React from "react"
import { lt } from "lodash"

import { useState, useEffect } from "react"
import { Film } from "lucide-react"
import "@/styles/vue-futuristic-alain.css"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

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
/* Dashboard visual enhancements */
.vue-card {
  background: linear-gradient(180deg, rgba(15,23,42,0.6), rgba(2,6,23,0.6));
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid rgba(34,211,238,0.15);
  box-shadow: 0 12px 40px -20px rgba(14,165,233,0.35);
}

.vue-env-card { backdrop-filter: blur(8px); }

.vue-camera-thumbnail { border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px -20px rgba(14,165,233,0.4); }

.vue-video-container { border-radius: 12px; }
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

export default function DashboardPage() {
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
  const [selectedProject, setSelectedProject] = useState<{
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
  } | null>(null)

  // Add state for document filters
  const [filters, setFilters] = useState<DocumentFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [documentTypes, setDocumentTypes] = useState<string[]>([])
  const [projectNames, setProjectNames] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Ensure activeTab is always "dashboard" since other tabs are removed
  useEffect(() => {
    setActiveTab("dashboard")
  }, [])

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

        if (error) {
          console.warn("Error fetching documents:", error.message)
          setDemoDocuments()
          return
        }

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
        id: "6",
        name: "Al Ain Floor Plan.pdf",
        type: "PDF",
        size: "4.2 MB",
        date: "2023-05-18",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/floor-plan-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطةasad",
      },
      {
        id: "1",
        name: "Project Overview.pdf",
        type: "PDF",
        size: "2.4 MB",
        date: "2023-12-15",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطةasad",
      },
      {
        id: "2",
        name: "Construction Blueprint.pdf",
        type: "PDF",
        size: "5.7 MB",
        date: "2023-12-10",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطةasad",
      },
      {
        id: "3",
        name: "Site Photos.jpg",
        type: "JPG",
        size: "12.8 MB",
        date: "2023-11-28",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
        project: "مركز شرطةasad",
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
    if (lt(bytes, 1024)) return bytes + " B"
    else if (lt(bytes, 1024 * 1024)) return (bytes / 1024).toFixed(1) + " KB"
    else if (lt(bytes, 1024 * 1024 * 1024)) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
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

    // Set up polling as a fallback mechanism
    const pollingInterval = setInterval(() => {
      fetchDocuments(filters)
    }, 30000) // Poll every 30 seconds as a fallback

    // Try to set up Supabase realtime subscription if credentials are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let subscription: { unsubscribe: () => void } | undefined

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // First check if the documents table exists
        supabase
          .from("documents")
          .select("count", { count: "exact", head: true })
          .then(({ error }) => {
            if (error) {
              console.warn("Documents table may not exist or is not accessible:", error.message)
              return // Don't attempt to subscribe if table doesn't exist
            }

            // Table exists, set up subscription
            try {
              const channel = supabase.channel("documents-changes")

              subscription = channel
                .on(
                  "postgres_changes",
                  {
                    event: "*",
                    schema: "public",
                    table: "documents",
                  },
                  (payload) => {
                    console.log("Change received in left slider!", payload)
                    fetchDocuments(filters) // Refresh documents when changes occur
                  },
                )
                .subscribe((status) => {
                  if (status === "SUBSCRIBED") {
                    console.log("Successfully subscribed to documents changes")
                  } else if (status === "CHANNEL_ERROR") {
                    console.warn("Failed to subscribe to documents changes, falling back to polling")
                  }
                })
            } catch (subError) {
              console.warn("Error setting up subscription:", subError)
            }
          })
          .catch((err) => {
            console.warn("Error checking documents table:", err)
          })
      } catch (error) {
        console.warn("Error initializing Supabase client:", error)
      }
    }

    // Listen for document updates from other components
    const handleDocumentUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setDocuments(event.detail)
      }
    }

    window.addEventListener("documentUpdate", handleDocumentUpdate as EventListener)

    // Listen for marker hover events
    const handleMarkerHover = (event: CustomEvent) => {
      if (event.detail && event.detail.project) {
        // Update the selected project
        if (typeof setSelectedProject === "function") {
          setSelectedProject(event.detail.project)
        }

        // Update the active tab to show project details
        setActiveTab("dashboard")
      }
    }

    window.addEventListener("markerHovered", handleMarkerHover as EventListener)

    return () => {
      // Clean up all subscriptions and listeners
      clearInterval(pollingInterval)

      if (subscription) {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.warn("Error unsubscribing from channel:", error)
        }
      }

      window.removeEventListener("documentUpdate", handleDocumentUpdate as EventListener)
      window.removeEventListener("markerHovered", handleMarkerHover as EventListener)
    }
  }, [filters]) // Re-run when filters change

  // Fetch documents when selected project changes
  useEffect(() => {
    if (selectedProject) {
      const projectFilter = {
        ...filters,
        project: selectedProject.projectNameEn,
      }
      fetchDocuments(projectFilter)

      // Update tab to show project details
      setActiveTab("dashboard")
    }
  }, [selectedProject])

  // Add this new useEffect to highlight the floor plan document when the Saad Police Station project is selected
  useEffect(() => {
    if (selectedProject && selectedProject.projectNameAr === "مركز شرطةasad") {
      // Make sure the floor plan document is loaded and visible
      const hasFloorPlan = documents.some((doc) => doc.name === "Al Ain Floor Plan.pdf")

      if (!hasFloorPlan) {
        // If the floor plan isn't in the current documents, add it
        const floorPlanDoc = {
          id: "6",
          name: "Al Ain Floor Plan.pdf",
          type: "PDF",
          size: "4.2 MB",
          date: "2023-05-18",
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/floor-plan-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
          project: "مركز شرطةasad",
        }

        // Add the floor plan at the beginning of the documents array
        setDocuments((prevDocs) => [floorPlanDoc, ...prevDocs])
      }
    }
  }, [selectedProject, documents])

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
    <div className="min-h-screen relative bg-gradient-to-b from-slate-950 via-slate-900 to-[#0b1020] text-white">
      {/* Background grid pattern - z-index adjusted to ensure it doesn't block scrolling */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.08),transparent_60%)] pointer-events-none z-0"></div>

      {/* Main content area - scrollable with enhanced vertical scrolling */}
      <div
        className="h-[95%] overflow-y-auto overflow-x-hidden pr-2 no-scrollbar relative z-20 mx-auto max-w-[900px] p-5"
        style={{
          maxHeight: "calc(100vh - 6rem)",
          overflowY: "auto",
        }}
      >
        <div className="flex flex-col p-4 space-y-6 w-full rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_10px_40px_-15px_rgba(14,165,233,0.25)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-cyan-400">
              {selectedProject ? selectedProject.projectNameEn : "Al Ain"}
            </h2>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {/* Docs button */}
                <button
                  onClick={() => {
                    try {
                      console.log("Navigating to documents page...")
                      // Navigate to documents page with the selected project as a query parameter
                      if (selectedProject) {
                        console.log("Selected project:", selectedProject)
                        const url = `/al-ain/documents?project=${encodeURIComponent(selectedProject.projectNameEn)}&id=${selectedProject.id}`
                        console.log("Navigation URL:", url)
                        router.push(url)
                      } else {
                        console.log("No project selected, navigating to documents page without parameters")
                        router.push("/al-ain/documents")
                      }
                    } catch (error) {
                      console.error("Navigation error:", error)
                      // Fallback navigation
                      router.push("/al-ain/documents")
                    }
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-all hover:scale-105 group relative overflow-hidden ring-1 ring-white/5 hover:from-cyan-500/10 hover:to-cyan-500/5"
                  aria-label="View documents"
                >
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
                  className="flex flex-col items-center justify-center p-3 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-all hover:scale-105 group relative overflow-hidden ring-1 ring-white/5 hover:from-cyan-500/10 hover:to-cyan-500/5"
                >
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
                  className="flex flex-col items-center justify-center p-3 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-all hover:scale-105 group relative overflow-hidden ring-1 ring-white/5 hover:from-cyan-500/10 hover:to-cyan-500/5"
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
                  className="flex flex-col items-center justify-center p-3 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-all hover:scale-105 group relative overflow-hidden ring-1 ring-white/5 hover:from-cyan-500/10 hover:to-cyan-500/5"
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
                    {selectedProject ? selectedProject.projectNameEn : "Al Ain Police Station Renovation Project"}
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
                        {selectedProject ? `PRJ-${selectedProject.id}` : "PRJ-001"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                      <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                        Start Date:
                      </span>
                      <span className="text-xs font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
                        15th June 2025
                      </span>
                    </div>

                    <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                      <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                        End Date:
                      </span>
                      <span className="text-xs font-medium text-amber-300 group-hover:text-amber-200 transition-colors">
                        30th December 2025
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
                        style={{ width: `${selectedProject ? (selectedProject.id % 5) * 20 + 20 : 28}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                      <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                        Company:
                      </span>
                      <span className="text-xs font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                        Al Ain Development
                      </span>
                    </div>

                    <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                      <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                        Project Manager (Company):
                      </span>
                      <span className="text-xs font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
                        Eng. Mohammed
                      </span>
                    </div>

                    <div className="flex justify-between items-center group hover:bg-cyan-900/10 p-1 rounded-md transition-all">
                      <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                        Project Manager (Police):
                      </span>
                      <span className="text-xs font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">
                        Eng. Khalid Al Shamsi
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-cyan-900/30 mt-2 items-center group hover:bg-[#8B0000]/20 p-1 rounded-md transition-all bg-[#8B0000]/10">
                      <span className="text-xs text-white/80 group-hover:text-white transition-colors font-medium">
                        Total Cost:
                      </span>
                      <span className="text-xs font-bold text-white">
                        {selectedProject
                          ? `AED ${(selectedProject.id * 1.5 + 8).toFixed(1)},000,000`
                          : "AED 12,800,000"}
                      </span>
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
                        <div className="text-xs text-cyan-300">Al Ain Oasis</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-full w-48 relative mx-1">
                      <div className="absolute inset-0 bg-[url('/al-ain-city-traffic.png')] bg-cover bg-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="text-xs text-cyan-300">City Center</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-full w-48 relative mx-1">
                      <div className="absolute inset-0 bg-[url('/al-ain-street-surveillance.png')] bg-cover bg-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="text-xs text-cyan-300">Main Street</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-full w-48 relative mx-1">
                      <div className="absolute inset-0 bg-[url('/al-ain-grand-entrance.png')] bg-cover bg-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="text-xs text-cyan-300">Police HQ</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-full w-48 relative mx-1">
                      <div className="absolute inset-0 bg-[url('/al-ain-parking-lot-daytime.png')] bg-cover bg-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="text-xs text-cyan-300">Parking Area</div>
                      </div>
                    </div>

                    {/* Duplicate the first few images to make the loop seamless */}
                    <div className="flex-shrink-0 h-full w-48 relative mx-1">
                      <div className="absolute inset-0 bg-[url('/al-ain-oasis-cityscape.png')] bg-cover bg-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="text-xs text-cyan-300">Al Ain Oasis</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-full w-48 relative mx-1">
                      <div className="absolute inset-0 bg-[url('/al-ain-city-traffic.png')] bg-cover bg-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="text-xs text-cyan-300">City Center</div>
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

          <div className="p-4 pt-4 border-t border-slate-700/50 mt-6">
            <div className="text-xs text-slate-500 flex justify-between">
              <span>v1.2.4</span>
              <span>Last updated: 2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
