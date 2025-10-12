"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import anime from "animejs"

// Update the Image component in the header section to use the logo from data file
import { logos } from "@/data/logos"

// Updated projects array with all 38 projects
const projects = [
  {
    name: "إدارة التأهيل الشرطي - الفوعة",
    type: "Training",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%206-msaqQYoO32C9QtvO3EKPwUdbpZ7UtV.png", // Updated image URL
  },
  {
    name: "مركز شرطة هيلي",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-Qdagb16LpBmW2fjIf1P6WakG33fe9p.png",
  },
  {
    name: "مركز شرطة الهير",
    type: "Police Station",
    status: "Active",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "مركز شرطة سويحان",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-MVmgpl1O9Rfk3O22gW1LPWWCDJxRbw.png",
  },
  {
    name: "قسم موسيقى شرطة أبوظبي",
    type: "Special Unit",
    status: "Active",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "مركز شرطة الجيمي القديم",
    type: "Police Station",
    status: "Active", // Changed from "Historical" to "Active"
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "مركز شرطة المربعة",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image4-HfGqJ9fWupMT0wTBz3AQKOyHadpUSQ.png",
  },
  {
    name: "ميدان الرماية (بدع بنت سعود)",
    type: "Training",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image2-XepPUlokzxkqDX509F1f3NcePPIO8n.png",
  },
  {
    name: "متحف شرطة المربعة",
    type: "Museum",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image5-OCPo2zqOwofKNHqaKd1uGqMTFycEkX.png",
  },
  {
    name: "مركز شرطة الساد",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-Ros8LnbfFMuiD9Fde15LynNSvvxYS4.png",
  },
  {
    name: "ساحة حجز المركبات الساد",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image1-bqC0dI3sIwgFqshr21kIC6AGkP4Skg.png",
  },
  {
    name: "إدارة المهام الخاصة",
    type: "Special Unit",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%207-WSyPPxf3kXCOtezcpFzfyl50RuFMVc.png",
  },
  {
    name: "مركز شرطة فلج هزاع",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image4-FyF23H0FsMEq42HX6ZuY60XV93VSvr.png",
  },
  {
    name: "إدارة المرور والترخيص",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%206-ZK0GEUDK3kyoVwW0I2nmzCtSl2mXVj.png",
  },
  {
    name: "قسم هندسة المرور",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%208-TqUYBXuhvE48vvPpH0ongDm4kKIFTa.png",
  },
  {
    name: "المتابعة الشرطية والرعاية اللاحقة",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image9-DAEsy8FX4QsHhqfWBIml8EwGbZUZrm.png",
  },
  {
    name: "المعهد المروري",
    type: "Training",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-d9Rc0uHJkafsJIzeBHw1ivl47TdTpD.png",
  },
  // Update the remaining projects to use the same set of images in rotation
  {
    name: "إدارة الأسلحة والمتفجرات",
    type: "Special Unit",
    status: "Active",
    // Changed from weapons image to building image
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%207-WSyPPxf3kXCOtezcpFzfyl50RuFMVc.png",
  },
  {
    name: "فلل فلج هزاع",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image5-OCPo2zqOwofKNHqaKd1uGqMTFycEkX.png",
  },
  {
    name: "الضبط المروري والمراسم",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-Ros8LnbfFMuiD9Fde15LynNSvvxYS4.png",
  },
  {
    name: "قسم الدوريات الخاصة",
    type: "Special Unit",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image1-bqC0dI3sIwgFqshr21kIC6AGkP4Skg.png",
  },
  {
    name: "سكن أفراد المرور",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image4-FyF23H0FsMEq42HX6ZuY60XV93VSvr.png",
  },
  {
    name: "إدارة الدوريات الخاصة",
    type: "Special Unit",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%206-ZK0GEUDK3kyoVwW0I2nmzCtSl2mXVj.png",
  },
  {
    name: "قسم التفتيش الأمني K9",
    type: "Special Unit",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%208-TqUYBXuhvE48vvPpH0ongDm4kKIFTa.png",
  },
  {
    name: "ساحة حجز المركبات فلج هزاع",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image9-DAEsy8FX4QsHhqfWBIml8EwGbZUZrm.png",
  },
  {
    name: "مبنى التحريات والمخدرات",
    type: "Special Unit",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-d9Rc0uHJkafsJIzeBHw1ivl47TdTpD.png",
  },
  {
    name: "مديرية شرطة العين",
    type: "Headquarters",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%207-WSyPPxf3kXCOtezcpFzfyl50RuFMVc.png",
  },
  {
    name: "نادي ضباط الشرطة",
    type: "Recreation",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image5-OCPo2zqOwofKNHqaKd1uGqMTFycEkX.png",
  },
  {
    name: "فرع النقل والمشاغل",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-Ros8LnbfFMuiD9Fde15LynNSvvxYS4.png",
  },
  {
    name: "مركز شرطة المقام",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image1-bqC0dI3sIwgFqshr21kIC6AGkP4Skg.png",
  },
  {
    name: "فلل للادات الشرطية عشارج",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image4-FyF23H0FsMEq42HX6ZuY60XV93VSvr.png",
  },
  {
    name: "مبنى إدارات",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%206-ZK0GEUDK3kyoVwW0I2nmzCtSl2mXVj.png",
  },
  {
    name: "فرع الضبط المروري (الخزنة)",
    type: "Support",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%208-TqUYBXuhvE48vvPpH0ongDm4kKIFTa.png",
  },
  {
    name: "مركز شرطة رماح",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image9-DAEsy8FX4QsHhqfWBIml8EwGbZUZrm.png",
  },
  {
    name: "مركز شرطة زاخر",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-d9Rc0uHJkafsJIzeBHw1ivl47TdTpD.png",
  },
  {
    name: "مركز شرطة الوقن",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%207-WSyPPxf3kXCOtezcpFzfyl50RuFMVc.png",
  },
  {
    name: "مركز شرطة الظاهر",
    type: "Police Station",
    status: "Under Construction",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image5-OCPo2zqOwofKNHqaKd1uGqMTFycEkX.png",
  },
  {
    name: "مركز شرطة الفقع",
    type: "Police Station",
    status: "Under Construction",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-Ros8LnbfFMuiD9Fde15LynNSvvxYS4.png",
  },
  {
    name: "مركز شرطة القوع",
    type: "Police Station",
    status: "Under Construction",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image1-bqC0dI3sIwgFqshr21kIC6AGkP4Skg.png",
  },
  {
    name: "نقطة ثبات الروضة",
    type: "Police Station",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image4-FyF23H0FsMEq42HX6ZuY60XV93VSvr.png",
  },
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
}

