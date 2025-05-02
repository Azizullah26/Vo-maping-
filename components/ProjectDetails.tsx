"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Project } from "@/app/actions/project-actions"
import { type Document, deleteDocument } from "@/app/actions/document-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Calendar, FileText, Trash2, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { uploadDocument } from "@/app/actions/document-actions"

interface ProjectDetailsProps {
  project: Project
  documents: Document[]
}

export default function ProjectDetails({ project, documents }: ProjectDetailsProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await uploadDocument(file, project.id, description)

      if (!result.success) {
        throw new Error(result.error || "Failed to upload document")
      }

      setSuccess("Document uploaded successfully!")
      setFile(null)
      setDescription("")

      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // Refresh the page to show the new document
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    setIsDeleting(documentId)

    try {
      const result = await deleteDocument(documentId)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete document")
      }

      // Refresh the page to update the document list
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#1b1464]">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center text-gray-700 mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <div className="text-gray-700 mb-2">
                <span className="font-medium">Coordinates:</span> {project.coordinates[0]}, {project.coordinates[1]}
              </div>
              {project.updated_at && (
                <div className="text-gray-700">
                  <span className="font-medium">Last Updated:</span> {new Date(project.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Documents</CardTitle>
          <CardDescription>Upload and manage documents related to this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <form onSubmit={handleUpload} className="space-y-4 border-b pb-6">
              <h3 className="font-medium">Upload New Document</h3>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700">Success</AlertTitle>
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="file-upload">Document File</Label>
                <Input id="file-upload" type="file" onChange={handleFileChange} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter document description"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={isUploading || !file}
                className="bg-[#1B1464] hover:bg-[#1B1464]/90 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>

            <div>
              <h3 className="font-medium mb-4">Document List</h3>

              {documents.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-[#1b1464] mr-3" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          {doc.description && <p className="text-sm text-gray-600">{doc.description}</p>}
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDocument(doc.id)}
                          disabled={isDeleting === doc.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          {isDeleting === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
