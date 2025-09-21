"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AnimatedControls } from "@/components/AnimatedControls"
import { useMapboxToken } from "@/hooks/useMapboxToken"
import { MarkerHoverWidget } from "@/components/MarkerHoverWidget"
import MapInstructionWidget from "@/components/MapInstructionWidget"

// Declare mapboxgl as a global variable
declare global {
  interface Window {
    mapboxgl: any
  }
}

const markerStyles = `
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.marker-container {
  position: absolute !important;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: auto;
  width: 2rem;
  height: 2rem;
}

@media (min-width: 640px) {
  .marker-container {
    width: 2.25rem;
    height: 2.25rem;
  }
}

@media (min-width: 768px) {
  .marker-container {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.marker-circle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.625rem;
  height: 0.625rem;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@media (min-width: 640px) {
  .marker-circle {
    width: 0.75rem;
    height: 0.75rem;
  }
}

@media (min-width: 768px) {
  .marker-circle {
    width: 0.875rem;
    height: 0.875rem;
  }
}

.marker-number {
  color: #000000;
  font-size: 0.625rem;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  user-select: none;
  transition: color 0.3s ease;
}

@media (min-width: 640px) {
  .marker-number {
    font-size: 0.6875rem;
  }
}

@media (min-width: 768px) {
  .marker-number {
    font-size: 0.75rem;
  }
}

.marker-tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -130%);
  white-space: nowrap;
  box-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
  border: 1px solid rgba(0, 204, 255, 0.3);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.2s ease;
}

@media (min-width: 640px) {
  .marker-tooltip {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}

@media (min-width: 768px) {
  .marker-tooltip {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}

/* Hide Mapbox attribution */
.mapboxgl-ctrl-bottom-right {
  display: none !important;
}

/* Ensure markers are above in-container overlays */
.mapboxgl-marker {
  position: absolute;
  z-index: 20 !important;
}

/* Added sophisticated label system from 16 projects page */
.marker-label {
  position: absolute;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  font-size: 13px;
  font-weight: 600;
  color: #000;
  white-space: nowrap;
  pointer-events: auto;
  z-index: 14;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.marker-label:hover {
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3), 0 8px 24px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

/* Circular positioning system - 8 positions around the circle */
/* Position 1: Top (0°) */
.marker-container.position-1 .marker-label {
  bottom: calc(100% + 80px);
  left: 50%;
  transform: translateX(-50%);
}

/* Position 2: Top-Right (45°) */
.marker-container.position-2 .marker-label {
  bottom: calc(100% + 60px);
  left: calc(100% + 60px);
  transform: translate(-30%, 30%);
}

/* Position 3: Right (90°) */
.marker-container.position-3 .marker-label {
  top: 50%;
  left: calc(100% + 80px);
  transform: translateY(-50%);
}

/* Position 4: Bottom-Right (135°) */
.marker-container.position-4 .marker-label {
  top: calc(100% + 60px);
  left: calc(100% + 60px);
  transform: translate(-30%, -30%);
}

/* Position 5: Bottom (180°) */
.marker-container.position-5 .marker-label {
  top: calc(100% + 80px);
  left: 50%;
  transform: translateX(-50%);
}

/* Position 6: Bottom-Left (225°) */
.marker-container.position-6 .marker-label {
  top: calc(100% + 60px);
  right: calc(100% + 60px);
  transform: translate(50%, -50%);
}

/* Position 7: Left (270°) */
.marker-container.position-7 .marker-label {
  top: 50%;
  right: calc(100% + 80px);
  transform: translateY(-50%);
}

/* Position 8: Top-Left (315°) */
.marker-container.position-8 .marker-label {
  bottom: calc(100% + 60px);
  right: calc(100% + 60px);
  transform: translate(30%, 30%);
}

/* Simple connecting lines - straight lines only */
.marker-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  z-index: 13;
  transition: all 0.3s ease;
}

.marker-container:hover .marker-line {
  background: #0ea5e9;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.6);
}

/* Line styles for each position */
.marker-container.position-1 .marker-line,
.marker-container.position-5 .marker-line {
  width: 2px;
  height: 80px;
  left: 50%;
  transform: translateX(-50%);
}

.marker-container.position-1 .marker-line {
  bottom: 100%;
}

.marker-container.position-5 .marker-line {
  top: 100%;
}

.marker-container.position-3 .marker-line,
.marker-container.position-7 .marker-line {
  height: 2px;
  width: 80px;
  top: 50%;
  transform: translateY(-50%);
}

.marker-container.position-3 .marker-line {
  left: 100%;
}

.marker-container.position-7 .marker-line {
  right: 100%;
}

.marker-container.position-2 .marker-line,
.marker-container.position-4 .marker-line,
.marker-container.position-6 .marker-line,
.marker-container.position-8 .marker-line {
  background: transparent;
  transition: all 0.3s ease;
  border: none;
}

.marker-container:hover .marker-container.position-2 .marker-line,
.marker-container:hover .marker-container.position-4 .marker-line,
.marker-container:hover .marker-container.position-6 .marker-line,
.marker-container:hover .marker-container.position-8 .marker-line {
  border: none;
}

.marker-container.position-2 .marker-line {
  bottom: 100%;
  left: 100%;
  width: 2px;
  height: 60px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8) 50%, transparent 50%);
  background-size: 100% 8px;
  animation: dashFlow 3s linear infinite;
}

.marker-container.position-4 .marker-line {
  top: 100%;
  left: 100%;
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 50%, transparent 50%);
  background-size: 100% 8px;
  animation: dashFlow 3s linear infinite;
}

.marker-container.position-6 .marker-line {
  top: 100%;
  right: 100%;
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 50%, transparent 50%);
  background-size: 100% 8px;
  animation: dashFlow 3s linear infinite;
}

.marker-container.position-8 .marker-line {
  bottom: 100%;
  right: 100%;
  width: 2px;
  height: 60px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8) 50%, transparent 50%);
  background-size: 100% 8px;
  animation: dashFlow 3s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .marker-label {
    font-size: 11px;
    padding: 6px 12px;
  }
  
  .marker-container.position-1 .marker-line,
  .marker-container.position-5 .marker-line {
    height: 60px;
  }
  
  .marker-container.position-1 .marker-label {
    bottom: calc(100% + 60px);
  }
  
  .marker-container.position-5 .marker-label {
    top: calc(100% + 60px);
  }
  
  .marker-container.position-3 .marker-line,
  .marker-container.position-7 .marker-line {
    width: 60px;
  }
  
  .marker-container.position-3 .marker-label {
    left: calc(100% + 60px);
  }
  
  .marker-container.position-7 .marker-label {
    right: calc(100% + 60px);
  }
  
  .marker-container.position-2 .marker-line,
  .marker-container.position-4 .marker-line,
  .marker-container.position-6 .marker-line,
  .marker-container.position-8 .marker-line {
    width: 45px;
    height: 45px;
  }
  
  .marker-container.position-2 .marker-label,
  .marker-container.position-8 .marker-label {
    bottom: calc(100% + 45px);
  }
  
  .marker-container.position-4 .marker-label,
  .marker-container.position-6 .marker-label {
    top: calc(100% + 45px);
  }
  
  .marker-container.position-2 .marker-label,
  .marker-container.position-4 .marker-label {
    left: calc(100% + 45px);
  }
  
  .marker-container.position-6 .marker-label,
  .marker-container.position-8 .marker-label {
    right: calc(100% + 45px);
  }
}

@media (max-width: 640px) {
  .marker-label {
    font-size: 10px;
    padding: 4px 8px;
  }
  
  .marker-container.position-1 .marker-line,
  .marker-container.position-5 .marker-line {
    height: 45px;
  }
  
  .marker-container.position-1 .marker-label {
    bottom: calc(100% + 45px);
  }
  
  .marker-container.position-5 .marker-label {
    top: calc(100% + 45px);
  }
  
  .marker-container.position-3 .marker-line,
  .marker-container.position-7 .marker-line {
    width: 45px;
  }
  
  .marker-container.position-3 .marker-label {
    left: calc(100% + 45px);
  }
  
  .marker-container.position-7 .marker-label {
    right: calc(100% + 45px);
  }
  
  .marker-container.position-2 .marker-line,
  .marker-container.position-4 .marker-line,
  .marker-container.position-6 .marker-line,
  .marker-container.position-8 .marker-line {
    width: 35px;
    height: 35px;
  }
  
  .marker-container.position-2 .marker-label,
  .marker-container.position-4 .marker-label {
    left: calc(100% + 35px);
  }
  
  .marker-container.position-6 .marker-label,
  .marker-container.position-8 .marker-label {
    right: calc(100% + 35px);
  }
}

/* Dashed connection lines */
.connection-line {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.dashed-line {
  stroke: rgba(255, 255, 255, 0.8);
  stroke-width: 2;
  stroke-dasharray: 8 4;
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
  animation: dashFlow 3s linear infinite;
}

.dashed-line-hover {
  stroke: rgba(0, 204, 255, 1);
  stroke-width: 3;
  stroke-dasharray: 8 4;
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px rgba(0, 204, 255, 0.6));
  animation: dashFlow 2s linear infinite;
}

@keyframes dashFlow {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 24;
  }
}

/* Connection labels */
.connection-label {
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.connection-label.visible {
  opacity: 1;
}

.connection-label::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgba(0, 0, 0, 0.85);
}

.connection-label.opposite-label {
  transform: none;
}
`

