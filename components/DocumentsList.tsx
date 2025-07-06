"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase" // Import the updated Database type

// Update Document interface to match project_documents table
export interface Document {
  id: string
  project_name: string
  file_name: string
  file_url: string
  uploaded_at: string
  // Optional fields for display purposes, derived or not stored in DB
  type?: string
  size?: string
  date?: string
  project?: string // Alias for project_name for UI consistency
}

interface DocumentsListProps {
  documents?: Document[] // Make initialDocuments optional
  isLoading?: boolean
  emptyMessage?: string
  projectId?: string // This is likely project_name now
  projectName?: string // This is the primary identifier for filtering
  titleProp?: string
  descriptionProp?: string
  onDelete?: (id: string) => Promise<void>
  refreshInterval?: number // in milliseconds
  refreshTrigger?: number // Added to manually trigger refresh
}

export function DocumentsList({
  documents: initialDocuments,
  isLoading = false,
  emptyMessage = "No documents found",
  projectId, // Keep for backward compatibility if needed, but prefer projectName
  projectName, // Use this for filtering
  titleProp = "Documents",
  descriptionProp = "Manage project documents",
  onDelete,
  refreshInterval = 0,
  refreshTrigger = 0, // Use this to trigger re-fetch
}: DocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments || [])
  const [loading, setLoading] = useState(isLoading)
  const [error, setError] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  const fetchDocuments = async () => {
    // Only fetch if initialDocuments are not provided, or if a refresh is triggered
    if (!initialDocuments || refreshTrigger > 0) {
      try {
        setLoading(true)
        setError(null)

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Missing Supabase environment variables for DocumentsList")
        }

        const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

        let query = supabase.from("project_documents").select("*").order("uploaded_at", { ascending: false })

        // Filter by project_name if provided
        const currentProjectName = projectName || projectId // Use projectName first, then projectId as fallback
        if (currentProjectName) {
          query = query.eq("project_name", currentProjectName)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
          throw new Error(`Failed to fetch documents: ${fetchError.message}`)
        }

        if (data && Array.isArray(data)) {
          const formattedDocs: Document[] = data.map((doc) => ({
            id: doc.id,
            project_name: doc.project_name,
            file_name: doc.file_name,
            file_url: doc.file_url,
            uploaded_at: doc.uploaded_at,
            type: doc.file_name.split(".").pop()?.toUpperCase() || "FILE", // Derive type
            size: formatFileSize(0), // Size is not in new schema, set to 0 or fetch from storage if needed
            date: new Date(doc.uploaded_at).toLocaleDateString(), // Use uploaded_at
            project: doc.project_name, // Alias for UI
          }))
          setDocuments(formattedDocs)
        } else {
          setDocuments([])
        }
      } catch (err) {
        console.error("Error fetching documents in DocumentsList:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch documents")
      } finally {
        setLoading(false)
      }
    } else {
      // If initialDocuments are provided and no refresh trigger, just use them
      setDocuments(initialDocuments)
      setLoading(false)
    }
  }

  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document)
  }

  const handleDownloadDocument = (document: Document) => {
    window.open(document.file_url, "_blank")
  }

  const handleDeleteDocument = async (id: string) => {
    if (!onDelete) return

    try {
      await onDelete(id)
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (err) {
      console.error("Error deleting document:", err)
      setError(err instanceof Error ? err.message : "Failed to delete document")
    }
  }

  // Fetch documents on mount and when refreshInterval or refreshTrigger changes
  useEffect(() => {
    fetchDocuments()

    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchDocuments, refreshInterval)
      return () => clearInterval(intervalId)
    }
  }, [projectName, projectId, refreshInterval, refreshTrigger]) // Added refreshTrigger to dependency array

  // Listen for document updates from other components
  useEffect(() => {
    const handleDocumentUpdate = (event: CustomEvent) => {
      if (event.detail) {
        let updatedDocs = event.detail

        const currentProjectName = projectName || projectId
        if (currentProjectName) {
          updatedDocs = updatedDocs.filter(
            (doc: any) => doc.project_name === currentProjectName || doc.project === currentProjectName,
          )
        }

        setDocuments(updatedDocs)
      }
    }

    window.addEventListener("documentUpdate", handleDocumentUpdate as EventListener)
    return () => window.removeEventListener("documentUpdate", handleDocumentUpdate as EventListener)
  }, [projectName, projectId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 px-4 bg-slate-900/50 rounded-lg border border-slate-800">
        <p className="text-center text-gray-400 mb-6">{emptyMessage}</p>

        <div className="w-full max-w-xs flex flex-col gap-3">
          <h3 className="text-cyan-400 text-sm font-medium mb-2">Document Categories</h3>

          <button className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 text-white py-3 px-4 rounded-md transition-all border border-slate-700 hover:border-cyan-700">
            <div className="w-8 h-8 flex items-center justify-center bg-cyan-900/50 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-cyan-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span className="font-medium">Summary</span>
            <span className="ml-auto text-xs text-gray-400">0</span>
          </button>

          <button className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 text-white py-3 px-4 rounded-md transition-all border border-slate-700 hover:border-red-700">
            <div className="w-8 h-8 flex items-center justify-center bg-red-900/50 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M9 15L12 12 15 15"></path>
                <path d="M12 12V18"></path>
              </svg>
            </div>
            <span className="font-medium">PDF</span>
            <span className="ml-auto text-xs text-gray-400">0</span>
          </button>

          <button className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 text-white py-3 px-4 rounded-md transition-all border border-slate-700 hover:border-blue-700">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-900/50 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span className="font-medium">Document</span>
            <span className="ml-auto text-xs text-gray-400">0</span>
          </button>

          <button className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 text-white py-3 px-4 rounded-md transition-all border border-slate-700 hover:border-green-700">
            <div className="w-8 h-8 flex items-center justify-center bg-green-900/50 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <span className="font-medium">Presentation</span>
            <span className="ml-auto text-xs text-gray-400">0</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div key={doc.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 truncate">{doc.file_name}</h3> {/* Use file_name */}
            {/* Description is no longer in DB, so remove this line or make it optional if derived */}
            {/* {doc.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>} */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {doc.date || new Date(doc.uploaded_at).toLocaleDateString()}
              </span>{" "}
              {/* Use uploaded_at */}
              <Link
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Document
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DocumentsList
