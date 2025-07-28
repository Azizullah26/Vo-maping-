"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Building, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Project {
  id: string
  name: string
  nameAr: string
  status: "completed" | "in-progress" | "planned"
  completion: number
  location: { x: number; y: number }
  description: string
  startDate: string
  endDate: string
  team: number
  budget: string
}

const projects: Project[] = [
  {
    id: "1",
    name: "Al Ain Oasis Heritage Center",
    nameAr: "مركز تراث واحة العين",
    status: "completed",
    completion: 100,
    location: { x: 45, y: 35 },
    description: "A cultural heritage center showcasing the history and traditions of Al Ain Oasis.",
    startDate: "2022-01-15",
    endDate: "2023-12-20",
    team: 25,
    budget: "AED 15M",
  },
  {
    id: "2",
    name: "Green Valley Residential Complex",
    nameAr: "مجمع الوادي الأخضر السكني",
    status: "in-progress",
    completion: 75,
    location: { x: 60, y: 25 },
    description: "Modern residential complex with sustainable design and green spaces.",
    startDate: "2023-03-01",
    endDate: "2024-08-30",
    team: 40,
    budget: "AED 45M",
  },
  {
    id: "3",
    name: "Al Ain Technology Hub",
    nameAr: "مركز العين التقني",
    status: "in-progress",
    completion: 60,
    location: { x: 30, y: 50 },
    description: "State-of-the-art technology center for innovation and research.",
    startDate: "2023-06-15",
    endDate: "2025-01-15",
    team: 35,
    budget: "AED 30M",
  },
  {
    id: "4",
    name: "Desert Rose Shopping Center",
    nameAr: "مركز وردة الصحراء التجاري",
    status: "planned",
    completion: 0,
    location: { x: 70, y: 60 },
    description: "Modern shopping and entertainment complex in the heart of Al Ain.",
    startDate: "2024-02-01",
    endDate: "2025-12-31",
    team: 50,
    budget: "AED 60M",
  },
  {
    id: "5",
    name: "Al Ain Sports Complex",
    nameAr: "مجمع العين الرياضي",
    status: "in-progress",
    completion: 40,
    location: { x: 25, y: 70 },
    description: "Multi-purpose sports facility with Olympic-standard amenities.",
    startDate: "2023-09-01",
    endDate: "2025-06-30",
    team: 45,
    budget: "AED 80M",
  },
  {
    id: "6",
    name: "Jebel Hafeet Observatory",
    nameAr: "مرصد جبل حفيت",
    status: "completed",
    completion: 100,
    location: { x: 80, y: 40 },
    description: "Advanced astronomical observatory on Jebel Hafeet mountain.",
    startDate: "2021-05-01",
    endDate: "2023-03-15",
    team: 20,
    budget: "AED 25M",
  },
  {
    id: "7",
    name: "Al Ain Medical Center",
    nameAr: "مركز العين الطبي",
    status: "in-progress",
    completion: 85,
    location: { x: 40, y: 45 },
    description: "Modern healthcare facility with specialized medical services.",
    startDate: "2022-08-01",
    endDate: "2024-04-30",
    team: 60,
    budget: "AED 120M",
  },
  {
    id: "8",
    name: "Palm Gardens Residential",
    nameAr: "حدائق النخيل السكنية",
    status: "planned",
    completion: 0,
    location: { x: 55, y: 75 },
    description: "Luxury residential development with landscaped gardens.",
    startDate: "2024-06-01",
    endDate: "2026-12-31",
    team: 35,
    budget: "AED 90M",
  },
  {
    id: "9",
    name: "Al Ain Innovation District",
    nameAr: "منطقة العين للابتكار",
    status: "planned",
    completion: 0,
    location: { x: 35, y: 30 },
    description: "Business and innovation hub for startups and tech companies.",
    startDate: "2024-09-01",
    endDate: "2027-03-31",
    team: 40,
    budget: "AED 150M",
  },
  {
    id: "10",
    name: "Desert Bloom Park",
    nameAr: "حديقة زهرة الصحراء",
    status: "completed",
    completion: 100,
    location: { x: 50, y: 55 },
    description: "Large public park with native desert flora and recreational facilities.",
    startDate: "2022-01-01",
    endDate: "2023-08-15",
    team: 30,
    budget: "AED 35M",
  },
  {
    id: "11",
    name: "Al Ain Cultural Museum",
    nameAr: "متحف العين الثقافي",
    status: "in-progress",
    completion: 70,
    location: { x: 65, y: 35 },
    description: "Museum showcasing the rich cultural heritage of the UAE.",
    startDate: "2023-02-15",
    endDate: "2024-11-30",
    team: 25,
    budget: "AED 40M",
  },
  {
    id: "12",
    name: "Sunrise Business Tower",
    nameAr: "برج شروق الأعمال",
    status: "planned",
    completion: 0,
    location: { x: 45, y: 65 },
    description: "Modern office tower for business and commercial activities.",
    startDate: "2024-12-01",
    endDate: "2027-06-30",
    team: 55,
    budget: "AED 200M",
  },
  {
    id: "13",
    name: "Al Ain Water Treatment Plant",
    nameAr: "محطة معالجة مياه العين",
    status: "in-progress",
    completion: 90,
    location: { x: 20, y: 40 },
    description: "Advanced water treatment facility for sustainable water management.",
    startDate: "2022-10-01",
    endDate: "2024-03-31",
    team: 40,
    budget: "AED 75M",
  },
  {
    id: "14",
    name: "Golden Sands Resort",
    nameAr: "منتجع الرمال الذهبية",
    status: "planned",
    completion: 0,
    location: { x: 75, y: 70 },
    description: "Luxury desert resort with world-class amenities.",
    startDate: "2025-01-01",
    endDate: "2027-12-31",
    team: 70,
    budget: "AED 300M",
  },
  {
    id: "15",
    name: "Al Ain Solar Farm",
    nameAr: "مزرعة العين الشمسية",
    status: "completed",
    completion: 100,
    location: { x: 85, y: 55 },
    description: "Large-scale solar energy facility for renewable power generation.",
    startDate: "2021-03-01",
    endDate: "2022-11-30",
    team: 35,
    budget: "AED 180M",
  },
  {
    id: "16",
    name: "Heritage Village Restoration",
    nameAr: "ترميم القرية التراثية",
    status: "in-progress",
    completion: 55,
    location: { x: 60, y: 80 },
    description: "Restoration and preservation of traditional Emirati village.",
    startDate: "2023-04-01",
    endDate: "2024-12-31",
    team: 28,
    budget: "AED 50M",
  },
]

