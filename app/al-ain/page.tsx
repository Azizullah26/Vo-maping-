"use client"

import dynamic from "next/dynamic"
import { useState, useCallback, useRef } from "react"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/TopNav"
import { MapIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/Breadcrumb"
import { RightSliderButton } from "@/components/RightSliderButton"
import AlAinLeftSlider from "@/components/AlAinLeftSlider"
import type mapboxgl from "mapbox-gl"

// Dynamically import components that use Cesium
const AlAinTerrainViewer = dynamic(() => import("@/components/AlAinTerrainViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading terrain viewer...</p>
      </div>
    </div>
  ),
})

const AlAinMap = dynamic(() => import("@/components/AlAinMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

interface PoliceLocation {
  name: string
  coordinates: [number, number]
  type: string
  description: string
}

const boundaryPolygon = [
  [
    [55.792934807493964, 24.367725088902347],
    [55.77562828563876, 24.36085942002154],
    [55.76454086233821, 24.354590136715615],
    [55.73422041764334, 24.310095425111143],
    [55.71975549501471, 24.274644495298617],
    [55.72021053631016, 24.25912725117452],
    [55.739950439509016, 24.258702895259475],
    [55.75926904431816, 24.261521142546115],
    [55.76790865436482, 24.2622104299477],
    [55.79086891050778, 24.279246819050897],
    [55.80739608639843, 24.310419968342657],
    [55.83448229133111, 24.326944907156445],
    [55.83425274722214, 24.363334008192155],
    [55.792934807493964, 24.367725088902347],
  ],
]

const policeLocations: PoliceLocation[] = [
  {
    name: "إدارة التأهيل الشرطي - الفوعة",
    coordinates: [55.804094143988124, 24.33356950894388],
    type: "police",
    description: "مركز تأهيل وتدريب الشرطة في منطقة الفوعة",
  },
  {
    name: "مركز شرطة هيلي",
    coordinates: [55.76486147272425, 24.277296159962688],
    type: "police",
    description: "مركز شرطة يخدم منطقة هيلي",
  },
  {
    name: "مركز شرطة الهير",
    coordinates: [55.736118393917934, 24.5811877336795],
    type: "police",
    description: "مركز شرطة في منطقة الهير",
  },
  {
    name: "مركز شرطة سويحان",
    coordinates: [55.331635765622394, 24.46829853547152],
    type: "police",
    description: "مركز شرطة رئيسي في سويحان",
  },
  {
    name: "قسم موسيقى شرطة أبوظبي",
    coordinates: [55.80752936967028, 24.342548523036186],
    type: "police",
    description: "قسم الموسيقى التابع لشرطة أبوظبي",
  },
  {
    name: "مركز شرطة المربعة",
    coordinates: [55.776750053389094, 24.221008086930823],
    type: "police",
    description: "مركز شرطة في منطقة المربعة",
  },
  {
    name: "ميدان الشرطة بدع بنت سعود",
    coordinates: [55.73906058820131, 24.307406827212986],
    type: "police",
    description: "ميدان تدريب الشرطة",
  },
  {
    name: "متحف شرطة المربعة",
    coordinates: [55.776750053389094, 24.221008086930823],
    type: "police",
    description: "متحف يوثق تاريخ الشرطة في المنطقة",
  },
  {
    name: "مركز شرطة الساد",
    coordinates: [55.517515867556455, 24.213101755771433],
    type: "police",
    description: "مركز شرطة في منطقة الساد",
  },
  {
    name: "ساحة حجز المركبات - الساد",
    coordinates: [55.504756086046854, 24.21166835043384],
    type: "police",
    description: "ساحة حجز المركبات التابعة لمركز شرطة الساد",
  },
  {
    name: "ادارة المهام الخاصة العين",
    coordinates: [55.724096640469895, 24.1956108396531],
    type: "police",
    description: "إدارة العمليات والمهام الخاصة",
  },
  {
    name: "مركز شرطة فلج هزاع",
    coordinates: [55.72710955627929, 24.19954145588217],
    type: "police",
    description: "مركز شرطة في منطقة فلج هزاع",
  },
  {
    name: "قسم هندسة المرور",
    coordinates: [55.7225168640654, 24.19328471799456],
    type: "police",
    description: "قسم هندسة وتخطيط المرور",
  },
  {
    name: "المتابعة الشرطية والرعاية اللاحقة",
    coordinates: [55.722557288830416, 24.19360483409058],
    type: "police",
    description: "قسم المتابعة الشرطية والرعاية اللاحقة",
  },
  {
    name: "المعهد المروري",
    coordinates: [55.72411502267644, 24.19240048461677],
    type: "police",
    description: "معهد تدريب وتأهيل السائقين",
  },
  {
    name: "إدارة الأسلحة والمتفجرات",
    coordinates: [55.72427804325733, 24.19797500690261],
    type: "police",
    description: "إدارة ترخيص ومراقبة الأسلحة والمتفجرات",
  },
  {
    name: "فلل فلج هزاع",
    coordinates: [55.72680131200215, 24.186317410709492],
    type: "police",
    description: "مجمع إدارات (الأدلة الجنائية - التفتيش الأمني - الشرطة المجتمعية - تأجير المركبات - الاستقطاب)",
  },
  {
    name: "الضبط المروري والمراسم",
    coordinates: [55.7286784476679, 24.191336582641284],
    type: "police",
    description: "قسم الضبط المروري والمراسم",
  },
  {
    name: "قسم الدوريات الخاصة",
    coordinates: [55.7234652185187, 24.191243364694444],
    type: "police",
    description: "قسم الدوريات الخاصة",
  },
  {
    name: "سكن أفراد المرور",
    coordinates: [55.724324255872546, 24.193154596995498],
    type: "police",
    description: "سكن منتسبي إدارة المرور",
  },
  {
    name: "إدارة الدوريات الخاصة",
    coordinates: [55.723325119991586, 24.191513430459977],
    type: "police",
    description: "إدارة الدوريات الخاصة",
  },
  {
    name: "قسم التفتيش الأمني K9",
    coordinates: [55.72352938898794, 24.18905139894737],
    type: "police",
    description: "وحدة الكلاب البوليسية والتفتيش الأمني",
  },
  {
    name: "ساحة حجز المركبات فلج هزاع",
    coordinates: [55.726040750462175, 24.19089476054195],
    type: "police",
    description: "ساحة حجز المركبات في منطقة فلج هزاع",
  },
  {
    name: "مبنى التحريات والمخدرات",
    coordinates: [55.71923885266557, 24.196245342189755],
    type: "police",
    description: "إدارة مكافحة المخدرات والتحريات",
  },
  {
    name: "مديرية شرطة العين",
    coordinates: [55.7404449670278, 24.233199622911968],
    type: "police",
    description: "المقر الرئيسي لشرطة العين",
  },
  {
    name: "نادي ضباط الشرطة",
    coordinates: [55.74130397171359, 24.235157925682785],
    type: "police",
    description: "نادي اجتماعي وترفيهي لضباط الشرطة",
  },
  {
    name: "فرع النقل والمشاغل",
    coordinates: [55.74303931401195, 24.2348982203018],
    type: "police",
    description: "فرع النقل والمشاغل",
  },
  {
    name: "مبنى إدارات الشرطة",
    coordinates: [55.74252775199696, 24.23252678639456],
    type: "police",
    description: "مبنى يضم إدارات (التربية الرياضية - الاعلام الامني - مسرح الجريمة - فرع البصمة)",
  },
  {
    name: "مركز شرطة رماح",
    coordinates: [55.32528990210085, 24.18069207722408],
    type: "police",
    description: "مركز شرطة في منطقة رماح (الاعلام الامني)",
  },
  {
    name: "مركز شرطة زاخر",
    coordinates: [55.70650103250864, 24.13198773085604],
    type: "police",
    description: "مركز شرطة في منطقة زاخر",
  },
  {
    name: "مركز شرطة الوقن",
    coordinates: [55.56621526707235, 23.626998471785996],
    type: "police",
    description: "مركز شرطة في منطقة الوقن",
  },
]

const filterButtons = [
  { id: "police", label: "Police", icon: MapIcon },
  // Add more filter buttons as needed
]

const glowStyles = {
  glowOnHover:
    "before:absolute before:inset-0 before:border-0 before:border-white/10 before:transition-colors before:duration-300 hover:before:border-[1px]",
}

export default function AlAinPage() {
  const [showingTerrain, setShowingTerrain] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLeftSliderOpen, setIsLeftSliderOpen] = useState(false)
  const router = useRouter()
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>({})

  const [selectedProject, setSelectedProject] = useState<{
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  } | null>(null)

  const handleFilterChange = (type: string, id: string) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [id]: !prevFilters[id],
    }))
  }

  const handleProjectSelect = (project: {
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  }) => {
    setSelectedProject(project)
    setIsLeftSliderOpen(true) // Open the left slider when a project is selected

    // Zoom to the project location on the map
    if (mapRef.current && project.coordinates) {
      mapRef.current.flyTo({
        center: project.coordinates,
        zoom: 14,
        duration: 2000,
      })
    }
  }

  const handleTerrainError = useCallback((error: Error) => {
    console.error("Terrain viewer error:", error.message)
    setShowingTerrain(false)
    setError(error.message)
  }, [])

  const toggleProjects = () => {
    setShowProjects(!showProjects)
    if (showAdmin) setShowAdmin(false)
  }

  const toggleAdmin = () => {
    router.push("/al-ain/admin")
  }

  const toggleLeftSlider = () => {
    setIsLeftSliderOpen(!isLeftSliderOpen)
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-red-50 text-red-500 p-4">
        <div className="text-center max-w-md">
          <p className="font-semibold mb-2">An error occurred</p>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <Button
            variant="destructive"
            onClick={() => {
              setError(null)
              window.location.reload()
            }}
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      <TopNav
        onToggleProjects={toggleProjects}
        showProjects={showProjects}
        onAdminClick={toggleAdmin}
        showAdmin={showAdmin}
      />

      {/* Breadcrumb positioned below the logo */}
      <div className="fixed top-14 sm:top-16 md:top-18 left-0 right-0 z-40 px-2 py-1">
        <div className="w-full max-w-[1800px] mx-auto">
          <Breadcrumb
            items={[
              { label: "UAE", path: "/" },
              { label: "Al Ain", path: "/al-ain" },
            ]}
          />
        </div>
      </div>

      {/* Add the AlAinLeftSlider component */}
      <AlAinLeftSlider isOpen={isLeftSliderOpen} toggleSlider={toggleLeftSlider} selectedProject={selectedProject} />

      <AlAinMap
        policeLocations={policeLocations}
        onToggleTerrain={() => setShowingTerrain(true)}
        offsetX={60}
        offsetY={60}
        mapRef={mapRef}
      />

      {showingTerrain && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-[2000px] mx-auto">
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500 p-4">
                  <div className="text-center max-w-md">
                    <p className="font-semibold mb-2">Failed to load terrain viewer</p>
                    <p className="text-sm text-red-400 mb-4">{error.message}</p>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        resetErrorBoundary()
                        setShowingTerrain(false)
                      }}
                      className="w-full sm:w-auto"
                    >
                      Return to Map View
                    </Button>
                  </div>
                </div>
              )}
            >
              <AlAinTerrainViewer onError={handleTerrainError} onClose={() => setShowingTerrain(false)} />
            </ErrorBoundary>
          </div>
        </div>
      )}

      <RightSliderButton
        isOpen={showProjects}
        onClose={() => setShowProjects(false)}
        toggleProjects={toggleProjects}
        openLeftSlider={handleProjectSelect}
      />
    </div>
  )
}