interface AlAinMapProps {
  policeLocations: Array<{
    name: string
    coordinates: [number, number]
    type: string
    description: string
  }>
  onToggleTerrain: () => void
  offsetX?: number
  offsetY?: number
  mapRef?: React.MutableRefObject<any>
  rightSliderRef?: React.MutableRefObject<any>
}

// Mapbox styles configuration
const MAPBOX_STYLES = {
  style1: {
    url: "mapbox://styles/azizullah2611/cm7ehm5if00c001r7fr9pgvvk",
    name: "Style 1 (Latest)",
  },
  style2: {
    url: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
    name: "Style 2 (Current)",
  },
  style3: {
    url: "mapbox://styles/azizullah2611/cm6okbhyo000301qz5q58gdud",
    name: "Style 3 (Original)",
  },
}

// Constants
const ZOOM_THRESHOLD = 12
const EXCLUDED_COORDINATES: [number, number] = [55.74252775199696, 24.23252678639456]

const ALWAYS_HIDDEN_MARKERS: string[] = [
  "مركز شرطة الجيمي القديم",
  "قسم الدوريات الخاصة",
  "إدارة الدوريات الخاصة",
  "قسم هندسة المرور",
  "مركز شرطة فلج هزاع",
  "إدارة الأسلحة والمتفجرات",
  "��بنى التحريات والم��درات",
  "ادارة المهام الخاصة العين",
  "الضبط المروري والمراسم",
  "المتابعة الشرطية والرعاية اللاحقة",
  "سكن أفراد المرور",
  "المعهد المر��ري",
  "إدارة المرور والترخ��ص",
  "ساحة حجز المركبات فلج هزاع",
  "قسم التفتيش الأمني K9",
  "فلل فلج هزاع (قسم الأدلة الجنائية - قسم الشرطة المجتمعية - قسم تأجير المركبات - قسم الاستقطاب)",
]

