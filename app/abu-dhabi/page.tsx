"use client"

import { useState, useCallback } from "react"
import { ProjectsRightSlider } from "@/components/ProjectsRightSlider"
import { ProjectDetailsLeftSlider } from "@/components/ProjectDetailsLeftSlider"
import { MapFilters, typeFilters } from "@/components/MapFilters"
import { MapWeather } from "@/components/MapWeather"
import type { Project, ProjectRegion } from "@/data/abu-dhabi-projects"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { projects } from "@/data/abu-dhabi-projects"

export default function AbuDhabiPage() {
  const [isRightSliderOpen, setIsRightSliderOpen] = useState(true)
  const [isLeftSliderOpen, setIsLeftSliderOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<ProjectRegion | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [showCategoryFilters, setShowCategoryFilters] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [activeButton, setActiveButton] = useState<string | null>(null)

  // Handle project selection
  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project)
    setIsLeftSliderOpen(true)
  }, [])

  // Handle region selection
  const handleRegionSelect = useCallback((region: ProjectRegion | null) => {
    setSelectedRegion(region)
  }, [])

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setFilterType(filter)
  }, [])

  // Handle marker hover
  const handleMarkerHover = useCallback((project: Project | null) => {
    setHoveredProject(project)
  }, [])

  // Close left slider and clear selection
  const handleCloseLeftSlider = useCallback(() => {
    setIsLeftSliderOpen(false)
    // Optional: keep the selected project for a moment before clearing
    setTimeout(() => {
      setSelectedProject(null)
    }, 300)
  }, [])

  const toggleCategoryFilters = useCallback(() => {
    setShowCategoryFilters((prev) => !prev)
    setActiveButton(activeButton === "filters" ? null : "filters")
  }, [activeButton])

  const handleProfile = useCallback(() => {
    setActiveButton(activeButton === "profile" ? null : "profile")
    // Add profile functionality here
  }, [activeButton])

  // Filter projects based on selected filter type
  const filteredProjects = projects.filter((project) => {
    if (filterType === "all") return true
    return project.type === filterType
  })

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-[70px] z-50 bg-black/80 backdrop-blur-sm border-b border-white/10 px-4 flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <Image
            src="/abu-dhabi-police-logo.png"
            alt="Abu Dhabi Police Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          <div className="text-white">Abu Dhabi</div>

          {/* Map Filters button moved here */}
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "bg-black text-white hover:bg-white hover:text-black transition-all duration-200",
              activeButton === "filters" && "bg-red-600 text-white hover:bg-red-700",
            )}
            onClick={toggleCategoryFilters}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Map Filters
          </Button>
        </div>

        {/* Center - Empty now that filters are moved to slider */}
        <div className="flex-1"></div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "bg-black text-white hover:bg-white hover:text-black transition-all duration-200",
              activeButton === "profile" && "bg-red-600 text-white hover:bg-red-700",
            )}
            onClick={handleProfile}
          >
            <User className="h-4 w-4 mr-1" />
            Profile
          </Button>
        </div>
      </header>

      {/* Weather and date display */}
      <div className="absolute top-[90px] left-6 z-30">
        <MapWeather />
      </div>

      {/* Map filters */}
      <div className="absolute top-[90px] left-1/2 transform -translate-x-1/2 z-30">
        <MapFilters
          activeFilter={filterType}
          onFilterChange={handleFilterChange}
          showCategoryFilters={showCategoryFilters}
          showTypeFilters={false} // Don't show type filters here
        />
      </div>

      {/* Static Map Image */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          <Image src="/abu-dhabi-satellite.jpg" alt="Abu Dhabi Map" fill priority className="object-cover" />

          {/* Project Markers */}
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300",
                hoveredProject && hoveredProject.id !== project.id ? "opacity-50" : "opacity-100",
              )}
              style={{
                left: `${project.coordinates[0]}%`,
                top: `${project.coordinates[1]}%`,
              }}
              onMouseEnter={() => handleMarkerHover(project)}
              onMouseLeave={() => handleMarkerHover(null)}
              onClick={() => handleProjectSelect(project)}
            >
              {(hoveredProject?.id === project.id || project.id === selectedProject?.id) && (
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-300",
                    project.id === selectedProject?.id ? "border-red-500" : "border-blue-500",
                  )}
                ></div>
              )}

              {/* Tooltip on hover */}
              {hoveredProject?.id === project.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 backdrop-blur-sm text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {project.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right slider - Projects list */}
      <ProjectsRightSlider
        isOpen={isRightSliderOpen}
        onClose={() => {
          setIsRightSliderOpen(false)
          setActiveButton(null)
        }}
        onProjectSelect={handleProjectSelect}
        selectedProject={selectedProject}
        filterType={filterType}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
        onFilterChange={handleFilterChange}
        typeFilters={typeFilters}
      />

      {/* Left slider - Project details */}
      <ProjectDetailsLeftSlider isOpen={isLeftSliderOpen} onClose={handleCloseLeftSlider} project={selectedProject} />
    </div>
  )
}
