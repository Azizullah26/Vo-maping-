"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from "next/image"

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
              return (
                <div key={project.id} onClick={() => onProjectClick(project)} className="cursor-pointer">
                  <Card
                    key={project.id}
                    className="relative w-[240px] h-[85px] bg-transparent border border-cyan-500/30 hover:border-cyan-400/70 rounded-lg overflow-hidden group flex flex-col shadow-[0_0_8px_rgba(0,200,255,0.15)] transition-all duration-300"
                  >
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
                        alt="Construction project"
                        src={project.imageSrc || "/placeholder.svg"}
                        width={100}
                        height={85}
                      />
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

export const RightSliderButton = ({
  isOpen,
  onClose,
  toggleProjects,
  openLeftSlider,
}: RightSliderButtonProps): JSX.Element => {
  // Project data for mapping
  const projects = [
    {
      id: 1,
      imageSrc: "https://citytouruae.com/wp-content/uploads/2021/09/Al-Ain-city-1-600x590.jpg",
      projectNameAr: "قسم موسيقى شرطة أبوظبي",
      projectNameEn: "Abu Dhabi Police Music Department",
      coordinates: [55.80752936967028, 24.342548523036186],
    },
    {
      id: 2,
      imageSrc: "https://c8.alamy.com/comp/K3KAFH/uae-al-ain-skyline-from-zayed-bin-sultan-street-K3KAFH.jpg",
      projectNameAr: "إدارة التأهيل الشرطي - الفوعة",
      projectNameEn: "Police Rehabilitation Department - Al Foua",
      coordinates: [55.804094143988124, 24.33356950894388],
    },
    {
      id: 3,
      imageSrc: "https://www.propertyfinder.ae/blog/wp-content/uploads/2023/07/3-14.jpg",
      projectNameAr: "مركز شرطة هيلي",
      projectNameEn: "Hili Police Station",
      coordinates: [55.76486147272425, 24.277296159962688],
    },
    {
      id: 4,
      imageSrc: "https://media-cdn.tripadvisor.com/media/photo-s/06/53/d8/8e/city-seasons-hotel-al.jpg",
      projectNameAr: "ميدان الشرطة بدع بنت سعود",
      projectNameEn: "Police Square in Bida Bint Saud",
      coordinates: [55.73906058820131, 24.307406827212986],
    },
    {
      id: 5,
      imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP2QgVN8QLQxgnvTH8hVSuL2gqC8s2D_7CqA&s",
      projectNameAr: "متحف شرطة المربعة",
      projectNameEn: "Al Murabba Police Museum",
      coordinates: [55.776750053389094, 24.221008086930823],
    },
    {
      id: 6,
      imageSrc:
        "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_267,q_40,w_400/hotelier-images/cb/6f/dedc57f138551de78e7919b395b1a380cc620aaa8b27da05282b37f64ff8.jpeg",
      projectNameAr: "مركز شرطة المربعة",
      projectNameEn: "Al Murabba Police Station",
      coordinates: [55.776750053389094, 24.221008086930823],
    },
    {
      id: 7,
      imageSrc: "https://photos.hotelbeds.com/giata/bigger/10/107054/107054a_hb_a_001.jpg",
      projectNameAr: "مديرية شرطة العين",
      projectNameEn: "Al Ain Police Directorate",
      coordinates: [55.7404449670278, 24.233199622911968],
    },
    {
      id: 8,
      imageSrc:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcitytouruae.com%2Fbooking%2Fal-ain-city-tour-from-dubai%2F&psig=AOvVaw1YrwP1vVo5REw6ZGToy1A6&ust=1745305764040000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKiIk-XI6IwDFQAAAAAdAAAAABBF",
      projectNameAr: "فرع النقل والمشاغل",
      projectNameEn: "Transportation and Workshops Branch",
      coordinates: [55.74303931401195, 24.2348982203018],
    },
    {
      id: 9,
      imageSrc:
        "https://abudhabiculture.ae/-/media/Project/abudhabiculture/abudhabiculture/images/cultural-sites/al-ain-palace-museum/al-ain-palace-museum-gallery-1.ashx?h=500&la=en&w=1328&hash=68A962BD4D013726E91B545ADD810E59",
      projectNameAr: "نادي ضباط الشرطة",
      projectNameEn: "Police Officers Club",
      coordinates: [55.74130397171359, 24.235157925682785],
    },
    {
      id: 10,
      imageSrc: "https://whatson.ae/wp-content/uploads/2021/03/Al-Ain-Oasis.jpeg",
      projectNameAr: "مركز شرطة زاخر",
      projectNameEn: "Active",
      coordinates: [55.70650103250864, 24.13198773085604],
    },
    {
      id: 11,
      imageSrc: "https://www.emirates-online.net/English/wp-content/uploads/2021/01/Al-Ain-Mall-1.jpg",
      projectNameAr: "فلل فلج هزاع",
      projectNameEn: "Active",
      coordinates: [55.72680131200215, 24.186317410709492],
    },
    {
      id: 12,
      imageSrc:
        "https://cdn.prod.website-files.com/645c81de0e35a93fd99a3dca/655d8808998cc007276cd824_oasis-at-night-1-1536x864.jpg",
      projectNameAr: "فلل فلج هزاع",
      projectNameEn: "Active",
      coordinates: [55.72680131200215, 24.186317410709492],
    },
    {
      id: 13,
      imageSrc: "https://conferences.uaeu.ac.ae/ties2015/images/hazza-bin-zayed-stadium.jpg",
      projectNameAr: "قسم التفتيش الأمني K9",
      projectNameEn: "Active",
      coordinates: [55.72352938898794, 24.18905139894737],
    },
    {
      id: 14,
      imageSrc: "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/91/3b/33.jpg",
      projectNameAr: "الضبط المروري والمراسم",
      projectNameEn: "Active",
      coordinates: [55.7286784476679, 24.191336582641284],
    },
    {
      id: 15,
      imageSrc:
        "https://media1.thrillophilia.com/filestore/8o2z8ilneyni8cb5gt90j46mgbw2_Al_Ain_City_Tour_fb80a2404f.jpg",
      projectNameAr: "ساحة حجز المركبات فلج هزاع",
      projectNameEn: "Active",
      coordinates: [55.726040750462175, 24.19089476054195],
    },
    {
      id: 16,
      imageSrc: "https://www.seha.ae/img/hospital/665866d91782a.jpg",
      projectNameAr: "إدارة المرور والترخيص",
      projectNameEn: "Active",
      coordinates: [55.7225168640654, 24.19328471799456],
    },
    {
      id: 17,
      imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStA6Btf0ucxwrFPtxujScX3xdjyTw2mTYfTA&s",
      projectNameAr: "قسم الدوريات الخاصة",
      projectNameEn: "Active",
      coordinates: [55.7234652185187, 24.191243364694444],
    },
    {
      id: 18,
      imageSrc: "https://abudhabi-desertsafari.com/en/tours/al-ain-images/al-ain-city-tour-4.webp",
      projectNameAr: "إدارة الدوريات الخاصة",
      projectNameEn: "Active",
      coordinates: [55.723325119991586, 24.191513430459977],
    },
    {
      id: 19,
      imageSrc: "https://www.petra.gov.jo/upload/1715582762073.jpg",
      projectNameAr: "المعهد المروري",
      projectNameEn: "Active",
      coordinates: [55.72411502267644, 24.19240048461677],
    },
    {
      id: 20,
      imageSrc: "https://abu-dhabi.realestate/wp-content/uploads/2024/05/al-ain-properties-1.jpg",
      projectNameAr: "سكن أفراد المرور",
      projectNameEn: "Active",
      coordinates: [55.724324255872546, 24.193154596995498],
    },
  ]

  const handleProjectClick = (project: {
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  }) => {
    // Make sure openLeftSlider is a function before calling it
    if (typeof openLeftSlider === "function") {
      openLeftSlider(project)
    } else {
      console.error("openLeftSlider is not a function")
    }
  }

  return (
    <>
      <Button
        onClick={toggleProjects}
        className={cn(
          "fixed top-1/2 right-4 transform -translate-y-1/2 z-[9999] p-3 bg-cyan-500 text-white backdrop-blur-md rounded-full border-2 border-cyan-400 hover:bg-cyan-600 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.7)]",
          isOpen ? "right-[280px]" : "",
        )}
        aria-label={isOpen ? "Hide Projects" : "Show Projects"}
      >
        <Building2 className={cn("h-6 w-6", isOpen ? "" : "animate-pulse")} />
      </Button>
      <div
        className={cn(
          "fixed top-1/2 sm:top-1/2 md:top-1/2 right-0 transform -translate-y-1/2 max-h-[80vh] w-[280px] transition-transform ease-out-expo duration-500 z-[99999] shadow-md bg-[#0a192f]/90 overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <ProjectsDetailsSlider projects={projects} onProjectClick={handleProjectClick} />
      </div>
    </>
  )
}

export default RightSliderButton
