"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useRouter } from "next/navigation"
import { AnimatedControls } from "@/components/AnimatedControls"
// Remove this import as we're not using animations anymore
// import { animateMarkerEntrance, animateMarkerHover, animateMarkerUnhover, animateMarkerClick } from "./MarkerAnimation"
import { alamerahCoordinates } from "../data/alamerahCoordinates"

// Update the marker styles CSS
const markerStyles = `
.marker-container {
  position: relative;
  width: 400px;
  height: 70px;
  pointer-events: auto;
  transform: translate(-50%, -50%);
}

.marker-circle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 2;
}

.marker-content-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.marker-dotted-line {
  position: absolute;
  z-index: 1;
}

.marker-text-container {
  position: absolute;
  z-index: 2;
  white-space: nowrap;
}

/* Left-aligned marker */
.marker-container.left-aligned .marker-dotted-line {
  right: 50%;
  top: 50%;
  width: 100px;
  height: 2px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, #ffffff 50%, transparent 50%);
  background-size: 8px 2px;
  background-repeat: repeat-x;
}

.marker-container.left-aligned .marker-text-container {
  right: calc(50% + 100px);
  top: 50%;
  transform: translateY(-50%);
}

/* Right-aligned marker (default) */
.marker-container:not(.left-aligned):not(.top-aligned):not(.bottom-aligned):not(.top-right-aligned):not(.bottom-left-aligned):not(.bottom-right-aligned) .marker-dotted-line {
  left: 50%;
  top: 50%;
  width: 100px;
  height: 2px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, #ffffff 50%, transparent 50%);
  background-size: 8px 2px;
  background-repeat: repeat-x;
}

.marker-container:not(.left-aligned):not(.top-aligned):not(.bottom-aligned):not(.top-right-aligned):not(.bottom-left-aligned):not(.bottom-right-aligned) .marker-text-container {
  left: calc(50% + 100px);
  top: 50%;
  transform: translateY(-50%);
}

/* Top-aligned marker */
.marker-container.top-aligned .marker-dotted-line {
  left: 50%;
  bottom: 50%;
  width: 2px;
  height: 100px;
  transform: translateX(-50%);
  background: linear-gradient(0deg, #ffffff 50%, transparent 50%);
  background-size: 2px 8px;
  background-repeat: repeat-y;
}

.marker-container.top-aligned .marker-text-container {
  left: 50%;
  bottom: calc(50% + 100px);
  transform: translateX(-50%);
}

/* Bottom-aligned marker */
.marker-container.bottom-aligned .marker-dotted-line {
  left: 50%;
  top: 50%;
  width: 2px;
  height: 100px;
  transform: translateX(-50%);
  background: linear-gradient(0deg, #ffffff 50%, transparent 50%);
  background-size: 2px 8px;
  background-repeat: repeat-y;
}

.marker-container.bottom-aligned .marker-text-container {
  left: 50%;
  top: calc(50% + 100px);
  transform: translateX(-50%);
}

/* Bottom-left aligned marker */
.marker-container.bottom-left-aligned .marker-dotted-line {
  right: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  border-left: 2px dotted #ffffff;
  border-bottom: 2px dotted #ffffff;
}

.marker-container.bottom-left-aligned .marker-text-container {
  right: calc(50% + 100px);
  top: calc(50% + 100px);
  transform: translate(0, -50%);
}

/* Top-right aligned marker */
.marker-container.top-right-aligned .marker-dotted-line {
  left: 50%;
  bottom: 50%;
  width: 100px;
  height: 100px;
  border-right: 2px dotted #ffffff;
  border-top: 2px dotted #ffffff;
}

.marker-container.top-right-aligned .marker-text-container {
  left: calc(50% + 100px);
  bottom: calc(50% + 100px);
  transform: translate(0, 50%);
}

/* Bottom-right aligned marker */
.marker-container.bottom-right-aligned .marker-dotted-line {
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  border-right: 2px dotted #ffffff;
  border-bottom: 2px dotted #ffffff;
}

.marker-container.bottom-right-aligned .marker-text-container {
  left: calc(50% + 100px);
  top: calc(50% + 100px);
  transform: translate(0, -50%);
}

.marker-button {
  all: unset;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 10px 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 1.2em;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.marker-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.marker-button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* Adjust hover effects for all alignments */
.marker-container:hover .marker-circle {
  transform: translate(-50%, -50%) scale(1.5);
  box-shadow: 0 0 16px rgba(255, 255, 255, 1);
}

/* Responsive adjustments for all alignments */
@media (max-width: 640px) {
  .marker-container {
    width: 300px;
    height: 60px;
  }

  .marker-button {
    font-size: 1em;
    padding: 8px 16px;
  }

  .marker-container.bottom-right-aligned .marker-dotted-line,
  .marker-container.top-right-aligned .marker-dotted-line,
  .marker-container.bottom-left-aligned .marker-dotted-line {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .marker-container {
    width: 240px;
    height: 50px;
  }

  .marker-button {
    font-size: 0.9em;
    padding: 6px 12px;
  }

  .marker-container.bottom-right-aligned .marker-dotted-line,
  .marker-container.top-right-aligned .marker-dotted-line,
  .marker-container.bottom-left-aligned .marker-dotted-line {
    width: 60px;
    height: 60px;
  }
}
`

