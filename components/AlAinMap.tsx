"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useRouter } from "next/navigation"
import { AnimatedControls } from "@/components/AnimatedControls"
import { useMapboxToken } from "@/hooks/useMapboxToken"

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
}

.mapboxgl-marker {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}

.marker-container {
  position: relative;
  width: 60px;
  height: 60px;
  pointer-events: auto;
  transform: translate(-50%, -50%);
}

.marker-circle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 25px;
  height: 25px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.marker-number {
  color: #000000;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  user-select: none;
  transition: color 0.3s ease;
}

.marker-content-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

/* Hide the dotted lines and text containers */
.marker-dotted-line {
  display: none;
}

.marker-text-container {
  display: none;
}

/* Adjust hover effects for all alignments */
.marker-container:hover .marker-circle {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  background-color: #000000;
}

.marker-container:hover .marker-number {
  color: #ffffff;
}

/* Fixed position markers */
.marker-fixed {
  position: fixed !important;
  z-index: 1000;
}

/* Responsive adjustments for all alignments */
@media (max-width: 640px) {
  .marker-container {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .marker-container {
    width: 40px;
    height: 40px;
  }
}

/* Futuristic tech line styles */
@keyframes flow {
  0% {
    background-position: 0% 50%;
    opacity: 0.7;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.7;
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: -50;
  }
}

.tech-line {
  position: absolute;
  height: 3px;
  background: linear-gradient(90deg, rgba(0, 102, 255, 0.2), rgba(0, 204, 255, 0.8), rgba(0, 102, 255, 0.2));
  background-size: 200% 100%;
  animation: flow 4s linear infinite;
  transform-origin: 0 0;
  z-index: 0;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(0, 153, 255, 0.8), 0 0 20px rgba(0, 153, 255, 0.4);
  border-radius: 3px;
}

.tech-line-dotted {
  position: absolute;
  height: 2px;
  background: none;
  z-index: 0;
  pointer-events: none;
}

.tech-line-dotted::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(90deg, 
    rgba(0, 204, 255, 0.8) 0px, 
    rgba(0, 204, 255, 0.8) 5px, 
    transparent 5px, 
    transparent 10px);
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(0, 153, 255, 0.6);
  animation: flow 4s linear infinite;
}

.tech-line-glow {
  position: absolute;
  height: 1px;
  background: rgba(0, 204, 255, 0.3);
  filter: blur(3px);
  z-index: -1;
  pointer-events: none;
  transform-origin: 0 0;
}

.tech-line-pulse {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 204, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 153, 255, 0.8), 0 0 20px rgba(0, 153, 255, 0.4);
  z-index: 1;
  pointer-events: none;
  animation: pulse 2s infinite;
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
  offsetX?: number
  offsetY?: number
  mapRef?: React.MutableRefObject<mapboxgl.Map | null>
}

// Add these constants at the top of the file after the interfaces
const ZOOM_THRESHOLD = 12

// Define coordinates to exclude
const EXCLUDED_COORDINATES: [number, number] = [55.74252775199696, 24.23252678639456]

// Helper function to check if coordinates are approximately equal (with a small tolerance)
function areCoordinatesEqual(coord1: [number, number], coord2: [number, number], tolerance = 0.0001): boolean {
  return Math.abs(coord1[0] - coord2[0]) < tolerance && Math.abs(coord1[1] - coord2[1]) < tolerance
}

// Helper function to validate coordinates
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

// Define markers that should always be hidden at initial zoom
const ALWAYS_HIDDEN_MARKERS: string[] = ["مركز شرطة الجيمي القديم"]

// Define markers that should always be visible at initial zoom
const ALWAYS_VISIBLE_MARKERS: string[] = [
  "16 Projects",
  "7 Projects",
  "2 Projects",
  "1 Project",
  "5 Projects",
  "مركز شرطة رماح",
  "مركز شرطة سويحان",
  "مركز شرطة الهير",
]

