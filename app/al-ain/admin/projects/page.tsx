"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Search, Filter, Eye, Edit, Trash2, AlertCircle, CheckCircle, Clock, Play } from "lucide-react"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"
import { useProjectsRealtime } from "@/hooks/useSupabaseRealtime"
import { getProjects, deleteProject, type Project } from "@/app/actions/supabase-project-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const { user, loading: authLoading } = useSupabaseAuth()

  // Set up realtime updates for projects
  useProjectsRealtime((project) => {
    loadProjects()
  })

  const loadProjects = async () => {
    try {
      const result = await getProjects()
      if (result.success && result.data) {
        setProjects(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to load projects")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (project: Project) => {
    try {
      const result = await deleteProject(project.id)
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id))
        setIsDeleteDialogOpen(false)
        setSelectedProject(null)
      } else {
        setError(result.error || "Failed to delete project")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  // Filter projects based on search term and status
  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter])

  useEffect(() => {
    loadProjects()
  }, [])

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

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage all your projects</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to the system</DialogDescription>
            </DialogHeader>
            <ProjectForm onClose={() => setIsCreateDialogOpen(false)} onSuccess={loadProjects} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(project.status)}
                    {project.status}
                  </div>
                </Badge>
              </div>
              {project.description && <CardDescription className="line-clamp-3">{project.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              {project.location && <p className="text-sm text-muted-foreground mb-4">📍 {project.location}</p>}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-muted-foreground">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  Updated: {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={isViewDialogOpen && selectedProject?.id === project.id}
                  onOpenChange={(open) => {
                    setIsViewDialogOpen(open)
                    if (!open) setSelectedProject(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedProject?.name}</DialogTitle>
                      <DialogDescription>Project Details</DialogDescription>
                    </DialogHeader>
                    <ProjectView project={selectedProject} />
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isEditDialogOpen && selectedProject?.id === project.id}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setSelectedProject(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Project</DialogTitle>
                      <DialogDescription>Update project information</DialogDescription>
                    </DialogHeader>
                    <ProjectForm
                      project={selectedProject}
                      onClose={() => {
                        setIsEditDialogOpen(false)
                        setSelectedProject(null)
                      }}
                      onSuccess={loadProjects}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isDeleteDialogOpen && selectedProject?.id === project.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setSelectedProject(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive" onClick={() => setSelectedProject(project)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Project</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDeleteDialogOpen(false)
                          setSelectedProject(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => selectedProject && handleDeleteProject(selectedProject)}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "No projects match your search criteria."
                : "No projects found. Create your first project to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Project View Component
function ProjectView({ project }: { project: Project | null }) {
  if (!project) return null

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Name</Label>
        <p className="text-sm text-muted-foreground mt-1">{project.name}</p>
      </div>

      {project.description && (
        <div>
          <Label className="text-sm font-medium">Description</Label>
          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
        </div>
      )}

      {project.location && (
        <div>
          <Label className="text-sm font-medium">Location</Label>
          <p className="text-sm text-muted-foreground mt-1">{project.location}</p>
        </div>
      )}

      <div>
        <Label className="text-sm font-medium">Status</Label>
        <div className="mt-1">
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Created</Label>
          <p className="text-sm text-muted-foreground mt-1">{new Date(project.created_at).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Updated</Label>
          <p className="text-sm text-muted-foreground mt-1">{new Date(project.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

// Project Form Component
function ProjectForm({
  project,
  onClose,
  onSuccess,
}: {
  project?: Project | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    location: project?.location || "",
    status: project?.status || ("planned" as const),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { createProject, updateProject } = await import("@/app/actions/supabase-project-actions")

      let result
      if (project) {
        result = await updateProject({ id: project.id, ...formData })
      } else {
        result = await createProject(formData)
      }

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.error || "Failed to save project")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {project ? "Update" : "Create"} Project
        </Button>
      </div>
    </form>
  )
}

function getStatusColor(status: string) {
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
