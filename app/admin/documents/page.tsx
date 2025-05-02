"use client"

import type React from "react"
import { useState, useEffect } from "react"
import TopNav from "@/components/TopNav"
import { useRouter } from "next/navigation"
import DemoBanner from "@/app/al-ain/admin/demo-banner"
import { isDemoMode } from "@/lib/demo-service"
import DocumentsList from "@/components/DocumentsList"

interface Project {
  id: string
  name: string
  description: string
}

export default function DocumentsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Fetch projects
    const fetchProjects = async () => {
      try {
        // In a real app, you would fetch from your API
        // For demo, we'll use sample data
        const sampleProjects = [
          { id: "project-1", name: "Sample Project 1", description: "A sample project" },
          { id: "zayed-national-museum", name: "Zayed National Museum", description: "Museum project in Abu Dhabi" },
          {
            id: "al-saad-police-center",
            name: "Al Saad Police Center (مركز شرطة الساد)",
            description: "Police center in Al Ain",
          },
        ]

        setProjects(sampleProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProject || !file) {
      setMessage({ text: "Please select a project and file", type: "error" })
      return
    }

    setIsUploading(true)
    setMessage({ text: "", type: "" })

    try {
      const formData = new FormData()
      formData.append("projectId", selectedProject)
      formData.append("file", file)
      formData.append("description", description)

      console.log(`Uploading document for project: ${selectedProject}`)

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ text: "Document uploaded successfully!", type: "success" })
        setFile(null)
        setDescription("")
        // Reset the file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""

        // Trigger refresh of the documents list
        setRefreshTrigger((prev) => prev + 1)
      } else {
        setMessage({ text: data.error || "Failed to upload document", type: "error" })
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      setMessage({ text: "An error occurred while uploading the document", type: "error" })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <TopNav />

      <div className="container mx-auto px-4 py-8">
        {isDemoMode() && <DemoBanner />}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">Upload and manage documents for projects</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                Select Project
              </label>
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Select a project --</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                Document File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Supported formats: PDF, DOCX, XLSX, JPG, PNG</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {message.text}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isUploading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </form>
        </div>

        {selectedProject && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Documents</h2>
            <DocumentsList projectId={selectedProject} refreshTrigger={refreshTrigger} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Documents</h2>
          <p className="text-gray-600 mb-4">
            To view and manage documents for a specific project, please go to the project details page.
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Projects
          </button>
        </div>
      </div>
    </main>
  )
}
