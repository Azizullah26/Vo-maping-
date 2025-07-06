"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

// Sample Abu Dhabi projects data
const abuDhabiProjects = [
  {
    id: "al-aliah-p5-p7",
    name: "Al Aliah P5_P7",
    nameAr: "العالية P5_P7",
    description: "Strategic development project in Al Aliah Island featuring modern infrastructure and facilities.",
    status: "in-progress",
    category: "infrastructure",
    location: "Al Aliah Island",
    coordinates: [54.4373, 24.5373],
    plots: "2 Plots",
    type: "Mixed Use",
    handover: "2025",
  },
  {
    id: "al-bahyah-tmp15",
    name: "Al Bahyah TMP15",
    nameAr: "البهية TMP15",
    description: "Comprehensive development in Al Bahyah area with residential and commercial components.",
    status: "in-progress",
    category: "residential",
    location: "Al Bahyah",
    coordinates: [54.4016, 24.5336],
    plots: "15 Plots",
    type: "Residential",
    handover: "2025",
  },
  {
    id: "al-riyad-tmp2",
    name: "Al Riyad TMP2",
    nameAr: "الرياض TMP2",
    description: "Modern urban development in Madinat Al Riyad with state-of-the-art amenities.",
    status: "completed",
    category: "urban",
    location: "Madinat Al Riyad",
    coordinates: [54.42, 24.54],
    plots: "8 Plots",
    type: "Commercial",
    handover: "2024",
  },
  {
    id: "al-nahdha-tmp19",
    name: "Al Nahdha TMP19",
    nameAr: "النهضة TMP19",
    description: "Strategic development in Al Nahda Al Askariah focusing on community infrastructure.",
    status: "planned",
    category: "community",
    location: "Al Nahda Al Askariah",
    coordinates: [54.41, 24.53],
    plots: "12 Plots",
    type: "Mixed Use",
    handover: "2026",
  },
  {
    id: "shahkbout-tmp1",
    name: "Shahkbout TMP1",
    nameAr: "شخبوط TMP1",
    description: "Premier development in Shahkbout City with modern residential and commercial facilities.",
    status: "in-progress",
    category: "residential",
    location: "Shahkbout City",
    coordinates: [54.45, 24.52],
    plots: "20 Plots",
    type: "Residential",
    handover: "2025",
  },
  {
    id: "rabdan-1-tmp4",
    name: "Rabdan 1 TMP4",
    nameAr: "ربدان 1 TMP4",
    description: "First phase of Rabdan development featuring integrated community facilities.",
    status: "in-progress",
    category: "community",
    location: "Rabdan",
    coordinates: [54.43, 24.51],
    plots: "18 Plots",
    type: "Mixed Use",
    handover: "2025",
  },
  {
    id: "rabdan-2-tmp27",
    name: "Rabdan 2 TMP27",
    nameAr: "ربدان 2 TMP27",
    description: "Second phase of Rabdan development expanding community infrastructure.",
    status: "planned",
    category: "community",
    location: "Rabdan",
    coordinates: [54.44, 24.5],
    plots: "25 Plots",
    type: "Residential",
    handover: "2026",
  },
  {
    id: "al-rahbah-tmp3",
    name: "Al Rahbah TMP3",
    nameAr: "الرحبة TMP3",
    description: "Comprehensive development in Al Rahbah area with modern amenities.",
    status: "in-progress",
    category: "residential",
    location: "Al Rahbah",
    coordinates: [54.46, 24.49],
    plots: "14 Plots",
    type: "Residential",
    handover: "2025",
  },
  {
    id: "al-bateen-tmp26",
    name: "Al Bateen TMP26",
    nameAr: "الباطن TMP26",
    description: "Prestigious waterfront development along Al Bateen Corniche.",
    status: "completed",
    category: "waterfront",
    location: "Al Bateen Corniche",
    coordinates: [54.35, 24.47],
    plots: "10 Plots",
    type: "Commercial",
    handover: "2024",
  },
  {
    id: "al-muntazah-tmp39",
    name: "Al Muntazah TMP39",
    nameAr: "المنتزه TMP39",
    description: "Recreation and leisure development in Al Muntazah area.",
    status: "in-progress",
    category: "recreation",
    location: "Al Muntazah",
    coordinates: [54.48, 24.48],
    plots: "22 Plots",
    type: "Mixed Use",
    handover: "2025",
  },
  {
    id: "ngc-abu-dhabi-airport-p23",
    name: "NGC Abu Dhabi Airport P23",
    nameAr: "مطار أبوظبي P23",
    description: "Strategic infrastructure development at Abu Dhabi International Airport.",
    status: "in-progress",
    category: "infrastructure",
    location: "Al Matar",
    coordinates: [54.65, 24.43],
    plots: "5 Plots",
    type: "Infrastructure",
    handover: "2025",
  },
  {
    id: "ngc-mbz-ambulance-p1",
    name: "NGC MBZ Ambulance P1",
    nameAr: "الإسعاف محمد بن زايد P1",
    description: "Emergency services facility in Mohamed Bin Zayed City.",
    status: "completed",
    category: "healthcare",
    location: "Mohamed Bin Zayed City",
    coordinates: [54.52, 24.35],
    plots: "3 Plots",
    type: "Healthcare",
    handover: "2024",
  },
  {
    id: "al-rahba-police-hcni-p3",
    name: "Al Rahba Police Station – AD Police HCNI P3",
    nameAr: "مركز شرطة الرحبة HCNI P3",
    description: "Modern police facility serving Al Rahba community.",
    status: "completed",
    category: "security",
    location: "Al Rahba",
    coordinates: [54.46, 24.49],
    plots: "2 Plots",
    type: "Security",
    handover: "2024",
  },
  {
    id: "al-rahba-police-rcc-p3",
    name: "Al Rahba Police Station – AD Police RCC P3",
    nameAr: "مركز شرطة الرحبة RCC P3",
    description: "Regional command center for Al Rahba police operations.",
    status: "in-progress",
    category: "security",
    location: "Al Rahba",
    coordinates: [54.47, 24.48],
    plots: "3 Plots",
    type: "Security",
    handover: "2025",
  },
  {
    id: "shooting-range-wafia-west",
    name: "Shooting Range – AD Police RCC P1a",
    nameAr: "ميدان الرماية الوافية الغربية",
    description: "Professional shooting range facility for police training.",
    status: "completed",
    category: "training",
    location: "Al Wafia West",
    coordinates: [54.4, 24.3],
    plots: "1 Plot",
    type: "Training",
    handover: "2024",
  },
  {
    id: "police-center-musaffah",
    name: "Police Center Musaffah – AD Police RCC P1",
    nameAr: "مركز شرطة مصفح RCC P1",
    description: "Comprehensive police center serving Musaffah industrial area.",
    status: "in-progress",
    category: "security",
    location: "Musaffah",
    coordinates: [54.5, 24.37],
    plots: "4 Plots",
    type: "Security",
    handover: "2025",
  },
  {
    id: "special-task-sector",
    name: "Special Task Sector – AD Police RCC P1_P2",
    nameAr: "قطاع المهام الخاصة P1_P2",
    description: "Specialized police operations center in Abu Dhabi City.",
    status: "in-progress",
    category: "security",
    location: "Abu Dhabi City",
    coordinates: [54.37, 24.47],
    plots: "6 Plots",
    type: "Security",
    handover: "2025",
  },
  {
    id: "shamkha-community-police",
    name: "Shamkha Community Police P5",
    nameAr: "شرطة مجتمعية الشامخة P5",
    description: "Community-focused police facility in Al Shamkhah.",
    status: "completed",
    category: "security",
    location: "Al Shamkhah",
    coordinates: [54.7, 24.4],
    plots: "2 Plots",
    type: "Security",
    handover: "2024",
  },
  {
    id: "traffic-patrol-shamkha",
    name: "Traffic And Patrol + General Maintenance P5",
    nameAr: "المرور والدوريات والصيانة العامة P5",
    description: "Traffic management and maintenance facility in Al Shamkhah.",
    status: "in-progress",
    category: "infrastructure",
    location: "Al Shamkhah",
    coordinates: [54.71, 24.41],
    plots: "3 Plots",
    type: "Infrastructure",
    handover: "2025",
  },
  {
    id: "haggana-offices-tmp6",
    name: "Haggana Offices TMP6",
    nameAr: "مكاتب الحقانة TMP6",
    description: "Administrative offices complex in Al Wathba area.",
    status: "planned",
    category: "administrative",
    location: "Al Wathba",
    coordinates: [54.6, 24.25],
    plots: "8 Plots",
    type: "Commercial",
    handover: "2026",
  },
]

