"use client"

import { useState, useEffect, useRef } from "react"
import anime from "animejs"

// Updated projects array with all 38 projects
const projects = [
  { id: 1, imageSrc: "/construction-projects-.png" },
  { id: 2, imageSrc: "/construction-projects--1.png" },
  { id: 3, imageSrc: "/construction-projects--2.png" },
  { id: 4, imageSrc: "/construction-projects--3.png" },
  { id: 5, imageSrc: "/construction-projects--4.png" },
]

type ProjectType =
  | "All"
  | "Police Station"
  | "Training"
  | "Special Unit"
  | "Support"
  | "Headquarters"
  | "Museum"
  | "Recreation"
type ProjectStatus = "All" | "Active" | "Under Construction"

interface AlAinProjectsProps {
  isOpen: boolean
  onClose: () => void
  toggleProjects: () => void
}

export function AlAinProjects({ isOpen, onClose, toggleProjects }: AlAinProjectsProps) {
  const [selectedType, setSelectedType] = useState<ProjectType>("All")
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("All")
  const projectsRef = useRef<HTMLDivElement>(null)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const [showSlider, setShowSlider] = useState(true)

  // Remove the isOpen state and button since it's controlled by parent
  // Remove handleOpen and handleClose since they're now controlled by parent

  const filteredProjects = projects.filter((project) => {
    const matchesType = selectedType === "All" || project.type === selectedType
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    return matchesType && matchesStatus
  })

  useEffect(() => {
    // Animate the trigger button on mount
    // if (buttonRef.current) {
    //   anime({
    //     targets: buttonRef.current,
    //     scale: [0.95, 1],
    //     opacity: [0, 1],
    //     translateX: [20, 0],
    //     duration: 800,
    //     easing: "spring(1, 80, 10, 0)",
    //   })
    // }
  }, [])

  useEffect(() => {
    if (isOpen && projectsRef.current) {
      // Animate project cards when panel opens
      anime({
        targets: projectsRef.current.querySelectorAll(".project-card"),
        opacity: [0, 1],
        translateX: [20, 0],
        scale: [0.9, 1],
        delay: anime.stagger(50),
        duration: 600,
        easing: "cubicBezier(0.4, 0.0, 0.2, 1)",
      })
    }
  }, [isOpen])

  // const handleOpen = () => {
  //   setIsOpen(true)
  //   // Animate the panel opening
  //   anime({
  //     targets: ".projects-panel",
  //     translateX: ["100%", "0%"],
  //     duration: 600,
  //     easing: "cubicBezier(0.4, 0.0, 0.2, 1)",
  //   })
  // }

  // const handleClose = () => {
  //   // Animate the panel closing
  //   anime({
  //     targets: ".projects-panel",
  //     translateX: ["0%", "100%"],
  //     duration: 600,
  //     easing: "cubicBezier(0.4, 0.0, 0.2, 1)",
  //     complete: () => setIsOpen(false),
  //   })
  // }

  const handleProjectHover = (projectName: string) => {
    setHoveredProject(projectName)
    // Dispatch custom event for map markers
    window.dispatchEvent(new CustomEvent("projectHover", { detail: projectName }))
  }

  const handleProjectLeave = () => {
    setHoveredProject(null)
    // Dispatch custom event for map markers
    window.dispatchEvent(new CustomEvent("projectHover", { detail: null }))
  }

  return null
}
