"use client"

import type React from "react"

import {
  ArrowLeft,
  Users,
  Settings,
  Database,
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
  Upload,
  Eye,
  FileText,
  PlusCircle,
  Lock,
  Edit,
  ClipboardList,
  Download,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { TopNav } from "@/components/TopNav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

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

export default function AdminPageClient() {
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
  const [storageDocuments, setStorageDocuments] = useState<Document[]>([])

  // Add state for project details sorting
  const [sortColumn, setSortColumn] = useState<keyof Project>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [projectFilter, setProjectFilter] = useState("")
  const [dbInitialized, setDbInitialized] = useState(false)
  const [dbConfigured, setDbConfigured] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)

  // Replace with this proper hook usage:
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [demoMode, setDemoMode] = useState(true)

  // Use useEffect to safely check for auth context
  useEffect(() => {
    try {
      // Try to get auth from localStorage directly instead of using the hook
      const storedAuth = localStorage.getItem("isAuthenticated")
      if (storedAuth === "true") {
        setIsAuthenticated(true)
        setDemoMode(false)
      }
    } catch (error) {
      console.warn("Auth storage not available, using demo mode")
      setIsAuthenticated(false)
      setDemoMode(true)
    }
  }, [])

  // Sample project data
  const [projectsData, setProjectsData] = useState<Project[]>([])

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
    const fetchData = async () => {
      try {
        setLoading(true)

        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          console.error("Missing Supabase credentials in environment variables")
          throw new Error("Missing Supabase credentials")
        }

        console.log("Connecting to Supabase at:", supabaseUrl)
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Test connection with a simple query
        const { count, error: testError } = await supabase.from("documents").select("*", { count: "exact", head: true })

        if (testError) {
          console.error("Supabase connection test failed:", testError)
          throw testError
        }

        console.log("Supabase connection successful, fetching projects")

        // Fetch projects from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })

        if (projectsError) {
          console.error("Error fetching projects:", projectsError)
          throw projectsError
        }

        if (projectsData && projectsData.length > 0) {
          console.log(`Found ${projectsData.length} projects in database`)

          // Format projects
          const formattedProjects: Project[] = projectsData.map((proj) => ({
            id: proj.id,
            name: proj.name,
            startDate: new Date(proj.start_date || proj.created_at).toISOString().split("T")[0],
            endDate: new Date(proj.end_date || proj.updated_at || proj.created_at).toISOString().split("T")[0],
            due: proj.due_days || "N/A",
            status: (proj.status as Project["status"]) || "Active",
            progress: proj.progress || 0,
            amount: proj.budget || "AED 0",
            manager: proj.manager || "Unassigned",
            managerId: proj.manager_id || "",
          }))

          // Replace static projectsData with fetched data
          setProjectsData(formattedProjects)

          // Fetch documents from Supabase
          const { data: documentsData, error: documentsError } = await supabase
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false })

          if (documentsError) {
            console.error("Error fetching documents:", documentsError)
            throw documentsError
          }

          if (documentsData && documentsData.length > 0) {
            console.log(`Found ${documentsData.length} documents in database`)

            // Format documents
            const formattedDocs: Document[] = documentsData.map((doc) => ({
              id: doc.id,
              name: doc.file_name || doc.name,
              type: (doc.file_name || doc.name).split(".").pop()?.toUpperCase() || "FILE",
              size: formatFileSize(doc.file_size || doc.size || 0),
              date: new Date(doc.created_at).toLocaleDateString(),
              url: doc.file_url,
              project: doc.project_name,
            }))

            setDocuments(formattedDocs)
            setDemoMode(false)
            showNotification("success", "Connected to Supabase successfully")
          } else {
            // No documents found, but we still have projects
            console.log("No documents found in database")
            setDemoMode(false)
            showNotification("info", "No documents found in database")
          }
        } else {
          // No projects found, use demo data but notify user
          console.log("No projects found in database, using demo data")
          setDemoMode(true)
          setDemoDocuments()
          showNotification("info", "No projects found in database, using demo data")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setDemoMode(true)
        setDemoDocuments()
        showNotification(
          "error",
          "Error connecting to Supabase, using demo data: " + (err instanceof Error ? err.message : String(err)),
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up Supabase realtime subscription for documents
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const subscription = supabase
        .channel("schema-db-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "documents" }, (payload) => {
          console.log("Document change received!", payload)
          // Re-fetch documents when changes occur
          fetchData()
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
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
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase credentials")
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Get the document to delete
      const docToDelete = documents.find((doc) => doc.id === id)

      if (!docToDelete) {
        throw new Error("Document not found")
      }

      // Extract the file path from the URL if available
      let filePath = null
      if (docToDelete.url) {
        const urlParts = docToDelete.url.split("/")
        if (urlParts.length >= 2) {
          // Try to extract the path from the URL
          const bucketParts = docToDelete.url.split("project-documents/")
          if (bucketParts.length > 1) {
            filePath = bucketParts[1]
          }
        }
      }

      // Delete document from Supabase database
      const { error: deleteError } = await supabase.from("documents").delete().eq("id", id)

      if (deleteError) {
        throw deleteError
      }

      // Delete file from Supabase storage if we have a path
      if (filePath) {
        const { error: storageError } = await supabase.storage.from("project-documents").remove([filePath])

        if (storageError) {
          console.error("Error deleting file from storage:", storageError)
          // We continue even if storage deletion fails
        }
      }

      // Update documents state
      setDocuments(documents.filter((doc) => doc.id !== id))
      showNotification("success", "Document deleted successfully")

      // Dispatch custom event to notify other components
      const event = new CustomEvent("documentUpdate", {
        detail: documents.filter((doc) => doc.id !== id),
      })
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
  // Update the handleInitializeDatabase function to use direct SQL
  const handleInitializeDatabase = async () => {
    try {
      showNotification("info", "Initializing database...")

      // Always try to initialize the database, regardless of demo mode
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase credentials")
      }

      // Call the API endpoint to initialize the database
      const response = await fetch("/api/init-supabase-tables", {
        method: "POST",
      })

      const responseText = await response.text()
      let responseData

      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response as JSON:", responseText)
        throw new Error("Invalid response from server: " + responseText.substring(0, 100))
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to initialize database")
      }

      // Also initialize the documents table with our updated endpoint
      try {
        const docsResponse = await fetch("/api/init-documents-table", {
          method: "POST",
        })

        if (!docsResponse.ok) {
          const errorData = await docsResponse.json()
          console.warn("Warning: Failed to initialize documents table:", errorData.message)
          // Continue even if this fails
        } else {
          const docsData = await docsResponse.json()
          console.log("Documents table initialization:", docsData.message)
        }
      } catch (docError) {
        console.warn("Warning: Error initializing documents table:", docError)
        // Continue even if this fails
      }

      showNotification("success", responseData.message || "Database initialized successfully!")

      // Set demo mode to false since we've successfully initialized the database
      setDemoMode(false)

      // Refresh the data after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("Error initializing database:", error)
      setDbError(error instanceof Error ? error.message : "Unknown error")
      showNotification(
        "error",
        "An error occurred while initializing the database: " +
          (error instanceof Error ? error.message : String(error)),
      )
      setDemoMode(true)
    }
  }

  // Filter documents by project
  const getFilteredDocuments = () => documents.filter((doc) => doc.project === selectedProject)

  // Fetch documents directly from Supabase storage bucket by project ID
  const fetchProjectDocumentsFromStorage = async (projectId: string) => {
    try {
      setLoading(true)

      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase credentials")
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // List files in the project folder within the storage bucket
      const { data: files, error } = await supabase.storage.from("project-documents").list(projectId)

      if (error) {
        console.error("Error fetching files from storage:", error)
        throw error
      }

      if (!files || files.length === 0) {
        return []
      }

      // Map storage files to document format
      const storageDocuments: Document[] = await Promise.all(
        files.map(async (file) => {
          // Get public URL for the file
          const { data: publicUrlData } = supabase.storage
            .from("project-documents")
            .getPublicUrl(`${projectId}/${file.name}`)

          const url = publicUrlData?.publicUrl || ""

          // Extract file extension for type
          const fileExtension = file.name.split(".").pop()?.toUpperCase() || "FILE"

          return {
            id: `storage-${file.id || Date.now()}`,
            name: file.name,
            type: fileExtension,
            size: formatFileSize(file.metadata?.size || 0),
            date: new Date(file.created_at || Date.now()).toLocaleDateString(),
            url: url,
            project: selectedProject,
          }
        }),
      )

      return storageDocuments
    } catch (error) {
      console.error("Error in fetchProjectDocumentsFromStorage:", error)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check storage for documents
  const checkStorageForDocuments = (supabase, projectId) => {
    // List files in the project folder
    supabase.storage
      .from("project-documents")
      .list(projectId)
      .then(({ data: files, error }) => {
        if (error) {
          throw error
        }

        if (!files || files.length === 0) {
          return showNotification("info", "No documents found in storage for this project")
        }

        // Map files to document format with direct public URLs
        const docs = files.map((file) => {
          const { data } = supabase.storage.from("project-documents").getPublicUrl(`${projectId}/${file.name}`)

          const publicUrl = data?.publicUrl || ""

          return {
            id: `storage-${file.id || Date.now()}`,
            name: file.name,
            type: file.name.split(".").pop()?.toUpperCase() || "FILE",
            size: formatFileSize(file.metadata?.size || 0),
            date: new Date(file.created_at || Date.now()).toLocaleDateString(),
            url: publicUrl,
            project: selectedProject,
          }
        })

        setStorageDocuments(docs)
        showNotification("success", `Found ${docs.length} document(s) in Supabase storage`)
      })
      .catch((error) => {
        console.error("Error fetching from storage:", error)
        showNotification("error", "Failed to fetch documents from storage")
      })
  }

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

    try {
      setLoading(true)

      // Get the project ID from the selected project
      const project = projectsData.find((p) => p.name === selectedProject)
      const projectId = project?.id || "unknown"

      // Create form data for the API request
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("projectId", projectId)
      formData.append("projectName", selectedProject)
      // Add an empty description to ensure the field exists
      formData.append("description", "")

      // Send the file to our API endpoint
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)

        // If we're in demo mode, continue with mock data
        if (demoMode) {
          const fileExtension = selectedFile.name.split(".").pop()?.toUpperCase() || "FILE"
          const newDocument = {
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

          setDocuments([newDocument, ...documents])
          showNotification("success", "Document uploaded successfully (Demo Mode)")

          // Reset form after successful upload
          setSelectedFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
          return
        }

        // If the error is related to missing columns or tables, try to initialize the table
        if (
          errorText.includes("column") ||
          errorText.includes("schema") ||
          errorText.includes("relation") ||
          errorText.includes("table") ||
          errorText.includes("function") ||
          errorText.includes("procedure")
        ) {
          try {
            showNotification("info", "Database schema issue detected. Attempting to initialize tables...")

            // Try to initialize the documents table
            const initResponse = await fetch("/api/init-documents-table", {
              method: "POST",
            })

            if (initResponse.ok) {
              const initData = await initResponse.json()
              showNotification("info", initData.message || "Database schema updated. Retrying upload...")

              // Retry the upload after initializing the table
              const retryResponse = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
              })

              if (retryResponse.ok) {
                const retryResult = await retryResponse.json()

                // Create a new document object from the response
                const newDocument = {
                  id: retryResult.document.id,
                  name: selectedFile.name,
                  type: selectedFile.name.split(".").pop()?.toUpperCase() || "FILE",
                  size: formatFileSize(selectedFile.size),
                  date: new Date().toLocaleDateString(),
                  url: retryResult.document.file_url,
                  project: selectedProject,
                }

                // Add the new document to the documents array
                setDocuments([newDocument, ...documents])
                showNotification("success", "Document uploaded successfully after schema update")

                // Reset form after successful upload
                setSelectedFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
                return
              } else {
                // If retry fails, fall back to demo mode
                throw new Error("Upload retry failed after schema initialization")
              }
            } else {
              // If initialization fails, fall back to demo mode
              const errorData = await initResponse.json()
              throw new Error(`Database initialization failed: ${errorData.message || "Unknown error"}`)
            }
          } catch (initError) {
            console.error("Error initializing documents table:", initError)
            showNotification("warning", "Could not initialize database schema. Using demo mode instead.")

            // Fall back to demo mode
            const fileExtension = selectedFile.name.split(".").pop()?.toUpperCase() || "FILE"
            const newDocument = {
              id: `demo-${Date.now()}`,
              name: selectedFile.name,
              type: fileExtension,
              size: formatFileSize(selectedFile.size),
              date: new Date().toLocaleDateString(),
              url:
                fileExtension === "JPG" ||
                fileExtension === "PNG" ||
                fileExtension === "JPEG" ||
                fileExtension === "GIF"
                  ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg"
                  : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
              project: selectedProject,
            }

            setDocuments([newDocument, ...documents])
            setSelectedFile(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
            return
          }
        }

        throw new Error(`Upload failed with status ${response.status}: ${errorText.substring(0, 100)}`)
      }

      const result = await response.json()

      // Create a new document object from the response
      const newDocument = {
        id: result.document.id,
        name: selectedFile.name,
        type: selectedFile.name.split(".").pop()?.toUpperCase() || "FILE",
        size: formatFileSize(selectedFile.size),
        date: new Date().toLocaleDateString(),
        url: result.document.file_url,
        project: selectedProject,
      }

      // Add the new document to the documents array
      setDocuments([newDocument, ...documents])
      showNotification("success", "Document uploaded successfully")

      // Dispatch custom event to notify other components about the document update
      const event = new CustomEvent("documentUpdate", {
        detail: [newDocument, ...documents],
      })
      window.dispatchEvent(event)

      // Reset form after successful upload
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to upload document")

      // If there's an error, switch to demo mode for this upload
      if (!demoMode) {
        const fileExtension = selectedFile.name.split(".").pop()?.toUpperCase() || "FILE"
        const newDocument = {
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

        setDocuments([newDocument, ...documents])
        showNotification("info", "Added document in demo mode due to database error")

        // Reset form after upload
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Update filtered documents when selected project changes
  useEffect(() => {
    console.log("Selected project changed to:", selectedProject)
    console.log("Available documents:", documents)
    const filtered = documents.filter((doc) => doc.project === selectedProject)
    console.log("Filtered documents:", filtered)
  }, [selectedProject, documents])

  // Fetch documents from storage when selected project changes
  useEffect(() => {
    const getProjectIdByName = (projectName: string) => {
      // Special case for Al Ain Oasis Visitor Center
      if (projectName === "Al Ain Oasis Visitor Center") {
        return "fc89f369-c325-4475-a048-6420e9c08154"
      }

      // For other projects, try to find the ID in projectsData
      const project = projectsData.find((p) => p.name === projectName)
      return project?.id || ""
    }

    const projectId = getProjectIdByName(selectedProject)

    if (projectId) {
      fetchProjectDocumentsFromStorage(projectId)
        .then((docs) => {
          setStorageDocuments(docs)
          console.log(`Fetched ${docs.length} documents from storage for project ${selectedProject}`)
        })
        .catch((error) => {
          console.error("Failed to fetch documents from storage:", error)
          setStorageDocuments([])
        })
    } else {
      setStorageDocuments([])
    }
  }, [selectedProject, projectsData])

  // Combine database documents and storage documents
  const dbDocuments = getFilteredDocuments()
  const filteredDocuments = [...dbDocuments, ...storageDocuments]

  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState<Partial<Project>>({})

  const handleSaveProject = async (project: Project) => {
    try {
      // In a real implementation, you would call an API to update the project
      // For demo purposes, we'll just update the local state
      const updatedProjects = projectsData.map((p) => (p.id === project.id ? { ...p, ...editedProject } : p))
      setProjectsData(updatedProjects as Project[])
      setIsEditing(false)
      showNotification("success", "Project details updated successfully")
    } catch (error) {
      console.error("Error updating project:", error)
      showNotification("error", "Failed to update project details")
    }
  }

  // Add PDF loading effect
  useEffect(() => {
    if (previewDocument && previewDocument.type === "PDF") {
      const loadingMessage = document.getElementById("pdf-loading-message")
      if (loadingMessage) {
        loadingMessage.classList.remove("opacity-0")
        loadingMessage.classList.add("opacity-100")

        // Hide loading message after 3 seconds
        const timer = setTimeout(() => {
          loadingMessage.classList.remove("opacity-100")
          loadingMessage.classList.add("opacity-0")
        }, 3000)

        return () => clearTimeout(timer)
      }
    }
  }, [previewDocument])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10"
      onDragOver={(e) => {
        // Prevent default to allow drop
        e.preventDefault()
        // Add visual feedback for drag over if needed
        if (!isDragging) setIsDragging(true)
      }}
      onDragLeave={() => {
        // Reset drag state when leaving the drop zone
        if (isDragging) setIsDragging(false)
      }}
      onDrop={async (e) => {
        // Prevent default browser behavior
        e.preventDefault()
        setIsDragging(false)

        // Check if files were dropped
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0]

          // Check file type
          const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/xml",
            "image/jpeg",
            "image/png",
          ]
          if (!allowedTypes.includes(file.type)) {
            showNotification("error", "Unsupported file type. Please upload PDF, DOCX, XML, JPEG, or PNG files.")
            return
          }

          // Set the file for upload
          setSelectedFile(file)

          // Auto-upload if in dashboard view
          if (activeTab === "dashboard") {
            try {
              setLoading(true)

              // In demo mode, simulate a successful upload
              const fileExtension = file.name.split(".").pop()?.toUpperCase() || "FILE"
              const newDocument = {
                id: `demo-${Date.now()}`,
                name: file.name,
                type: fileExtension,
                size: formatFileSize(file.size),
                date: new Date().toLocaleDateString(),
                url:
                  fileExtension === "JPG" ||
                  fileExtension === "PNG" ||
                  fileExtension === "JPEG" ||
                  fileExtension === "GIF"
                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg"
                    : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
                project: selectedProject || "Al Ain",
              }

              // Add to documents array
              setDocuments([newDocument, ...documents])
              showNotification("success", "Document uploaded successfully (Demo Mode)")

              // Reset selected file
              setSelectedFile(null)
            } catch (error) {
              console.error("Error uploading document:", error)
              showNotification("error", error instanceof Error ? error.message : "Failed to upload document")
            } finally {
              setLoading(false)
            }
          }
        }
      }}
    >
      {/* Drag overlay indicator */}
      {isDragging && (
        <div className="fixed inset-0 bg-[#1B1464]/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <Upload className="h-16 w-16 text-[#1B1464] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1B1464] mb-2">Drop to Upload Document</h3>
            <p className="text-gray-600">Files will be uploaded to the Al Ain project</p>
          </div>
        </div>
      )}

      <TopNav />
      {demoMode && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertTitle className="text-yellow-800 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Demo Mode Active
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            <p>The application is running in demo mode with sample data. Database connection failed.</p>
            <p className="mt-1 text-sm">
              Possible reasons:
              {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
                <span className="block">• Missing NEXT_PUBLIC_SUPABASE_URL environment variable</span>
              )}
              {!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                <span className="block">• Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable</span>
              )}
              <span className="block">• Database tables may not be initialized</span>
              <span className="block">• Connection error to Supabase</span>
            </p>
            <Button
              onClick={handleInitializeDatabase}
              className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
              size="sm"
            >
              Initialize Database
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
                <Shield className="h-6 w-6" /> Summary Dashboard
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
                <div className="flex flex-nowrap overflow-x-auto gap-6 pb-4">
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
                          <p className="text-sm font-medium text-gray-500">Contractors</p>
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
                          <p className="text-sm font-medium text-gray-500">Projects Managers</p>
                          <p className="text-3xl font-bold">24</p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Edit className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-red-600 flex items-center">
                        <span>5 New added </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cities</p>
                          <p className="text-3xl font-bold">3</p>
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
                                <div className="relative">
                                  <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                                    <Image
                                      src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"}/${(index % 10) + 1}.jpg`}
                                      alt={user.name}
                                      width={32}
                                      height={32}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  {user.status === "Active" && (
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white">
                                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                                    </span>
                                  )}
                                  {user.status === "Away" && (
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-yellow-500 ring-2 ring-white"></span>
                                  )}
                                  {user.status === "Inactive" && (
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white"></span>
                                  )}
                                </div>
                                <span>{user.name}</span>
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
                                  }`}
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
                    <Select value={selectedProject} onValueChange={(value) => setSelectedProject(value)}>
                      <SelectTrigger className="w-[200px]">
                        <div className="flex items-center">
                          <ListFilter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Select project" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "قسم موسيقى شرطة أبوظبي",
                          "إدارة التأهيل الشرطي - الفوعة",
                          "مركز شرطة هيلي",
                          "ميدان الشرطة بدع بنت سعود",
                          "متحف شرطة المربعة",
                          "مركز شرطة المربعة",
                          "مديرية شرطة العين",
                          "فرع النقل والمشاغل",
                          "نادي ضباط الشرطة",
                          "مركز شرطة زاخر",
                          "فلل فلج هزاع",
                          "قسم التفتيش الأمني K9",
                          "الضبط المروري والمراسم",
                          "ساحة حجز المركبات فلج هزاع",
                          "إدارة المرور والترخيص",
                          "قسم الدوريات الخاصة",
                          "إدارة الدوريات الخاصة",
                          "المعهد المروري",
                          "سكن أفراد المرور",
                          "مركز شرطة الساد",
                        ].map((projectName) => (
                          <SelectItem key={projectName} value={projectName}>
                            {projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          .map((project) => {
                            const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                              const { name, value } = e.target
                              setEditedProject((prev) => ({ ...prev, [name]: value }))
                            }

                            return (
                              <div key={project.id} className="space-y-4">
                                {isEditing ? (
                                  <>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-sm text-gray-500">Project ID</p>
                                        <p className="font-medium">{project.id}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <Select
                                          value={editedProject.status || project.status}
                                          onValueChange={(value) =>
                                            setEditedProject((prev) => ({ ...prev, status: value }))
                                          }
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Delayed">Delayed</SelectItem>
                                            <SelectItem value="On Hold">On Hold</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">Project Name</p>
                                      <Input
                                        name="name"
                                        value={editedProject.name || project.name}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                      />
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">Project Manager</p>
                                      <Input
                                        name="manager"
                                        value={editedProject.manager || project.manager}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-sm text-gray-500">Start Date</p>
                                        <Input
                                          type="date"
                                          name="startDate"
                                          value={editedProject.startDate || project.startDate}
                                          onChange={handleInputChange}
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">End Date</p>
                                        <Input
                                          type="date"
                                          name="endDate"
                                          value={editedProject.endDate || project.endDate}
                                          onChange={handleInputChange}
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">Budget</p>
                                      <Input
                                        name="amount"
                                        value={editedProject.amount || project.amount}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                      />
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">Progress (%)</p>
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        name="progress"
                                        value={editedProject.progress || project.progress}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                      />
                                      {renderProgressBar(Number(editedProject.progress || project.progress))}
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">Time Remaining</p>
                                      <Input
                                        name="due"
                                        value={editedProject.due || project.due}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                      />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleSaveProject(project)}
                                        className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                                      >
                                        Save Changes
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
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

                                    <div className="flex justify-end pt-2">
                                      <Button
                                        onClick={() => {
                                          setIsEditing(true)
                                          setEditedProject(project)
                                        }}
                                        className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                                      >
                                        <Edit className="h-4 w-4 mr-2" /> Edit Project
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )
                          })}
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
                            <p className="text-xs text-gray-500 mb-1">
                              Files will be stored in the "project-documents" bucket
                            </p>
                            <p className="text-xs text-gray-500 mb-3">Organized by project name and ID</p>
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
                            <Button
                              className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                              onClick={handleUpload}
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  Uploading to Storage...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" /> Save to Documents
                                </>
                              )}
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
                              <p className="text-gray-500 mb-2">
                                {selectedProject === "Al Ain Oasis Visitor Center"
                                  ? "No documents found for Al Ain Oasis Visitor Center (ID: fc89f369-c325-4475-a048-6420e9c08154)."
                                  : `No documents found for ${selectedProject}.`}
                              </p>
                              <p className="text-sm text-blue-600 mb-4">
                                Documents might be stored in a different location or using a different naming
                                convention.
                              </p>
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
                                              className="h-8 w-8"
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
                <h2 className="text-xl font-bold text-[#1B1464]">System Settings</h2>

                <Card className="bg-white shadow-md">
                  <CardHeader>
                    <CardTitle>Database Configuration</CardTitle>
                    <CardDescription>Manage database connections and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dbInitialized ? (
                      <Alert className="bg-green-50 border-green-500">
                        <CheckCircle2 className="h-4 w-4 text-green-700" />
                        <AlertTitle className="text-green-700">Database Initialized</AlertTitle>
                        <AlertDescription className="text-green-600">
                          The Nile database has been successfully initialized.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-yellow-50 border-yellow-500">
                        <AlertCircle className="h-4 w-4 text-yellow-700" />
                        <AlertTitle className="text-yellow-700">Database Not Initialized</AlertTitle>
                        <AlertDescription className="text-yellow-600">
                          The Nile database has not been initialized. Please initialize to enable database features.
                        </AlertDescription>
                      </Alert>
                    )}

                    {dbError && (
                      <Alert className="bg-red-50 border-red-500">
                        <AlertCircle className="h-4 w-4 text-red-700" />
                        <AlertTitle className="text-red-700">Database Error</AlertTitle>
                        <AlertDescription className="text-red-600">{dbError}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                      onClick={handleInitializeDatabase}
                      disabled={dbInitialized}
                    >
                      Initialize Database
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-md">
                  <CardHeader>
                    <CardTitle>User Interface Settings</CardTitle>
                    <CardDescription>Customize the look and feel of the application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="System" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h2 className="text-xl font-bold text-[#1B1464]">Analytics Dashboard</h2>
                <p>Coming Soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] overflow-hidden">
            <div className="p-4 bg-[#1B1464] text-white flex justify-between items-center">
              <h2 className="font-semibold">Document Preview</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewDocument(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 h-[calc(80vh-64px)] overflow-auto">
              {previewDocument && (
                <>
                  {previewDocument.type === "PDF" ? (
                    // PDF Viewer
                    <div className="w-full h-full relative">
                      <iframe
                        src={`${previewDocument.url}#toolbar=1&navpanes=1&view=FitH`}
                        width="100%"
                        height="100%"
                        className="border rounded"
                        title="PDF Preview"
                        type="application/pdf"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          console.error("PDF failed to load:", e)
                          // Show fallback message when iframe fails to load
                          const container = e.currentTarget.parentElement
                          if (container) {
                            const fallback = document.createElement("div")
                            fallback.className = "bg-white p-4 rounded shadow-lg text-center"
                            fallback.innerHTML = `
        <p class="text-red-600 mb-2">Unable to display PDF directly due to browser security restrictions.</p>
        <p class="mb-4">Please use the download button below to view the document.</p>
        <a href="${previewDocument.url}" target="_blank" rel="noopener noreferrer" 
           class="px-4 py-2 bg-[#1B1464] text-white rounded hover:bg-[#1B1464]/90">
          Open PDF in new tab
        </a>
      `
                            container.appendChild(fallback)
                          }
                        }}
                      ></iframe>
                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={() => window.open(previewDocument.url, "_blank")}
                          className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                        >
                          <Download className="h-4 w-4 mr-2" /> Download PDF
                        </Button>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="bg-white p-4 rounded shadow-lg opacity-0 transition-opacity duration-300"
                          id="pdf-loading-message"
                        >
                          Loading PDF...
                        </div>
                      </div>
                      <noscript>
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
                          <div className="bg-white p-4 rounded shadow-lg">
                            Your browser does not support embedded PDFs.
                            <a
                              href={previewDocument.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline ml-1"
                            >
                              Open PDF in new tab
                            </a>
                          </div>
                        </div>
                      </noscript>
                    </div>
                  ) : previewDocument.type === "JPG" ||
                    previewDocument.type === "JPEG" ||
                    previewDocument.type === "PNG" ||
                    previewDocument.type === "GIF" ? (
                    // Image Viewer
                    <div className="flex flex-col h-full">
                      <div className="bg-gray-100 p-2 mb-4 rounded flex justify-between items-center">
                        <span className="text-sm font-medium">{previewDocument.name}</span>
                        <Button size="sm" variant="outline" onClick={() => window.open(previewDocument.url, "_blank")}>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-center bg-gray-50 rounded h-full">
                        <img
                          src={previewDocument.url || "/placeholder.svg"}
                          alt={previewDocument.name}
                          className="max-w-full max-h-[calc(80vh-120px)] object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-image-7eFnEXXXXXXXXXXXXXXXXXXXXXXXXX.png"
                            e.currentTarget.alt = "Failed to load image"
                          }}
                        />
                      </div>
                    </div>
                  ) : previewDocument.type === "DOCX" ||
                    previewDocument.type === "DOC" ||
                    previewDocument.type === "XLSX" ||
                    previewDocument.type === "XLS" ? (
                    // Document Viewer (with download option since browsers can't display these directly)
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-center max-w-md">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">{previewDocument.name}</h3>
                        <p className="text-gray-500 mb-6">
                          This document type ({previewDocument.type}) cannot be previewed directly in the browser.
                        </p>
                        <Button
                          onClick={() => window.open(previewDocument.url, "_blank")}
                          className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                        >
                          <Download className="h-4 w-4 mr-2" /> Download Document
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Fallback for other file types
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-center max-w-md">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">{previewDocument.name}</h3>
                        <p className="text-gray-500 mb-6">
                          Preview not available for this file type ({previewDocument.type}).
                        </p>
                        <Button
                          onClick={() => window.open(previewDocument.url, "_blank")}
                          className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                        >
                          <Download className="h-4 w-4 mr-2" /> Download File
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
