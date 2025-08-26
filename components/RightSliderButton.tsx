"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from "next/image"
import { useMobile } from "@/hooks/use-mobile"
import { useImperativeHandle, forwardRef, useEffect } from "react"
import type { JSX } from "react/jsx-runtime"

interface ProjectsDetailsSliderProps {
  projects: {
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  }[]
  onProjectClick: (project: {
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  }) => void
}

const ProjectsDetailsSlider = ({ projects, onProjectClick }: ProjectsDetailsSliderProps): JSX.Element => {
  return (
    <div className="relative w-[280px] h-[600px] bg-[#0a192f]/90 rounded-[52px_52px_0px_52px] shadow-[-12px_4px_4px_-3px_#00000059,0px_4px_4px_#00000040]">
      <div className="flex flex-col w-[240px] items-center justify-center gap-[18px] absolute top-[20px] left-[20px]">
        <h1 className="relative w-[200px] h-[36px] mt-[-1px] [font-family:'Inter',Helvetica] font-bold text-white text-[26px] tracking-[0] leading-normal">
          Projects Details
        </h1>

        <div className="flex justify-around w-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 opacity-75 blur-[2px] group-hover:blur-[3px] transition-all duration-300"></div>
              <div className="absolute inset-[1px] rounded-full bg-black"></div>
              <div className="absolute inset-[2px] rounded-full border-[1.5px] border-white opacity-10"></div>
              <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,0,255,0.7),0_0_15px_rgba(0,170,255,0.5)] group-hover:shadow-[0_0_15px_rgba(255,0,255,0.8),0_0_20px_rgba(0,170,255,0.6)] transition-all duration-300"></div>
              <span className="text-white font-bold relative z-10 text-sm group-hover:scale-110 transition-transform duration-300">
                {projects.length}
              </span>
            </div>
            <p className="text-xs text-white mt-1 group-hover:text-blue-300 transition-colors">All</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-75 blur-[2px] group-hover:blur-[3px] transition-all duration-300"></div>
              <div className="absolute inset-[1px] rounded-full bg-black"></div>
              <div className="absolute inset-[2px] rounded-full border-[1.5px] border-white opacity-10"></div>
              <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(0,255,127,0.7),0_0_15px_rgba(0,170,255,0.5)] group-hover:shadow-[0_0_15px_rgba(0,255,127,0.8),0_0_20px_rgba(0,170,255,0.6)] transition-all duration-300"></div>
              <span className="text-white font-bold relative z-10 text-sm group-hover:scale-110 transition-transform duration-300">
                24
              </span>
            </div>
            <p className="text-xs text-white mt-1 group-hover:text-green-300 transition-colors">Active</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 opacity-75 blur-[2px] group-hover:blur-[3px] transition-all duration-300"></div>
              <div className="absolute inset-[1px] rounded-full bg-black"></div>
              <div className="absolute inset-[2px] rounded-full border-[1.5px] border-white opacity-10"></div>
              <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,165,0,0.7),0_0_15px_rgba(255,69,0,0.5)] group-hover:shadow-[0_0_15px_rgba(255,165,0,0.8),0_0_20px_rgba(255,69,0,0.6)] transition-all duration-300"></div>
              <span className="text-white font-bold relative z-10 text-sm group-hover:scale-110 transition-transform duration-300">
                14
              </span>
            </div>
            <p className="text-xs text-white mt-1 group-hover:text-yellow-300 transition-colors">Construction</p>
          </div>
        </div>

        <ScrollArea className="w-full h-[420px] pr-2">
          <div className="flex flex-col items-start gap-[16.57px] w-full">
            {projects.map((project) => {
              const projectId = `project-${project.id}`
              const markerName = project.projectNameAr

              return (
                <div
                  key={projectId}
                  id={projectId}
                  data-marker-name={markerName}
                  data-project-id={project.id}
                  onClick={() => {
                    console.log(`Clicked project: ${project.projectNameEn} (${markerName})`)
                    onProjectClick(project)
                    const zoomEvent = new CustomEvent("zoomToMarker", {
                      detail: {
                        coordinates: project.coordinates,
                        name: markerName,
                        projectId: projectId,
                        projectNameEn: project.projectNameEn,
                        project: { ...project },
                        hideOthers: true,
                        source: "rightSlider",
                        timestamp: Date.now(),
                        animation: {
                          duration: 1500,
                          easing: "easeOutCubic",
                          zoom: 13,
                        },
                      },
                    })
                    window.dispatchEvent(zoomEvent)
                    const leftSliderEvent = new CustomEvent("openLeftSlider", {
                      detail: {
                        project: { ...project },
                        projectId: projectId,
                        source: "rightSlider",
                        timestamp: Date.now(),
                        animation: true,
                      },
                    })
                    window.dispatchEvent(leftSliderEvent)
                    document.querySelectorAll("[data-project-id]").forEach((el) => {
                      el.classList.remove("selected-project")
                      el.setAttribute("aria-selected", "false")
                    })
                    const selectedElement = document.getElementById(projectId)
                    if (selectedElement) {
                      selectedElement.classList.add("selected-project")
                      selectedElement.setAttribute("aria-selected", "true")
                      selectedElement.style.transform = "scale(1.05)"
                      setTimeout(() => {
                        selectedElement.style.transform = "scale(1)"
                      }, 300)
                    }
                  }}
                  className="cursor-pointer w-full transition-all duration-300 hover:scale-[1.02]"
                  role="button"
                  aria-selected="false"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      e.currentTarget.click()
                    }
                  }}
                >
                  <Card className="relative w-[240px] h-[85px] bg-transparent border border-cyan-500/30 hover:border-cyan-400/70 rounded-lg overflow-hidden group flex flex-col shadow-[0_0_8px_rgba(0,200,255,0.15)] transition-all duration-300">
                    <CardContent className="p-0 relative flex items-center flex-row-reverse bg-black/20 backdrop-blur-sm text-gray-300">
                      <div className="flex flex-col w-[160px] h-[36px] items-center justify-center absolute top-6 left-0 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300 z-10">
                        <div className="relative self-stretch h-[20px] mt-[-0.77px] [font-family:'Tajawal',Helvetica] font-bold text-white text-sm text-left tracking-[0] leading-normal [direction:rtl]">
                          {project.projectNameAr}
                        </div>
                        <div className="relative self-stretch [font-family:'Inter',Helvetica] font-bold text-white text-[12px] tracking-[0] leading-[normal]">
                          {project.projectNameEn}
                        </div>
                      </div>
                      <Image
                        className="absolute w-[65px] h-[85px] top-0 right-0 group-hover:w-[240px] transition-all duration-300 object-cover z-0"
                        alt={`${project.projectNameEn} project`}
                        src={project.imageSrc || "/placeholder.svg"}
                        width={100}
                        height={85}
                      />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 opacity-0 selected-indicator transition-opacity duration-300"></div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  )
}

