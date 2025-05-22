"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProjectsDetailsPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const router = useRouter()

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

    return () => {
      document.head.removeChild(style)
    }
  }, [])

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
      projectNameEn: "Under Construction",
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
      projectNameEn: "Under Construction",
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
        "https://res.cloudinary.com/protenders/image/upload/c_limit,d_missing,dpr_3.0,f_auto,fl_progressive:semi,q_auto:eco,w_500/s8pblrez5gcu2cbed4ux.jpg",
      projectNameAr: "فرع النقل والمشاغل",
      projectNameEn: "Under Construction",
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
      imageSrc: "https://abu-dhabi.realestate/wp-content/uploads/2024/05/al-ain-properties-1.jpg",
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

  const getImageWithFallback = (src: string) => {
    return src || "/modern-city-building.png"
  }

  const handleProjectClick = (project: any) => {
    // Navigate to the project's dashboard
    router.push(
      `/dashboard/${project.id}?name=${encodeURIComponent(project.projectNameEn)}&nameAr=${encodeURIComponent(project.projectNameAr || "")}`,
    )
  }

  return (
    <div className="min-h-screen bg-[#0a192f] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8 relative">
          <button
            onClick={() => router.push("/")}
            className="absolute left-0 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400/70"
            aria-label="Back to home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white text-center">RCC Projects Details</h1>
        </div>

        <div className="flex justify-around w-full mb-8">
          <div className="flex flex-col items-center">
            <button
              onClick={() => setActiveFilter("all")}
              className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative group cursor-pointer"
              aria-pressed={activeFilter === "all"}
            >
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 opacity-75 blur-[2px] group-hover:blur-[3px] transition-all duration-300 ${activeFilter === "all" ? "opacity-100 blur-[3px]" : ""}`}
              ></div>
              <div className="absolute inset-[1px] rounded-full bg-black"></div>
              <div className="absolute inset-[2px] rounded-full border-[1.5px] border-white opacity-10"></div>
              <div
                className={`absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,0,255,0.7),0_0_15px_rgba(0,170,255,0.5)] group-hover:shadow-[0_0_15px_rgba(255,0,255,0.8),0_0_20px_rgba(0,170,255,0.6)] transition-all duration-300 ${activeFilter === "all" ? "shadow-[0_0_20px_rgba(255,0,255,0.9),0_0_25px_rgba(0,170,255,0.7)]" : ""}`}
              ></div>
              <span className="text-white font-bold relative z-10 text-lg group-hover:scale-110 transition-transform duration-300">
                {projects.length}
              </span>
            </button>
            <p
              className={`text-sm mt-2 transition-colors ${activeFilter === "all" ? "text-blue-300 font-bold" : "text-white"}`}
            >
              All
            </p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setActiveFilter("active")}
              className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative group cursor-pointer"
              aria-pressed={activeFilter === "active"}
            >
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-75 blur-[2px] group-hover:blur-[3px] transition-all duration-300 ${activeFilter === "active" ? "opacity-100 blur-[3px]" : ""}`}
              ></div>
              <div className="absolute inset-[1px] rounded-full bg-black"></div>
              <div className="absolute inset-[2px] rounded-full border-[1.5px] border-white opacity-10"></div>
              <div
                className={`absolute inset-0 rounded-full shadow-[0_0_10px_rgba(0,255,127,0.7),0_0_15px_rgba(0,170,255,0.5)] group-hover:shadow-[0_0_15px_rgba(0,255,127,0.8),0_0_20px_rgba(0,170,255,0.6)] transition-all duration-300 ${activeFilter === "active" ? "shadow-[0_0_20px_rgba(0,255,127,0.9),0_0_25px_rgba(0,170,255,0.7)]" : ""}`}
              ></div>
              <span className="text-white font-bold relative z-10 text-lg group-hover:scale-110 transition-transform duration-300">
                {projects.filter((p) => p.projectNameEn === "Active").length}
              </span>
            </button>
            <p
              className={`text-sm mt-2 transition-colors ${activeFilter === "active" ? "text-green-300 font-bold" : "text-white"}`}
            >
              Active
            </p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setActiveFilter("construction")}
              className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative group cursor-pointer"
              aria-pressed={activeFilter === "construction"}
            >
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 opacity-75 blur-[2px] group-hover:blur-[3px] transition-all duration-300 ${activeFilter === "construction" ? "opacity-100 blur-[3px]" : ""}`}
              ></div>
              <div className="absolute inset-[1px] rounded-full bg-black"></div>
              <div className="absolute inset-[2px] rounded-full border-[1.5px] border-white opacity-10"></div>
              <div
                className={`absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,165,0,0.7),0_0_15px_rgba(255,69,0,0.5)] group-hover:shadow-[0_0_15px_rgba(255,165,0,0.8),0_0_20px_rgba(255,69,0,0.6)] transition-all duration-300 ${activeFilter === "construction" ? "shadow-[0_0_20px_rgba(255,165,0,0.9),0_0_25px_rgba(255,69,0,0.7)]" : ""}`}
              ></div>
              <span className="text-white font-bold relative z-10 text-lg group-hover:scale-110 transition-transform duration-300">
                {projects.filter((p) => p.projectNameEn === "Under Construction").length}
              </span>
            </button>
            <p
              className={`text-sm mt-2 transition-colors ${activeFilter === "construction" ? "text-yellow-300 font-bold" : "text-white"}`}
            >
              Construction
            </p>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-250px)] pb-8 pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16 mb-8">
            {projects
              .filter((project) => {
                if (activeFilter === "all") return true
                if (activeFilter === "active") return project.projectNameEn === "Active"
                if (activeFilter === "construction") return project.projectNameEn === "Under Construction"
                return true
              })
              .map((project) => {
                const projectId = `project-${project.id}`
                const markerName = project.projectNameAr

                return (
                  <div
                    key={projectId}
                    id={projectId}
                    data-marker-name={markerName}
                    data-project-id={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="cursor-pointer w-full transition-all duration-300 hover:scale-[1.02]"
                    role="button"
                    aria-selected="false"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleProjectClick(project)
                      }
                    }}
                  >
                    <Card className="relative w-full h-[85px] bg-transparent border border-cyan-500/30 hover:border-cyan-400/70 rounded-lg overflow-hidden group flex flex-col shadow-[0_0_8px_rgba(0,200,255,0.15)] transition-all duration-300">
                      <CardContent className="p-0 relative flex items-center flex-row-reverse bg-black/20 backdrop-blur-sm text-gray-300">
                        <div className="flex flex-col w-[160px] h-[36px] items-center justify-center absolute top-6 left-0 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300 z-10">
                          <div className="relative self-stretch h-[20px] mt-[-0.77px] [font-family:'Tajawal',Helvetica] font-bold text-white text-sm text-left tracking-[0] leading-normal [direction:rtl]">
                            {project.projectNameAr}
                          </div>
                          <div className="relative self-stretch [font-family:'Inter',Helvetica] font-bold text-white text-[12px] tracking-[0] leading-[normal]">
                            {project.projectNameEn}
                            {project.projectNameEn === "Active" && (
                              <span className="ml-1.5 inline-flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="ml-1 text-[10px] text-green-400">active</span>
                              </span>
                            )}
                            {project.projectNameEn === "Under Construction" && (
                              <span className="ml-1.5 inline-flex items-center">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                <span className="ml-1 text-[10px] text-yellow-400">construction</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <Image
                          className="absolute w-[65px] h-[85px] top-0 right-0 group-hover:w-full transition-all duration-300 object-cover z-0"
                          alt={`${project.projectNameEn} project`}
                          src={getImageWithFallback(project.imageSrc) || "/placeholder.svg"}
                          width={100}
                          height={85}
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            ;(e.target as HTMLImageElement).src = "/modern-city-building.png"
                          }}
                        />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 opacity-0 selected-indicator transition-opacity duration-300"></div>

                        {/* Add a "View Dashboard" button that appears on hover */}
                        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <span className="text-xs bg-cyan-500/80 text-white px-2 py-1 rounded-full">
                            View Dashboard
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center text-cyan-400 text-xs mt-4 animate-pulse">
          <span>Scroll for more projects</span>
          <div className="mt-1">↓</div>
        </div>
      </div>
    </div>
  )
}
