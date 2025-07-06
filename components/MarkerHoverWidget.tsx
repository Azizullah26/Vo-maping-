"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ArrowRight, MapPin, Building2 } from "lucide-react"

interface MarkerHoverWidgetProps {
  markerName: string | null
  isVisible: boolean
  isClicked?: boolean
  onClickStateChange?: (state: boolean) => void
}

export function MarkerHoverWidget({
  markerName,
  isVisible,
  isClicked = false,
  onClickStateChange,
}: MarkerHoverWidgetProps) {
  const router = useRouter()
  const [projectData, setProjectData] = useState<{
    name: string
    englishName: string
    image: string
    plots: string
    type: string
    status: string
  } | null>(null)

  useEffect(() => {
    if (!markerName) {
      setProjectData(null)
      return
    }

    // Map marker names to project data
    // In a real app, this could come from an API or database
    const projectsMap: Record<string, any> = {
      "قسم موسيقى شرطة أبوظبي": {
        name: "قسم موسيقى شرطة أبوظبي",
        englishName: "Abu Dhabi Police Music Department",
        image: "https://citytouruae.com/wp-content/uploads/2021/09/Al-Ain-city-1-600x590.jpg",
        plots: "3 Plots",
        type: "Government",
        status: "Active",
      },
      "إدارة التأهيل الشرطي - الفوعة": {
        name: "إدارة التأهيل الشرطي - الفوعة",
        englishName: "Police Rehabilitation Department - Al Foua",
        image: "https://c8.alamy.com/comp/K3KAFH/uae-al-ain-skyline-from-zayed-bin-sultan-street-K3KAFH.jpg",
        plots: "5 Plots",
        type: "Government",
        status: "Active",
      },
      "مركز شرطة هيلي": {
        name: "مركز شرطة هيلي",
        englishName: "Hili Police Station",
        image: "https://www.propertyfinder.ae/blog/wp-content/uploads/2023/07/3-14.jpg",
        plots: "2 Plots",
        type: "Government",
        status: "Active",
      },
      "ميدان الشرطة بدع بنت سعود": {
        name: "ميدان الشرطة بدع بنت سعود",
        englishName: "Police Square in Bida Bint Saud",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/06/53/d8/8e/city-seasons-hotel-al.jpg",
        plots: "1 Plot",
        type: "Government",
        status: "Active",
      },
      "متحف شرطة المربعة": {
        name: "متحف شرطة المربعة",
        englishName: "Al Murabba Police Museum",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP2QgVN8QLQxgnvTH8hVSuL2gqC8s2D_7CqA&s",
        plots: "1 Plot",
        type: "Cultural",
        status: "Active",
      },
      // Default data for other markers
      default: {
        name: markerName,
        englishName: getEnglishName(markerName),
        image: "https://whatson.ae/wp-content/uploads/2021/03/Al-Ain-Oasis.jpeg",
        plots: "2 Plots",
        type: "Mixed Use",
        status: "Active",
      },
    }

    // Get project data or use default
    const data = projectsMap[markerName] || projectsMap.default
    setProjectData(data)
  }, [markerName])

  const handleNavigation = () => {
    if (!projectData) return

    // Generate a project ID based on the name
    const projectId = projectData.englishName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Navigate to the project dashboard
    router.push(
      `/dashboard/${projectId}?name=${encodeURIComponent(projectData.englishName)}&nameAr=${encodeURIComponent(projectData.name)}`,
    )
  }

  if ((!isVisible && !isClicked) || !projectData) return null

  return (
    <div
      className={cn(
        "fixed top-2 left-2 sm:top-4 sm:left-4 z-50 w-44 sm:w-48 md:w-56 bg-gray-900/95 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border transition-all duration-300",
        isClicked ? "border-cyan-400 shadow-cyan-900/40" : "border-gray-700 hover:border-gray-600",
        isVisible || isClicked
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none",
      )}
    >
      {/* Header with navigation button */}
      <div className="relative h-20 sm:h-24 md:h-36 w-full overflow-hidden">
        <Image
          src={projectData.image || "/placeholder.svg"}
          alt={projectData.englishName}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 288px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

        {/* Navigation button overlay */}
        <button
          onClick={handleNavigation}
          className="absolute inset-0 w-full h-full group cursor-pointer transition-all duration-300 hover:bg-cyan-500/10"
        >
          {/* Hover indicator */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-cyan-400/30">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-cyan-300 font-medium">View Dashboard</span>
            </div>
          </div>
        </button>
      </div>

      {/* Content section */}
      <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        {/* Interactive project name button */}
        <button
          onClick={handleNavigation}
          className="w-full text-left group cursor-pointer transition-all duration-300 hover:bg-cyan-900/20 rounded-lg p-2 -m-2"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base group-hover:text-cyan-300 transition-colors duration-300 truncate">
                {projectData.englishName}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                {projectData.name}
              </p>
            </div>
            <div className="ml-3 flex-shrink-0">
              <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 transition-all duration-300">
                <Building2 className="w-3 h-3 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </button>

        {/* Project details - now interactive buttons */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              {/* Plots button */}
              <button
                onClick={handleNavigation}
                className="text-gray-400 hover:text-cyan-300 text-xs transition-colors duration-300 hover:bg-cyan-900/20 px-2 py-1 rounded-md cursor-pointer"
              >
                {projectData.plots}
              </button>
              <span className="text-gray-500">•</span>
              {/* Type button */}
              <button
                onClick={handleNavigation}
                className="text-gray-400 hover:text-cyan-300 text-xs transition-colors duration-300 hover:bg-cyan-900/20 px-2 py-1 rounded-md cursor-pointer"
              >
                {projectData.type}
              </button>
            </div>

            {/* Status button */}
            <button
              onClick={handleNavigation}
              className={cn(
                "text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 cursor-pointer hover:scale-105",
                projectData.status === "Sold Out"
                  ? "bg-red-900/50 text-red-300 border border-red-700/30 hover:bg-red-900/70 hover:border-red-600/50"
                  : "bg-green-900/50 text-green-300 border border-green-700/30 hover:bg-green-900/70 hover:border-green-600/50",
              )}
            >
              {projectData.status}
            </button>
          </div>
        </div>

        {/* Interactive widget footer */}
        <button
          onClick={handleNavigation}
          className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg p-2 sm:p-3 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-cyan-300 text-sm font-medium group-hover:text-cyan-200 transition-colors duration-300">
                Open Project Dashboard
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </button>
      </div>

      {/* Futuristic accent lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"></div>
    </div>
  )
}

// Helper function to convert Arabic names to English
function getEnglishName(arabicName: string): string {
  const nameMap: Record<string, string> = {
    "قسم موسيقى شرطة أبوظبي": "Abu Dhabi Police Music Department",
    "إدارة التأهيل الشرطي - الفوعة": "Police Rehabilitation Department - Al Foua",
    "مركز شرطة هيلي": "Hili Police Station",
    "ميدان الشرطة بدع بنت سعود": "Police Square in Bida Bint Saud",
    "متحف شرطة المربعة": "Al Murabba Police Museum",
    "مركز شرطة المربعة": "Al Murabba Police Station",
    "مديرية شرطة العين": "Al Ain Police Directorate",
    "فرع النقل والمشاغل": "Transportation and Workshops Branch",
    "نادي ضباط الشرطة": "Police Officers Club",
    "مركز شرطة زاخر": "Zakher Police Station",
    "فلل فلج هزاع": "Falaj Hazza Villas",
    "قسم التفتيش الأمني K9": "K9 Security Inspection Department",
    "الضبط المروري والمراسم": "Traffic Control and Ceremonies",
    "ساحة حجز المركبات فلج هزاع": "Falaj Hazza Vehicle Impound",
    "إدارة المرور والترخيص": "Traffic and Licensing Department",
    "قسم الدوريات الخاصة": "Special Patrols Department",
    "إدارة الدوريات الخاصة": "Special Patrols Administration",
    "المعهد المروري": "Traffic Institute",
    "سكن أفراد المرور": "Traffic Personnel Residence",
    "قسم هندسة المرور": "Traffic Engineering Department",
    "المتابعة الشرطية والرعاية اللاحقة": "Police Follow-up and Aftercare",
    "ادارة المهام الخاصة العين": "Al Ain Special Tasks Administration",
    "مبنى التحريات والمخدرات": "Investigations and Drug Enforcement Building",
    "إدارة الأسلحة والمتفجرات": "Weapons and Explosives Administration",
    "مركز شرطة فلج هزاع": "Falaj Hazza Police Station",
    "فلل للادرات الشرطية عشارج": "Police Departments Villas in Asharj",
    "مركز شرطة المقام": "Al Maqam Police Station",
    "مركز شرطة الساد": "Al Saad Police Station",
    "ساحة حجز المركبات - الساد": "Al Saad Vehicle Impound",
    "مركز شرطة الوقن": "Al Wagan Police Station",
  }

  return nameMap[arabicName] || "Police Facility"
}
