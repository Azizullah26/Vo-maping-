"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download, Filter, Plus, Search } from "lucide-react"

// Sample project data
const projectsData = [
  {
    id: 1,
    name: "Saad Police Station Renovation",
    manager: {
      name: "Ahmed Al Mansouri",
      email: "ahmed@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 1250000,
    status: "In Progress",
    progress: 45,
    startDate: "2023-05-15",
    endDate: "2024-02-28",
  },
  {
    id: 2,
    name: "Al Ain Wildlife Park Expansion",
    manager: {
      name: "Fatima Al Shamsi",
      email: "fatima@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 3750000,
    status: "Planning",
    progress: 15,
    startDate: "2023-08-01",
    endDate: "2025-01-15",
  },
  {
    id: 3,
    name: "Jebel Hafeet Road Improvement",
    manager: {
      name: "Mohammed Al Dhaheri",
      email: "mohammed@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 850000,
    status: "Completed",
    progress: 100,
    startDate: "2022-11-10",
    endDate: "2023-09-30",
  },
  {
    id: 4,
    name: "Al Ain Oasis Visitor Center",
    manager: {
      name: "Noura Al Kaabi",
      email: "noura@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 1850000,
    status: "In Progress",
    progress: 72,
    startDate: "2023-02-20",
    endDate: "2023-12-15",
  },
  {
    id: 5,
    name: "Al Ain Hospital Wing Extension",
    manager: {
      name: "Khalid Al Nuaimi",
      email: "khalid@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 5200000,
    status: "Delayed",
    progress: 35,
    startDate: "2022-09-05",
    endDate: "2023-11-30",
  },
  {
    id: 6,
    name: "Green Mubazzarah Hot Springs Renovation",
    manager: {
      name: "Aisha Al Mazrouei",
      email: "aisha@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 920000,
    status: "In Progress",
    progress: 60,
    startDate: "2023-04-12",
    endDate: "2024-01-20",
  },
  {
    id: 7,
    name: "Al Ain Mall Expansion Phase 2",
    manager: {
      name: "Saeed Al Zaabi",
      email: "saeed@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 7500000,
    status: "Planning",
    progress: 10,
    startDate: "2023-10-01",
    endDate: "2025-06-30",
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter projects based on search term
  const filteredProjects = projectsData.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort projects based on sort field and direction
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortField === "manager") {
      return sortDirection === "asc"
        ? a.manager.name.localeCompare(b.manager.name)
        : b.manager.name.localeCompare(a.manager.name)
    } else if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    } else if (sortField === "progress") {
      return sortDirection === "asc" ? a.progress - b.progress : b.progress - a.progress
    } else if (sortField === "status") {
      return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
    } else {
      return 0
    }
  })

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Planning":
        return "bg-purple-100 text-purple-800"
      case "Delayed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Al Ain Projects</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Project Name
                  {sortField === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("manager")}>
                <div className="flex items-center">
                  Project Manager
                  {sortField === "manager" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end">
                  Budget
                  {sortField === "amount" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center">
                  Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("progress")}>
                <div className="flex items-center">
                  Progress
                  {sortField === "progress" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <img
                      src={project.manager.avatar || "/placeholder.svg"}
                      alt={project.manager.name}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <div>
                      <div>{project.manager.name}</div>
                      <div className="text-xs text-muted-foreground">{project.manager.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(project.amount)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${project.progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                    <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