interface RightSliderButtonProps {
  isOpen: boolean
  onClose: () => void
  toggleProjects: () => void
  openLeftSlider: (project: {
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  }) => void
}

export const RightSliderButton = forwardRef<{ openLeftSlider: (project: any) => void }, RightSliderButtonProps>(
  ({ isOpen, onClose, toggleProjects, openLeftSlider }, ref) => {
    const isMobile = useMobile()

    useImperativeHandle(
      ref,
      () => ({
        openLeftSlider: (project) => {
          if (typeof openLeftSlider === "function") {
            openLeftSlider(project)
          }
        },
      }),
      [openLeftSlider],
    )

    // Keep the event listeners but don't do anything with them
    useEffect(() => {
      const style = document.createElement("style")
      style.textContent = `
        .selected-project .card {
          border-color: rgba(6, 182, 212, 0.8) !important;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.4) !important;
        }
        .selected-project .selected-indicator {
          opacity: 1 !important;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(6, 182, 212, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
          }
        }
        .selected-project {
          position: relative;
        }
        .selected-project::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #06b6d4, #a855f7);
          border-radius: 4px 0 0 4px;
        }
      `
      document.head.appendChild(style)

      const handleMarkerClick = (event: CustomEvent) => {
        if (event.detail?.source === "map" && event.detail?.name) {
          const projectElement = document.querySelector(`[data-marker-name="${event.detail.name}"]`)
          if (projectElement) {
            document.querySelectorAll("[data-project-id]").forEach((el) => {
              el.classList.remove("selected-project")
              el.setAttribute("aria-selected", "false")
            })
            projectElement.classList.add("selected-project")
            projectElement.setAttribute("aria-selected", "true")
            projectElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
            projectElement.style.transform = "scale(1.05)"
            setTimeout(() => {
              projectElement.style.transform = "scale(1)"
            }, 300)
          }
        }
      }

      window.addEventListener("markerClick", handleMarkerClick as EventListener)

      return () => {
        document.head.removeChild(style)
        window.removeEventListener("markerClick", handleMarkerClick as EventListener)
      }
    }, [])

    useEffect(() => {
      const handleZoomToMarker = (event: CustomEvent) => {
        console.log("Zoom to marker event received in RightSliderButton:", event.detail)
      }

      const handleOpenLeftSlider = (event: CustomEvent) => {
        if (event.detail?.source !== "rightSlider" && event.detail?.project) {
          if (typeof openLeftSlider === "function") {
            openLeftSlider(event.detail.project)
          }
        }
      }

      window.addEventListener("zoomToMarker", handleZoomToMarker as EventListener)
      window.addEventListener("openLeftSlider", handleOpenLeftSlider as EventListener)

      return () => {
        window.removeEventListener("zoomToMarker", handleZoomToMarker as EventListener)
        window.removeEventListener("openLeftSlider", handleOpenLeftSlider as EventListener)
      }
    }, [openLeftSlider])

    return <>{/* Button has been removed */}</>
  },
)

RightSliderButton.displayName = "RightSliderButton"

export default RightSliderButton
