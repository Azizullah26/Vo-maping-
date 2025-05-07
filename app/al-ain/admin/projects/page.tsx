"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowUpDown, Edit, FileText, Loader2, Plus, Save, Search, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@supabase/supabase-js"

// Project type definition
interface Project {
  id: string
  name: string
  start_date: string
  end_date: string
  due_days: string
  status: "Active" | "Completed" | "Delayed" | "On Hold" | "Cancelled" | "Pending"
  progress: number
  budget: string
  manager: string
  manager_id: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortColumn, setSortColumn] = useState<keyof Project>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isPdfExporting, setIsPdfExporting] = useState(false)
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
            start_date: new Date(proj.start_date || proj.created_at).toISOString().split("T")[0],
            end_date: new Date(proj.end_date || proj.updated_at || proj.created_at).toISOString().split("T")[0],
            due_days: proj.due_days || "N/A",
            status:
              (proj.status as "Active" | "Completed" | "Delayed" | "On Hold" | "Cancelled" | "Pending") || "Active",
            progress: proj.progress || 0,
            budget: proj.budget || "AED 0",
            manager: proj.manager || "Unassigned",
            manager_id: proj.manager_id || "",
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

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      } else {
        const aString = String(aValue).toLowerCase()
        const bString = String(bValue).toLowerCase()
        return sortDirection === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString)
      }
    })

    setFilteredProjects(result)
  }, [projects, searchQuery, statusFilter, sortColumn, sortDirection])

  // Handle sort column click
  const handleSort = (column: keyof Project) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Handle edit button click
  const handleEditClick = (project: Project) => {
    setEditingId(project.id)
    setEditFormData({ ...project })
  }

  // Handle save button click
  const handleSaveClick = async (id: string) => {
    if (!editFormData) return

    try {
      setIsSaving(true)

      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase credentials")
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Format data for update
      const updateData = {
        name: editFormData.name,
        start_date: editFormData.start_date,
        end_date: editFormData.end_date,
        status: editFormData.status,
        progress: editFormData.progress,
        budget: editFormData.budget,
        manager: editFormData.manager,
        updated_at: new Date().toISOString(),
      }

      // Update in Supabase
      const { error } = await supabase.from("projects").update(updateData).eq("id", id)

      if (error) {
        throw new Error(`Failed to update project: ${error.message}`)
      }

      // Update local state
      setProjects(projects.map((p) => (p.id === id ? editFormData : p)))
      setEditingId(null)
      setEditFormData(null)
      toast({
        title: "Project updated",
        description: "The project has been updated successfully.",
      })
    } catch (err) {
      console.error("Error updating project:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle delete button click
  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    try {
      setIsDeleting(id)

      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase credentials")
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Delete the project from Supabase
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) {
        throw new Error(`Failed to delete project: ${error.message}`)
      }

      // Update local state
      setProjects(projects.filter((p) => p.id !== id))
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      })
    } catch (err) {
      console.error("Error deleting project:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Project) => {
    if (!editFormData) return

    setEditFormData({
      ...editFormData,
      [field]: e.target.value,
    })
  }

  // Handle select changes
  const handleSelectChange = (value: string, field: keyof Project) => {
    if (!editFormData) return

    setEditFormData({
      ...editFormData,
      [field]: value,
    })
  }

  // Export to PDF - completely client-side implementation
  const exportToPDF = async () => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      setIsPdfExporting(true)

      // Dynamically import the modules only on client side
      const jspdfPromise = import("jspdf").catch(() => {
        console.error("Failed to load jspdf")
        return { default: null }
      })

      const autotablePromise = import("jspdf-autotable").catch(() => {
        console.error("Failed to load jspdf-autotable")
        return { default: null }
      })

      const [jspdfModule, autotableModule] = await Promise.all([jspdfPromise, autotablePromise])

      if (!jspdfModule.default || !autotableModule.default) {
        throw new Error("PDF generation libraries could not be loaded")
      }

      const jsPDF = jspdfModule.default
      const autoTable = autotableModule.default

      const doc = new jsPDF()

      // Add title
      doc.setFontSize(18)
      doc.text("Projects Report", 14, 22)

      // Add date
      doc.setFontSize(11)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

      // Create table
      autoTable(doc, {
        head: [["Name", "Start Date", "End Date", "Status", "Progress", "Budget", "Manager"]],
        body: filteredProjects.map((project) => [
          project.name,
          project.start_date,
          project.end_date,
          project.status,
          `${project.progress}%`,
          project.budget,
          project.manager,
        ]),
        startY: 40,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [27, 20, 100] },
      })

      // Save PDF
      doc.save("projects-report.pdf")

      toast({
        title: "PDF Exported",
        description: "The projects report has been exported to PDF.",
      })
    } catch (err) {
      console.error("Error exporting to PDF:", err)
      toast({
        title: "Export Failed",
        description: "Failed to export projects to PDF. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsPdfExporting(false)
    }
  }

  // Render status badge with appropriate color
  const renderStatusBadge = (status: Project["status"]) => {
    const statusColors: Record<Project["status"], string> = {
      Active: "bg-green-100 text-green-800",
      Completed: "bg-blue-100 text-blue-800",
      Delayed: "bg-orange-100 text-orange-800",
      "On Hold": "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
      Pending: "bg-purple-100 text-purple-800",
    }

    return <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>{status}</span>
  }

  // Render progress bar
  const renderProgressBar = (progress: number) => {
    let barColor = "bg-red-600"

    if (progress >= 70) barColor = "bg-green-600"
    else if (progress >= 30) barColor = "bg-yellow-600"

    return (
      <div className="flex items-center gap-2">
        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs whitespace-nowrap">{progress}%</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={exportToPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isPdfExporting || typeof window === "undefined"}
          >
            {isPdfExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {isPdfExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <Button className="bg-[#1B1464] hover:bg-[#1B1464]/90">
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Filters</CardTitle>
          <CardDescription>Filter and search through projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border" ref={tableRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Project Name
                  {sortColumn === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("start_date")}>
                <div className="flex items-center">
                  Start Date
                  {sortColumn === "start_date" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("end_date")}>
                <div className="flex items-center">
                  End Date
                  {sortColumn === "end_date" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center">
                  Status
                  {sortColumn === "status" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("progress")}>
                <div className="flex items-center">
                  Progress
                  {sortColumn === "progress" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("budget")}>
                <div className="flex items-center">
                  Budget
                  {sortColumn === "budget" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("manager")}>
                <div className="flex items-center">
                  Manager
                  {sortColumn === "manager" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-4 animate-spin mr-2" />
                    Loading projects...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className={editingId === project.id ? "bg-blue-50" : ""}>
                  <TableCell>
                    {editingId === project.id ? (
                      <Input
                        value={editFormData?.name || ""}
                        onChange={(e) => handleInputChange(e, "name")}
                        className="max-w-[200px]"
                      />
                    ) : (
                      project.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Input
                        type="date"
                        value={editFormData?.start_date || ""}
                        onChange={(e) => handleInputChange(e, "start_date")}
                        className="max-w-[150px]"
                      />
                    ) : (
                      project.start_date
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Input
                        type="date"
                        value={editFormData?.end_date || ""}
                        onChange={(e) => handleInputChange(e, "end_date")}
                        className="max-w-[150px]"
                      />
                    ) : (
                      project.end_date
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Select
                        value={editFormData?.status || ""}
                        onValueChange={(value) => handleSelectChange(value, "status")}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Delayed">Delayed</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      renderStatusBadge(project.status)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editFormData?.progress || 0}
                        onChange={(e) => handleInputChange(e, "progress")}
                        className="max-w-[80px]"
                      />
                    ) : (
                      renderProgressBar(project.progress)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Input
                        value={editFormData?.budget || ""}
                        onChange={(e) => handleInputChange(e, "budget")}
                        className="max-w-[150px]"
                      />
                    ) : (
                      project.budget
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Input
                        value={editFormData?.manager || ""}
                        onChange={(e) => handleInputChange(e, "manager")}
                        className="max-w-[150px]"
                      />
                    ) : (
                      project.manager
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {editingId === project.id ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveClick(project.id)}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(project.id)}
                        disabled={isDeleting === project.id}
                      >
                        {isDeleting === project.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
