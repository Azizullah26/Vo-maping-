"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, Download, Eye, Upload, AlertCircle, CheckCircle, Clock, Play } from "lucide-react"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"
import { useDocumentsRealtime } from "@/hooks/useSupabaseRealtime"
import { getProject, type Project } from "@/app/actions/supabase-project-actions"

interface Document {
  id: string
  name: string
  file_url: string
  file_type: string
  file_size: number
  project_id: string
  created_at: string
  updated_at: string
}

interface ProjectDetailsProps {
  projectId: string
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const { user } = useSupabaseAuth()

  // Set up realtime updates for documents
  useDocumentsRealtime(projectId, (document) => {
    loadDocuments()
  })

  const loadProject = async () => {
    try {
      const result = await getProject(projectId)
      if (result.success && result.data) {
        setProject(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to load project")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  const loadDocuments = async () => {
    try {
      // This would be implemented with Supabase document queries
      // For now, we'll use mock data
      setDocuments([])
    } catch (error) {
      console.error("Error loading documents:", error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !project) return

    setUploading(true)
    try {
      // This would implement file upload to Supabase Storage
      // For now, we'll show a placeholder
      console.log("Uploading file:", file.name)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Refresh documents after upload
      await loadDocuments()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Clock className="h-4 w-4" />
      case "active":
        return <Play className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([loadProject(), loadDocuments()])
      setLoading(false)
    }

    loadData()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading project details...</span>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Project Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(project.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(project.status)}
                {project.status}
              </div>
            </Badge>
            {project.location && <span className="text-muted-foreground">📍 {project.location}</span>}
          </div>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
          <p>Updated: {new Date(project.updated_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Project Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Status</h4>
                  <Badge className={getStatusColor(project.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(project.status)}
                      {project.status}
                    </div>
                  </Badge>
                </div>
                {project.location && (
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-muted-foreground">{project.location}</p>
                  </div>
                )}
                {project.coordinates && (
                  <div>
                    <h4 className="font-medium">Coordinates</h4>
                    <p className="text-muted-foreground">
                      {project.coordinates[0]}, {project.coordinates[1]}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Documents</h4>
                  <p className="text-2xl font-bold">{documents.length}</p>
                </div>
                <div>
                  <h4 className="font-medium">Created</h4>
                  <p className="text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium">Last Updated</h4>
                  <p className="text-muted-foreground">{new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Documents</h2>
            {user && (
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                />
                <Button onClick={() => document.getElementById("file-upload")?.click()} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {documents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No documents uploaded yet. Upload your first document to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {document.name}
                    </CardTitle>
                    <CardDescription>
                      {document.file_type} • {formatFileSize(document.file_size)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Uploaded: {new Date(document.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Track project milestones and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Project Created</p>
                    <p className="text-sm text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {project.updated_at !== project.created_at && (
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Project Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
