"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/TopNav"
import {
  ArrowLeft,
  Users,
  PlusCircle,
  Edit,
  Settings,
  Database,
  Lock,
  BarChart,
  Shield,
  Building2,
  Search,
  Bell,
  LogOut,
  HelpCircle,
  Home,
  AlertCircle,
  CheckCircle2,
  X,
  ListFilter,
  ClipboardList,
  Eye,
  Download,
  Upload,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { DocumentPreview } from "@/components/DocumentPreview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Document type definition
interface Document {
  id: string
  name: string
  type: string
  size: string
  date: string
  url: string
  project: string
}

// Project type definition
interface Project {
  id: string
  name: string
  startDate: string
  endDate: string
  due: string
  status: "Active" | "Completed" | "Delayed" | "On Hold" | "Cancelled" | "Pending"
  progress: number
  amount: string
  manager: string
  managerId: string
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState("مركز شرطة الساد")
  const [selectedDocType, setSelectedDocType] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [projectsTab, setProjectsTab] = useState("all")

  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Add state for project details sorting
  const [sortColumn, setSortColumn] = useState<keyof Project>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [projectFilter, setProjectFilter] = useState("")
  const [dbInitialized, setDbInitialized] = useState(false)
  const [dbConfigured, setDbConfigured] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(true) // Default to demo mode to prevent errors

  // Sample project data
  const projectsData: Project[] = [
    {
      id: "1",
      name: "مركز شرطة الساد",
      startDate: "2023-01-15",
      endDate: "2024-12-30",
      due: "250 days",
      status: "Active",
      progress: 45,
      amount: "AED 24,500,000",
      manager: "Mohammed Al Shamsi",
      managerId: "MS001",
    },
    {
      id: "2",
      name: "مركز شرطة هيلي",
      startDate: "2022-08-22",
      endDate: "2024-06-30",
      due: "87 days",
      status: "Active",
      progress: 78,
      amount: "AED 18,750,000",
      manager: "Ahmed Al Dhaheri",
      managerId: "AD002",
    },
    {
      id: "3",
      name: "مركز شرطة الهير",
      startDate: "2023-11-10",
      endDate: "2025-04-15",
      due: "471 days",
      status: "Pending",
      progress: 10,
      amount: "AED 31,200,000",
      manager: "Khalid Al Mansoori",
      managerId: "KM003",
    },
    {
      id: "4",
      name: "مركز شرطة سويحان",
      startDate: "2022-02-28",
      endDate: "2023-11-15",
      due: "Completed",
      status: "Completed",
      progress: 100,
      amount: "AED 15,800,000",
      manager: "Sara Al Naqbi",
      managerId: "SN004",
    },
    {
      id: "5",
      name: "مركز شرطة المربعة",
      startDate: "2023-05-12",
      endDate: "2024-09-30",
      due: "158 days",
      status: "Active",
      progress: 65,
      amount: "AED 22,300,000",
      manager: "Fatima Al Kaabi",
      managerId: "FK005",
    },
    {
      id: "6",
      name: "مركز شرطة زاخر",
      startDate: "2023-08-05",
      endDate: "2025-02-28",
      due: "395 days",
      status: "Delayed",
      progress: 32,
      amount: "AED 19,600,000",
      manager: "Hamdan Al Blooshi",
      managerId: "HB006",
    },
    {
      id: "7",
      name: "مركز شرطة الخبيصي",
      startDate: "2023-03-20",
      endDate: "2024-08-15",
      due: "112 days",
      status: "Active",
      progress: 55,
      amount: "AED 17,400,000",
      manager: "Mariam Al Suwaidi",
      managerId: "MS007",
    },
    {
      id: "8",
      name: "مركز شرطة الطوية",
      startDate: "2022-12-01",
      endDate: "2024-05-30",
      due: "35 days",
      status: "Completed",
      progress: 88,
      amount: "AED 14,900,000",
      manager: "Saeed Al Ahbabi",
      managerId: "SA008",
    },
  ]

  // Filter projects based on the selected tab
  const filteredProjectsByStatus = projectsData.filter((project) => {
    if (projectsTab === "all") return true
    if (projectsTab === "active") return project.status === "Active"
    if (projectsTab === "completed") return project.status === "Completed"
    if (projectsTab === "pending")
      return project.status === "Pending" || project.status === "On Hold" || project.status === "Delayed"
    return true
  })

  // Sort and filter projects
  const sortedProjects = [...filteredProjectsByStatus]
    .filter(
      (project) =>
        project.name.toLowerCase().includes(projectFilter.toLowerCase()) ||
        project.manager.toLowerCase().includes(projectFilter.toLowerCase()),
    )
    .sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (sortColumn === "progress" || sortColumn === "id") {
        // Numeric sorting
        return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
      } else {
        // String sorting
        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      }
    })

  // Handle column sort
  const handleSort = (column: keyof Project) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Check database status and fetch documents on component mount
  useEffect(() => {
    // Set demo documents immediately to ensure we have data even if API calls fail
    setDemoDocuments()

    const setup = async () => {
      try {
        setLoading(true)

        // Always use demo mode for stability
        setDbConfigured(false)
        setDbError("Using demo mode for stability")
        showNotification("info", "Using demo mode for stability")
        setDemoMode(true)
        setLoading(false)
      } catch (error) {
        console.error("Setup error:", error)
        setDbError("Setup error: " + (error instanceof Error ? error.message : "Unknown error"))
        setDemoMode(true)
        showNotification("info", "Setup error. Operating in demo mode.")
        setLoading(false)
      }
    }

    setup()
  }, [])

  // Set demo documents
  const setDemoDocuments = () => {
    setDocuments([
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
    ])
    setLoading(false)
  }

  // Fetch documents from database
  const fetchDocuments = async () => {
    try {
      setLoading(true)
      console.log("Fetching documents...")

      // Skip actual API calls and just use demo data
      showNotification("info", "Using demo data for documents.")
      setDemoMode(true)
      setDemoDocuments()
    } catch (err) {
      console.error("Error fetching documents:", err)
      showNotification("info", "Failed to fetch documents. Using demo mode.")
      setDemoMode(true)
      setDemoDocuments()
    } finally {
      setLoading(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  // Show notification
  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Handle document deletion
  const handleDeleteDocument = async (id: string) => {
    if (demoMode) {
      showNotification("info", "Delete not available in demo mode")
      return
    }

    try {
      // Delete document via Nile API
      const response = await fetch(`/api/nile/documents/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to delete document")
      }

      // Update documents state
      setDocuments(documents.filter((doc) => doc.id !== id))
      showNotification("success", "Document deleted successfully")

      // Dispatch custom event to notify other components
      const event = new CustomEvent("documentUpdate", { detail: documents.filter((doc) => doc.id !== id) })
      window.dispatchEvent(event)
    } catch (error) {
      console.error("Error deleting document:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to delete document")
    }
  }

  // Preview document
  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document)
  }

  // Download document
  const handleDownloadDocument = (document: Document) => {
    window.open(document.url, "_blank")
  }

  // Update the handleInitializeDatabase function to use Nile
  const handleInitializeDatabase = async () => {
    try {
      showNotification("info", "Initializing Nile database...")

      // In demo mode, just simulate success
      showNotification("success", "Database initialized successfully (Demo Mode)!")
      return
    } catch (error) {
      console.error("Error initializing Nile database:", error)
      setDbError(error instanceof Error ? error.message : "Unknown error")
      showNotification("error", "An error occurred while initializing the Nile database")
      setDemoMode(true)
    }
  }

  // Filter documents by project
  const getFilteredDocuments = () => documents.filter((doc) => doc.project === selectedProject)

  // Render status badge with appropriate color
  const renderStatusBadge = (status: Project["status"]) => {
    const statusColors: Record<Project["status"], string> = {
      Active: "bg-green-100 text-green-800",
      Completed: "bg-blue-100 text-blue-800",
      Delayed: "bg-orange-100 text-orange-800",
      "On Hold": "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
      Pending: "bg-purple-100 text-purple-800",
    }

    return <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>{status}</span>
  }

  // Render progress bar
  const renderProgressBar = (progress: number) => {
    let barColor = "bg-red-600"

    if (progress >= 70) barColor = "bg-green-600"
    else if (progress >= 30) barColor = "bg-yellow-600"

    return (
      <div className="flex items-center gap-2">
        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs whitespace-nowrap">{progress}%</span>
      </div>
    )
  }

  // Handle document upload
  const handleUpload = async () => {
    if (!selectedFile) {
      showNotification("error", "Please select a file to upload")
      return
    }

    if (!selectedProject) {
      showNotification("error", "Please select a project")
      return
    }

    // In demo mode, simulate a successful upload
    const fileExtension = selectedFile.name.split(".").pop()?.toUpperCase() || "FILE"
    const newDocument: Document = {
      id: `demo-${Date.now()}`,
      name: selectedFile.name,
      type: fileExtension,
      size: formatFileSize(selectedFile.size),
      date: new Date().toLocaleDateString(),
      url:
        fileExtension === "JPG" || fileExtension === "PNG" || fileExtension === "JPEG" || fileExtension === "GIF"
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
      project: selectedProject,
    }

    // Add the new document to the documents array
    setDocuments([newDocument, ...documents])

    // Reset form
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    showNotification("success", "Document uploaded successfully (Demo Mode)")
  }

  // Update filtered documents when selected project changes
  useEffect(() => {
    console.log("Selected project changed to:", selectedProject)
    console.log("Available documents:", documents)
    const filtered = documents.filter((doc) => doc.project === selectedProject)
    console.log("Filtered documents:", filtered)
  }, [selectedProject, documents])

  // Filter documents by project
  const filteredDocuments = getFilteredDocuments()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
      <TopNav />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/al-ain")}
              className="bg-[#1B1464]/80 hover:bg-[#1B1464] text-white rounded-full w-10 h-10 p-0 shadow-lg transition-all duration-300 hover:scale-105"
              aria-label="Back to Al Ain Map"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#1b1464] flex items-center gap-2">
                <Shield className="h-6 w-6" /> Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage police projects, users, and system settings</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-[#1B1464] focus:ring focus:ring-[#1B1464]/20 focus:ring-opacity-50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#E31E24] rounded-full"></span>
            </Button>

            <div className="flex items-center gap-2">
              <div className="logo-container-alain h-9 w-9">
                <div className="logo-inner">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/remove%20bg%20rcc-police-logo-animation--2LfRrKuENgA7jmdeasfaIkgAiw4m3V.gif"
                    alt="RCC Logo"
                    width={36}
                    height={36}
                    className="logo-image"
                    priority
                  />
                </div>
                <div className="logo-glow"></div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {demoMode && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertTitle className="text-yellow-800">Demo Mode Active</AlertTitle>
            <AlertDescription className="text-yellow-700">
              The application is running in demo mode with sample data. Database features are not available.
            </AlertDescription>
          </Alert>
        )}

        {/* Notification */}
        {notification && (
          <div className="fixed top-24 right-4 z-50 w-96 transition-all duration-300 ease-in-out">
            <Alert
              className={
                notification.type === "success"
                  ? "bg-green-50 border-green-500"
                  : notification.type === "error"
                    ? "bg-red-50 border-red-500"
                    : "bg-blue-50 border-blue-500"
              }
            >
              <div className="flex items-center gap-2">
                {notification.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : notification.type === "error" ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Database className="h-5 w-5 text-blue-500" />
                )}
                <div className="flex-1">
                  <AlertTitle
                    className={
                      notification.type === "success"
                        ? "text-green-700"
                        : notification.type === "error"
                          ? "text-red-700"
                          : "text-blue-700"
                    }
                  >
                    {notification.type === "success" ? "Success" : notification.type === "error" ? "Error" : "Info"}
                  </AlertTitle>
                  <AlertDescription
                    className={
                      notification.type === "success"
                        ? "text-green-600"
                        : notification.type === "error"
                          ? "text-red-600"
                          : "text-blue-600"
                    }
                  >
                    {notification.message}
                  </AlertDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => setNotification(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-[#1B1464] text-white">
                <h2 className="font-semibold">Admin Menu</h2>
              </div>
              <nav className="p-2">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 rounded-lg",
                    activeTab === "dashboard" ? "bg-[#1B1464]/10 text-[#1B1464] font-medium" : "",
                  )}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 rounded-lg",
                    activeTab === "users" ? "bg-[#1B1464]/10 text-[#1B1464] font-medium" : "",
                  )}
                  onClick={() => setActiveTab("users")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 rounded-lg",
                    activeTab === "projects" ? "bg-[#1B1464]/10 text-[#1B1464] font-medium" : "",
                  )}
                  onClick={() => {
                    setActiveTab("projects")
                    setProjectsTab("all")
                  }}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Projects
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 rounded-lg",
                    activeTab === "project-details" ? "bg-[#1B1464]/10 text-[#1B1464] font-medium" : "",
                  )}
                  onClick={() => setActiveTab("project-details")}
                >
                  <ListFilter className="h-4 w-4 mr-2" />
                  Project Details
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 rounded-lg",
                    activeTab === "settings" ? "bg-[#1B1464]/10 text-[#1B1464] font-medium" : "",
                  )}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 rounded-lg",
                    activeTab === "analytics" ? "bg-[#1B1464]/10 text-[#1B1464] font-medium" : "",
                  )}
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>

                <div className="border-t my-4"></div>

                <Button variant="ghost" className="w-full justify-start mb-1 rounded-lg text-gray-500">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-1 rounded-lg text-gray-500"
                  onClick={() => router.push("/al-ain")}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Projects</p>
                          <p className="text-3xl font-bold">38</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-600 flex items-center">
                        <span>+4 new this month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Active Users</p>
                          <p className="text-3xl font-bold">142</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-600 flex items-center">
                        <span>+12 since last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                          <p className="text-3xl font-bold">24</p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Edit className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-red-600 flex items-center">
                        <span>5 require attention</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">System Status</p>
                          <p className="text-3xl font-bold">Online</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Settings className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-600 flex items-center">
                        <span>All systems operational</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Projects</CardTitle>
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{7}</div>
                      <p className="text-xs text-muted-foreground">Active projects in Al Ain</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/al-ain/admin/projects">View All Projects</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-white shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions across the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          user: "Admin",
                          action: "Added new project",
                          time: "2 hours ago",
                          icon: PlusCircle,
                          color: "text-green-500",
                        },
                        {
                          user: "System",
                          action: "Backup completed",
                          time: "5 hours ago",
                          icon: Database,
                          color: "text-blue-500",
                        },
                        {
                          user: "Mohammed",
                          action: "Updated user permissions",
                          time: "Yesterday",
                          icon: Lock,
                          color: "text-yellow-500",
                        },
                        {
                          user: "Khalid",
                          action: "Generated monthly report",
                          time: "2 days ago",
                          icon: BarChart,
                          color: "text-purple-500",
                        },
                        {
                          user: "Admin",
                          action: "System maintenance",
                          time: "3 days ago",
                          icon: Settings,
                          color: "text-gray-500",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div
                            className={`h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ${item.color}`}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {item.user} <span className="font-normal text-gray-600">{item.action}</span>
                            </p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#1B1464]">User Management</h2>
                  <Button className="bg-[#1B1464] hover:bg-[#1B1464]/90">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add New User
                  </Button>
                </div>

                <Card className="bg-white shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>System Users</CardTitle>
                      <div className="flex items-center gap-2">
                        <Input placeholder="Search users..." className="w-64" />
                        <Button variant="outline" size="icon">
                          <ListFilter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Last Login</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              name: "Mohammed Al Shamsi",
                              role: "Administrator",
                              department: "IT Department",
                              status: "Active",
                              lastLogin: "Today, 09:45 AM",
                            },
                            {
                              name: "Ahmed Al Dhaheri",
                              role: "Project Manager",
                              department: "Engineering",
                              status: "Active",
                              lastLogin: "Yesterday, 04:30 PM",
                            },
                            {
                              name: "Fatima Al Kaabi",
                              role: "Data Analyst",
                              department: "Planning",
                              status: "Active",
                              lastLogin: "Today, 11:20 AM",
                            },
                            {
                              name: "Khalid Al Mansoori",
                              role: "Project Manager",
                              department: "Engineering",
                              status: "Away",
                              lastLogin: "3 days ago",
                            },
                            {
                              name: "Sara Al Naqbi",
                              role: "Document Controller",
                              department: "Administration",
                              status: "Active",
                              lastLogin: "Today, 08:15 AM",
                            },
                            {
                              name: "Hamdan Al Blooshi",
                              role: "Security Officer",
                              department: "Security",
                              status: "Inactive",
                              lastLogin: "2 weeks ago",
                            },
                          ].map((user, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-[#1B1464]/10 flex items-center justify-center text-[#1B1464] font-medium">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <span>{user.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">{user.role}</td>
                              <td className="py-3 px-4">{user.department}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    user.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : user.status === "Away"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                  }}`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">{user.lastLogin}</td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Lock className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Roles</CardTitle>
                      <CardDescription>Manage system access levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { role: "Administrator", count: 3, permissions: "Full system access" },
                          { role: "Project Manager", count: 8, permissions: "Project management, reporting" },
                          { role: "Document Controller", count: 5, permissions: "Document management" },
                          { role: "Security Officer", count: 12, permissions: "Security monitoring" },
                          { role: "Data Analyst", count: 4, permissions: "Data access, reporting" },
                        ].map((role, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div>
                              <p className="font-medium">{role.role}</p>
                              <p className="text-sm text-gray-500">{role.permissions}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{role.count} users</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Activity</CardTitle>
                      <CardDescription>Recent login activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            user: "Mohammed Al Shamsi",
                            action: "Logged in",
                            time: "Today, 09:45 AM",
                            device: "Desktop - Chrome",
                          },
                          {
                            user: "Sara Al Naqbi",
                            action: "Logged in",
                            time: "Today, 08:15 AM",
                            device: "Mobile - Safari",
                          },
                          {
                            user: "Fatima Al Kaabi",
                            action: "Logged in",
                            time: "Today, 11:20 AM",
                            device: "Desktop - Firefox",
                          },
                          {
                            user: "Ahmed Al Dhaheri",
                            action: "Logged in",
                            time: "Yesterday, 04:30 PM",
                            device: "Tablet - Chrome",
                          },
                          {
                            user: "Khalid Al Mansoori",
                            action: "Failed login attempt",
                            time: "Yesterday, 06:15 PM",
                            device: "Unknown",
                          },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                            <div className="h-8 w-8 rounded-full bg-[#1B1464]/10 flex items-center justify-center text-[#1B1464] font-medium">
                              {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{activity.user}</p>
                              <p className="text-sm text-gray-500">
                                {activity.action} • {activity.time}
                              </p>
                              <p className="text-xs text-gray-400">{activity.device}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#1B1464]">Police Station Projects</h2>
                  <Button className="bg-[#1B1464] hover:bg-[#1B1464]/90">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add New Project
                  </Button>
                </div>

                <Tabs value={projectsTab} onValueChange={setProjectsTab} className="w-full">
                  <TabsList className="grid grid-cols-4 w-full max-w-md">
                    <TabsTrigger value="all">All Projects</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Search projects..."
                          className="w-64"
                          value={projectFilter}
                          onChange={(e) => setProjectFilter(e.target.value)}
                        />
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="delayed">Delayed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" /> Export
                      </Button>
                    </div>

                    <Card className="bg-white shadow-md">
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th
                                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer"
                                  onClick={() => handleSort("id")}
                                >
                                  <div className="flex items-center gap-1">
                                    ID {sortColumn === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                                  </div>
                                </th>
                                <th
                                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer"
                                  onClick={() => handleSort("name")}
                                >
                                  <div className="flex items-center gap-1">
                                    Project Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                                  </div>
                                </th>
                                <th
                                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer"
                                  onClick={() => handleSort("startDate")}
                                >
                                  <div className="flex items-center gap-1">
                                    Start Date {sortColumn === "startDate" && (sortDirection === "asc" ? "↑" : "↓")}
                                  </div>
                                </th>
                                <th
                                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer"
                                  onClick={() => handleSort("endDate")}
                                >
                                  <div className="flex items-center gap-1">
                                    End Date {sortColumn === "endDate" && (sortDirection === "asc" ? "↑" : "↓")}
                                  </div>
                                </th>
                                <th
                                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer"
                                  onClick={() => handleSort("status")}
                                >
                                  <div className="flex items-center gap-1">
                                    Status {sortColumn === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                                  </div>
                                </th>
                                <th
                                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer"
                                  onClick={() => handleSort("progress")}
                                >
                                  <div className="flex items-center gap-1">
                                    Progress {sortColumn === "progress" && (sortDirection === "asc" ? "↑" : "↓")}
                                  </div>
                                </th>
                                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedProjects.map((project) => (
                                <tr key={project.id} className="border-b hover:bg-gray-50">
                                  <td className="py-3 px-4">{project.id}</td>
                                  <td className="py-3 px-4 font-medium">{project.name}</td>
                                  <td className="py-3 px-4">{project.startDate}</td>
                                  <td className="py-3 px-4">{project.endDate}</td>
                                  <td className="py-3 px-4">{renderStatusBadge(project.status)}</td>
                                  <td className="py-3 px-4">{renderProgressBar(project.progress)}</td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                          setSelectedProject(project.name)
                                          setActiveTab("project-details")
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Tabs>
              </div>
            )}

            {activeTab === "project-details" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setActiveTab("projects")}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-bold text-[#1B1464]">{selectedProject}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" /> Edit Project
                    </Button>
                    <Button className="bg-[#1B1464] hover:bg-[#1B1464]/90">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Document
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projectsData
                          .filter((p) => p.name === selectedProject)
                          .map((project) => (
                            <div key={project.id} className="space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-sm text-gray-500">Project ID</p>
                                  <p className="font-medium">{project.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Status</p>
                                  <p>{renderStatusBadge(project.status)}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">Project Manager</p>
                                <p className="font-medium">{project.manager}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-sm text-gray-500">Start Date</p>
                                  <p className="font-medium">{project.startDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">End Date</p>
                                  <p className="font-medium">{project.endDate}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">Budget</p>
                                <p className="font-medium">{project.amount}</p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">Progress</p>
                                {renderProgressBar(project.progress)}
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">Time Remaining</p>
                                <p className="font-medium">{project.due}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Project Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                            isDragging ? "border-[#1B1464] bg-[#1B1464]/5" : "border-gray-300"
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <div className="flex flex-col items-center justify-center text-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm font-medium mb-1">Drag and drop files here</p>
                            <p className="text-xs text-gray-500 mb-3">or</p>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                              Browse Files
                            </Button>
                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            {selectedFile && (
                              <div className="mt-4 text-sm">
                                Selected: <span className="font-medium">{selectedFile.name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedFile && (
                          <div className="mt-4 flex justify-end">
                            <Button className="bg-[#1B1464] hover:bg-[#1B1464]/90" onClick={handleUpload}>
                              <Upload className="h-4 w-4 mr-2" /> Upload Document
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Project Documents</h3>
                          <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="All document types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All document types</SelectItem>
                              <SelectItem value="PDF">PDF</SelectItem>
                              <SelectItem value="DOCX">DOCX</SelectItem>
                              <SelectItem value="XLSX">XLSX</SelectItem>
                              <SelectItem value="JPG">Images</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="overflow-hidden border rounded-lg">
                          {loading ? (
                            <div className="p-8 flex justify-center">
                              <p>Loading documents...</p>
                            </div>
                          ) : filteredDocuments.length === 0 ? (
                            <div className="p-8 text-center">
                              <p className="text-gray-500">No documents found for this project.</p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-50 border-b">
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Name</th>
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Type</th>
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Size</th>
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Date</th>
                                    <th className="text-right py-2 px-4 font-medium text-gray-600">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredDocuments
                                    .filter((doc) =>
                                      selectedDocType && selectedDocType !== "all"
                                        ? doc.type === selectedDocType
                                        : true,
                                    )
                                    .map((doc) => (
                                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                          <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-[#1B1464]/10 rounded flex items-center justify-center text-[#1B1464]">
                                              <FileText className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">{doc.name}</span>
                                          </div>
                                        </td>
                                        <td className="py-3 px-4">{doc.type}</td>
                                        <td className="py-3 px-4">{doc.size}</td>
                                        <td className="py-3 px-4">{doc.date}</td>
                                        <td className="py-3 px-4 text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={() => handlePreviewDocument(doc)}
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={() => handleDownloadDocument(doc)}
                                            >
                                              <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 text-red-500"
                                              onClick={() => handleDeleteDocument(doc.id)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#1B1464]">System Settings</h2>
                  <Button className="bg-[#1B1464] hover:bg-[#1B1464]/90">Save Changes</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>Settings Categories</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-1 p-2">
                          {[
                            { name: "General", icon: Settings },
                            { name: "Database", icon: Database },
                            { name: "Security", icon: Shield },
                            { name: "Notifications", icon: Bell },
                            { name: "Backup & Restore", icon: Download },
                            { name: "API Access", icon: Lock },
                          ].map((category, index) => (
                            <Button key={index} variant="ghost" className="w-full justify-start rounded-lg">
                              <category.icon className="h-4 w-4 mr-2" />
                              {category.name}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Configure system-wide settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">System Name</label>
                          <Input defaultValue="Al Ain Police Projects Management System" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Default Language</label>
                          <Select defaultValue="en">
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                              <SelectItem value="both">Bilingual (Arabic/English)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date Format</label>
                          <Select defaultValue="dd-mm-yyyy">
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                              <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Timezone</label>
                          <Select defaultValue="gst">
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gst">Gulf Standard Time (GST)</SelectItem>
                              <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                              <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Database Connection</label>
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${demoMode ? "bg-yellow-500" : dbConfigured ? "bg-green-500" : "bg-red-500"}`}
                              ></span>
                              <span className="text-sm">
                                {demoMode ? "Demo Mode" : dbConfigured ? "Connected" : "Not Connected"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={handleInitializeDatabase}
                              disabled={dbConfigured && !demoMode}
                            >
                              <Database className="h-4 w-4 mr-2" />
                              {dbConfigured && !demoMode ? "Connected" : "Initialize Database"}
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/al-ain/admin/database-setup")}>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                          {dbError && <p className="text-sm text-red-500">{dbError}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">System Maintenance</label>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              <Clock className="h-4 w-4 mr-2" />
                              Schedule Maintenance
                            </Button>
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Backup System
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>Configure system security options</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Password Policy</label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="min-length" defaultChecked />
                              <label htmlFor="min-length" className="text-sm">
                                Require minimum 8 characters
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="special-chars" defaultChecked />
                              <label htmlFor="special-chars" className="text-sm">
                                Require special characters
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="numbers" defaultChecked />
                              <label htmlFor="numbers" className="text-sm">
                                Require numbers
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="uppercase" defaultChecked />
                              <label htmlFor="uppercase" className="text-sm">
                                Require uppercase letters
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Session Timeout</label>
                          <Select defaultValue="30">
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeout period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Two-Factor Authentication</label>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="2fa" defaultChecked />
                            <label htmlFor="2fa" className="text-sm">
                              Require 2FA for administrative accounts
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#1B1464]">Analytics Dashboard</h2>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="month">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Export Report
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Budget</p>
                          <p className="text-3xl font-bold">AED 164.5M</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-600 flex items-center">
                        <span>+12.5% from last year</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                          <p className="text-3xl font-bold">68.4%</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-600 flex items-center">
                        <span>+5.2% from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Active Projects</p>
                          <p className="text-3xl font-bold">24</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-red-600 flex items-center">
                        <span>-2 from last quarter</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Avg. Completion Time</p>
                          <p className="text-3xl font-bold">14.2 mo</p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-600 flex items-center">
                        <span>-1.5 months improvement</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Status Distribution</CardTitle>
                      <CardDescription>Current status of all projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <div className="w-full max-w-md">
                          <div className="space-y-4">
                            {[
                              { status: "Active", count: 24, percentage: 63, color: "bg-green-500" },
                              { status: "Completed", count: 8, percentage: 21, color: "bg-blue-500" },
                              { status: "Delayed", count: 4, percentage: 11, color: "bg-orange-500" },
                              { status: "On Hold", count: 1, percentage: 3, color: "bg-yellow-500" },
                              { status: "Cancelled", count: 1, percentage: 3, color: "bg-red-500" },
                            ].map((item, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                                    <span className="text-sm font-medium">{item.status}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {item.count} ({item.percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${item.color}`}
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Allocation by Region</CardTitle>
                      <CardDescription>Distribution of project budgets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <div className="w-full max-w-md">
                          <div className="space-y-4">
                            {[
                              {
                                region: "Al Ain City Center",
                                amount: "AED 68.2M",
                                percentage: 41,
                                color: "bg-[#1B1464]",
                              },
                              { region: "Al Hayer", amount: "AED 32.5M", percentage: 20, color: "bg-[#1B1464]/80" },
                              { region: "Al Wagan", amount: "AED 24.8M", percentage: 15, color: "bg-[#1B1464]/60" },
                              { region: "Al Qua'a", amount: "AED 19.7M", percentage: 12, color: "bg-[#1B1464]/40" },
                              { region: "Sweihan", amount: "AED 12.3M", percentage: 7, color: "bg-[#1B1464]/30" },
                              { region: "Other Areas", amount: "AED 7.0M", percentage: 5, color: "bg-[#1B1464]/20" },
                            ].map((item, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                                    <span className="text-sm font-medium">{item.region}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {item.amount} ({item.percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${item.color}`}
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline Overview</CardTitle>
                    <CardDescription>Timeline of active and upcoming projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px] space-y-6">
                        {[
                          {
                            quarter: "Q1 2024",
                            projects: [
                              {
                                name: "مركز شرطة الساد",
                                status: "Active",
                                duration: "3 months",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة هيلي",
                                status: "Active",
                                duration: "2 months",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة الهير",
                                status: "Pending",
                                duration: "1 month",
                                color: "bg-purple-100 border-purple-500",
                              },
                            ],
                          },
                          {
                            quarter: "Q2 2024",
                            projects: [
                              {
                                name: "مركز شرطة الساد",
                                status: "Active",
                                duration: "3 months",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة هيلي",
                                status: "Active",
                                duration: "1 month",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة المربعة",
                                status: "Active",
                                duration: "3 months",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة زاخر",
                                status: "Delayed",
                                duration: "2 months",
                                color: "bg-orange-100 border-orange-500",
                              },
                            ],
                          },
                          {
                            quarter: "Q3 2024",
                            projects: [
                              {
                                name: "مركز شرطة المربعة",
                                status: "Active",
                                duration: "1 month",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة زاخر",
                                status: "Active",
                                duration: "3 months",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة الخبيصي",
                                status: "Active",
                                duration: "2 months",
                                color: "bg-green-100 border-green-500",
                              },
                            ],
                          },
                          {
                            quarter: "Q4 2024",
                            projects: [
                              {
                                name: "مركز شرطة زاخر",
                                status: "Active",
                                duration: "1 month",
                                color: "bg-green-100 border-green-500",
                              },
                              {
                                name: "مركز شرطة الخبيصي",
                                status: "Active",
                                duration: "2 months",
                                color: "bg-green-100 border-green-500",
                              },
                            ],
                          },
                        ].map((quarter, index) => (
                          <div key={index}>
                            <h3 className="font-medium mb-2">{quarter.quarter}</h3>
                            <div className="grid grid-cols-12 gap-2">
                              {quarter.projects.map((project, pIndex) => (
                                <div
                                  key={pIndex}
                                  className={`col-span-${project.duration === "1 month" ? "3" : project.duration === "2 months" ? "6" : "9"} p-2 rounded border-l-4 ${project.color}`}
                                >
                                  <p className="text-sm font-medium">{project.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {project.status} • {project.duration}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      {previewDocument && (
        <DocumentPreview
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          document={previewDocument}
        />
      )}
    </div>
  )
}