// Define markers to exclude from the policeLocations loop
const EXCLUDED_MARKERS: string[] = ["مركز شرطة رماح", "مركز شرطة سويحان", "مركز شرطة الهير"]

// Updated: Remove the three police stations from HIDDEN_AT_START
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
  "مركز شرطة الوقن",
]

// Define actual coordinates for the fixed position markers
const FIXED_MARKER_COORDINATES = {
  "مركز شرطة رماح": [55.37815, 24.19234] as [number, number],
  "مركز شرطة سويحان": [55.33126, 24.47012] as [number, number],
  "مركز شرطة الهير": [55.736118393917934, 24.5811877336795] as [number, number],
}

// Define a mapping for project markers to their numbers
const PROJECT_NUMBERS: { [key: string]: string } = {
  "16 Projects": "16",
  "7 Projects": "7",
  "2 Projects": "2",
  "1 Project": "1",
  "2Projects": "2",
  "Alamerah 2 Projects": "2 al",
  "5 Projects": "5",
  "مركز شرطة رماح": "1",
  "مركز شرطة سويحان": "1",
  "مركز شرطة الهير": "1",
}

// Define tech line connections between markers - updated order
const TECH_LINE_CONNECTIONS = [
  // Main network - solid lines in the specified order
  { from: "مركز شرطة رماح", to: "مركز شرطة سويحان", type: "solid" },
  { from: "مركز شرطة سويحان", to: "مركز شرطة الهير", type: "solid" },
  { from: "مركز شرطة الهير", to: "2 Projects", type: "solid" },
  { from: "2 Projects", to: "7 Projects", type: "solid" },
  { from: "7 Projects", to: "16 Projects", type: "solid" },
  { from: "7 Projects", to: "5 Projects", type: "solid" },
  { from: "5 Projects", to: "2 Projects", type: "solid" },
  { from: "2al Projects", to: "1 Projects", type: "solid" },
  { from: "16 Projects", to: "2al Projects", type: "solid" },
  { from: "Alamerah 2 Projects", to: "5 Project", type: "solid" },
  { from: "16 Projects", to: "1 Project", type: "solid" },

  // Add new connections from 5 Projects to police stations
  { from: "5 Projects", to: "مركز شرطة سويحان", type: "solid" },
  { from: "5 Projects", to: "مركز شرطة رماح", type: "solid" },
  { from: "5 Projects", to: "مركز شرطة الهير", type: "solid" },

  // Add a closing connection to complete the circuit
  { from: "1 Project", to: "مركز شرطة رماح", type: "solid" },
]