interface PoliceLocation {
  name: string
  coordinates: [number, number]
  type: string
  description: string
  color: string
}

interface AlAinMapProps {
  policeLocations: Array<{
    name: string
    coordinates: [number, number]
    type: string
    description: string
  }>
  onToggleTerrain: () => void
}

// Add these constants at the top of the file after the interfaces
const ZOOM_THRESHOLD = 13

// Define coordinates to exclude
const EXCLUDED_COORDINATES: [number, number] = [55.74252775199696, 24.23252678639456]

// Helper function to check if coordinates are approximately equal (with a small tolerance)
function areCoordinatesEqual(coord1: [number, number], coord2: [number, number], tolerance = 0.0001): boolean {
  return Math.abs(coord1[0] - coord2[0]) < tolerance && Math.abs(coord1[1] - coord2[1]) < tolerance
}

// Define markers that should always be hidden at initial zoom
const ALWAYS_HIDDEN_MARKERS: string[] = ["مبنى إدارات شرطة", "مركز شرطة الجيمي القديم"]

// Remove the three markers from the HIDDEN_AT_START array
const HIDDEN_AT_START = [
  "قسم موسيقى شرطة أبوظبي",
  "إدارة التأهيل الشرطي - الفوعة",
  "مركز شرطة هيلي",
  "ميدان الشرطة بدع بنت سعود",
  "متحف شرطة المربعة",
  "مركز شرطة المربعة",
  "مديرية شرطة العين",
  "فرع النقل والمشاغل",
  "نادي ضباط الشرطة",
  "مركز شرطة زاخر",
  "فلل فلج هزاع",
  "فلل فلج هزاع (قسم الأدلة الجنائية - قسم التفتيش الأمني - قسم الشرطة المجتمعية - قسم تأجير المركبات - قسم الاستقطاب)",
  "قسم التفتيش الأمني K9",
  "الضبط المروري والمراسم",
  "ساحة حجز المركبات فلج هزاع",
  "إدارة المرور والترخيص",
  "قسم الدوريات الخاصة",
  "إدارة الدوريات الخاصة",
  "المعهد المروري",
  "سكن أفراد المرور",
  "قسم هندسة المرور",
  "المتابعة الشرطية والرعاية اللاحقة",
  "ادارة المهام الخاصة العين",
  "مبنى التحريات والمخدرات",
  "إدارة الأسلحة والمتفجرات",
  "مركز شرطة فلج هزاع",
  "فلل للادرات الشرطية عشارج",
  "مركز شرطة المقام",
  "مركز شرطة الساد",
  "ساحة حجز المركبات - الساد",
]

// Keep only these two area definitions
const murabaArea = {
  type: "Feature",
  properties: {
    stroke: "#ffffff",
    "stroke-width": 3,
    "stroke-opacity": 1,
    fill: "#9c9c9c",
    "fill-opacity": 0.5,
    place: "Al Murabba Police Museum",
  },
  geometry: {
    coordinates: [
      [
        [55.75305885377762, 24.230858484121896],
        [55.75225740110416, 24.230858008423656],
        [55.75183151059872, 24.23068629524291],
        [55.75154981133818, 24.23040091755185],
        [55.75144144846382, 24.229694030394725],
        [55.75090940746401, 24.22394839438347],
        [55.752096691208294, 24.213256916108236],
        [55.76028946343882, 24.213350938335935],
        [55.76091742176189, 24.205218802572503],
        [55.7881486145632, 24.20571339991507],
        [55.784149773532675, 24.22873464788509],
        [55.75305885377762, 24.230858484121896],
      ],
    ],
    type: "Polygon",
  },
  id: 4,
}

const sixteenProjectsArea = {
  type: "Feature",
  properties: {
    stroke: "#ffffff",
    "stroke-width": 3,
    "stroke-opacity": 1,
    fill: "#8c8c8c",
    "fill-opacity": 0.5,
    place: "16 projects",
  },
  geometry: {
    coordinates: [
      [
        [55.74579431298241, 24.20528865302552],
        [55.736896995402134, 24.207059204870717],
        [55.726381983717744, 24.205878839706585],
        [55.69710172040911, 24.191418479404405],
        [55.71214627558868, 24.16824897470721],
        [55.713602200284186, 24.13607033285753],
        [55.73123506603312, 24.132527234990818],
        [55.738029381275936, 24.136365586581775],
        [55.737705842455654, 24.1400562006111],
        [55.736896995402134, 24.144632414049482],
        [55.74304423300299, 24.153341528912648],
        [55.752426858815056, 24.158655273508074],
        [55.75614755525817, 24.16824897470721],
        [55.75679463290021, 24.17400484945017],
        [55.75711817172038, 24.18226924132678],
        [55.75388278351059, 24.188909882646996],
        [55.74773554590979, 24.198648864562415],
        [55.74579431298241, 24.20528865302552],
      ],
    ],
    type: "Polygon",
  },
}

