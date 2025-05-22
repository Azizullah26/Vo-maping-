"use client"

import { useState, useCallback, useMemo } from "react"
import { type Project, type ProjectRegion, projects } from "@/data/abu-dhabi-projects"
import { regions } from "@/data/abu-dhabi-regions"

interface ProjectsRightSliderProps {
  isOpen: boolean
  onClose: () => void
  onProjectSelect: (project: Project) => void
  selectedProject: Project | null
  filterType: string
  selectedRegion: ProjectRegion | null
  onRegionSelect: (region: ProjectRegion) => void
  onFilterChange: (filter: string) => void
  typeFilters: { id: string; label: string }[]
}

export function ProjectsRightSlider({
  isOpen,
  onClose,
  onProjectSelect,
  selectedProject,
  filterType = "all",
  selectedRegion,
  onRegionSelect,
  onFilterChange,
  typeFilters,
}: ProjectsRightSliderProps) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)

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
  const handleTabChange = useCallback(
    (regionId: string) => {
      setActiveTab(regionId)

      // If selecting a region tab, also update the selected region
      if (regionId !== "all") {
        const region = regions.find((r) => r.id === regionId)
        if (region && onRegionSelect) {
          onRegionSelect(region)
        }
      } else if (onRegionSelect) {
        // Clear region selection when "All" is selected
        onRegionSelect(null as any)
      }
    },
    [onRegionSelect],
  )

  // Handle project hover
  const handleProjectHover = useCallback((project: Project | null) => {
    setHoveredProject(project)

    // Dispatch custom event for map to handle
    const event = new CustomEvent("projectHover", {
      detail: { project },
    })
    window.dispatchEvent(event)
  }, [])

  return null // Return null instead of rendering the slider
}
