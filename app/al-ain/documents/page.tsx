"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Breadcrumb } from "@/components/Breadcrumb"
import { DocumentsList } from "@/components/DocumentsList"
import { DocumentPreview } from "@/components/DocumentPreview"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState("")
  const [folders, setFolders] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")
  const folderId = searchParams.get("folder")

  // Function to fetch documents from Supabase
  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      // Fetch documents from the database
      let query = supabase.from("documents").select("*")

      if (projectId) {
        query = query.eq("project_id", projectId)
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      const { data: dbDocuments, error: dbError } = await query.order("created_at", { ascending: false })

      if (dbError) throw dbError

      // Fetch files from storage
      await fetchStorageFiles()

      if (dbDocuments && dbDocuments.length > 0) {
        setDocuments(dbDocuments)
      }
    } catch (err) {
      console.error("Error fetching documents:", err)
      setError("Failed to load documents. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch files from Supabase Storage
  const fetchStorageFiles = async () => {
    try {
      const supabase = getSupabaseClient()

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
            })

          allFiles = [...allFiles, ...filesWithUrls]
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
      setError("Failed to load files from storage. Please try again later.")
    }
  }

  // Function to handle document selection
  const handleDocumentSelect = (document: any) => {
    setSelectedDocument(document)
  }

  // Function to handle folder navigation
  const handleFolderSelect = (folder: string) => {
    setCurrentFolder(folder)
    router.push(`/al-ain/documents?folder=${folder}${projectId ? `&project=${projectId}` : ""}`)
  }

  // Function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Load documents on initial render and when dependencies change
  useEffect(() => {
    fetchDocuments()
  }, [projectId, folderId, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header section with background */}
      <div className="relative bg-[#0a192f] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-20"></div>

        {/* Top decorative element */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>

        <div className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Al Ain", href: "/al-ain" },
              { label: "Documents", href: "/al-ain/documents" },
              ...(projectId ? [{ label: projectId, href: `/al-ain/documents?project=${projectId}` }] : []),
              ...(currentFolder
                ? [{ label: currentFolder.split("/").pop() || "", href: `/al-ain/documents?folder=${currentFolder}` }]
                : []),
            ]}
          />

          {/* Project title and details */}
          <div className="mt-8 mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {projectId ? `${projectId} Documents` : "Al Ain Project Documents"}
            </h1>
            <div className="flex items-center space-x-4 text-gray-300">
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
      </div>

      {/* Main content with glass effect */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 p-4">
              <h2 className="text-xl font-semibold mb-4 text-white">Documents</h2>

              {/* Search input with enhanced styling */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Folders list with enhanced styling */}
              {folders.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-cyan-400">Folders</h3>
                  <ul className="space-y-1">
                    {folders.map((folder) => (
                      <li key={folder} className="group">
                        <button
                          onClick={() => handleFolderSelect(folder)}
                          className="flex items-center w-full text-gray-300 hover:text-cyan-400 transition-colors py-1 px-2 rounded hover:bg-gray-700/50 group-hover:bg-gray-700/30"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-gray-400 group-hover:text-cyan-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                          <span className="truncate">{folder.split("/").pop()}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents list with error handling */}
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <DocumentsList
                  documents={documents}
                  loading={loading}
                  onSelect={handleDocumentSelect}
                  selectedId={selectedDocument?.id}
                />
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 p-4 min-h-[500px]">
              {selectedDocument ? (
                <DocumentPreview document={selectedDocument} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
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
                  </div>
                  <p className="text-gray-400 mb-2">Select a document to preview</p>
                  <p className="text-gray-500 text-sm max-w-md">
                    Browse through the available documents in the sidebar or use the search function to find specific
                    files.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