const sevenProjectsArea = {
  type: "Feature",
  properties: {
    stroke: "#ffffff",
    "stroke-width": 3,
    "stroke-opacity": 1,
    fill: "#a39e9e",
    "fill-opacity": 0.5,
    place: "7projects",
  },
  geometry: {
    coordinates: [
      [
        [55.75320587470995, 24.31937770887191],
        [55.74866529608616, 24.31371612425984],
        [55.741117232531025, 24.299377640107906],
        [55.73529375287342, 24.288864285856754],
        [55.73220691726995, 24.282695561092172],
        [55.72962035531012, 24.27955930468265],
        [55.72419698993917, 24.276112551733227],
        [55.719986788157684, 24.274387331201126],
        [55.720523326777965, 24.27209760359058],
        [55.719523616520576, 24.230397016302305],
        [55.727271371017906, 24.231764465420966],
        [55.738268183852085, 24.231308650680177],
        [55.751014489637186, 24.23062492550929],
        [55.755513185797525, 24.263895289799436],
        [55.76391824170878, 24.27915678720079],
        [55.767546343301134, 24.287180253679978],
        [55.76777685369848, 24.29549349656652],
        [55.764211134388226, 24.301525575003094],
        [55.76254083630381, 24.304541615589287],
        [55.76102062031366, 24.307671639730906],
        [55.7567505491212, 24.313296722989808],
        [55.75320587470995, 24.31937770887191],
      ],
    ],
    type: "Polygon",
  },
  id: 6,
}

const twoProjectsArea = {
  type: "Feature",
  properties: {
    stroke: "#ffffff",
    "stroke-width": 3,
    "stroke-opacity": 1,
    fill: "#959393",
    "fill-opacity": 0.5,
    place: "2projects",
  },
  geometry: {
    coordinates: [
      [
        [55.83420236287404, 24.383762072745526],
        [55.79788613282827, 24.3798350800525],
        [55.77350948526214, 24.34010518345994],
        [55.76007745497165, 24.32847087669083],
        [55.754439318799854, 24.319857779718504],
        [55.770192934572606, 24.295375256929304],
        [55.790258066242075, 24.299758277956414],
        [55.80120268351618, 24.29628210128557],
        [55.80783578489522, 24.310337360128486],
        [55.833373225200944, 24.327866467928132],
        [55.83420236287404, 24.383762072745526],
      ],
    ],
    type: "Polygon",
  },
  id: 2,
}

const zeroProjectsArea = {
  type: "Feature",
  properties: {
    stroke: "#ffffff",
    "stroke-width": 3,
    "stroke-opacity": 1,
    fill: "#a5a1a1",
    "fill-opacity": 0.5,
    place: "zeroprojects",
  },
  geometry: {
    coordinates: [
      [
        [55.71815014030551, 24.27405787200594],
        [55.71097205650264, 24.27256221385977],
        [55.704204148917825, 24.269196918660327],
        [55.696000624572775, 24.264335779368025],
        [55.6937446553782, 24.256108812421544],
        [55.67713251857887, 24.2430193588894],
        [55.679388487774446, 24.2325468263777],
        [55.684147383922635, 24.216915729779927],
        [55.686771659684325, 24.207297000866333],
        [55.72204681436949, 24.223382653604787],
        [55.71773996408734, 24.230302600157174],
        [55.71815014030551, 24.27405787200594],
      ],
    ],
    type: "Polygon",
  },
  id: 5,
}

const policeAdminVillasArea = {
  type: "Feature",
  properties: {
    stroke: "#ffffff",
    "stroke-width": 3,
    "stroke-opacity": 1,
    fill: "#c6c3c3",
    "fill-opacity": 0.5,
    place: "Police Administration Villas, Asharej",
  },
  geometry: {
    coordinates: [
      [
        [55.68566819221107, 24.206726290789746],
        [55.67833055397, 24.233031107159306],
        [55.653185325193306, 24.223496782487672],
        [55.61672338992037, 24.20977653076507],
        [55.59897267589736, 24.201798825848513],
        [55.59357028467315, 24.202268116430417],
        [55.584051785849766, 24.20039094373611],
        [55.58765337999921, 24.19569789107733],
        [55.596657365372835, 24.183964503790605],
        [55.606175864196274, 24.175750490561597],
        [55.61981047062011, 24.17880147148037],
        [55.68566819221107, 24.206726290789746],
      ],
    ],
    type: "Polygon",
  },
  id: 1,
}