export function AlAinProjects({ isOpen, onClose }: AlAinProjectsProps) {
  const [selectedType, setSelectedType] = useState<ProjectType>("All")
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("All")
  const projectsRef = useRef<HTMLDivElement>(null)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

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

  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="h-full bg-gradient-to-b from-[#1b1f3a] to-black border-l border-[#333] relative z-[99999]">
      {/* Rest of the component JSX remains the same, just remove the trigger button */}
      {/* ... */}
      <div
        className={cn(
          "projects-panel fixed inset-y-0 right-0 w-80 text-white shadow-2xl rounded-l-2xl",
          "transform transition-all duration-300 ease-in-out",
          "border-l border-[#333] z-[99999]", // Added z-index here
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="relative h-full">
          {/* Update the glowing border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

          <div className="flex items-center justify-between p-6 border-b border-[#333]">
            {/* Update the logo section in the header */}
            <div className="flex items-center gap-6">
              {/* Update the logo container div to remove cursor pointer and add pointer-events-none */}
              <div className="logo-container pointer-events-none">
                <img
                  src={logos.rcc.url || "/placeholder.svg"}
                  alt={logos.rcc.alt}
                  className="relative z-10 w-[95%] h-[95%] object-contain"
                />
                <div className="logo-text">
                  <div className="logo-text-arabic">{logos.rcc.arabicText}</div>
                  <div className="logo-text-english">{logos.rcc.englishText}</div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold">{filteredProjects.length}</span>
                  <span className="text-sm text-gray-400">of {projects.length} projects</span>
                </div>
                <div className="flex gap-3 mt-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded-full">
                      {projects.filter((p) => p.status === "Active").length} Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-yellow-400 bg-yellow-900/50 px-2 py-0.5 rounded-full">
                      {projects.filter((p) => p.status === "Under Construction").length} Under Construction
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/10 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Close projects panel</span>
            </Button>
          </div>

          {/* Update the search and filter section */}
          <div className="p-6 border-b border-[#333]">
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ProjectType)}>
                <SelectTrigger className="bg-[#1b1f3a]/80 border-[#333] text-white hover:bg-[#1b1f3a] transition-colors duration-200">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1b1f3a] border-[#333] z-[99999]">
                  <SelectItem value="All" className="text-white hover:bg-zinc-800">
                    All Types
                  </SelectItem>
                  <SelectItem value="Police Station" className="text-white hover:bg-zinc-800">
                    Police Station
                  </SelectItem>
                  <SelectItem value="Training" className="text-white hover:bg-zinc-800">
                    Training
                  </SelectItem>
                  <SelectItem value="Special Unit" className="text-white hover:bg-zinc-800">
                    Special Unit
                  </SelectItem>
                  <SelectItem value="Support" className="text-white hover:bg-zinc-800">
                    Support
                  </SelectItem>
                  <SelectItem value="Headquarters" className="text-white hover:bg-zinc-800">
                    Headquarters
                  </SelectItem>
                  <SelectItem value="Museum" className="text-white hover:bg-zinc-800">
                    Museum
                  </SelectItem>
                  <SelectItem value="Recreation" className="text-white hover:bg-zinc-800">
                    Recreation
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ProjectStatus)}>
                <SelectTrigger className="bg-[#1b1f3a]/80 border-[#333] text-white hover:bg-[#1b1f3a] transition-colors duration-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1b1f3a] border-[#333] z-[99999]">
                  <SelectItem value="All" className="text-white hover:bg-white/10">
                    All Status
                  </SelectItem>
                  <SelectItem value="Active" className="text-white hover:bg-white/10">
                    Active
                  </SelectItem>
                  <SelectItem value="Under Construction" className="text-white hover:bg-white/10">
                    Under Construction
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Update the projects list section */}
          <ScrollArea className="h-[calc(100vh-11rem)] hover:bg-[#1b1f3a]/50 transition-colors duration-300 rounded-lg relative z-[99999]">
            <div ref={projectsRef} className="grid gap-4 p-6">
              {filteredProjects.map((project, index) => (
                <div
                  key={index}
                  className={cn(
                    "project-card group relative rounded-lg overflow-hidden",
                    "hover:scale-[1.02] hover:-translate-y-0.5",
                    "transition-all duration-300",
                    hoveredProject === project.name ? "ring-2 ring-[#444]" : "",
                  )}
                  onMouseEnter={() => handleProjectHover(project.name)}
                  onMouseLeave={handleProjectLeave}
                >
                  <div className="aspect-video relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 384px) 100vw, 384px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 w-full p-4">
                    <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">{project.name}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-200 bg-zinc-800/80 px-2 py-1 rounded-md backdrop-blur-sm">
                        {project.type}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-medium",
                          project.status === "Active" &&
                            "bg-emerald-900/50 text-emerald-400 border border-emerald-500/30",
                          project.status === "Under Construction" &&
                            "bg-yellow-900/50 text-yellow-400 border border-yellow-500/30",
                        )}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-zinc-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
