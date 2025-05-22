"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, Home, Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Project, type ProjectRegion, projects } from "@/data/abu-dhabi-projects"
import { regions } from "@/data/abu-dhabi-regions"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"

// Define type filters similar to MapFilters component
const typeFilters = [
  { id: "all", label: "All" },
  { id: "residential", label: "Constructed" },
  { id: "commercial", label: "Active" },
  { id: "mixed-use", label: "Completed" },
]

export default function AbuDhabiProjectsPage() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState<ProjectRegion | null>(null)
  const router = useRouter()
  const isMobile = useMobile()

  // Filter projects based on type and region
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by type
      if (filterType !== "all" && project.type.toLowerCase() !== filterType.toLowerCase()) {
        return false
      }

      // Filter by region if selected
      if (selectedRegion && project.region !== selectedRegion.id) {
        return false
      }

      // Filter by tab
      if (activeTab !== "all") {
        return project.region === activeTab
      }

      return true
    })
  }, [filterType, selectedRegion, activeTab])

  // Group projects by region
  const projectsByRegion = useMemo(() => {
    return regions
      .map((region) => {
        const regionProjects = filteredProjects.filter((project) => project.region === region.id)
        return {
          ...region,
          projects: regionProjects,
          count: regionProjects.length,
        }
      })
      .filter((region) => region.count > 0)
  }, [filteredProjects])

  // Handle tab change
  const handleTabChange = useCallback((regionId: string) => {
    setActiveTab(regionId)

    // If selecting a region tab, also update the selected region
    if (regionId !== "all") {
      const region = regions.find((r) => r.id === regionId)
      if (region) {
        setSelectedRegion(region)
      }
    } else {
      // Clear region selection when "All" is selected
      setSelectedRegion(null)
    }
  }, [])

  // Handle project hover
  const handleProjectHover = useCallback((project: Project | null) => {
    setHoveredProject(project)
  }, [])

  // Handle project selection
  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project)
    // Navigate to project details page or show details in a modal
  }, [])

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setFilterType(filter)
  }, [])

  // Get display type for project
  const getDisplayType = useCallback((type: string) => {
    if (type.toLowerCase() === "residential") return "Constructed"
    if (type.toLowerCase() === "commercial") return "Active"
    if (type.toLowerCase() === "mixed use") return "Completed"
    return type
  }, [])

  // Handle navigation
  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path)
    },
    [router],
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[70px] z-50 bg-black/80 backdrop-blur-sm border-b border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <nav className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 bg-white rounded-full p-1 flex items-center justify-center mr-2"
              style={{ width: "28px", height: "28px" }}
              aria-label="Home"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/our%20main%20logo%202025-01-Qfxvimv60zcUduv8DZzSRzoS6qKX09.png"
                alt="El Race Contracting Logo"
                className="h-4 w-auto"
              />
            </Link>

            {isMobile ? (
              // Mobile version - simplified navigation
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("/abu-dhabi")}
                  className="text-white hover:bg-white/10 p-1.5 h-auto"
                >
                  <ChevronRight className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs">Back</span>
                </Button>
                <span className="text-white text-xs font-medium ml-1">Projects</span>
              </div>
            ) : (
              // Desktop version - full breadcrumb
              <ol className="flex items-center">
                <li className="flex items-center">
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded text-xs transition-all flex items-center"
                  >
                    <Home className="h-3 w-3 mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-3 w-3 text-gray-500 mx-1" />
                  <Link
                    href="/abu-dhabi"
                    className="text-gray-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded text-xs transition-all flex items-center"
                  >
                    <Building className="h-3 w-3 mr-1" />
                    <span>Abu Dhabi</span>
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-3 w-3 text-gray-500 mx-1" />
                  <span className="text-white bg-white/10 px-2 py-1 rounded text-xs">Projects</span>
                </li>
              </ol>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-[90px] px-4 pb-20 max-w-7xl mx-auto">
        {/* Type filters */}
        <div className="mb-8">
          <h3 className="text-white text-sm font-medium mb-3">Filter by Type</h3>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                  filterType === filter.id
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-black/50 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20",
                )}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Region tabs */}
        <div className="mb-6">
          <h3 className="text-white text-sm font-medium mb-3">Filter by Region</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                activeTab === "all"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-black/50 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20",
              )}
              onClick={() => handleTabChange("all")}
            >
              All Regions
            </Button>
            {regions.map((region) => (
              <Button
                key={region.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeTab === region.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-black/50 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20",
                )}
                onClick={() => handleTabChange(region.id)}
              >
                {region.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "relative group cursor-pointer rounded-lg overflow-hidden border transition-all duration-300",
                selectedProject?.id === project.id
                  ? "border-cyan-400 shadow-lg shadow-cyan-400/20 scale-[1.02]"
                  : "border-white/10 hover:border-white/30",
              )}
              onClick={() => handleProjectSelect(project)}
              onMouseEnter={() => handleProjectHover(project)}
              onMouseLeave={() => handleProjectHover(null)}
              data-project-id={project.id}
              data-project-name={project.name}
            >
              {/* Selected indicator */}
              {selectedProject?.id === project.id && (
                <>
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                </>
              )}

              {/* Hover indicator */}
              <div
                className={cn(
                  "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-opacity duration-300",
                  hoveredProject?.id === project.id || selectedProject?.id === project.id ? "opacity-100" : "opacity-0",
                )}
              ></div>

              <div className="flex">
                {/* Project image */}
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image src={project.image || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-1/2"></div>
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {getDisplayType(project.type)}
                  </div>
                </div>

                {/* Project details */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm">{project.name}</h3>
                    <p className="text-white/60 text-xs mt-1">{project.plots} Plots</p>
                  </div>

                  {/* Status or action button */}
                  {project.status === "sold out" ? (
                    <div className="text-red-500 text-xs font-medium mt-2">Completed</div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start mt-2 px-3 py-1 h-auto text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 rounded-sm"
                    >
                      Explore
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-white/60 mb-2">No projects found matching your filters</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterType("all")
                setActiveTab("all")
                setSelectedRegion(null)
              }}
              className="bg-white text-black hover:bg-black hover:text-white transition-colors"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
