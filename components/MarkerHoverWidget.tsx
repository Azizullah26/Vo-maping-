"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MarkerHoverWidgetProps {
  markerName: string | null
  isVisible: boolean
}

export function MarkerHoverWidget({ markerName, isVisible }: MarkerHoverWidgetProps) {
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

  if (!isVisible || !projectData) return null

  // Generate a project ID based on the name
  const projectId = projectData.englishName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-50 w-64 bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
      )}
      onClick={() => {
        // Navigate to the project dashboard
        router.push(
          `/dashboard/${projectId}?name=${encodeURIComponent(projectData.englishName)}&nameAr=${encodeURIComponent(projectData.name)}`,
        )
      }}
    >
      <div className="relative h-32 w-full">
        <Image
          src={projectData.image || "/placeholder.svg"}
          alt={projectData.englishName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      <div className="p-3">
        <h3 className="text-white font-medium text-lg">{projectData.englishName}</h3>
        <p className="text-gray-300 text-sm">{projectData.name}</p>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <span className="text-gray-400 text-xs">{projectData.plots}</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-gray-400 text-xs">{projectData.type}</span>
          </div>

          <div
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded",
              projectData.status === "Sold Out" ? "bg-red-900/50 text-red-300" : "bg-green-900/50 text-green-300",
            )}
          >
            {projectData.status}
          </div>
        </div>
      </div>

      {/* Subtle call to action */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

      {/* Hover effect indicator */}
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/70 animate-pulse"></div>
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
