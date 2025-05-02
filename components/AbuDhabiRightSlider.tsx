"use client"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface ProjectsDetailsSliderProps {
  projects: { id: number; imageSrc: string; projectNameAr: string; projectNameEn: string }[]
  onProjectClick: (projectId: number) => void
}

const ProjectsDetailsSlider = ({ projects, onProjectClick }: ProjectsDetailsSliderProps): JSX.Element => {
  return (
    <div className="relative w-[280px] h-[600px] bg-[#0a192f]/90 backdrop-blur-sm border-r border-cyan-500/30 rounded-lg shadow-lg overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] before:bg-[length:20px_20px] before:opacity-10 before:z-0">
      {/* Top decorative element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>

      {/* Animated corner elements */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 animate-pulse"></div>

      <div className="flex flex-col w-full h-full p-4 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-400">Abu Dhabi Projects</h2>
          <div className="text-xs text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/30">LIVE</div>
        </div>

        <div className="flex justify-around w-full mb-4 relative before:content-[''] before:absolute before:inset-0 before:bg-[#0a1a3d]/40 before:rounded-xl before:backdrop-blur-sm before:z-0 p-2 rounded-xl border border-cyan-500/10">
          <Button
            variant="ghost"
            className="flex flex-col items-center hover:bg-blue-900/20 rounded-md relative z-10 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg border border-blue-300/30 group-hover:shadow-blue-500/40 transition-all duration-300">
              <span className="relative z-10">42</span>
            </div>
            <p className="text-xs text-cyan-300 mt-1 group-hover:text-cyan-200">All</p>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center hover:bg-green-900/20 rounded-md relative z-10 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold shadow-lg border border-green-300/30 group-hover:shadow-green-500/40 transition-all duration-300">
              <span className="relative z-10">28</span>
            </div>
            <p className="text-xs text-green-300 mt-1 group-hover:text-green-200">Active</p>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center hover:bg-yellow-900/20 rounded-md relative z-10 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white flex items-center justify-center font-bold shadow-lg border border-yellow-300/30 group-hover:shadow-yellow-500/40 transition-all duration-300">
              <span className="relative z-10">14</span>
            </div>
            <p className="text-xs text-yellow-300 mt-1 group-hover:text-yellow-200">Construction</p>
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-2 relative z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[50px] before:bg-gradient-to-b before:from-[#0a192f] before:to-transparent before:z-20 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[50px] after:bg-gradient-to-t after:from-[#0a192f] after:to-transparent after:z-20">
          <div className="flex flex-col gap-3 w-full">
            {projects.map((project) => (
              <div key={project.id} onClick={() => onProjectClick(project.id)} className="cursor-pointer">
                <div className="vue-card bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-3 rounded border border-cyan-900/30 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-start space-x-3">
                    <div className="vue-icon-container">
                      <MapPin size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-cyan-300 font-medium mb-1">{project.projectNameEn}</div>
                      <div className="text-xs text-slate-400 mb-2">{project.projectNameAr}</div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs px-2 py-0.5 bg-cyan-900/30 text-cyan-400 rounded-full border border-cyan-500/30">
                          Active
                        </div>
                        <div className="text-xs text-slate-500">35% Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="pt-3 mt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 flex justify-between">
            <span>v1.2.4</span>
            <span>Last updated: 2h ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AbuDhabiRightSliderProps {
  isOpen: boolean
  onClose: () => void
  toggleProjects: () => void
  openLeftSlider: (projectId: number) => void
}

export const AbuDhabiRightSlider = ({
  isOpen,
  onClose,
  toggleProjects,
  openLeftSlider,
}: AbuDhabiRightSliderProps): JSX.Element => {
  // Project data for mapping
  const projects = [
    {
      id: 1,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2021/09/11/udHX1aAW-corniche-1200x900.jpg",
      projectNameAr: "كورنيش أبوظبي",
      projectNameEn: "Abu Dhabi Corniche",
    },
    {
      id: 2,
      imageSrc: "https://www.bayut.com/blog/wp-content/uploads/2019/06/Sheikh-Zayed-Grand-Mosque-FAQs-Cover-27-06.jpg",
      projectNameAr: "مسجد الشيخ زايد الكبير",
      projectNameEn: "Sheikh Zayed Grand Mosque",
    },
    {
      id: 3,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/06/13/Qasr-Al-Watan-1200x900.jpg",
      projectNameAr: "قصر الوطن",
      projectNameEn: "Qasr Al Watan",
    },
    {
      id: 4,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Yas-Island-Abu-Dhabi.jpg",
      projectNameAr: "جزيرة ياس",
      projectNameEn: "Yas Island",
    },
    {
      id: 5,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Ferrari-World-Abu-Dhabi.jpg",
      projectNameAr: "عالم فيراري أبوظبي",
      projectNameEn: "Ferrari World Abu Dhabi",
    },
    {
      id: 6,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Warner-Bros-World-Abu-Dhabi.jpg",
      projectNameAr: "عالم وارنر براذرز أبوظبي",
      projectNameEn: "Warner Bros. World Abu Dhabi",
    },
    {
      id: 7,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Louvre-Abu-Dhabi.jpg",
      projectNameAr: "متحف اللوفر أبوظبي",
      projectNameEn: "Louvre Abu Dhabi",
    },
    {
      id: 8,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Emirates-Palace-Abu-Dhabi.jpg",
      projectNameAr: "قصر الإمارات",
      projectNameEn: "Emirates Palace",
    },
    {
      id: 9,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Etihad-Towers-Abu-Dhabi.jpg",
      projectNameAr: "أبراج الاتحاد",
      projectNameEn: "Etihad Towers",
    },
    {
      id: 10,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Mangrove-National-Park-Abu-Dhabi.jpg",
      projectNameAr: "منتزه القرم الوطني",
      projectNameEn: "Mangrove National Park",
    },
    {
      id: 11,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Saadiyat-Island-Abu-Dhabi.jpg",
      projectNameAr: "جزيرة السعديات",
      projectNameEn: "Saadiyat Island",
    },
    {
      id: 12,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Yas-Waterworld-Abu-Dhabi.jpg",
      projectNameAr: "ياس ووتروورلد أبوظبي",
      projectNameEn: "Yas Waterworld Abu Dhabi",
    },
    {
      id: 13,
      imageSrc:
        "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Observation-Deck-at-300-Abu-Dhabi.jpg",
      projectNameAr: "منصة المراقبة عند 300",
      projectNameEn: "Observation Deck at 300",
    },
    {
      id: 14,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Heritage-Village-Abu-Dhabi.jpg",
      projectNameAr: "قرية التراث",
      projectNameEn: "Heritage Village",
    },
    {
      id: 15,
      imageSrc: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2023/05/24/Al-Maryah-Island-Abu-Dhabi.jpg",
      projectNameAr: "جزيرة المارية",
      projectNameEn: "Al Maryah Island",
    },
  ]

  const handleProjectClick = (projectId: number) => {
    // Open the left slider with the selected project
    openLeftSlider(projectId)
  }

  return (
    <div
      className={cn(
        "fixed top-[5rem] sm:top-16 md:top-[4.5rem] right-0 max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-4.5rem)] w-[280px] transform transition-transform ease-out-expo duration-500 z-[99999] shadow-md bg-[#030011]/80 overflow-y-auto",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <ProjectsDetailsSlider projects={projects} onProjectClick={handleProjectClick} />
    </div>
  )
}