export default function SixteenProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const router = useRouter()

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-400/30"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30"
      case "planned":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    }
  }

  const getStatusText = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      case "planned":
        return "Planned"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.05)_60deg,transparent_120deg)]" />

      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="outline"
        size="sm"
        className="absolute top-6 left-6 z-50 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 bg-slate-900/50 backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex h-screen">
        {/* Main Map Area */}
        <div className="flex-1 relative">
          {/* Satellite Image with Dark Overlays */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/images/al-ain-16-projects-satellite.png"
              alt="Al Ain 16 Projects Satellite View"
              fill
              className="object-cover"
              priority
            />

            {/* Greenish dark contrast mask - positioned between image and markers */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/30 via-slate-800/20 to-slate-700/10" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/40 via-slate-800/20 to-transparent" />

            {/* Project Markers */}
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${project.location.x}%`,
                  top: `${project.location.y}%`,
                }}
              >
                {/* Marker Container */}
                <div className="relative group">
                  {/* Small circle marker */}
                  <div
                    className="w-3 h-3 bg-white rounded-full border border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() => setSelectedProject(project)}
                    style={{
                      boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />

                  {/* Dotted line */}
                  <div
                    className="absolute bottom-4 left-2 w-0.5 h-12 opacity-80"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 4px, transparent 4px, transparent 8px)",
                    }}
                  />

                  {/* Project label */}
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/${project.id}?name=${encodeURIComponent(project.name)}&nameAr=${encodeURIComponent(project.nameAr)}`,
                      )
                    }
                    className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-1 py-0.5 bg-white hover:bg-black text-black hover:text-white rounded-full border-2 border-solid transition-all duration-300 cursor-pointer font-sans font-medium shadow-lg hover:shadow-blue-500/50 hover:ring-2 hover:ring-blue-400 hover:scale-110"
                    style={{
                      animationDelay: `${index * 0.1 + 0.2}s`,
                    }}
                  >
                    <span className="tracking-normal leading-snug whitespace-nowrap overflow-hidden text-ellipsis font-sans font-semibold antialiased text-[8px]">
                      {project.name}
                    </span>
                  </button>

                  {/* Project Number */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-cyan-400/30 shadow-lg">
                    {project.id}
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-slate-900/95 text-white text-sm px-3 py-2 rounded-lg border border-cyan-400/30 backdrop-blur-sm shadow-xl whitespace-nowrap">
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-slate-400 text-xs">{project.nameAr}</div>
                      <div className="text-xs mt-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Bottom Panel */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-40">
          {selectedProject && (
            <Card className="m-4 bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-2 border-cyan-400/30 shadow-xl shadow-cyan-400/20 backdrop-blur-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-cyan-400 mb-1">{selectedProject.name}</CardTitle>
                    <p className="text-sm text-slate-400 mb-2">{selectedProject.nameAr}</p>
                    <Badge className={`text-xs ${getStatusColor(selectedProject.status)}`}>
                      {getStatusText(selectedProject.status)} - {selectedProject.completion}%
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setSelectedProject(null)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <div className="pt-0 px-6 pb-6">
                <p className="text-sm text-slate-300 mb-4">{selectedProject.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedProject.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{selectedProject.team} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building className="w-4 h-4" />
                    <span>{selectedProject.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>Project #{selectedProject.id}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
