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
  documents,
  isLoading = false,
  emptyMessage = "No documents found",
  projectId,
  projectName,
  titleProp = "Documents",
  descriptionProp = "Manage project documents",
  onDelete,
  refreshInterval = 0, // 0 means no auto-refresh
}: DocumentsListProps) {
  const [internalDocuments, setInternalDocuments] = useState<Document[]>(documents || [])
  const [loading, setLoading] = useState(isLoading)
  const [error, setError] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/nile/documents", {
        cache: "no-store",
        next: { revalidate: 0 },
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
          url: doc.file_path,
          createdAt: doc.created_at,
          name: doc.name,
          type: doc.type,
          size: formatFileSize(doc.size),
          date: new Date(doc.created_at).toLocaleDateString(),
          project: doc.project_name,
        }))

        setInternalDocuments(formattedDocs)
      } else {
        setInternalDocuments([])
      }
    } catch (err) {
      console.error("Error fetching documents:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch documents")
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
      setInternalDocuments(internalDocuments.filter((doc) => doc.id !== id))
    } catch (err) {
      console.error("Error deleting document:", err)
      setError(err instanceof Error ? err.message : "Failed to delete document")
    }
  }

  // Fetch documents on mount and when refreshInterval changes
  useEffect(() => {
    if (!documents) {
      fetchDocuments()
    }

    // Set up auto-refresh if refreshInterval is provided
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchDocuments, refreshInterval)
      return () => clearInterval(intervalId)
    }
  }, [projectId, projectName, refreshInterval, documents])

  // Listen for document updates from other components
  useEffect(() => {
    const handleDocumentUpdate = (event: CustomEvent) => {
      if (event.detail) {
        // Filter by project if projectId or projectName is provided
        let updatedDocs = event.detail

        if (projectId) {
          updatedDocs = updatedDocs.filter((doc) => doc.project_id === projectId)
        } else if (projectName) {
          updatedDocs = updatedDocs.filter((doc) => doc.project_name === projectName || doc.project === projectName)
        }

        setInternalDocuments(updatedDocs)
      }
    }

    window.addEventListener("documentUpdate", handleDocumentUpdate as EventListener)
    return () => window.removeEventListener("documentUpdate", handleDocumentUpdate as EventListener)
  }, [projectId, projectName])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!documents || documents.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div key={doc.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 truncate">{doc.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
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

// Add this default export to fix the missing export issue
export default DocumentsList
