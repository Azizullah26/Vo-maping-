"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Breadcrumb } from "@/components/Breadcrumb"
import { EnhancedPDFViewer } from "@/components/EnhancedPDFViewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowLeft } from "lucide-react"

// Sample document data - replace with your actual data source
const sampleDocuments = [
  {
    id: 1,
    fileName: "Al Ain Master Plan 2024",
    fileUrl: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
    projectName: "Al Ain Urban Development",
    category: "Planning",
    uploadDate: "2024-01-15",
    size: "2.4 MB",
  },
  {
    id: 2,
    fileName: "Police Station Construction Report",
    fileUrl: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
    projectName: "Al Saad Police Center",
    category: "Construction",
    uploadDate: "2024-01-10",
    size: "1.8 MB",
  },
  {
    id: 3,
    fileName: "Infrastructure Assessment",
    fileUrl: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
    projectName: "Al Ain Infrastructure",
    category: "Assessment",
    uploadDate: "2024-01-05",
    size: "3.2 MB",
  },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState("")
  const [folders, setFolders] = useState<string[]>([])
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredDocuments, setFilteredDocuments] = useState(sampleDocuments)

  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams?.get("project") || ""
  const folderId = searchParams?.get("folder") || ""

  const categories = ["All", "Planning", "Construction", "Assessment", "Reports"]

  useEffect(() => {
    let filtered = sampleDocuments

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory)
    }

    setFilteredDocuments(filtered)
  }, [searchTerm, selectedCategory])

  // Initialize navigation history when component mounts
  useEffect(() => {
    try {
      const currentPath = `/al-ain/documents${projectId ? `?project=${projectId}` : ""}${folderId ? `&folder=${folderId}` : ""}`
      setNavigationHistory([currentPath])
      setHistoryIndex(0)
    } catch (err) {
      console.error("Error initializing navigation history:", err)
    }
  }, [])

  // Function to navigate back
  const handleBack = () => {
    if (historyIndex > 0) {
      try {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        const previousPath = navigationHistory[newIndex] || ""

        // Extract parameters from the path
        const urlParams = new URLSearchParams(previousPath.split("?")[1] || "")
        const prevProjectId = urlParams.get("project")
        const prevFolderId = urlParams.get("folder")

        // Update state
        if (prevProjectId !== projectId) {
          // Handle project change
        }

        if (prevFolderId !== folderId) {
          setCurrentFolder(prevFolderId || "")
        }

        // Clear selected document when navigating back
        setSelectedDocument(null)

        // Update URL without triggering a new history entry
        router.push(previousPath, { scroll: false })
      } catch (err) {
        console.error("Error navigating back:", err)
      }
    }
  }

  // Function to navigate forward
  const handleForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      try {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        const nextPath = navigationHistory[newIndex] || ""

        // Extract parameters from the path
        const urlParams = new URLSearchParams(nextPath.split("?")[1] || "")
        const nextProjectId = urlParams.get("project")
        const nextFolderId = urlParams.get("folder")

        // Update state
        if (nextProjectId !== projectId) {
          // Handle project change
        }

        if (nextFolderId !== folderId) {
          setCurrentFolder(nextFolderId || "")
        }

        // Clear selected document when navigating forward
        setSelectedDocument(null)

        // Update URL without triggering a new history entry
        router.push(nextPath, { scroll: false })
      } catch (err) {
        console.error("Error navigating forward:", err)
      }
    }
  }

  // Function to add a new entry to navigation history
  const addToHistory = (path: string) => {
    try {
      // Remove any forward history if we're navigating from a point in history
      const newHistory = navigationHistory.slice(0, historyIndex + 1)
      newHistory.push(path)
      setNavigationHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    } catch (err) {
      console.error("Error adding to history:", err)
    }
  }

  // Function to fetch documents from Supabase
  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if we're in demo mode or if we should use demo data
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.NEXT_PUBLIC_STATIC_MODE === "true"

      if (isDemoMode) {
        console.log("Running in demo mode, using sample data")
        // Provide sample documents data for demo mode
        const demoDocuments = [
          {
            id: "demo-doc-1",
            title: "Project Overview",
            description: "Overview of the Al Ain development projects",
            file_path: "demo/project-overview.pdf",
            url: "https://example.com/demo/project-overview.pdf",
            created_at: new Date().toISOString(),
            project_id: projectId || "demo",
            type: "application/pdf",
          },
          {
            id: "demo-doc-2",
            title: "Technical Specifications",
            description: "Technical details for the Al Ain projects",
            file_path: "demo/technical-specs.pdf",
            url: "https://example.com/demo/technical-specs.pdf",
            created_at: new Date().toISOString(),
            project_id: projectId || "demo",
            type: "application/pdf",
          },
          {
            id: "demo-doc-3",
            title: "Project Timeline",
            description: "Timeline for the Al Ain development",
            file_path: "demo/timeline.pdf",
            url: "https://example.com/demo/timeline.pdf",
            created_at: new Date().toISOString(),
            project_id: projectId || "demo",
            type: "application/pdf",
          },
        ]

        setDocuments(demoDocuments)
        return
      }

      // Check if Supabase environment variables are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase environment variables not found, using demo data")
        throw new Error("Supabase not configured")
      }

      // Get Supabase client with error handling
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("DocumentsPage: Supabase client initialization failed. Check environment variables.")
        throw new Error("Supabase client initialization failed")
      }

      console.log("DocumentsPage: Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log(
        "DocumentsPage: Using Supabase Anon Key (first 5 chars):",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 5) + "...",
      )

      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from("documents")
        .select("count", { count: "exact", head: true })

      if (testError) {
        console.warn("Documents table not accessible:", testError.message)
        console.log("Falling back to demo data due to database error")
        // Use demo data when database is not accessible
        const demoDocuments = [
          {
            id: "demo-doc-1",
            title: "Project Overview",
            description: "Overview of the Al Ain development projects",
            file_path: "demo/project-overview.pdf",
            url: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
            created_at: new Date().toISOString(),
            project_id: projectId || "demo",
            type: "application/pdf",
          },
          {
            id: "demo-doc-2",
            title: "Technical Specifications",
            description: "Technical details for the Al Ain projects",
            file_path: "demo/technical-specs.pdf",
            url: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
            created_at: new Date().toISOString(),
            project_id: projectId || "demo",
            type: "application/pdf",
          },
          {
            id: "demo-doc-3",
            title: "Project Timeline",
            description: "Timeline for the Al Ain development",
            file_path: "demo/timeline.pdf",
            url: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
            created_at: new Date().toISOString(),
            project_id: projectId || "demo",
            type: "application/pdf",
          },
        ]
        setDocuments(demoDocuments)
        return
      }

      // Build the query
      let query = supabase.from("documents").select("*")

      if (projectId) {
        query = query.eq("project_id", projectId)
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      const { data: dbDocuments, error: dbError } = await query.order("created_at", { ascending: false })

      if (dbError) {
        console.error("Error querying documents:", dbError)
        throw new Error(`Query error: ${dbError.message}`)
      }

      // Try to fetch storage files, but don't fail if this doesn't work
      try {
        await fetchStorageFiles()
      } catch (storageError) {
        console.warn("Error fetching storage files:", storageError)
        // Continue execution even if storage files fetch fails
      }

      if (dbDocuments && Array.isArray(dbDocuments) && dbDocuments.length > 0) {
        setDocuments(dbDocuments)
      } else {
        console.log("No documents found in database, using demo data")
        // Use demo data when no documents found
        const fallbackDocuments = [
          {
            id: "fallback-1",
            title: "Project Documentation",
            description: "Al Ain project documentation",
            file_path: "fallback/documentation.pdf",
            url: "https://example.com/fallback/documentation.pdf",
            created_at: new Date().toISOString(),
            project_id: projectId || "fallback",
            type: "application/pdf",
          },
        ]
        setDocuments(fallbackDocuments)
      }
    } catch (err) {
      console.error("Error fetching documents:", err)

      // Always provide fallback data instead of showing error
      const fallbackDocuments = [
        {
          id: "fallback-1",
          title: "Project Documentation",
          description: "Al Ain project documentation (Demo Mode)",
          file_path: "fallback/documentation.pdf",
          url: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
          created_at: new Date().toISOString(),
          project_id: projectId || "fallback",
          type: "application/pdf",
        },
        {
          id: "fallback-2",
          title: "Technical Specifications",
          description: "Technical details and specifications (Demo Mode)",
          file_path: "fallback/technical-specs.pdf",
          url: "https://www.nutrient.io/downloads/nutrient-web-demo.pdf",
          created_at: new Date().toISOString(),
          project_id: projectId || "fallback",
          type: "application/pdf",
        },
      ]

      setDocuments(fallbackDocuments)
      setError(null) // Clear any previous errors

      // Only log warning, don't set error state
      console.warn("Using demo data due to database connection issues")
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch files from Supabase Storage
  const fetchStorageFiles = async () => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error("Supabase client initialization failed")
      }

      // Define the folders to check
      const foldersToCheck = [
        "projects/alfoua",
        "projects/unknown",
        "unknown",
        "alfoua",
        "", // Root folder
      ]

      // If we have a specific folder from the URL, prioritize it
      if (folderId) {
        foldersToCheck.unshift(folderId)
      }

      // Collect all files from all folders
      let allFiles: any[] = []
      const allFolders = new Set<string>()

      for (const folder of foldersToCheck) {
        try {
          const { data: files, error } = await supabase.storage.from("documents").list(folder, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          })

          if (error) {
            console.warn(`Error listing files in folder ${folder}:`, error)
            continue
          }

          if (files && files.length > 0) {
            // Extract subfolder names
            const subfolders = files.filter((item) => item.id === null).map((item) => item.name)
            subfolders.forEach((subfolder) => allFolders.add(`${folder}/${subfolder}`))

            // Process files
            const filesWithUrls = files
              .filter((file) => file.id !== null)
              .map((file) => {
                try {
                  const { data } = supabase.storage.from("documents").getPublicUrl(`${folder}/${file.name}`)

                  return {
                    id: file.id || `file-${file.name}`,
                    title: file.name,
                    description: `File in ${folder}`,
                    file_path: `${folder}/${file.name}`,
                    url: data.publicUrl,
                    created_at: file.created_at || new Date().toISOString(),
                    project_id: projectId || "unknown",
                    size: file.metadata?.size,
                    type: file.metadata?.mimetype,
                  }
                } catch (urlError) {
                  console.warn(`Error getting URL for file ${file.name}:`, urlError)
                  return null
                }
              })
              .filter(Boolean) // Remove any null entries

            allFiles = [...allFiles, ...filesWithUrls]
          }
        } catch (folderError) {
          console.warn(`Error processing folder ${folder}:`, folderError)
          // Continue with next folder
        }
      }

      // Update state with the files and folders
      setFolders(Array.from(allFolders))

      // Merge with existing documents
      setDocuments((prevDocs) => {
        // Create a map of existing documents by file_path
        const existingDocsMap = new Map(prevDocs.map((doc) => [doc.file_path, doc]))

        // Add new files that don't exist in the database
        allFiles.forEach((file) => {
          if (!existingDocsMap.has(file.file_path)) {
            existingDocsMap.set(file.file_path, file)
          }
        })

        return Array.from(existingDocsMap.values())
      })
    } catch (err) {
      console.error("Error fetching storage files:", err)
      // Don't set error state here, as this is a secondary data source
      // Just log the error and continue
    }
  }

  // Function to handle document selection
  const handleDocumentSelect = (document: any) => {
    try {
      setSelectedDocument(document)

      // Add to navigation history when selecting a document
      const newPath = `/al-ain/documents${projectId ? `?project=${projectId}` : ""}${folderId ? `&folder=${folderId}` : ""}&doc=${document.id}`
      addToHistory(newPath)
    } catch (err) {
      console.error("Error selecting document:", err)
    }
  }

  // Function to handle folder navigation
  const handleFolderSelect = (folder: string) => {
    try {
      setCurrentFolder(folder)
      setSelectedDocument(null) // Clear selected document when changing folders

      // Create the new path
      const newPath = `/al-ain/documents?folder=${folder}${projectId ? `&project=${projectId}` : ""}`

      // Add to navigation history
      addToHistory(newPath)

      // Navigate to the new path
      router.push(newPath, { scroll: false })
    } catch (err) {
      console.error("Error selecting folder:", err)
    }
  }

  // Function to handle project navigation
  const handleProjectSelect = (project: string) => {
    try {
      setSelectedDocument(null) // Clear selected document when changing projects

      // Create the new path
      const newPath = `/al-ain/documents?project=${project}${currentFolder ? `&folder=${currentFolder}` : ""}`

      // Add to navigation history
      addToHistory(newPath)

      // Navigate to the new path
      router.push(newPath, { scroll: false })
    } catch (err) {
      console.error("Error selecting project:", err)
    }
  }

  // Function to handle breadcrumb navigation
  const handleBreadcrumbClick = (path: string) => {
    try {
      // Add to navigation history
      addToHistory(path)

      // Navigate to the path
      router.push(path, { scroll: false })

      // Clear selected document when using breadcrumb navigation
      setSelectedDocument(null)
    } catch (err) {
      console.error("Error handling breadcrumb click:", err)
    }
  }

  // Function to handle search
  const handleSearch = (query: string) => {
    try {
      setSearchQuery(query)
      setSearchTerm(query)

      // Only add to history if the search is executed (not on every keystroke)
      if (query.length > 2 || query.length === 0) {
        const newPath = `/al-ain/documents${projectId ? `?project=${projectId}` : ""}${folderId ? `&folder=${folderId}` : ""}&search=${encodeURIComponent(query)}`
        addToHistory(newPath)
      }
    } catch (err) {
      console.error("Error handling search:", err)
    }
  }

  // Function to handle document close
  const handleCloseDocument = () => {
    try {
      setSelectedDocument(null)

      // Create the path without the document
      const newPath = `/al-ain/documents${projectId ? `?project=${projectId}` : ""}${folderId ? `&folder=${folderId}` : ""}`

      // Add to navigation history
      addToHistory(newPath)

      // Navigate to the new path
      router.push(newPath, { scroll: false })
    } catch (err) {
      console.error("Error closing document:", err)
    }
  }

  // Load documents on initial render and when dependencies change
  useEffect(() => {
    fetchDocuments()
  }, [projectId, folderId, searchQuery])

  // Prepare breadcrumb items with safe values
  const breadcrumbItems = [
    { label: "Home", href: "/", onClick: () => handleBreadcrumbClick("/") },
    {
      label: "Al Ain",
      href: "/al-ain",
      onClick: () => handleBreadcrumbClick("/al-ain"),
    },
    {
      label: "Documents",
      href: "/al-ain/documents",
      onClick: () => handleBreadcrumbClick("/al-ain/documents"),
    },
    ...(projectId
      ? [
          {
            label: projectId,
            href: `/al-ain/documents?project=${projectId}`,
            onClick: () => handleBreadcrumbClick(`/al-ain/documents?project=${projectId}`),
          },
        ]
      : []),
    ...(currentFolder
      ? [
          {
            label: currentFolder.split("/").pop() || "",
            href: `/al-ain/documents?folder=${currentFolder}`,
            onClick: () =>
              handleBreadcrumbClick(
                `/al-ain/documents?folder=${currentFolder}${projectId ? `&project=${projectId}` : ""}`,
              ),
          },
        ]
      : []),
    ...(selectedDocument
      ? [
          {
            label: selectedDocument.title || "Document",
            href: "#",
            current: true,
          },
        ]
      : []),
  ]

  if (selectedDocument) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setSelectedDocument(null)} variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documents
            </Button>
          </div>

          <EnhancedPDFViewer
            fileUrl={selectedDocument.url}
            fileName={selectedDocument.title}
            projectName={selectedDocument.project_id}
            category={selectedDocument.type}
            height="80vh"
            showMetadata={true}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header section with background */}
      <div className="relative bg-[#0a192f] overflow-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none z-0"></div>

        {/* Top decorative element */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>

        {/* Navigation controls */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumb
            items={breadcrumbItems.map((item) => ({
              label: item.label || "",
              path: item.href || "#",
            }))}
          />
        </div>

        {/* Project title and details */}
        <div className="mt-8 mb-6 pl-5">
          <h1 className="text-3xl font-bold text-white mb-2">
            {projectId ? `${projectId} Documents` : "Al Ain Project Documents"}
          </h1>
          <div className="flex items-center space-x-4 text-gray-300 flex-wrap">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm">{documents.length} documents</span>
            </div>
            {projectId && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">Project ID: {projectId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content with glass effect */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card
              key={document.id}
              className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 p-4 min-h-[500px] cursor-pointer"
              onClick={() => handleDocumentSelect(document)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-blue-400 mb-2" />
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                    {document.category}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg line-clamp-2">{document.fileName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-white/70 text-sm">Project: {document.projectName}</p>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>{document.uploadDate}</span>
                    <span>{document.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
            <p className="text-white/70">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