const ALWAYS_VISIBLE_MARKERS: string[] = ["مركز شرطة الوقن"]

const EXCLUDED_MARKERS: string[] = [
  "مركز شرطة فلج هزاع",
  "إدارة الأسلحة والمتفجرات",
  "مبنى التحريات والمخدرات",
  "ادارة المهام الخاصة العين",
  "الضبط المروري والمرا��م",
  "المتابعة الشرطية والرعاية اللاحقة",
  "سكن أفراد المرور",
  "المعهد المروري",
  "إدارة المرور والترخيص",
  "ساحة حجز المركبات فلج هزاع",
  "قسم التفتيش الأمني K9",
  "فلل فلج هزاع",
  "ف��ل للادرات الشرط��ة عشارج",
  "مركز شرطة المقام",
  "مركز شرطةasad",
  "ساحة حجز المركبات -asad",
  "16 Projects",
  "7 Projects",
  "2 Projects",
  "1 Project",
]

const HIDDEN_AT_START = [
  "م��كز شرطةasad",
  "متحف شرطة المربعة",
  "مركز شرطة المربعة",
  "مديرية شرطة ا��عين",
  "فرع النقل والمشاغل",
  "نادي ض��اط الشرطة",
  "فلل فلج هزاع",
  "فلل للادرات الشرطية عشارج",
  "مركز شرطة المقام",
  "16 Projects",
  "7 Projects",
  "2 Projects",
]

const PROJECT_NUMBERS: { [key: string]: string } = {
  "16 Projects": "16",
  "7 Projects": "7",
  "2 Projects": "2",
  "1 Project": "1",
  "2Projects": "2",
  "Alamerah 2 Projects": "2 al",
  "نقطة ثبات الروضة": "1",
  "فرع ال��بط المروري (الخزنة)": "1",
  "مركز شرطة القوع (فلل صحة)": "1",
  "ساحة حجز المركبات -asad": "1",
  "مركز شرطة سويحان": "1",
  "مركز شرطة الهير": "1",
  "مركز شرطة الوقن": "1",
}

const HOVERABLE_MARKERS = [
  "قسم موسيقى شرطة أبوظبي",
  "إدارة التأهيل الشرطي - الفوعة",
  "مركز شرطة هيلي",
  "ميدان الشرطة بدع بنت سعود",
  "متحف شرطة المربعة",
  "مركز شرطة ا��مربعة",
  "مديرية شرطة العين",
  "فرع النقل والمشاغل",
  "نادي ضباط الشرطة",
  "مركز شرطةasad",
  "متحف شرطة المربعة",
  "مركز شرطة المرب��ة",
  "مديرية شرطة العين",
  "فرع النقل والمشاغل",
  "نادي ضباط الشرطة",
  "مركز شرطة زاخر",
  "فلل فلج هزاع",
  "فلل فلج هزاع (قسم الأدلة الجنائية - قسم الشرطة المجتمعية - قسم تأجير المركبات - قسم الاستقطاب)",
  "قسم التفتيش الأمني K9",
  "الضبط المروري والمراسم",
  "ساحة حجز المركبات فلج هزاع",
  "إدارة المرور والترخيص",
  "المعهد المروري",
  "سكن أفراد المرور",
  "المتابعة الشرطية والرعاية اللاحقة",
  "ادارة المهام الخاصة العين",
  "مبنى التحريات والمخدرات",
  "إدارة الأسلحة والمتفجرات",
  "مركز شرطة فلج هزاع",
  "فلل للادرات الشرطية عشارج",
  "مركز شرطة المقام",
  "مركز شرطةasad",
  "ساحة حجز المركبات -asad",
  "مركز شرطة الوقن",
  "مركز شرطة الجيمي",
  "مركز شرطة القوع (فلل صحة)",
  "نقطة ثبات الروضة",
  "فرع الضبط المروري (الخزنة)",
  "مبنى إدارات (التربية الرياضية - الاعلام الامني - مسرح الجريمة - فرع البصمة)",
  "1 Project",
  "مركز شرطة سويحان",
  "مركز شرطة الهير",
]

// Helper functions
function areCoordinatesEqual(coord1: [number, number], coord2: [number, number], tolerance = 0.0001): boolean {
  return Math.abs(coord1[0] - coord2[0]) < tolerance && Math.abs(coord1[1] - coord2[1]) < tolerance
}

function isValidCoordinate(coord: [number, number]): boolean {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1])
  )
}

