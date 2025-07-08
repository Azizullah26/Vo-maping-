"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime"
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  type Project,
} from "@/app/actions/supabase-project-actions"
import { getAllDocuments } from "@/lib/db"
import { Plus, Edit, Trash2, FileText, Users, Database, Activity } from "lucide-react"

interface Document {
  id: string
  title: string
  description?: string
  url: string
  createdAt: string
  projectId?: string
}

export default function AdminPageClient() {
  const { user, loading: authLoading, signOut } = useSupabaseAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Real-time subscription for projects
  useSupabaseRealtime({
    table: "projects",
    onInsert: (payload) => {
      setProjects((prev) => [payload.new, ...prev])
    },
    onUpdate: (payload) => {
      setProjects((prev) => prev.map((p) => (p.id === payload.new.id ? payload.new : p)))
    },
    onDelete: (payload) => {
      setProjects((prev) => prev.filter((p) => p.id !== payload.old.id))
    },
  })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load projects
        const projectsResult = await getProjects()
        if (projectsResult.success && projectsResult.data) {
          setProjects(projectsResult.data)
        } else {
          setError(projectsResult.error || "Failed to load projects")
        }

        // Load documents
        const documentsData = await getAllDocuments()
        setDocuments(documentsData)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateProject = async (formData: FormData) => {
    const result = await createProject(formData)
    if (result.success) {
      setIsCreateDialogOpen(false)
    } else {
      setError(result.error || "Failed to create project")
    }
  }

  const handleUpdateProject = async (formData: FormData) => {
    if (!selectedProject) return

    const result = await updateProject(selectedProject.id, formData)
    if (result.success) {
      setIsEditDialogOpen(false)
      setSelectedProject(null)
    } else {
      setError(result.error || "Failed to update project")
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    const result = await deleteProject(id)
    if (!result.success) {
      setError(result.error || "Failed to delete project")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "planned":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage projects and documents for ELRACE UAE</p>
          </div>
          <div className="flex items-center gap-4">
            {user && <div className="text-white text-sm">Welcome, {user.email}</div>}
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                </div>
                <Database className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Documents</p>
                  <p className="text-2xl font-bold text-white">{documents.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter((p) => p.status === "completed").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="projects" className="text-white">
              Projects
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-white">
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Projects Management</CardTitle>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Create New Project</DialogTitle>
                      </DialogHeader>
                      <form action={handleCreateProject} className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-white">
                            Project Name
                          </Label>
                          <Input id="name" name="name" required className="bg-gray-700 border-gray-600 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-white">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-white">
                            Location
                          </Label>
                          <Input id="location" name="location" className="bg-gray-700 border-gray-600 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="status" className="text-white">
                            Status
                          </Label>
                          <Select name="status" defaultValue="planned">
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          Create Project
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-white truncate">{project.name}</h3>
                          <Badge className={`${getStatusColor(project.status)} text-white`}>{project.status}</Badge>
                        </div>
                        {project.description && (
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{project.description}</p>
                        )}
                        {project.location && <p className="text-gray-400 text-xs mb-3">{project.location}</p>}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProject(project)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Documents Management</CardTitle>
              </CardHeader>
              <CardContent>
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Project Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Project</DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <form action={handleUpdateProject} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" className="text-white">
                    Project Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={selectedProject.name}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={selectedProject.description || ""}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location" className="text-white">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={selectedProject.location || ""}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status" className="text-white">
                    Status
                  </Label>
                  <Select name="status" defaultValue={selectedProject.status}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Project
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