export default function AlAinMap({
  policeLocations,
  onToggleTerrain,
  offsetX = 0,
  offsetY = 0,
  mapRef,
}: AlAinMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const router = useRouter()
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const techLinesRef = useRef<HTMLDivElement[]>([])
  const [lng] = useState(55.74)
  const [lat] = useState(24.13)
  const [zoom] = useState(10)
  const initialZoomRef = useRef<number>(5)
  const { token, loading, error } = useMapboxToken()

  // Function to create a tech line between two points
  const createTechLine = (
    map: mapboxgl.Map,
    fromCoords: [number, number],
    toCoords: [number, number],
    type: "solid" | "dotted",
  ) => {
    try {
      // Validate coordinates before using them
      if (!isValidCoordinate(fromCoords) || !isValidCoordinate(toCoords)) {
        console.error("Invalid coordinates for tech line:", fromCoords, toCoords)
        return null
      }

      // Convert geo coordinates to pixel coordinates
      const fromPoint = map.project(new mapboxgl.LngLat(fromCoords[0], fromCoords[1]))
      const toPoint = map.project(new mapboxgl.LngLat(toCoords[0], toCoords[1]))

      // Check if points are valid
      if (isNaN(fromPoint.x) || isNaN(fromPoint.y) || isNaN(toPoint.x) || isNaN(toPoint.y)) {
        console.error("Invalid projected points for tech line:", fromPoint, toPoint)
        return null
      }

      // Calculate distance and angle
      const dx = toPoint.x - fromPoint.x
      const dy = toPoint.y - fromPoint.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)

      // Create line container
      const lineContainer = document.createElement("div")
      lineContainer.className = type === "solid" ? "tech-line" : "tech-line-dotted"
      lineContainer.style.width = `${distance}px`
      lineContainer.style.left = `${fromPoint.x}px`
      lineContainer.style.top = `${fromPoint.y}px`
      lineContainer.style.transform = `rotate(${angle}deg)`

      // Add glow effect
      const glowLine = document.createElement("div")
      glowLine.className = "tech-line-glow"
      glowLine.style.width = `${distance}px`
      glowLine.style.transform = `rotate(${angle}deg)`
      lineContainer.appendChild(glowLine)

      // Add to map container and store reference
      if (mapContainer.current) {
        mapContainer.current.appendChild(lineContainer)
        techLinesRef.current.push(lineContainer)
        return lineContainer
      }
      return null
    } catch (error) {
      console.error("Error creating tech line:", error)
      return null
    }
  }

  // Function to update tech lines positions
  const updateTechLines = (map: mapboxgl.Map, markerPositions: { [key: string]: [number, number] }) => {
    try {
      // Remove existing lines
      techLinesRef.current.forEach((line) => {
        if (line && line.parentNode) {
          line.parentNode.removeChild(line)
        }
      })
      techLinesRef.current = []

      // Create new lines
      TECH_LINE_CONNECTIONS.forEach((connection) => {
        const fromCoords = markerPositions[connection.from]
        const toCoords = markerPositions[connection.to]

        if (fromCoords && toCoords && isValidCoordinate(fromCoords) && isValidCoordinate(toCoords)) {
          createTechLine(map, fromCoords, toCoords, connection.type as "solid" | "dotted")
        }
      })
    } catch (error) {
      console.error("Error updating tech lines:", error)
    }
  }

  useEffect(() => {
    if (map.current) return
    if (loading) return
    if (error || !token) {
      console.error("Mapbox access token error:", error)
      return
    }

    mapboxgl.accessToken = token

    // Use the exact center coordinates provided by the user
    const baseCenterLng = 55.503133160600925
    // Adjust the latitude to move the map down
    const baseCenterLat = 24.106600838029317 // Reduced from 24.306600838029317 to move map down

    // Convert pixel offsets to approximate coordinate offsets
    // This is a rough approximation - at zoom level 9.5, 20px is approximately 0.01 degrees
    const lngOffset = offsetX * 0.0005
    const latOffset = offsetY * 0.0005

    // Apply the offsets to shift the map view
    const centerLng = baseCenterLng + lngOffset
    const centerLat = baseCenterLat - latOffset // Subtract for Y because coordinates increase northward

    const getInitialZoom = () => {
      if (typeof window === "undefined") return 5
      return 5 // Set to 5 for all device sizes as requested
    }

    // Store the initial zoom level in the ref
    initialZoomRef.current = getInitialZoom()

    try {
      // Update the map initialization in the useEffect hook
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
        center: [centerLng, centerLat], // Set initial coordinates with offset
        zoom: initialZoomRef.current,
        pitch: 0, // Set pitch to 0 for flat view
        bearing: 0, // Set bearing to 0 for north-up orientation
        maxBounds: [
          // Restrict map panning to Al Ain region - fixed coordinates
          [54.5, 23.5], // Southwest coordinates
          [56.5, 25.0], // Northeast coordinates
        ],
        minZoom: 5, // Allow zooming out further
        maxZoom: 16,
        dragPan: true, // Change from false to true to enable panning
        scrollZoom: true, // Enable scroll zoom
        renderWorldCopies: false, // Add this line to prevent duplicate markers
        preserveDrawingBuffer: true, // Add this line to improve marker rendering
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      return
    }

    // Add scroll zoom handler to limit zooming out to initial zoom level
    map.current.scrollZoom.setWheelZoomRate(0.02) // Make zoom smoother

    // Disable the minZoom constraint from the map options
    // This allows our custom handler to take precedence
    map.current.setMinZoom(0)

    // Set the mapRef if provided
    if (mapRef) {
      mapRef.current = map.current
    }

    // Add styles to document
    const styleSheet = document.createElement("style")
    styleSheet.textContent = markerStyles
    document.head.appendChild(styleSheet)

    // Update the initial animation in the load event
    map.current.on("load", () => {
      setMapLoaded(true)
      if (!map.current) return

      // Add this after the map.current.on("load", () => { line, inside the load event handler
      map.current.on("drag", (e) => {
        try {
          // Get the current center
          const center = map.current!.getCenter()

          // Force the longitude to stay at the initial longitude
          // This restricts horizontal movement while allowing vertical movement
          map.current!.setCenter([centerLng, center.lat])
        } catch (error) {
          console.error("Error handling drag event:", error)
        }
      })

      try {
        // Add the dark overlay layer FIRST
        // This ensures all other layers will be added on top of it
        map.current.addLayer({
          id: "dark-overlay",
          type: "background",
          paint: {
            "background-color": "#000000",
            "background-opacity": 0.4,
          },
        })

        // Update the mask opacity for better visibility in 2D
        map.current.addLayer({
          id: "map-mask",
          type: "background",
          paint: {
            "background-color": "#1b1f3a", // Changed from #000000 to a navy blue color
            "background-opacity": 0.25, // Reduced from 0.35 to 0.25 for better visibility
          },
          // Add this line to ensure it renders below the dark overlay
          beforeId: "dark-overlay",
        })
      } catch (error) {
        console.error("Error adding map layers:", error)
      }

      // Create an object to store all markers
      const markers: { [key: string]: mapboxgl.Marker } = {}
      markersRef.current = markers

      // Object to store marker coordinates for tech lines
      const markerPositions: { [key: string]: [number, number] } = {}

      // Create markers for police locations
      policeLocations.forEach((location) => {
        try {
          // Skip creating the marker for "مبنى إدارات شرطة" entirely
          if (location.name === "مبنى إدارات شرطة") {
            return
          }

          // Skip creating any marker with the specified coordinates
          if (areCoordinatesEqual(location.coordinates, EXCLUDED_COORDINATES)) {
            console.log(`Skipping marker at coordinates ${EXCLUDED_COORDINATES}`)
            return
          }

          // Skip creating markers for the excluded police stations
          if (EXCLUDED_MARKERS.includes(location.name)) {
            console.log(`Skipping marker creation for ${location.name} - will create fixed version instead`)
            return
          }

          // Validate coordinates
          if (!isValidCoordinate(location.coordinates)) {
            console.error(`Invalid coordinates for ${location.name}:`, location.coordinates)
            return
          }

          // Create regular markers for all other locations
          markers[location.name] = createMarker({
            name: location.name,
            coordinates: location.coordinates,
            alignment: getMarkerAlignment(location.name),
            map: map.current!,
            // Add size property for this specific marker
            size: location.name === "فلل للادرات الشرطية عشارج" ? "small" : "normal",
          })

          // Store marker position for tech lines
          markerPositions[location.name] = location.coordinates
        } catch (error) {
          console.error(`Error creating marker for ${location.name}:`, error)
        }
      })

      try {
        // Add the "مبنى إدارات شرطة" marker at specific coordinates
        const adminBuildingCoords: [number, number] = [55.74289547603556, 24.232372376906]
        if (isValidCoordinate(adminBuildingCoords)) {
          markers["مبنى إدارات شرطة"] = createMarker({
            name: "مبنى إدارات شرطة",
            coordinates: adminBuildingCoords,
            alignment: "right-aligned",
            map: map.current!,
          })
          markerPositions["مبنى إدارات شرطة"] = adminBuildingCoords

          // Make sure this marker follows the visibility rules
          if (markers["مبنى إدارات شرطة"]) {
            const element = markers["مبنى إدارات شرطة"].getElement()
            // Since this marker is in ALWAYS_HIDDEN_MARKERS, it should be hidden initially
            element.style.display = "none"
            console.log(`Setting مبنى إدارات شرطة marker to be hidden initially`)
          }
        }
      } catch (error) {
        console.error("Error creating admin building marker:", error)
      }

      try {
        // Add the "16 Projects" marker
        const coords16Projects: [number, number] = [55.75688628119707, 24.18153037293483]
        if (isValidCoordinate(coords16Projects)) {
          markers["16 Projects"] = createMarker({
            name: "16 Projects",
            coordinates: coords16Projects, // Using a point from the polygon
            alignment: "right-aligned",
            map: map.current!,
          })
          markerPositions["16 Projects"] = coords16Projects
        }

        // Add the "7 Projects" marker
        const coords7Projects: [number, number] = [55.74320587470995, 24.27937770887191]
        if (isValidCoordinate(coords7Projects)) {
          markers["7 Projects"] = createMarker({
            name: "7 Projects",
            coordinates: coords7Projects, // Centered in the polygon
            alignment: "right-aligned",
            map: map.current!,
          })
          markerPositions["7 Projects"] = coords7Projects
        }

        // Add the "2 Projects" marker
        const coords2Projects: [number, number] = [55.79420236287404, 24.333762072745526]
        if (isValidCoordinate(coords2Projects)) {
          markers["2 Projects"] = createMarker({
            name: "2 Projects",
            coordinates: coords2Projects, // Centered in the polygon
            alignment: "right-aligned",
            map: map.current!,
          })
          markerPositions["2 Projects"] = coords2Projects
        }

        // Add the police station markers using the same approach as project markers
        if (isValidCoordinate(FIXED_MARKER_COORDINATES["مركز شرطة رماح"])) {
          markers["مركز شرطة رماح"] = createMarker({
            name: "مركز شرطة رماح",
            coordinates: FIXED_MARKER_COORDINATES["مركز شرطة رماح"],
            alignment: "left-aligned",
            map: map.current!,
          })
          markerPositions["مركز شرطة رماح"] = FIXED_MARKER_COORDINATES["مركز شرطة رماح"]
        }

        if (isValidCoordinate(FIXED_MARKER_COORDINATES["مركز شرطة سويحان"])) {
          markers["مركز شرطة سويحان"] = createMarker({
            name: "مركز شرطة سويحان",
            coordinates: FIXED_MARKER_COORDINATES["مركز شرطة سويحان"],
            alignment: "left-aligned",
            map: map.current!,
          })
          markerPositions["مركز شرطة سويحان"] = FIXED_MARKER_COORDINATES["مركز شرطة سويحان"]
        }

        if (isValidCoordinate(FIXED_MARKER_COORDINATES["مركز شرطة الهير"])) {
          markers["مركز شرطة الهير"] = createMarker({
            name: "مركز شرطة الهير",
            coordinates: FIXED_MARKER_COORDINATES["مركز شرطة الهير"],
            alignment: "bottom-aligned",
            map: map.current!,
          })
          markerPositions["مركز شرطة الهير"] = FIXED_MARKER_COORDINATES["مركز شرطة الهير"]
        }

        // Add the "مركز شرطة المقام" marker with the same effects as "فلل للادرات الشرطية عشارج"
        const coordsMaqam: [number, number] = [55.66797351728485, 24.200895632850177]
        if (isValidCoordinate(coordsMaqam)) {
          markers["مركز شرطة المقام"] = createMarker({
            name: "مركز شرطة المقام",
            coordinates: coordsMaqam,
            alignment: "top-aligned", // Explicitly set to top-aligned instead of using getMarkerAlignment
            map: map.current!,
          })
          markerPositions["مركز شرطة المقام"] = coordsMaqam
        }

        // Add the new "2Projects" marker with top alignment
        const coords2ProjectsAlt: [number, number] = [55.673752588199704, 24.230262636579667]
        if (isValidCoordinate(coords2ProjectsAlt)) {
          markers["2Projects"] = createMarker({
            name: "2Projects",
            coordinates: coords2ProjectsAlt,
            alignment: "top-aligned",
            map: map.current!,
          })
          markerPositions["2Projects"] = coords2ProjectsAlt
        }

        // Update the "Zakhir Police Station" marker coordinates
        const coords1Project: [number, number] = [55.70629570288418, 24.137217372354044]
        if (isValidCoordinate(coords1Project)) {
          markers["1 Project"] = createMarker({
            name: "1 Project",
            coordinates: coords1Project, // Same coordinates
            alignment: "right-aligned",
            map: map.current!,
          })
          markerPositions["1 Project"] = coords1Project
        }

        // Add the "5 Projects" marker
        const coords5Projects: [number, number] = [55.65, 24.28] // Approximate coordinates, adjust as needed
        if (isValidCoordinate(coords5Projects)) {
          markers["5 Projects"] = createMarker({
            name: "5 Projects",
            coordinates: coords5Projects,
            alignment: "right-aligned",
            map: map.current!,
          })
          markerPositions["5 Projects"] = coords5Projects
        }

        // Add the "مركز شرطة المربعة" marker
        const coordsMurabba: [number, number] = [55.776750053389094, 24.221008086930823]
        if (isValidCoordinate(coordsMurabba)) {
          markers["مركز شرطة المربعة"] = createMarker({
            name: "مركز شرطة المربعة",
            coordinates: coordsMurabba,
            alignment: "top-aligned",
            map: map.current!,
          })
          markerPositions["مركز شرطة المربعة"] = coordsMurabba
        }

        // Add the "متحف شرطة المربعة" marker
        const coordsMurabbaMuseum: [number, number] = [55.77601459818959, 24.220775925214355]
        if (isValidCoordinate(coordsMurabbaMuseum)) {
          markers["متحف شرطة المربعة"] = createMarker({
            name: "متحف شرطة المربعة",
            coordinates: coordsMurabbaMuseum,
            alignment: "left-aligned", // Changed from "top-aligned" to "left-aligned"
            map: map.current!,
          })
          markerPositions["متحف شرطة المربعة"] = coordsMurabbaMuseum
        }
      } catch (error) {
        console.error("Error creating project markers:", error)
      }

      try {
        // Force hide specific markers regardless of zoom level
        ALWAYS_HIDDEN_MARKERS.forEach((markerName) => {
          if (markers[markerName]) {
            const element = markers[markerName].getElement()
            element.style.display = "none"
            console.log(`Setting ${markerName} to be permanently hidden`)
          }
        })

        // Make sure the specified markers are always visible at initial zoom
        ALWAYS_VISIBLE_MARKERS.forEach((markerName) => {
          if (markers[markerName]) {
            const element = markers[markerName].getElement()
            element.style.display = "block"
            console.log(`Setting ${markerName} to be always visible at initial zoom`)
          }
        })
      } catch (error) {
        console.error("Error setting marker visibility:", error)
      }

      try {
        // Create tech lines between markers
        updateTechLines(map.current, markerPositions)
      } catch (error) {
        console.error("Error creating tech lines:", error)
      }

      map.current.on("zoom", () => {
        try {
          const zoom = map.current!.getZoom()

          // Toggle visibility based on zoom level
          Object.entries(markers).forEach(([name, marker]) => {
            const element = marker.getElement()

            // Always keep specific markers hidden regardless of zoom
            if (ALWAYS_HIDDEN_MARKERS.includes(name)) {
              element.style.display = "none"
              return
            }

            // Handle project markers
            if (ALWAYS_VISIBLE_MARKERS.includes(name)) {
              // Show these markers only at lower zoom levels
              element.style.display = zoom >= ZOOM_THRESHOLD ? "none" : "block"
            } else if (HIDDEN_AT_START.includes(name)) {
              // Show other markers only at higher zoom levels
              element.style.display = zoom >= ZOOM_THRESHOLD ? "block" : "none"
            }
          })

          // This ensures markers stay in the correct position when zooming
          Object.entries(markers).forEach(([name, marker]) => {
            try {
              const position = marker.getLngLat()
              if (position) {
                const point = map.current!.project(position)
                const element = marker.getElement()

                // Update marker position directly if needed
                if (element.style.display !== "none") {
                  marker.setLngLat(position)
                }
              }
            } catch (error) {
              console.error(`Error updating marker position for ${name}:`, error)
            }
          })

          // Update tech lines on zoom
          updateTechLines(map.current!, markerPositions)
        } catch (error) {
          console.error("Error handling zoom event:", error)
        }
      })

      // Update tech lines on move
      map.current.on("move", () => {
        try {
          updateTechLines(map.current!, markerPositions)
        } catch (error) {
          console.error("Error handling move event:", error)
        }
      })
    })

    // Disable map rotation to keep it fixed
    map.current.touchZoomRotate.disableRotation()
    map.current.keyboard.disable()

    return () => {
      try {
        map.current?.remove()
        document.head.removeChild(styleSheet)
        // Remove any dynamically added styles
        document.querySelectorAll("style[data-marker-style]").forEach((el) => el.remove())
        // Remove tech lines
        techLinesRef.current.forEach((line) => {
          if (line && line.parentNode) {
            line.parentNode.removeChild(line)
          }
        })
      } catch (error) {
        console.error("Error cleaning up map:", error)
      }
    }
  }, [policeLocations, offsetX, offsetY, mapRef, token, loading, error])

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
    try {
      // Validate coordinates
      if (!isValidCoordinate(coordinates)) {
        console.error(`Invalid coordinates for marker ${name}:`, coordinates)
        throw new Error(`Invalid coordinates for marker ${name}`)
      }

      // Create marker container
      const markerElement = document.createElement("div")
      markerElement.className = "marker-container"
      markerElement.style.position = "absolute" // Ensure absolute positioning
      markerElement.style.pointerEvents = "auto" // Make sure it can receive clicks

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
        `
        style.setAttribute("data-marker-style", "true")
        document.head.appendChild(style)
      }

      // Set initial visibility based on marker name
      if (ALWAYS_VISIBLE_MARKERS.includes(name)) {
        // Always show these markers at initial zoom
        markerElement.style.display = "block"
        console.log(`Setting ${name} to be always visible at initial zoom`)
      } else if (ALWAYS_HIDDEN_MARKERS.includes(name)) {
        // Always hide these specific markers
        markerElement.style.display = "none"
        console.log(`Setting ${name} to be permanently hidden`)
      } else if (HIDDEN_AT_START.includes(name)) {
        // Make sure this condition is applied consistently for all markers
        markerElement.style.display = map.getZoom() >= ZOOM_THRESHOLD ? "block" : "none"
      }

      // Create the circle element
      const circleElement = document.createElement("div")
      circleElement.className = "marker-circle"
      markerElement.appendChild(circleElement)

      // Add number inside circle for project markers
      if (PROJECT_NUMBERS[name]) {
        const numberElement = document.createElement("div")
        numberElement.className = "marker-number"
        numberElement.textContent = PROJECT_NUMBERS[name]
        circleElement.appendChild(numberElement)
      }

      // Create a content wrapper for click events
      const contentWrapper = document.createElement("div")
      contentWrapper.className = "marker-content-wrapper"

      // Make the entire marker clickable
      markerElement.onclick = (e) => {
        e.stopPropagation()
        if (name === "مركز شرطة الساد") {
          router.push("/al-ain/saad-police-station")
        } else {
          console.log(`Clicked ${name}`)
        }
      }

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
    } catch (error) {
      console.error(`Error creating marker for ${name}:`, error)
      throw error
    }
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
          if (map.current) {
            map.current.easeTo({
              center: [55.503133160600925, 24.106600838029317], // Updated to match the new center coordinates
              bearing: 0,
              pitch: 0,
              duration: 1500,
            })
          }
        }}
        onToggleTerrain={onToggleTerrain}
      />
    </div>
  )
}
