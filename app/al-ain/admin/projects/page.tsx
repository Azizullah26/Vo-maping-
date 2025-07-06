"use client"

import { useRef } from "react"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@supabase/supabase-js"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Building } from "lucide-react"

// Project type definition
interface Project {
  id: string
  name: string
  nameAr: string
  description: string
  status: "planned" | "in-progress" | "completed" | "on-hold"
  category: "residential" | "commercial" | "infrastructure" | "public"
  location: string
  coordinates?: [number, number]
  createdAt: string
  updatedAt: string
}

const statusColors = {
  planned: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  "on-hold": "bg-red-100 text-red-800",
}

const categoryIcons = {
  residential: "🏠",
  commercial: "🏢",
  infrastructure: "🏗️",
  public: "🏛️",
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    description: "",
    status: "planned" as Project["status"],
    category: "residential" as Project["category"],
    location: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // Fetch projects from the database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)

        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Missing Supabase credentials")
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Fetch projects from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })

        if (projectsError) {
          throw projectsError
        }

        if (projectsData && Array.isArray(projectsData) && projectsData.length > 0) {
          // Format the data to match our Project type
          const formattedProjects: Project[] = projectsData.map((proj) => ({
            id: proj.id,
            name: proj.name,
            nameAr: proj.nameAr || "",
            description: proj.description || "",
            status: proj.status as Project["status"],
            category: proj.category as Project["category"],
            location: proj.location || "",
            coordinates: proj.coordinates || undefined,
            createdAt: proj.created_at || "",
            updatedAt: proj.updated_at || proj.created_at || "",
          }))

          setProjects(formattedProjects)
          setFilteredProjects(formattedProjects)
        } else {
          // No projects found, try initializing database
          try {
            console.log("No projects found, initializing database...")
            await fetch("/api/init-database", {
              method: "POST",
            })
            // Try fetching again after initialization
            fetchProjects()
          } catch (initError) {
            console.error("Error initializing database:", initError)
          }
        }
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter and sort projects when dependencies change
  useEffect(() => {
    let result = [...projects]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) => project.name.toLowerCase().includes(query) || project.manager.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter)
    }

    setFilteredProjects(result)
  }, [projects, searchQuery, statusFilter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const projectData = {
      ...formData,
      id: editingProject?.id || Date.now().toString(),
      createdAt: editingProject?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    if (editingProject) {
      // Update existing project
      setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? (projectData as Project) : p)))
    } else {
      // Add new project
      setProjects((prev) => [...prev, projectData as Project])
    }

    // Reset form
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      status: "planned",
      category: "residential",
      location: "",
    })
    setShowAddForm(false)
    setEditingProject(null)
  }

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      nameAr: project.nameAr,
      description: project.description,
      status: project.status,
      category: project.category,
      location: project.location,
    })
    setEditingProject(project)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      status: "planned",
      category: "residential",
      location: "",
    })
    setShowAddForm(false)
    setEditingProject(null)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProject ? "Edit Project" : "Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Project Name (English)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nameAr">Project Name (Arabic)</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as Project["status"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value as Project["category"] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingProject ? "Update Project" : "Add Project"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-8">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery || statusFilter !== "all" ? "No projects match your filters" : "No projects found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryIcons[project.category]}</span>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-gray-600">{project.nameAr}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[project.status]}>{project.status.replace("-", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span className="capitalize">{project.category}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
