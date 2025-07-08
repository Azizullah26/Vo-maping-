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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  type Project,
} from "@/app/actions/supabase-project-actions"
import { Plus, Edit, Trash2, MapPin, Calendar, Activity } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        const result = await getProjects()
        if (result.success && result.data) {
          setProjects(result.data)
        } else {
          setError(result.error || "Failed to load projects")
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const handleCreateProject = async (formData: FormData) => {
    const result = await createProject(formData)
    if (result.success && result.data) {
      setProjects((prev) => [result.data!, ...prev])
      setIsCreateDialogOpen(false)
      setError(null)
    } else {
      setError(result.error || "Failed to create project")
    }
  }

  const handleUpdateProject = async (formData: FormData) => {
    if (!selectedProject) return

    const result = await updateProject(selectedProject.id, formData)
    if (result.success && result.data) {
      setProjects((prev) => prev.map((p) => (p.id === result.data!.id ? result.data! : p)))
      setIsEditDialogOpen(false)
      setSelectedProject(null)
      setError(null)
    } else {
      setError(result.error || "Failed to update project")
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    const result = await deleteProject(id)
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setError(null)
    } else {
      setError(result.error || "Failed to delete project")
    }
  }

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
        return <Activity className="h-3 w-3" />
      case "completed":
        return <Calendar className="h-3 w-3" />
      case "planned":
        return <MapPin className="h-3 w-3" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects Management</h1>
            <p className="text-gray-300">Manage all construction and infrastructure projects</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Project</DialogTitle>
              </DialogHeader>
              <form action={handleCreateProject} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Project Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Enter project name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter project description"
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-white">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter project location"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-white">
                    Status
                  </Label>
                  <Select name="status" defaultValue="planned">
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
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

        {error && (
          <Alert className="mb-6 border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Projects Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{projects.length}</p>
                <p className="text-gray-400 text-sm">Total Projects</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {projects.filter((p) => p.status === "active").length}
                </p>
                <p className="text-gray-400 text-sm">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {projects.filter((p) => p.status === "completed").length}
                </p>
                <p className="text-gray-400 text-sm">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {projects.filter((p) => p.status === "planned").length}
                </p>
                <p className="text-gray-400 text-sm">Planned</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No projects found</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Location</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="border-gray-700">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{project.name}</p>
                          {project.description && (
                            <p className="text-sm text-gray-400 truncate max-w-xs">{project.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(project.status)} text-white flex items-center gap-1 w-fit`}>
                          {getStatusIcon(project.status)}
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{project.location || "Not specified"}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(project.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProject(project)
                              setIsEditDialogOpen(true)
                            }}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Project Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
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
                    rows={3}
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
                    <SelectContent className="bg-gray-700 border-gray-600">
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
