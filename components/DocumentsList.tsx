"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

export interface Document {
  id: string
  title: string
  description: string
  url: string
  createdAt: string
  projectId?: string
  name?: string
  type?: string
  size?: string
  date?: string
  project?: string
}

interface DocumentsListProps {
  documents: Document[]
  isLoading?: boolean
  emptyMessage?: string
  projectId?: string
  projectName?: string
  titleProp?: string
  descriptionProp?: string
  onDelete?: (id: string) => Promise<void>
  refreshInterval?: number // in milliseconds
}

export function DocumentsList({
  documents: initialDocuments,
  isLoading = false,
  emptyMessage = "No documents found",
  projectId,
  projectName,
  titleProp = "Documents",
  descriptionProp = "Manage project documents",
  onDelete,
  refreshInterval = 0, // 0 means no auto-refresh
}: DocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments || [])
  const [loading, setLoading] = useState(isLoading)
  const [error, setError] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  // Fetch documents
  const fetchDocuments = async () => {
    if (!initialDocuments) {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/documents", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch documents: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data && Array.isArray(result.data)) {
          // Filter by project if projectId or projectName is provided
          let filteredDocs = result.data

          if (projectId) {
            filteredDocs = filteredDocs.filter((doc) => doc.project_id === projectId)
          } else if (projectName) {
            filteredDocs = filteredDocs.filter((doc) => doc.project_name === projectName)
          }

          // Format documents
          const formattedDocs = filteredDocs.map((doc) => ({
            id: doc.id,
            title: doc.name,
            description: doc.description || "",
            url: doc.file_url || doc.url,
            createdAt: doc.uploaded_at || doc.created_at,
            name: doc.name,
            type: doc.type,
            size: formatFileSize(doc.size || 0),
            date: new Date(doc.uploaded_at || doc.created_at).toLocaleDateString(),
            project: doc.project_name,
          }))

          setDocuments(formattedDocs)
        } else {
          setDocuments([])
        }
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch documents")
      } finally {
        setLoading(false)
      }
    }
  }

  // Handle document preview
  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document)
  }

  // Handle document download
  const handleDownloadDocument = (document: Document) => {
    window.open(document.url, "_blank")
  }

  // Handle document deletion
  const handleDeleteDocument = async (id: string) => {
    if (!onDelete) return

    try {
      await onDelete(id)
      // Remove the document from the list
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (err) {
      console.error("Error deleting document:", err)
      setError(err instanceof Error ? err.message : "Failed to delete document")
    }
  }

  // Fetch documents on mount and when refreshInterval changes
  useEffect(() => {
    fetchDocuments()

    // Set up auto-refresh if refreshInterval is provided
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchDocuments, refreshInterval)
      return () => clearInterval(intervalId)
    }
  }, [projectId, projectName, refreshInterval, initialDocuments])

  // Listen for document updates from other components
  useEffect(() => {
    const handleDocumentUpdate = (event: CustomEvent) => {
      if (event.detail) {
        // Filter by project if projectId or projectName is provided
        let updatedDocs = event.detail

        if (projectId) {
          updatedDocs = updatedDocs.filter((doc: any) => doc.project_id === projectId)
        } else if (projectName) {
          updatedDocs = updatedDocs.filter(
            (doc: any) => doc.project_name === projectName || doc.project === projectName,
          )
        }

        setDocuments(updatedDocs)
      }
    }

    window.addEventListener("documentUpdate", handleDocumentUpdate as EventListener)
    return () => window.removeEventListener("documentUpdate", handleDocumentUpdate as EventListener)
  }, [projectId, projectName])

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
            <h3 className="font-medium text-lg mb-1 truncate">{doc.title || doc.name}</h3>
            {doc.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{doc.date || new Date(doc.createdAt).toLocaleDateString()}</span>
              <Link
                href={doc.url}
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
