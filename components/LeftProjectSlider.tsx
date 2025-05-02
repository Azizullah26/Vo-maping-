"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Calendar, Users, Clock, AlertTriangle, DollarSign, FileText } from "lucide-react"
import type { JSX } from "react"

interface Project {
  id: number
  name: string
  description: string
  imageSrc: string
  startDate: string
  endDate: string
  progress: number
  teamSize: number
  budget: number
  challenges: string[]
  documents: { id: string; name: string; url: string }[]
}

const projects: Project[] = [
  {
    id: 1,
    name: "Abu Dhabi Corniche Development",
    description:
      "A comprehensive redevelopment of the Abu Dhabi Corniche, enhancing public spaces, adding recreational facilities, and improving infrastructure.",
    imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2021/09/11/udHX1aAW-corniche-1200x900.jpg",
    startDate: "2023-03-15",
    endDate: "2025-06-30",
    progress: 35,
    teamSize: 120,
    budget: 450000000,
    challenges: ["Coastal erosion management", "Traffic flow during construction", "Environmental protection measures"],
    documents: [
      { id: "doc1", name: "Project Brief", url: "#" },
      { id: "doc2", name: "Environmental Impact Assessment", url: "#" },
      { id: "doc3", name: "Phase 1 Completion Report", url: "#" },
    ],
  },
  {
    id: 2,
    name: "Sheikh Zayed Grand Mosque Expansion",
    description:
      "Expansion of visitor facilities at the Sheikh Zayed Grand Mosque, including new prayer halls, educational spaces, and improved access.",
    imageSrc: "https://www.bayut.com/blog/wp-content/uploads/2019/06/Sheikh-Zayed-Grand-Mosque-FAQs-Cover-27-06.jpg",
    startDate: "2023-01-10",
    endDate: "2024-12-15",
    progress: 48,
    teamSize: 85,
    budget: 320000000,
    challenges: ["Maintaining architectural harmony", "Working around prayer times", "Specialized marble sourcing"],
    documents: [
      { id: "doc1", name: "Architectural Plans", url: "#" },
      { id: "doc2", name: "Cultural Heritage Assessment", url: "#" },
      { id: "doc3", name: "Construction Timeline", url: "#" },
    ],
  },
  {
    id: 3,
    name: "Qasr Al Watan Cultural Center",
    description:
      "Development of a new cultural center adjacent to Qasr Al Watan, featuring exhibition spaces, performance venues, and educational facilities.",
    imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/06/13/Qasr-Al-Watan-1200x900.jpg",
    startDate: "2023-05-20",
    endDate: "2025-04-10",
    progress: 22,
    teamSize: 95,
    budget: 280000000,
    challenges: [
      "Integration with existing palace architecture",
      "Advanced climate control systems",
      "Security considerations",
    ],
    documents: [
      { id: "doc1", name: "Design Concept", url: "#" },
      { id: "doc2", name: "Technical Specifications", url: "#" },
      { id: "doc3", name: "Progress Report Q2 2023", url: "#" },
    ],
  },
  {
    id: 4,
    name: "Yas Island Transportation Network",
    description:
      "Comprehensive upgrade of the transportation infrastructure on Yas Island, including new roads, bridges, and public transit systems.",
    imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Yas-Island-Abu-Dhabi.jpg",
    startDate: "2023-02-05",
    endDate: "2026-01-15",
    progress: 18,
    teamSize: 150,
    budget: 520000000,
    challenges: [
      "Minimizing disruption to tourists",
      "Integration with existing attractions",
      "Sustainable transportation solutions",
    ],
    documents: [
      { id: "doc1", name: "Master Plan", url: "#" },
      { id: "doc2", name: "Traffic Impact Study", url: "#" },
      { id: "doc3", name: "Sustainability Report", url: "#" },
    ],
  },
  {
    id: 5,
    name: "Ferrari World Expansion Phase 3",
    description:
      "The third phase of Ferrari World's expansion, adding new rides, attractions, and visitor facilities to enhance the theme park experience.",
    imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Ferrari-World-Abu-Dhabi.jpg",
    startDate: "2023-04-12",
    endDate: "2024-11-30",
    progress: 40,
    teamSize: 110,
    budget: 380000000,
    challenges: ["Operating during construction", "Specialized ride engineering", "Tight timeline constraints"],
    documents: [
      { id: "doc1", name: "Attraction Designs", url: "#" },
      { id: "doc2", name: "Safety Certification Plan", url: "#" },
      { id: "doc3", name: "Construction Schedule", url: "#" },
    ],
  },
  // Projects 6-15 would follow the same pattern
]

interface LeftProjectSliderProps {
  isOpen: boolean
  onClose: () => void
  projectId: number | null
}