const zakhirPoliceStationArea = {
  type: "Feature",
  properties: {
    stroke: "#ffffff",
    "stroke-width": 3,
    "stroke-opacity": 1,
    fill: "#b5b0b0",
    "fill-opacity": 0.5,
    place: "Zakhir Police Station",
  },
  geometry: {
    coordinates: [
      [
        [55.69544394775994, 24.19030066698359],
        [55.67486340976271, 24.182791105701057],
        [55.663801370588885, 24.175281102408334],
        [55.6751206664882, 24.15274844149046],
        [55.70573421675863, 24.13068135993663],
        [55.708564040734046, 24.130916136167826],
        [55.709335810908044, 24.13467249724657],
        [55.711908378158, 24.136315870523333],
        [55.710107581083264, 24.167301239710895],
        [55.69544394775994, 24.19030066698359],
      ],
    ],
    type: "Polygon",
  },
  id: 0,
}

export default function AlAinMap({ policeLocations, onToggleTerrain }: AlAinMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const router = useRouter()
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({})

  useEffect(() => {
    if (map.current) return

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
      console.error("Mapbox access token is missing")
      return
    }

    mapboxgl.accessToken = accessToken

    // Update the map initialization in the useEffect hook
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
      center: [55.74523, 24.21089], // Al Ain center coordinates
      zoom: 10.5,
      pitch: 0, // Set pitch to 0 for flat view
      bearing: 0, // Set bearing to 0 for north-up orientation
      maxBounds: [
        // Restrict map panning to Al Ain region
        [55.0, 23.5], // Southwest coordinates
        [56.0, 24.7], // Northeast coordinates
      ],
      minZoom: 9.0,
      maxZoom: 16,
    })

    // Add styles to document
    const styleSheet = document.createElement("style")
    styleSheet.textContent = markerStyles
    document.head.appendChild(styleSheet)

    // Update the initial animation in the load event
    map.current.on("load", () => {
      setMapLoaded(true)
      if (!map.current) return

      // Add polygon source and layer
      // Remove this section

      // Add Alamerah Polygon
      map.current.addSource("alamerah", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [alamerahCoordinates],
          },
        },
      })

      map.current.addLayer({
        id: "alamerah-fill",
        type: "fill",
        source: "alamerah",
        layout: {},
        paint: {
          "fill-color": "#b0b0b0", // Changed to a light gray similar to other polygons
          "fill-opacity": 0.4,
        },
      })

      map.current.addLayer({
        id: "alamerah-outline",
        type: "line",
        source: "alamerah",
        layout: {},
        paint: {
          "line-color": "#ffffff", // Changed to white to match other polygons
          "line-width": 3,
          "line-opacity": 0.7,
        },
      })

      // Add initial zoom animation
      map.current.easeTo({
        zoom: 10.5,
        duration: 2000,
      })

      // Update the mask opacity for better visibility in 2D
      map.current.addLayer({
        id: "map-mask",
        type: "background",
        paint: {
          "background-color": "#1b1f3a", // Changed from #000000 to a navy blue color
          "background-opacity": 0.25, // Reduced from 0.35 to 0.25 for better visibility
        },
      })

      // Update the fill opacity for better visibility in 2D
      map.current.addSource("muraba-area", {
        type: "geojson",
        data: murabaArea,
      })

      map.current.addLayer({
        id: "muraba-area-fill",
        type: "fill",
        source: "muraba-area",
        paint: {
          "fill-color": "#9c9c9c",
          "fill-opacity": 0.5,
        },
      })

      map.current.addLayer({
        id: "muraba-area-outline",
        type: "line",
        source: "muraba-area",
        paint: {
          "line-color": "#ffffff",
          "line-width": 3,
          "line-opacity": 1,
        },
      })

      map.current.addSource("sixteen-projects-area", {
        type: "geojson",
        data: sixteenProjectsArea,
      })

      map.current.addLayer({
        id: "sixteen-projects-area-fill",
        type: "fill",
        source: "sixteen-projects-area",
        paint: {
          "fill-color": "#D3D3D3", // Changed from "#ffffff" to light gray
          "fill-opacity": 0.4,
        },
      })

      // Update the sixteen projects area outline layer
      map.current.addLayer({
        id: "sixteen-projects-area-outline",
        type: "line",
        source: "sixteen-projects-area",
        paint: {
          "line-color": "#ffffff", // Set to white
          "line-width": 3, // Set to 3
          "line-opacity": 0.7,
        },
      })

      // Add seven projects area
      map.current.addSource("seven-projects-area", {
        type: "geojson",
        data: sevenProjectsArea,
      })

      map.current.addLayer({
        id: "seven-projects-area-fill",
        type: "fill",
        source: "seven-projects-area",
        paint: {
          "fill-color": "#a39e9e",
          "fill-opacity": 0.4,
        },
      })

      map.current.addLayer({
        id: "seven-projects-area-outline",
        type: "line",
        source: "seven-projects-area",
        paint: {
          "line-color": "#ffffff",
          "line-width": 3,
          "line-opacity": 0.7,
        },
      })

      // Add two projects area
      map.current.addSource("two-projects-area", {
        type: "geojson",
        data: twoProjectsArea,
      })

      map.current.addLayer({
        id: "two-projects-area-fill",
        type: "fill",
        source: "two-projects-area",
        paint: {
          "fill-color": "#959393",
          "fill-opacity": 0.4,
        },
      })

      map.current.addLayer({
        id: "two-projects-area-outline",
        type: "line",
        source: "two-projects-area",
        paint: {
          "line-color": "#ffffff",
          "line-width": 3,
          "line-opacity": 0.7,
        },
      })

      // Add zero projects area
      map.current.addSource("zero-projects-area", {
        type: "geojson",
        data: zeroProjectsArea,
      })

      map.current.addLayer({
        id: "zero-projects-area-fill",
        type: "fill",
        source: "zero-projects-area",
        paint: {
          "fill-color": "#a5a1a1",
          "fill-opacity": 0.4,
        },
      })

      map.current.addLayer({
        id: "zero-projects-area-outline",
        type: "line",
        source: "zero-projects-area",
        paint: {
          "line-color": "#ffffff",
          "line-width": 3,
          "line-opacity": 0.7,
        },
      })

      // Add Police Administration Villas area
      map.current.addSource("police-admin-villas-area", {
        type: "geojson",
        data: policeAdminVillasArea,
      })

      map.current.addLayer({
        id: "police-admin-villas-area-fill",
        type: "fill",
        source: "police-admin-villas-area",
        paint: {
          "fill-color": "#c6c3c3",
          "fill-opacity": 0.4,
        },
      })

      map.current.addLayer({
        id: "police-admin-villas-area-outline",
        type: "line",
        source: "police-admin-villas-area",
        paint: {
          "line-color": "#ffffff",
          "line-width": 3,
          "line-opacity": 0.7,
        },
      })

      // Add Zakhir Police Station area
      map.current.addSource("zakhir-police-station-area", {
        type: "geojson",
        data: zakhirPoliceStationArea,
      })

      map.current.addLayer({
        id: "zakhir-police-station-area-fill",
        type: "fill",
        source: "zakhir-police-station-area",
        paint: {
          "fill-color": "#b5b0b0",
          "fill-opacity": 0.4,
        },
      })

      map.current.addLayer({
        id: "zakhir-police-station-area-outline",
        type: "line",
        source: "zakhir-police-station-area",
        paint: {
          "line-color": "#ffffff",
          "line-width": 3,
          "line-opacity": 0.7,
        },
      })

      map.current.on("mouseenter", "sixteen-projects-area-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("sixteen-projects-area-fill", "fill-opacity", 0.6)
          map.current.setPaintProperty("sixteen-projects-area-outline", "line-opacity", 0.9)
          map.current.getCanvas().style.cursor = "pointer"
        }
      })

      map.current.on("mouseleave", "sixteen-projects-area-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("sixteen-projects-area-fill", "fill-opacity", 0.4)
          map.current.setPaintProperty("sixteen-projects-area-outline", "line-opacity", 0.7)
          map.current.getCanvas().style.cursor = ""
        }
      })

      // Create an object to store all markers
      const markers: { [key: string]: mapboxgl.Marker } = {}
      markersRef.current = markers

      // Create markers for police locations
      policeLocations.forEach((location) => {
        // Skip creating the marker for "مبنى إدارات شرطة" entirely
        if (location.name === "مبنى إدارات شرطة") {
          return
        }

        // Skip creating any marker with the specified coordinates
        if (areCoordinatesEqual(location.coordinates, EXCLUDED_COORDINATES)) {
          console.log(`Skipping marker at coordinates ${EXCLUDED_COORDINATES}`)
          return
        }

        markers[location.name] = createMarker({
          name: location.name,
          coordinates: location.coordinates,
          alignment: getMarkerAlignment(location.name),
          map: map.current!,
          // Add size property for this specific marker
          size: location.name === "فلل للادرات الشرطية عشارج" ? "small" : "normal",
        })
      })

      // Add the "مبنى إدارات شرطة" marker at specific coordinates
      markers["مبنى إدارات شرطة"] = createMarker({
        name: "مبنى إدارات شرطة",
        coordinates: [55.74289547603556, 24.232372376906],
        alignment: "right-aligned",
        map: map.current!,
      })

      // Make sure this marker follows the visibility rules
      if (markers["مبنى إدارات شرطة"]) {
        const element = markers["مبنى إدارات شرطة"].getElement()
        // Since this marker is in ALWAYS_HIDDEN_MARKERS, it should be hidden initially
        element.style.display = "none"
        console.log(`Setting مبنى إدارات شرطة marker to be hidden initially`)
      }

      // Add the "16 Projects" marker
      markers["16 Projects"] = createMarker({
        name: "16 Projects",
        coordinates: [55.75688628119707, 24.18153037293483], // Using a point from the polygon
        alignment: "right-aligned",
        map: map.current!,
      })

      // Add the "7 Projects" marker
      markers["7 Projects"] = createMarker({
        name: "7 Projects",
        coordinates: [55.74320587470995, 24.27937770887191], // Centered in the polygon
        alignment: "right-aligned",
        map: map.current!,
      })

      // Add the "2 Projects" marker
      markers["2 Projects"] = createMarker({
        name: "2 Projects",
        coordinates: [55.79420236287404, 24.333762072745526], // Centered in the polygon
        alignment: "right-aligned",
        map: map.current!,
      })

      // Add the "2 Projects" marker for Alamerah area
      markers["Alamerah 2 Projects"] = createMarker({
        name: "2 Projects",
        coordinates: [55.53933572994427, 24.235409698348306], // Using a point from alamerah coordinates
        alignment: "bottom-aligned",
        map: map.current!,
      })

      // Add the "مركز شرطة المقام" marker with the same effects as "فلل للادرات الشرطية عشارج"
      markers["مركز شرطة المقام"] = createMarker({
        name: "مركز شرطة المقام",
        coordinates: [55.66797351728485, 24.200895632850177],
        alignment: "top-aligned", // Explicitly set to top-aligned instead of using getMarkerAlignment
        map: map.current!,
      })

      // Add the new "2Projects" marker with top alignment
      markers["2Projects"] = createMarker({
        name: "2Projects",
        coordinates: [55.673752588199704, 24.230262636579667],
        alignment: "top-aligned",
        map: map.current!,
      })

      // Update the "Zakhir Police Station" marker coordinates
      markers["1 Project"] = createMarker({
        name: "1 Project",
        coordinates: [55.70629570288418, 24.137217372354044], // Same coordinates
        alignment: "right-aligned",
        map: map.current!,
      })

      // Add the "مركز شرطة المربعة" marker
      markers["مركز شرطة المربعة"] = createMarker({
        name: "مركز شرطة المربعة",
        coordinates: [55.776750053389094, 24.221008086930823],
        alignment: "top-aligned",
        map: map.current!,
      })

      // Add the "متحف شرطة المربعة" marker
      markers["متحف شرطة المربعة"] = createMarker({
        name: "متحف شرطة المربعة",
        coordinates: [55.77601459818959, 24.220775925214355],
        alignment: "left-aligned", // Changed from "top-aligned" to "left-aligned"
        map: map.current!,
      })

      // Force hide specific markers regardless of zoom level
      ALWAYS_HIDDEN_MARKERS.forEach((markerName) => {
        if (markers[markerName]) {
          const element = markers[markerName].getElement()
          element.style.display = "none"
          console.log(`Forcing ${markerName} to be hidden initially`)
        }
      })

      // Add zoom change handler
      map.current.on("zoom", () => {
        const zoom = map.current!.getZoom()

        // Toggle visibility based on zoom level
        Object.entries(markers).forEach(([name, marker]) => {
          const element = marker.getElement()

          // Always keep specific markers hidden regardless of zoom
          if (ALWAYS_HIDDEN_MARKERS.includes(name)) {
            element.style.display = "none"
            return
          }

          // Handle other markers normally
          if (
            name === "16 Projects" ||
            name === "7 Projects" ||
            name === "2 Projects" ||
            name === "1 Project" ||
            name === "Alamerah 2 Projects"
          ) {
            // Show project markers only at lower zoom levels
            element.style.display = zoom >= ZOOM_THRESHOLD ? "none" : "block"
          } else if (HIDDEN_AT_START.includes(name)) {
            // Show other markers only at higher zoom levels
            element.style.display = zoom >= ZOOM_THRESHOLD ? "block" : "none"
          }
        })
      })

      // Set a fixed center and zoom level with animation
      map.current.flyTo({
        center: [55.74523, 24.21089],
        zoom: 10.5,
        duration: 2000,
      })

      // Add hover effects for the six projects area
      map.current.on("mouseenter", "muraba-area-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("muraba-area-fill", "fill-opacity", 0.6)
          map.current.setPaintProperty("muraba-area-outline", "line-opacity", 0.9)
          map.current.getCanvas().style.cursor = "pointer"
        }
      })

      map.current.on("mouseleave", "muraba-area-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("muraba-area-fill", "fill-opacity", 0.4)
          map.current.setPaintProperty("muraba-area-outline", "line-opacity", 0.7)
          map.current.getCanvas().style.cursor = ""
        }
      })

      map.current.on("mouseenter", "sixteen-projects-area-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("sixteen-projects-area-fill", "fill-opacity", 0.6)
          map.current.setPaintProperty("sixteen-projects-area-outline", "line-opacity", 0.9)
          map.current.getCanvas().style.cursor = "pointer"
        }
      })

      map.current.on("mouseleave", "sixteen-projects-area-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("sixteen-projects-area-fill", "fill-opacity", 0.4)
          map.current.setPaintProperty("sixteen-projects-area-outline", "line-opacity", 0.7)
          map.current.getCanvas().style.cursor = ""
        }
      })

      // Add hover effects for all special areas
      const specialAreas = [
        {
          id: "muraba-area",
          color: "#9c9c9c",
        },
        {
          id: "sixteen-projects-area",
          color: "#ffffff",
        },
        {
          id: "seven-projects-area",
          color: "#a39e9e",
        },
        {
          id: "two-projects-area",
          color: "#959393",
        },
        {
          id: "zero-projects-area",
          color: "#a5a1a1",
        },
        {
          id: "police-admin-villas-area",
          color: "#c6c3c3",
        },
        {
          id: "zakhir-police-station-area",
          color: "#b5b0b0",
        },
        {
          id: "alamerah",
          color: "#b0b0b0", // Changed from '#00796b' to '#b0b0b0'
        },
      ]

      specialAreas.forEach(({ id, color }) => {
        // Add hover effect for fill
        map.current.on("mouseenter", `${id}-fill`, () => {
          if (map.current) {
            map.current.setPaintProperty(`${id}-fill`, "fill-opacity", 0.7)
            map.current.setPaintProperty(`${id}-fill`, "fill-color", color)
            map.current.setPaintProperty(`${id}-outline`, "line-opacity", 1)
            map.current.setPaintProperty(`${id}-outline`, "line-width", 3)
            map.current.getCanvas().style.cursor = "pointer"
          }
        })

        map.current.on("mouseleave", `${id}-fill`, () => {
          if (map.current) {
            map.current.setPaintProperty(`${id}-fill`, "fill-opacity", 0.4)
            map.current.setPaintProperty(`${id}-fill`, "fill-color", color)
            map.current.setPaintProperty(`${id}-outline`, "line-opacity", 0.7)
            map.current.setPaintProperty(`${id}-outline`, "line-width", 2)
            map.current.getCanvas().style.cursor = ""
          }
        })

        // Add hover effect for outline
        map.current.on("mouseenter", `${id}-outline`, () => {
          if (map.current) {
            map.current.setPaintProperty(`${id}-fill`, "fill-opacity", 0.7)
            map.current.setPaintProperty(`${id}-fill`, "fill-color", color)
            map.current.setPaintProperty(`${id}-outline`, "line-opacity", 1)
            map.current.setPaintProperty(`${id}-outline`, "line-width", 3)
            map.current.getCanvas().style.cursor = "pointer"
          }
        })

        map.current.on("mouseleave", `${id}-outline`, () => {
          if (map.current) {
            map.current.setPaintProperty(`${id}-fill`, "fill-opacity", 0.4)
            map.current.setPaintProperty(`${id}-fill`, "fill-color", color)
            map.current.setPaintProperty(`${id}-outline`, "line-opacity", 0.7)
            map.current.setPaintProperty(`${id}-outline`, "line-width", 2)
            map.current.getCanvas().style.cursor = ""
          }
        })
      })

      // Add click handlers for all polygons
      const handlePolygonClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features[0] && e.features[0].geometry.type === "Polygon") {
          const coordinates = e.features[0].geometry.coordinates[0] as [number, number][]
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord as mapboxgl.LngLatLike)
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

          map.current?.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
          })
        }
      }

      // Add click handlers for all areas
      specialAreas.forEach(({ id }) => {
        map.current?.on("click", `${id}-fill`, handlePolygonClick)
      })

      // Add popup for Alamerah
      map.current.on("click", "alamerah-fill", (e) => {
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML("<h3>Alamerah</h3><p>A region in Al Ain.</p>")
          .addTo(map.current!)
      })

      // Change cursor on hover for Alamerah
      map.current.on("mouseenter", "alamerah-fill", () => {
        map.current!.getCanvas().style.cursor = "pointer"
      })

      map.current.on("mouseleave", "alamerah-fill", () => {
        map.current!.getCanvas().style.cursor = ""
      })
    })

    // Add navigation controls with custom styles
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true,
    })
    map.current.addControl(nav, "bottom-right")

    return () => {
      map.current?.remove()
      document.head.removeChild(styleSheet)
      // Remove any dynamically added styles
      document.querySelectorAll("style[data-marker-style]").forEach((el) => el.remove())
    }
  }, [policeLocations])

  // Helper function to create markers
  function createMarker({
    name,
    coordinates,
    alignment,
    map,
    size = "normal", // Add this line
  }: {
    name: string
    coordinates: [number, number]
    alignment: string
    map: mapboxgl.Map
    size?: "small" | "normal" // Add this line
  }) {
    // Create marker container
    const markerElement = document.createElement("div")
    markerElement.className = "marker-container"

    // Add special styling for small markers
    if (size === "small") {
      const style = document.createElement("style")
      const uniqueClass = `marker-${name.toLowerCase().replace(/\s+/g, "-")}`
      markerElement.classList.add(uniqueClass)

      style.textContent = `
    .${uniqueClass} .marker-circle {
      width: 6px !important;
      height: 6px !important;
    }
    
    .${uniqueClass} .marker-button {
      font-size: 0.9em !important;
      padding: 6px 12px !important;
    }

    .${uniqueClass} .marker-dotted-line {
      height: 40px !important;
    }

    .${uniqueClass}.top-aligned .marker-dotted-line {
      height: 40px !important;
      bottom: 50% !important;
    }

    .${uniqueClass}.top-aligned .marker-text-container {
      bottom: calc(50% + 40px) !important;
    }

    .${uniqueClass} {
      height: 50px !important;
    }
  `
      style.setAttribute("data-marker-style", "true")
      document.head.appendChild(style)
    }

    // Add special styling for "5 Projects" marker
    if (name === "5 Projects") {
      const style = document.createElement("style")
      const uniqueClass = `marker-${name.toLowerCase().replace(/\s+/g, "-")}`
      markerElement.classList.add(uniqueClass)

      style.textContent = `
        .${uniqueClass} .marker-dotted-line {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.9) 50%, transparent 50%) !important;
          background-size: 8px 2px !important;
          opacity: 0.9 !important;
        }
        
        .${uniqueClass} .marker-circle {
          background-color: rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.9) !important;
        }
      `
      document.head.appendChild(style)
    }

    // Set initial visibility based on marker name
    if (
      name === "16 Projects" ||
      name === "7 Projects" ||
      name === "2 Projects" ||
      name === "1 Project" ||
      name === "Alamerah 2 Projects"
    ) {
      markerElement.style.display = map.getZoom() >= ZOOM_THRESHOLD ? "none" : "block"
    } else if (ALWAYS_HIDDEN_MARKERS.includes(name)) {
      // Always hide these specific markers
      markerElement.style.display = "none"
      console.log(`Setting ${name} to be permanently hidden`)
    } else if (HIDDEN_AT_START.includes(name)) {
      // Make sure this condition is applied consistently for all markers
      markerElement.style.display = map.getZoom() >= ZOOM_THRESHOLD ? "block" : "none"
    }

    // Rest of the createMarker function remains the same...
    const circleElement = document.createElement("div")
    circleElement.className = "marker-circle"
    markerElement.appendChild(circleElement)

    const contentWrapper = document.createElement("div")
    contentWrapper.className = "marker-content-wrapper"

    const lineElement = document.createElement("div")
    lineElement.className = "marker-dotted-line"
    contentWrapper.appendChild(lineElement)

    // Keep only this declaration:
    const textContainer = document.createElement("div")
    textContainer.className = "marker-text-container"
    contentWrapper.appendChild(textContainer)

    const buttonElement = document.createElement("button")
    buttonElement.className = "marker-button"
    buttonElement.textContent = name
    buttonElement.setAttribute("type", "button")
    buttonElement.setAttribute("aria-label", `View details for ${name}`)
    buttonElement.onclick = (e) => {
      e.stopPropagation()
      if (name === "مركز شرطة الساد") {
        router.push("/al-ain/saad-police-station")
      } else {
        console.log(`Clicked ${name}`)
      }
    }
    textContainer.appendChild(buttonElement)

    markerElement.appendChild(contentWrapper)
    markerElement.className += ` ${alignment}`

    // Create the marker and store it in a ref for zoom handling
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: "center",
    })
      .setLngLat(coordinates)
      .addTo(map)

    // Add data attributes for identification
    markerElement.setAttribute("data-marker-name", name)

    return marker
  }

  // Helper function to determine marker alignment
  function getMarkerAlignment(name: string): string {
    switch (name) {
      case "مركز شرطة رماح":
      case "مركز شرطة سويحان":
      case "مركز شرطة زاخر":
      case "مركز شرطة الوقن":
      case "متحف شرطة المربعة":
      case "مبنى التحريات والمخدرات":
      case "المتابعة الشرطية والرعاية اللاحقة":
        return "left-aligned"
      case "مركز شرطة الساد":
      case "مركز شرطة الهير":
      case "1 Project":
      case "فلل فلج هزاع":
      case "قسم التفتيش الأمني K9":
        return "bottom-aligned"
      case "نادي ضباط الشرطة":
      case "قسم موسيقى شرطة أبوظبي":
      case "مديرية شرطة العين":
      case "ساحة حجز المركبات - الساد":
      case "فلل للادرات الشرطية عشارج":
      case "مركز شرطة المقام":
      case "مركز شرطة فلج هزاع":
        return "top-aligned"
      case "مركز شرطة الجيمي":
      case "مركز شرطة المقام":
        return "bottom-left-aligned"
      case "إدارة المرور والترخيص":
        return "bottom-right-aligned"
      case "5 Projects":
        return "right-aligned"
      default:
        return "right-aligned"
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      <AnimatedControls
        onResetView={() => {
          map.current?.easeTo({
            bearing: 0,
            pitch: 0,
            duration: 1500,
          })
        }}
        onToggleTerrain={onToggleTerrain}
      />
    </div>
  )
}