export default function AlAinMap({
  policeLocations,
  onToggleTerrain,
  offsetX = 0,
  offsetY = 0,
  mapRef,
  rightSliderRef,
}: AlAinMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [currentStyle, setCurrentStyle] = useState<keyof typeof MAPBOX_STYLES>("style2")
  const router = useRouter()
  const markersRef = useRef<{ [key: string]: any }>({})
  const [lng] = useState(55.74)
  const [lat] = useState(24.13)
  const [zoom] = useState(10)
  const initialZoomRef = useRef<number>(10.0)
  const { token, loading, error } = useMapboxToken()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialCenterRef = useRef<[number, number]>([0, 0])
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const lastCenterRef = useRef<any>(null)
  const [clickedMarker, setClickedMarker] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  // Load Mapbox GL from CDN with better error handling
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if mapboxgl is already loaded
    if (window.mapboxgl) {
      setMapboxLoaded(true)
      return
    }

    let cssLink: HTMLLinkElement | null = null
    let script: HTMLScriptElement | null = null

    try {
      // Load CSS
      cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
      cssLink.onerror = () => {
        console.error("Failed to load Mapbox CSS")
        setMapError("Failed to load map styles")
      }
      document.head.appendChild(cssLink)

      // Load JS
      script = document.createElement("script")
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
      script.onload = () => {
        if (window.mapboxgl) {
          setMapboxLoaded(true)
        } else {
          setMapError("Mapbox GL failed to initialize")
        }
      }
      script.onerror = () => {
        console.error("Failed to load Mapbox GL JS from CDN")
        setMapError("Failed to load map library")
      }
      document.head.appendChild(script)
    } catch (err) {
      console.error("Error loading Mapbox resources:", err)
      setMapError("Failed to load map resources")
    }

    return () => {
      // Cleanup
      try {
        if (cssLink && document.head.contains(cssLink)) {
          document.head.removeChild(cssLink)
        }
        if (script && document.head.contains(script)) {
          document.head.removeChild(script)
        }
      } catch (e) {
        console.warn("Cleanup error:", e)
      }
    }
  }, [])

  // Handle style change
  const handleStyleChange = (newStyle: keyof typeof MAPBOX_STYLES) => {
    if (map.current && mapLoaded) {
      try {
        setCurrentStyle(newStyle)
        map.current.setStyle(MAPBOX_STYLES[newStyle].url)

        // Re-add layers and markers after style change
        map.current.once("styledata", () => {
          try {
            // Reapply contrast and saturation filter after style change
            const canvas = map.current.getCanvas()
            if (canvas) {
              canvas.style.filter = "contrast(1.2) saturate(1.5) brightness(0.9)"
            }
          } catch (error) {
            console.error("Error re-adding layers after style change:", error)
          }
        })
      } catch (error) {
        console.error("Error changing map style:", error)
        setMapError("Failed to change map style")
      }
    }
  }

  const updateSlidersWithMarkerInfo = useCallback(
    (markerName: string | null) => {
      if (!markerName) return

      try {
        const projectData = {
          id: 1,
          imageSrc: getMarkerImage(markerName),
          projectNameAr: markerName,
          projectNameEn: getEnglishName(markerName),
          coordinates: getMarkerCoordinates(markerName),
        }

        const leftSliderEvent = new CustomEvent("openLeftSlider", {
          detail: { project: projectData, source: "map", timestamp: Date.now() },
        })
        window.dispatchEvent(leftSliderEvent)

        const event = new CustomEvent("markerHovered", {
          detail: { project: projectData },
        })
        window.dispatchEvent(event)
      } catch (error) {
        console.error("Error updating sliders:", error)
      }
    },
    [rightSliderRef],
  )

  function getMarkerImage(name: string): string {
    const imageMap: { [key: string]: string } = {
      "قسم موسيقى شرطة أبوظبي": "https://citytouruae.com/wp-content/uploads/2021/09/Al-Ain-city-1-600x590.jpg",
      "إدارة التأهيل الشرطي - الفوعة":
        "https://c8.alamy.com/comp/K3KAFH/uae-al-ain-skyline-from-zayed-bin-sultan-street-K3KAFH.jpg",
      "مركز شرطة هيلي": "https://www.propertyfinder.ae/blog/wp-content/uploads/2023/07/3-14.jpg",
      "1 Project": "https://whatson.ae/wp-content/uploads/2021/03/Al-Ain-Oasis.jpeg",
      "مركز شرطة الوقن":
        "https://www.visitabudhabi.ae/content/dam/visitabudhabi/images/plan-your-trip/regions-of-abu-dhabi/al-dhafra-region/liwa-oasis/liwa-oasis-hero-1920x1080.jpg",
    }
    return imageMap[name] || "https://whatson.ae/wp-content/uploads/2021/03/Al-Ain-Oasis.jpeg"
  }

  function getEnglishName(name: string): string {
    const nameMap: { [key: string]: string } = {
      "قسم موسيقى شرطة أبوظبي": "Abu Dhabi Police Music Department",
      "إدارة التأهيل الشرطي - الفوعة": "Police Rehabilitation Department - Al Foua",
      "��ركز شرطة هيلي": "Hili Police Station",
      "1 Project": "Al Ain Development Project",
      "مركز شرطة الوقن": "Al Wagan Police Station",
      "ساحة حجز المركبات -asad": "Vehicle Impound Facility - Asad",
      "ساحة حجز المركبات -asad": "Vehicle Impound Facility - Asad",
    }
    return nameMap[name] || "Police Facility"
  }

  function getMarkerCoordinates(name: string): [number, number] {
    if (markersRef.current && markersRef.current[name]) {
      try {
        const lngLat = markersRef.current[name].getLngLat()
        return [lngLat.lng, lngLat.lat]
      } catch (error) {
        console.error("Error getting marker coordinates:", error)
      }
    }
    return [55.74, 24.13]
  }

  const debouncedUpdateMarkers = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (!map.current) return

      Object.entries(markersRef.current).forEach(([name, marker]) => {
        try {
          const position = marker.getLngLat()
          if (position) {
            const element = marker.getElement()
            if (element && element.style.display !== "none") {
              marker.setLngLat(position)
            }
          }
        } catch (error) {
          console.error(`Error updating marker position for ${name}:`, error)
        }
      })
    }, 100)
  }

  useEffect(() => {
    if (rightSliderRef) {
      rightSliderRef.current = rightSliderRef.current
    }
  }, [rightSliderRef])

  useEffect(() => {
    if (map.current) return
    if (loading) return
    if (error || !token) {
      console.error("Mapbox access token error:", error)
      setMapError(error || "No access token available")
      return
    }
    if (!mapboxLoaded || !window.mapboxgl) {
      return
    }

    try {
      window.mapboxgl.accessToken = token

      const markers: { [key: string]: any } = {}
      const markerPositions: { [key: string]: [number, number] } = {}

      markersRef.current = markers

      const baseCenterLng = 55.503133160600925
      const baseCenterLat = 24.106600838029317

      const lngOffset = offsetX * 0.0005
      const latOffset = offsetY * 0.0005

      const centerLng = baseCenterLng + lngOffset
      const centerLat = baseCenterLat - latOffset

      // Calculate the center of the bounded area for all devices to show all markers
      const getInitialCenter = () => {
        if (typeof window === "undefined") return [centerLng, centerLat]

        // Use a more centered position for Al Ain area
        const boundedCenterLng = 55.7 // Center around Al Ain city
        const boundedCenterLat = 24.2 // Center around Al Ain city
        return [boundedCenterLng, boundedCenterLat]
      }

      const initialCenter = getInitialCenter()
      initialCenterRef.current = initialCenter

      // Device-specific minimum zoom levels (prevents zooming out beyond these levels)
      const getMinimumZoom = () => {
        if (typeof window === "undefined") return 10.0
        const width = window.innerWidth

        // Minimum zoom levels for different device types
        if (width <= 480) {
          // Mobile: Minimum zoom 9.5 (can't zoom out beyond this)
          return 9.5
        }

        if (width >= 481 && width <= 768) {
          // Tablet: Minimum zoom 10.0 (can't zoom out beyond this)
          return 10.0
        }

        return 10.5 // Desktop: Minimum zoom 10.5 (can't zoom out beyond this)
      }

      // Initial zoom levels (same as minimum zoom levels)
      const getInitialZoom = () => {
        if (typeof window === "undefined") return 10.0
        const width = window.innerWidth

        // Initial zoom levels for all device types
        if (width <= 480) {
          // Mobile: Initial zoom 9.5
          return 9.5
        }

        if (width >= 481 && width <= 768) {
          // Tablet: Initial zoom 10.0
          return 10.0
        }

        return 10.5 // Desktop: Initial zoom 10.5
      }

      const minimumZoom = getMinimumZoom()
      initialZoomRef.current = getInitialZoom()

      map.current = new window.mapboxgl.Map({
        container: mapContainer.current!,
        style: MAPBOX_STYLES[currentStyle].url,
        center: initialCenter,
        zoom: initialZoomRef.current,
        pitch: 0,
        bearing: 0,
        maxBounds: [
          [53.8, 22.8],
          [56.6, 25.5],
        ],
        minZoom: minimumZoom,
        maxZoom: 16,
        dragPan: true,
        scrollZoom: true,
        renderWorldCopies: false,
        preserveDrawingBuffer: true,
        attributionControl: false,
        fadeDuration: 0,
        trackResize: true,
        interactive: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
      })

      // Enable all interactions
      map.current.scrollZoom.enable()
      map.current.boxZoom.enable()
      map.current.dragRotate.enable()
      map.current.dragPan.enable()
      map.current.keyboard.enable()
      map.current.doubleClickZoom.enable()
      map.current.touchZoomRotate.enable()

      // Set zoom rates for smooth interaction
      map.current.scrollZoom.setWheelZoomRate(0.01)
      map.current.scrollZoom.setZoomRate(0.005)

      if (mapRef) {
        mapRef.current = map.current
      }

      const styleSheet = document.createElement("style")
      styleSheet.textContent = markerStyles
      document.head.appendChild(styleSheet)

      map.current.on("load", () => {
        setMapLoaded(true)
        if (!map.current) return

        lastCenterRef.current = map.current.getCenter()
        map.current.getCanvas().style.willChange = "transform"

        // Apply contrast and decrease saturation
        map.current.addLayer({
          id: "contrast-saturation-filter",
          type: "background",
          paint: {
            "background-color": "rgba(0, 0, 0, 0)",
          },
          filter: ["all"],
        })

        // Apply CSS filter to the map canvas for contrast and saturation
        const canvas = map.current.getCanvas()
        if (canvas) {
          canvas.style.filter = "contrast(1.2) saturate(1.5) brightness(0.9)"
        }

        // Add in-container dark mask below markers but above map canvas
        try {
          const container = mapContainer.current
          if (container && !container.querySelector('#alainmap-dark-mask')) {
            const mask = document.createElement('div')
            mask.id = 'alainmap-dark-mask'
            mask.style.position = 'absolute'
            mask.style.inset = '0'
            mask.style.background = 'rgba(0, 0, 0, 0.45)'
            mask.style.pointerEvents = 'none'
            mask.style.zIndex = '5'
            container.appendChild(mask)
          }
        } catch (e) {
          console.warn('Failed to add dark mask overlay:', e)
        }

        // Create markers for police locations
        policeLocations.forEach((location) => {
          try {
            if (location.name === "مبنى إدارات شرطة") {
              return
            }

            if (areCoordinatesEqual(location.coordinates, EXCLUDED_COORDINATES)) {
              console.log(`Skipping marker at coordinates ${EXCLUDED_COORDINATES}`)
              return
            }

            if (EXCLUDED_MARKERS.includes(location.name)) {
              console.log(`Skipping marker creation for ${location.name}`)
              return
            }

            if (!isValidCoordinate(location.coordinates)) {
              console.error(`Invalid coordinates for ${location.name}:`, location.coordinates)
              return
            }

            markers[location.name] = createMarker({
              name: location.name,
              coordinates: location.coordinates,
              alignment: getMarkerAlignment(location.name),
              size: location.name === "فلل للادرات الشرطية عشارج" ? "small" : "normal",
              map: map.current!,
            })

            markerPositions[location.name] = location.coordinates
          } catch (error) {
            console.error(`Error creating marker for ${location.name}:`, error)
          }
        })

        // Add project markers
        try {
          const coords16Projects: [number, number] = [55.727892104295364, 24.189781669555387]
          if (isValidCoordinate(coords16Projects)) {
            markers["16 Projects"] = createMarker({
              name: "16 Projects",
              coordinates: coords16Projects,
              alignment: "right-aligned",
              map: map.current!,
            })
            markerPositions["16 Projects"] = coords16Projects
          }
        } catch (error) {
          console.error("Error creating project markers:", error)
        }

        // Set marker visibility
        try {
          const currentZoom = map.current!.getZoom()

          ALWAYS_HIDDEN_MARKERS.forEach((markerName) => {
            if (markers[markerName]) {
              const element = markers[markerName].getElement()
              if (element) {
                element.style.display = "none"
              }
            }
          })

          ALWAYS_VISIBLE_MARKERS.forEach((markerName) => {
            if (markers[markerName]) {
              const element = markers[markerName].getElement()
              if (element) {
                element.style.display = currentZoom >= 10 ? "none" : "block"
              }
            }
          })

          HIDDEN_AT_START.forEach((markerName) => {
            if (markers[markerName]) {
              const element = markers[markerName].getElement()
              if (element) {
                element.style.display = currentZoom >= 8 ? "block" : "none"
              }
            }
          })
        } catch (error) {
          console.error("Error setting marker visibility:", error)
        }
      })

      // Error handler for map (ignore benign AbortError from tile cancellations)
      map.current.on("error", (e: any) => {
        const err = e?.error
        const name = err?.name || ""
        const message = err?.message || String(err || "")
        if (name === "AbortError" || message.toLowerCase().includes("abort")) {
          return
        }
        console.error("Map error:", err)
        setMapError(`Map rendering error occurred: ${message}`)
      })

      // Zoom event handler
      map.current.on("zoom", () => {
        try {
          const currentZoom = map.current!.getZoom()

          // Conditional dragPan based on zoom level - adjusted for much higher initial zoom
          if (currentZoom > 8.0) {
            // Higher threshold since we start much more zoomed in
            map.current.dragPan.enable()
          } else {
            map.current.dragPan.disable()
            // Snap back to initial center if zoomed out too far
            map.current.setCenter(initialCenterRef.current)
          }

          // Marker visibility logic
          Object.entries(markers).forEach(([name, marker]) => {
            const element = marker.getElement()
            if (!element) return

            if (ALWAYS_HIDDEN_MARKERS.includes(name)) {
              element.style.display = "none"
              return
            }

            if (ALWAYS_VISIBLE_MARKERS.includes(name)) {
              element.style.display = currentZoom >= 10 ? "none" : "block"
            } else if (HIDDEN_AT_START.includes(name)) {
              const shouldShow = currentZoom >= 8
              element.style.display = shouldShow ? "block" : "none"
            }
          })

          debouncedUpdateMarkers()
        } catch (error) {
          console.error("Error handling zoom event:", error)
        }
      })

      // Click handler
      map.current.on("click", () => {
        setClickedMarker(null)

        Object.keys(markersRef.current).forEach((markerName) => {
          const tooltip = document.getElementById(`tooltip-${markerName}`)
          if (tooltip) {
            tooltip.classList.remove("visible")
          }
        })

        Object.entries(markersRef.current).forEach(([_, marker]) => {
          const element = marker.getElement()
          if (element) {
            element.classList.remove("marker-dimmed")
            element.classList.remove("marker-highlighted")
            element.style.opacity = ""
            element.style.zIndex = ""
            element.style.filter = ""
          }
        })
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError("Failed to initialize map")
    }

    return () => {
      try {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }

        // Safer cleanup to prevent AbortError
        if (map.current) {
          try {
            // Remove all event listeners first
            map.current.off()

            // Stop any ongoing operations
            map.current.stop()

            // Set a minimal style to clear existing sources without triggering aborts
            map.current.setStyle({
              version: 8,
              sources: {},
              layers: [],
            })

            // Small delay to allow style to clear, then remove
            setTimeout(() => {
              try {
                if (map.current) {
                  map.current.remove()
                  map.current = null
                }
              } catch (e) {
                console.warn("Map already removed or error during removal:", e)
              }
            }, 50)
          } catch (e) {
            // If setStyle fails, try immediate removal
            try {
              map.current.remove()
              map.current = null
            } catch (removeError) {
              console.warn("Error during map removal:", removeError)
            }
          }
        }

        document.querySelectorAll("style[data-marker-style]").forEach((el) => el.remove())
      } catch (error) {
        console.error("Error cleaning up map:", error)
      }
    }
  }, [policeLocations, offsetX, offsetY, mapRef, token, loading, error, mapboxLoaded, currentStyle])

  function createMarker({
    name,
    coordinates,
    alignment,
    map,
    size = "normal",
  }: {
    name: string
    coordinates: [number, number]
    alignment: string
    map: any
    size?: "small" | "normal"
  }) {
    try {
      if (!isValidCoordinate(coordinates)) {
        console.error(`Invalid coordinates for marker ${name}:`, coordinates)
        throw new Error(`Invalid coordinates for marker ${name}`)
      }

      const markerElement = document.createElement("div")
      markerElement.className = "marker-container"
      markerElement.style.position = "absolute"
      markerElement.style.pointerEvents = "auto"
      markerElement.style.willChange = "transform"

      const labeledMarkers = [
        "16 Projects",
        "7 Projects",
        "2 Projects",
        "مركز شرطة زاخر",
        "مركز شرطة المربعة",
        "ساحة حجز ال��ركبات -asad",
        "ساحة حجز المركبات -asad",
        "إدارة التأهيل الشرطي - الفوعة",
        "مركز شرطة هيلي",
        "مركز شرطةasad",
        "ميدان الشرطة بدع بنت سعود",
        "مركز شرطة الساد",
        "ساحة حجز المركبات - الساد",
      ]

      if (labeledMarkers.includes(name)) {
        let positionClass = ""

        switch (name) {
          case "16 Projects":
            positionClass = "position-3" // Right
            break
          case "7 Projects":
            positionClass = "position-3" // Right
            break
          case "2 Projects":
            positionClass = "position-3" // Right
            break
          case "مركز شرطة زاخر":
            positionClass = "position-7" // Left
            break
          case "مركز شرطة المربعة":
            positionClass = "position-3" // Right
            break
          case "ساحة حجز المركبات -asad":
            positionClass = "position-7" // Left
            break
          case "إدارة التأهيل الشرطي - الفوعة":
            positionClass = "position-3" // Right
            break
          case "مركز شرطة هيلي":
            positionClass = "position-3" // Right
            break
          case "مركز شرطةasad":
            positionClass = "position-3" // Right
            break
          case "ميدان الشرطة بدع بنت سعود":
            positionClass = "position-7" // Left
            break
          case "مركز شرطة الساد":
            positionClass = "position-3" // Right
            break
          case "ساحة حجز المركبات - الساد":
            positionClass = "position-5" // Bottom
            break
          default:
            positionClass = "position-1" // Default to Top
        }

        markerElement.classList.add(positionClass)
      }

      // Add responsive classes
      markerElement.classList.add("w-8", "h-8", "sm:w-9", "sm:h-9", "md:w-10", "md:h-10")

      if (HOVERABLE_MARKERS.includes(name)) {
        markerElement.addEventListener("mouseenter", (e) => {
          e.stopPropagation()
          setHoveredMarker(name)

          let tooltip = document.getElementById(`tooltip-${name}`)
          if (!tooltip) {
            tooltip = document.createElement("div")
            tooltip.id = `tooltip-${name}`
            tooltip.className = "marker-tooltip"
            tooltip.textContent = name
            markerElement.appendChild(tooltip)
          }
          tooltip.classList.add("visible")

          Object.entries(markersRef.current).forEach(([markerName, marker]) => {
            const element = marker.getElement()
            if (element) {
              if (markerName !== name) {
                element.classList.add("marker-dimmed")
                element.style.opacity = "0.2"
              } else {
                element.classList.add("marker-highlighted")
                element.style.opacity = "1"
                element.style.zIndex = "1000"
                element.style.filter = "drop-shadow(0 0 8px rgba(0, 204, 255, 0.8))"
              }
            }
          })
        })

        markerElement.addEventListener("mouseleave", (e) => {
          e.stopPropagation()
          if (clickedMarker !== name) {
            setHoveredMarker(null)

            const tooltip = document.getElementById(`tooltip-${name}`)
            if (tooltip) {
              tooltip.classList.remove("visible")
            }

            Object.entries(markersRef.current).forEach(([_, marker]) => {
              const element = marker.getElement()
              if (element) {
                element.classList.remove("marker-dimmed")
                element.classList.remove("marker-highlighted")
                element.style.opacity = ""
                element.style.zIndex = ""
                element.style.filter = ""
              }
            })
          }
        })

        markerElement.addEventListener("click", (e) => {
          e.stopPropagation()
          setHoveredMarker(name)
          setClickedMarker(name)

          let tooltip = document.getElementById(`tooltip-${name}`)
          if (!tooltip) {
            tooltip = document.createElement("div")
            tooltip.id = `tooltip-${name}`
            tooltip.className = "marker-tooltip"
            tooltip.textContent = name
            markerElement.appendChild(tooltip)
          }
          tooltip.classList.add("visible")

          Object.entries(markersRef.current).forEach(([markerName, marker]) => {
            const element = marker.getElement()
            if (element) {
              if (markerName !== name) {
                element.classList.add("marker-dimmed")
                element.style.opacity = "0.2"
                const otherTooltip = document.getElementById(`tooltip-${markerName}`)
                if (otherTooltip) {
                  otherTooltip.classList.remove("visible")
                }
              } else {
                element.classList.add("marker-highlighted")
                element.style.opacity = "1"
                element.style.zIndex = "1000"
                element.style.filter = "drop-shadow(0 0 8px rgba(0, 204, 255, 0.8))"
              }
            }
          })
        })
      }

      if (size === "small") {
        const style = document.createElement("style")
        const uniqueClass = `marker-${name.toLowerCase().replace(/\s+/g, "-")}`
        markerElement.classList.add(uniqueClass)

        style.textContent = `
          .${uniqueClass} .marker-circle {
            width: 6px !important;
            height: 6px !important;
          }
        `
        style.setAttribute("data-marker-style", "true")
        document.head.appendChild(style)
      }

      if (ALWAYS_VISIBLE_MARKERS.includes(name)) {
        markerElement.style.display = "block"
      } else if (ALWAYS_HIDDEN_MARKERS.includes(name)) {
        markerElement.style.display = "none"
      } else if (HIDDEN_AT_START.includes(name)) {
        markerElement.style.display = "block"
      }

      const circleElement = document.createElement("div")
      circleElement.className = "marker-circle"
      markerElement.appendChild(circleElement)

      if (PROJECT_NUMBERS[name]) {
        const numberElement = document.createElement("div")
        numberElement.className = "marker-number"
        numberElement.textContent = PROJECT_NUMBERS[name]
        circleElement.appendChild(numberElement)
      }

      const labeledMarkersArray = [
        "16 Projects",
        "7 Projects",
        "2 Projects",
        "مركز شرطة زاخر",
        "مركز شرطة ��لمربعة",
        "ساحة حجز المركبات -asad",
        "إدارة التأهيل الشرطي - الفوعة",
        "مركز شرطة هيلي",
        "مركز شرطةasad",
        "ميدان الشرطة بدع بنت سعود",
        "مركز شرطة الساد",
        "ساحة حجز المركبات - الساد",
      ]

      if (labeledMarkersArray.includes(name)) {
        // Create connecting line
        const line = document.createElement("div")
        line.className = "marker-line"
        markerElement.appendChild(line)

        // Create label
        const label = document.createElement("button")
        label.className = "marker-label"
        label.textContent = name
        label.setAttribute("aria-label", name)
        markerElement.appendChild(label)
      }

      const contentWrapper = document.createElement("div")
      contentWrapper.className = "marker-content-wrapper"

      let clickTimer: NodeJS.Timeout | null = null
      let clickCount = 0

      markerElement.onclick = (e) => {
        e.stopPropagation()
        clickCount++

        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            if (name === "16 Projects") {
              // Single click on 16 Projects goes directly to the detailed view
              router.push("/al-ain/16-projects")
            } else {
              // Regular zoom behavior for other markers
              map.flyTo({
                center: coordinates,
                zoom: 13,
                duration: 1500,
                essential: true,
                easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
              })
              console.log(`Zoomed to ${name} at coordinates ${coordinates}`)
            }
            clickCount = 0
          }, 300)
        } else if (clickCount === 2) {
          if (clickTimer) clearTimeout(clickTimer)
          clickCount = 0

          if (name === "16 Projects") {
            // Double click also goes to detailed view
            router.push("/al-ain/16-projects")
          } else {
            // Regular project detail navigation for other markers
            const englishName = getEnglishName(name)
            const projectId = englishName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")

            router.push(
              `/dashboard/${projectId}?name=${encodeURIComponent(englishName)}&nameAr=${encodeURIComponent(name)}`,
            )
          }
        }
      }

      markerElement.appendChild(contentWrapper)
      markerElement.className += ` ${alignment}`

      const marker = new window.mapboxgl.Marker({
        element: markerElement,
        anchor: "center",
        offset: [0, 0],
        pitchAlignment: "map",
        rotationAlignment: "map",
      })
        .setLngLat(coordinates)
        .addTo(map)

      markerElement.setAttribute("data-marker-name", name)

      return marker
    } catch (error) {
      console.error(`Error creating marker for ${name}:`, error)
      throw error
    }
  }

  const getMarkerAlignment = (markerName: string): string => {
    const leftAligned = ["مركز شرطة زاخر", "ساحة حجز المركبات -asad"]
    const rightAligned = ["16 Projects", "7 Projects", "2 Projects", "مركز شرطة المربعة", "مركز شرطة هيل��"]
    const topAligned = ["فلل للادرات الشرطية عشارج"]

    if (leftAligned.includes(markerName)) {
      return "left-aligned"
    } else if (rightAligned.includes(markerName)) {
      return "right-aligned"
    } else if (topAligned.includes(markerName)) {
      return "top-aligned"
    }
    return "center-aligned"
  }

  const getConnectionLabel = (markerName: string): string => {
    const labels: { [key: string]: string } = {
      "16 Projects": "16 Development Projects",
      "7 Projects": "7 Development Projects",
      "2 Projects": "2 Development Projects",
    }
    return labels[markerName] || markerName
  }

  const getDistrictLabel = (markerName: string): string => {
    const labels: { [key: string]: string } = {
      "16 Projects": "Al Ain Development Zone",
      "7 Projects": "Al Ain Development Zone",
      "2 Projects": "Al Ain Development Zone",
    }
    return labels[markerName] || "Al Ain District"
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Mapbox token...</p>
        </div>
      </div>
    )
  }

  if (!mapboxLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Mapbox...</p>
        </div>
      </div>
    )
  }

  if (error || mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Map Error</p>
          <p className="text-sm">{error || mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="relative w-full h-full" />

      <AnimatedControls
        onResetView={() => {
          if (map.current) {
            const resetCenter = initialCenterRef.current

            map.current.easeTo({
              center: resetCenter,
              bearing: 0,
              pitch: 0,
              zoom: initialZoomRef.current,
              duration: 1500,
              essential: true,
              easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
            })
          }
        }}
        onToggleTerrain={onToggleTerrain}
      />
      <div ref={tooltipRef} className="absolute pointer-events-none" style={{ display: "none" }} />
      <MarkerHoverWidget
        markerName={hoveredMarker || clickedMarker}
        isVisible={!!hoveredMarker}
        isClicked={!!clickedMarker}
        onClickStateChange={(state) => {
          if (!state) setClickedMarker(null)
        }}
      />
      <MapInstructionWidget />
    </div>
  )
}
