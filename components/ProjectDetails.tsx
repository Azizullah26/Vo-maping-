"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getProject, type Project } from "@/app/actions/supabase-project-actions"
import { getDocumentsByProject } from "@/lib/db"
import { MapPin, Calendar, Activity, FileText, Download, Eye } from "lucide-react"

interface Document {
  id: string
  title: string
  description?: string
  url: string
  createdAt: string
  projectId?: string
}

interface ProjectDetailsProps {
  projectId: string
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true)

        // Load project details
        const projectResult = await getProject(projectId)
        if (projectResult.success && projectResult.data) {
          setProject(projectResult.data)
        } else {
          setError(projectResult.error || "Failed to load project")
          return
        }

        // Load project documents
        const documentsData = await getDocumentsByProject(projectId)
        setDocuments(documentsData)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      loadProjectData()
    }
  }, [projectId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "completed":
        return "bg-blue-500 hover:bg-blue-600"
      case "planned":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity className="h-4 w-4" />
      case "completed":
        return <Calendar className="h-4 w-4" />
      case "planned":
        return <MapPin className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleDocumentView = (url: string) => {
    window.open(url, "_blank")
  }

  const handleDocumentDownload = (url: string, title: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading project details...</div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">{error || "Project not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Project Header */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-white mb-2">{project.name}</CardTitle>
                {project.description && <p className="text-gray-300 mb-4">{project.description}</p>}
                <div className="flex items-center gap-4">
                  <Badge className={`${getStatusColor(project.status)} text-white flex items-center gap-1`}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </Badge>
                  {project.location && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Project Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-white">
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-white">
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Project Name</label>
                    <p className="text-white">{project.name}</p>
                  </div>
                  {project.description && (
                    <div>
                      <label className="text-gray-400 text-sm">Description</label>
                      <p className="text-white">{project.description}</p>
                    </div>
                  )}
                  {project.location && (
                    <div>
                      <label className="text-gray-400 text-sm">Location</label>
                      <p className="text-white">{project.location}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(project.status)} text-white flex items-center gap-1 w-fit`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Documents</span>
                    <span className="text-white font-semibold">{documents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Created Date</span>
                    <span className="text-white font-semibold">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-white font-semibold">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Project Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No documents found for this project</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">Upload Document</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((document) => (
                      <Card key={document.id} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <FileText className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{document.title}</h3>
                              {document.description && (
                                <p className="text-gray-300 text-sm mt-1 line-clamp-2">{document.description}</p>
                              )}
                              <p className="text-gray-400 text-xs mt-2">
                                {new Date(document.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDocumentView(document.url)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDocumentDownload(document.url, document.title)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Project Created</p>
                      <p className="text-gray-400 text-sm">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {project.updated_at !== project.created_at && (
                    <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">Project Updated</p>
                        <p className="text-gray-400 text-sm">{new Date(project.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  {documents.map((document) => (
                    <div key={document.id} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">Document Added: {document.title}</p>
                        <p className="text-gray-400 text-sm">{new Date(document.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