export const LeftProjectSlider = ({ isOpen, onClose, projectId }: LeftProjectSliderProps): JSX.Element => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "documents">("overview")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Find the project when projectId changes
  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId) || null
      setCurrentProject(project)
      setActiveTab("overview") // Reset to overview tab when changing projects
    } else {
      setCurrentProject(null)
    }
  }, [projectId])

  // Mock additional images for the project
  const projectImages = currentProject
    ? [
        currentProject.imageSrc,
        "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Abu-Dhabi-skyline-1200x900.jpg",
        "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Corniche-Beach-Abu-Dhabi.jpg",
      ]
    : []

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % projectImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + projectImages.length) % projectImages.length)
  }

  if (!currentProject) {
    return <></>
  }

  return (
    <div
      className={cn(
        "fixed top-[5rem] sm:top-16 md:top-[4.5rem] left-0 max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-4.5rem)] w-[350px] transform transition-transform ease-out-expo duration-500 z-[99999] shadow-md bg-[#0a192f]/90 backdrop-blur-sm overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
        >
          <X size={18} />
        </Button>

        {/* Image gallery */}
        <div className="relative w-full h-48">
          <img
            src={projectImages[currentImageIndex] || "/placeholder.svg"}
            alt={currentProject.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent"></div>

          {/* Image navigation */}
          {projectImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
              >
                <ChevronRight size={18} />
              </Button>
            </>
          )}

          {/* Project title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white">{currentProject.name}</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cyan-900/30">
          <Button
            variant="ghost"
            className={cn(
              "flex-1 rounded-none text-sm font-medium",
              activeTab === "overview"
                ? "text-cyan-400 border-b-2 border-cyan-500"
                : "text-slate-400 hover:text-cyan-300",
            )}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex-1 rounded-none text-sm font-medium",
              activeTab === "details"
                ? "text-cyan-400 border-b-2 border-cyan-500"
                : "text-slate-400 hover:text-cyan-300",
            )}
            onClick={() => setActiveTab("details")}
          >
            Details
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex-1 rounded-none text-sm font-medium",
              activeTab === "documents"
                ? "text-cyan-400 border-b-2 border-cyan-500"
                : "text-slate-400 hover:text-cyan-300",
            )}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </Button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm">{currentProject.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
                  <div className="flex items-center text-cyan-400 mb-1">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-xs font-medium">Timeline</span>
                  </div>
                  <div className="text-white text-sm">
                    {new Date(currentProject.startDate).toLocaleDateString()} -{" "}
                    {new Date(currentProject.endDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
                  <div className="flex items-center text-cyan-400 mb-1">
                    <Clock size={16} className="mr-2" />
                    <span className="text-xs font-medium">Progress</span>
                  </div>
                  <div className="text-white text-sm">{currentProject.progress}% Complete</div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5">
                    <div
                      className="bg-cyan-500 h-1.5 rounded-full"
                      style={{ width: `${currentProject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
                <div className="flex items-center text-cyan-400 mb-2">
                  <AlertTriangle size={16} className="mr-2" />
                  <span className="text-xs font-medium">Key Challenges</span>
                </div>
                <ul className="text-white text-sm space-y-1">
                  {currentProject.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
                <div className="flex items-center text-cyan-400 mb-1">
                  <Users size={16} className="mr-2" />
                  <span className="text-xs font-medium">Team Size</span>
                </div>
                <div className="text-white text-sm">{currentProject.teamSize} Personnel</div>
              </div>

              <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
                <div className="flex items-center text-cyan-400 mb-1">
                  <DollarSign size={16} className="mr-2" />
                  <span className="text-xs font-medium">Budget</span>
                </div>
                <div className="text-white text-sm">AED {currentProject.budget.toLocaleString()}</div>
              </div>

              <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30">
                <div className="flex items-center text-cyan-400 mb-1">
                  <Clock size={16} className="mr-2" />
                  <span className="text-xs font-medium">Timeline Breakdown</span>
                </div>
                <div className="space-y-2 mt-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Planning</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Design</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Construction</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-yellow-500 h-1.5 rounded-full w-[35%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Finishing</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-red-500 h-1.5 rounded-full w-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-3">
              <div className="flex items-center text-cyan-400 mb-1">
                <FileText size={16} className="mr-2" />
                <span className="text-xs font-medium">Project Documents</span>
              </div>

              {currentProject.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-900/30 hover:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText size={16} className="text-cyan-400 mr-2" />
                      <span className="text-white text-sm">{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-cyan-400 hover:text-cyan-300">
                      View
                    </Button>
                  </div>
                </div>
              ))}

              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-cyan-900 text-cyan-400 hover:text-cyan-300"
                >
                  View All Documents
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
