"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Download, Eye, FileText, Trash2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Document {
  id: string
  name: string
  type: string
  size: string
  date: string
  url: string
  project_name: string
  file_name: string
  file_url: string
  uploaded_at: string
}

interface Project {
  id: string
  name: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("Al Ain")
  const [alfouaFiles, setAlfouaFiles] = useState<Array<{ name: string; url: string; size: number; folder?: string }>>(
    [],
  )
  const [isLoadingAlfoua, setIsLoadingAlfoua] = useState(false)

  const searchParams = useSearchParams()
  const projectFromUrl = searchParams.get("project") || selectedProject

  // Fetch documents on component mount
  useEffect(() => {
    fetchProjects()
    fetchDocuments()
    fetchAlfouaFiles() // Add this line

    // Set up real-time subscription
    const subscription = supabase
      .channel("documents-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
        },
        (payload) => {
          console.log("Change received!", payload)
          fetchDocuments()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [projectFromUrl])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("id, name").order("name")

      if (error) throw error

      if (data) {
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      showNotification("error", "Failed to fetch projects")
    }
  }

  // Fetch documents from Supabase
  const fetchDocuments = async () => {
    try {
      setIsLoading(true)

      // Fetch documents from Supabase
      const query = supabase.from("documents").select("*").order("created_at", { ascending: false })

      // Filter by project if one is selected
      if (projectFromUrl && projectFromUrl !== "All Projects") {
        query.eq("project_name", projectFromUrl)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      if (data) {
        // Format documents
        const formattedDocs = data.map((doc) => ({
          id: doc.id,
          name: doc.file_name,
          type: doc.file_name.split(".").pop()?.toUpperCase() || "FILE",
          size: formatFileSize(doc.size || 0),
          date: new Date(doc.created_at).toLocaleDateString(),
          url: doc.file_url,
          project_name: doc.project_name,
          file_name: doc.file_name,
          file_url: doc.file_url,
          uploaded_at: doc.created_at,
        }))

        setDocuments(formattedDocs)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      showNotification("error", "Failed to fetch documents")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch files from multiple folders in Supabase storage
  const fetchAlfouaFiles = async () => {
    let allFiles: Array<{ name: string; url: string; size: number; folder?: string }> = []

    try {
      setIsLoadingAlfoua(true)
      const foldersToCheck = ["projects/alfoua", "projects/unknown", "unknown", "alfoua"]

      // Check each folder
      for (const folder of foldersToCheck) {
        console.log(`Checking folder: ${folder}`)
        const { data, error } = await supabase.storage.from("project-documents").list(folder)

        if (error) {
          console.error(`Error listing files in ${folder}:`, error)
          continue // Try the next folder
        }

        if (data && data.length > 0) {
          console.log(`Found ${data.length} files in ${folder}`)

          // Get public URLs for each file
          const filesWithUrls = await Promise.all(
            data.map(async (file) => {
              const { data: urlData } = await supabase.storage
                .from("project-documents")
                .getPublicUrl(`${folder}/${file.name}`)

              return {
                name: file.name,
                url: urlData?.publicUrl || "",
                size: file.metadata?.size || 0,
                folder: folder,
              }
            }),
          )

          allFiles = [...allFiles, ...filesWithUrls]
        } else {
          console.log(`No files found in ${folder}`)
        }
      }

      // Try direct access to the known file
      try {
        const { data: urlData } = await supabase.storage
          .from("project-documents")
          .getPublicUrl("projects/unknown/1746519518708_al-ain-palace-museum-gallery-1.a.png")

        if (urlData?.publicUrl) {
          console.log("Direct access to known file successful:", urlData.publicUrl)
          // Add this file if it's not already in the list
          if (!allFiles.some((file) => file.url === urlData.publicUrl)) {
            allFiles.push({
              name: "al-ain-palace-museum-gallery-1.a.png",
              url: urlData.publicUrl,
              size: 0,
              folder: "projects/unknown",
            })
          }
        }
      } catch (directError) {
        console.error("Error accessing known file directly:", directError)
      }

      console.log("Total files found:", allFiles.length)
      setAlfouaFiles(allFiles)
    } catch (error) {
      console.error("Error fetching files:", error)
      showNotification("error", "Failed to fetch files from storage")
    } finally {
      setIsLoadingAlfoua(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  // Show notification
  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      showNotification("error", "Please select a file to upload")
      return
    }

    if (selectedProject === "All Projects") {
      showNotification("error", "Please select a specific project for upload")
      return
    }

    try {
      setUploadProgress(0)

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${selectedFile.name}`
      const filePath = `${selectedProject.toLowerCase().replace(/\s+/g, "-")}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project-documents")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100)
            setUploadProgress(percent)
          },
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL for the uploaded file
      const { data: urlData } = await supabase.storage.from("project-documents").getPublicUrl(filePath)

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL for the uploaded file")
      }

      // Insert document metadata into Supabase
      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert({
          project_name: selectedProject,
          file_name: selectedFile.name,
          file_url: urlData.publicUrl,
          size: selectedFile.size,
          created_at: new Date().toISOString(),
        })
        .select()

      if (documentError) {
        // If metadata insertion fails, delete the uploaded file
        await supabase.storage.from("project-documents").remove([filePath])
        throw documentError
      }

      showNotification("success", "Document uploaded successfully")
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Refresh documents list
      fetchDocuments()
    } catch (error) {
      console.error("Error uploading document:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to upload document")
    } finally {
      setUploadProgress(null)
    }
  }

  // Handle document deletion
  const handleDeleteDocument = async (id: string, filePath: string) => {
    try {
      // Delete from Supabase database
      const { error: deleteError } = await supabase.from("documents").delete().eq("id", id)

      if (deleteError) {
        throw deleteError
      }

      // Extract the path from the URL
      const pathMatch = filePath.match(/project-documents\/(.+)/)
      if (pathMatch && pathMatch[1]) {
        // Delete from Supabase storage
        const { error: storageError } = await supabase.storage.from("project-documents").remove([pathMatch[1]])

        if (storageError) {
          console.error("Error deleting file from storage:", storageError)
        }
      }

      showNotification("success", "Document deleted successfully")

      // Update documents list
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error("Error deleting document:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to delete document")
    }
  }

  // Filter documents based on search term and filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    return matchesSearch && doc.type.toLowerCase() === filter.toLowerCase()
  })

  // Get file type icon
  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "docx":
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "xml":
        return <FileText className="h-5 w-5 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/al-ain" className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Al Ain</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Al Ain Project Documents</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Notification */}
        {notification && (
          <Alert
            className={`mb-4 ${
              notification.type === "success"
                ? "bg-green-50 border-green-500"
                : notification.type === "error"
                  ? "bg-red-50 border-red-500"
                  : "bg-blue-50 border-blue-500"
            }`}
          >
            <AlertTitle
              className={
                notification.type === "success"
                  ? "text-green-800"
                  : notification.type === "error"
                    ? "text-red-800"
                    : "text-blue-800"
              }
            >
              {notification.type === "success" ? "Success" : notification.type === "error" ? "Error" : "Info"}
            </AlertTitle>
            <AlertDescription
              className={
                notification.type === "success"
                  ? "text-green-700"
                  : notification.type === "error"
                    ? "text-red-700"
                    : "text-blue-700"
              }
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Search and filter bar */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-900/30 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href="/al-ain"
              className="flex items-center justify-center px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-full text-cyan-400 hover:bg-slate-600/50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">Documents</option>
                  <option value="xml">XML</option>
                  <option value="jpg">Images</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Project display */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-900/30 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Project:</span>
            <div className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-cyan-400 font-semibold">
              {decodeURIComponent(projectFromUrl)}
            </div>
          </div>
        </div>

        {/* Documents list */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/30">
          <h2 className="text-xl font-bold text-white mb-6">
            {projectFromUrl === "All Projects" ? "All Documents" : `${decodeURIComponent(projectFromUrl)} Documents`}
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-700/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-600/30"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {getFileTypeIcon(doc.type)}
                      <h3 className="font-medium text-lg ml-2 text-white truncate">{doc.name}</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">Uploaded: {doc.date}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">{doc.size}</span>
                      <div className="flex space-x-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-cyan-900/50 text-cyan-400 rounded-md hover:bg-cyan-800/50 transition-colors"
                          title="View Document"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <a
                          href={doc.url}
                          download
                          className="p-1.5 bg-cyan-900/50 text-cyan-400 rounded-md hover:bg-cyan-800/50 transition-colors"
                          title="Download Document"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.url)}
                          className="p-1.5 bg-red-900/50 text-red-400 rounded-md hover:bg-red-800/50 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              {isLoadingAlfoua ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
              ) : alfouaFiles.length > 0 ? (
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
                    <FileText className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Project Files ({alfouaFiles.length})</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {alfouaFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-600/30"
                      >
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            {getFileTypeIcon(file.name.split(".").pop() || "")}
                            <h3 className="font-medium text-lg ml-2 text-white truncate">{file.name}</h3>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">Folder: {file.folder || "Unknown"}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                            <div className="flex space-x-2">
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-cyan-900/50 text-cyan-400 rounded-md hover:bg-cyan-800/50 transition-colors"
                                title="View Document"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                              <a
                                href={file.url}
                                download
                                className="p-1.5 bg-cyan-900/50 text-cyan-400 rounded-md hover:bg-cyan-800/50 transition-colors"
                                title="Download Document"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No documents found</h3>
                  <p className="text-slate-400 mb-3">
                    {searchTerm || filter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : projectFromUrl === "All Projects"
                        ? "No documents available in any project"
                        : `No documents available for ${projectFromUrl}. Upload your first document using the form above.`}
                  </p>
                  <div className="mt-4 p-4 bg-slate-700/30 rounded-lg text-slate-300 text-sm">
                    <p>Debug info: Checked folders "projects/alfoua", "projects/unknown", "unknown", "alfoua"</p>
                    <p className="mt-2">
                      <a
                        href="https://pbqfgjzvclwgxgvuzmul.supabase.co/storage/v1/object/public/project-documents/projects/unknown/1746519518708_al-ain-palace-museum-gallery-1.a.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        Direct link to test file
                      </a>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