const statusColors = {
  completed: "bg-green-500",
  "in-progress": "bg-yellow-500",
  planned: "bg-blue-500",
}

const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  planned: "Planned",
}

export default function AbuDhabiProjectsPage() {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-white hover:bg-white hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Abu Dhabi Projects</h1>
          <p className="text-gray-400">مشاريع أبوظبي</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
        {abuDhabiProjects.map((project) => (
          <div
            key={project.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              router.push(
                `/dashboard/abu-dhabi-${project.id}?name=${encodeURIComponent(project.name)}&nameAr=${encodeURIComponent(project.nameAr)}`,
              )
            }}
          >
            {/* Hover indicator */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex">
              {/* Project image */}
              <div className="w-24 h-24 relative flex-shrink-0">
                <img
                  src={
                    [
                      "https://www.nuroluae.com/wp-content/uploads/2019/03/Abu-Dhabi-Marina-City-Development3-570x380_c.jpg",
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw73u5AdKwcnzQzn-s56Sey5qGyi-RUFGnXg&s",
                      "https://www.mecemirates.com/wp-content/uploads/2024/10/P68-2.jpg",
                      "https://www.fm-middleeast.com/cloud/2021/08/02/ADM-Press-1.jpg",
                      "https://www.iskan.abudhabi/-/media/Project/ADHA/ADHA/Media-Gallery/Housing-Project/Al-Saad-Project/New/Al-Saad-Image-04.jpg",
                      "https://dgjonesworld.com/uploads/ABUDHABI-Al-Mamoura-Building-gallery.jpg",
                    ][Number.parseInt(project.id.slice(-1)) % 6] ||
                    "https://www.nuroluae.com/wp-content/uploads/2019/03/Abu-Dhabi-Marina-City-Development3-570x380_c.jpg"
                  }
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-1/2"></div>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {project.type}
                </div>
              </div>

              {/* Project details */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-medium text-sm line-clamp-2">{project.name}</h3>
                  <p className="text-white/60 text-xs mt-1">{project.plots}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        project.status === "completed"
                          ? "bg-green-500"
                          : project.status === "in-progress"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <span className="text-white/60 text-xs capitalize">{project.status.replace("-", " ")}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-2">
                  <MapPin className="h-3 w-3 text-white/40" />
                  <span className="text-white/60 text-xs truncate">{project.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
