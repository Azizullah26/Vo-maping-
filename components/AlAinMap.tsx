"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useRouter } from "next/navigation"
import { AnimatedControls } from "@/components/AnimatedControls"
import { alamerahCoordinates } from "../data/alamerahCoordinates"
import { useMapboxToken } from "@/hooks/useMapboxToken"

const markerStyles = `
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
  width: 40px;
  height: 40px;
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

/* Hide the dotted lines and text containers */
.marker-dotted-line {
  display: none;
}

.marker-text-container {
  display: none;
}

/* Adjust hover effects for all alignments */
.marker-container:hover .marker-circle {
  transform: translate(-50%, -50%) scale(1.5);
  box-shadow: 0 0 16px rgba(255, 255, 255, 1);
}

/* Fixed position markers */
.marker-fixed {
  position: fixed !important;
  z-index: 1000;
}

/* Responsive adjustments for all alignments */
@media (max-width: 640px) {
  .marker-container {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .marker-container {
    width: 30px;
    height: 30px;
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

// Define markers that should always be hidden at initial zoom
const ALWAYS_HIDDEN_MARKERS: string[] = ["مركز شرطة الجيمي القديم"]

// Define markers that should always be visible at initial zoom
const ALWAYS_VISIBLE_MARKERS: string[] = [
  "16 Projects",
  "7 Projects",
  "2 Projects",
  "1 Project",
  "Alamerah 2 Projects",
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
  const [lng] = useState(55.74)
  const [lat] = useState(24.13)
  const [zoom] = useState(11)
  const initialZoomRef = useRef<number>(9.5)
  const { token, loading, error } = useMapboxToken()

  useEffect(() => {
    if (map.current) return
    if (loading) return
    if (error || !token) {
      console.error("Mapbox access token error:", error)
      return
    }

    mapboxgl.accessToken = token

    // Calculate the center coordinates with offset
    const baseCenterLng = 55.61916084965952
    const baseCenterLat = 24.369042478987268

    // Convert pixel offsets to approximate coordinate offsets
    // This is a rough approximation - at zoom level 9.5, 20px is approximately 0.01 degrees
    const lngOffset = offsetX * 0.0005
    const latOffset = offsetY * 0.0005

    // Apply the offsets to shift the map view
    const centerLng = baseCenterLng + lngOffset
    const centerLat = baseCenterLat - latOffset // Subtract for Y because coordinates increase northward

    const getInitialZoom = () => {
      if (typeof window === "undefined") return 9.5
      if (window.innerWidth < 640) return 9.0 // Mobile
      if (window.innerWidth < 768) return 9.2 // Tablet
      return 9.5 // Desktop
    }

    // Store the initial zoom level in the ref
    initialZoomRef.current = getInitialZoom()

    // Update the map initialization in the useEffect hook
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
      center: [baseCenterLng + lngOffset, baseCenterLat - latOffset], // Set initial coordinates with offset
      zoom: initialZoomRef.current,
      pitch: 0, // Set pitch to 0 for flat view
      bearing: 0, // Set bearing to 0 for north-up orientation
      maxBounds: [
        // Restrict map panning to Al Ain region
        [55.0, 23.5], // Southwest coordinates
        [56.0, 24.7], // Northeast coordinates
      ],
      minZoom: initialZoomRef.current, // Set minZoom to match initial zoom
      maxZoom: 16,
      dragPan: false, // Disable panning to fix the map in position
      scrollZoom: true, // Enable scroll zoom
      renderWorldCopies: false, // Add this line to prevent duplicate markers
      preserveDrawingBuffer: true, // Add this line to improve marker rendering
    })

    // Add scroll zoom handler to limit zooming out to initial zoom level
    map.current.scrollZoom.setWheelZoomRate(0.02) // Make zoom smoother

    // Disable the minZoom constraint from the map options
    // This allows our custom handler to take precedence
    map.current.setMinZoom(0)

    // Add a handler to prevent zooming out beyond the initial zoom level
    map.current.on("zoom", () => {
      if (map.current && map.current.getZoom() < initialZoomRef.current) {
        map.current.setZoom(initialZoomRef.current)
      }
    })

    // Add a handler to prevent zooming out beyond the initial zoom level when using the scroll wheel
    map.current.on("wheel", (e) => {
      if (e.originalEvent.deltaY > 0) {
        // Scrolling down (zooming out)
        if (map.current && map.current.getZoom() <= initialZoomRef.current) {
          e.preventDefault()
          map.current.setZoom(initialZoomRef.current)
          return false
        }
      }
    })

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

      // Disable map panning to fix it in position
      map.current.dragPan.disable()

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
        layout: {
          visibility: "visible", // Add this line
        },
        paint: {
          "fill-color": "#b0b0b0", // Changed to a light gray similar to other polygons
          "fill-opacity": 0.4,
        },
        // Add this line to ensure it renders below the dark overlay
        beforeId: "dark-overlay",
      })

      map.current.addLayer({
        id: "alamerah-outline",
        type: "line",
        source: "alamerah",
        layout: {
          visibility: "visible", // Add this line
        },
        paint: {
          "line-color": "#ffffff", // Changed to white to match other polygons
          "line-width": 3,
          "line-opacity": 0.7,
        },
        // Add this line to ensure it renders below the dark overlay
        beforeId: "dark-overlay",
      })

      // Set a fixed center and zoom level without animation
      map.current.setCenter([baseCenterLng, baseCenterLat])
      map.current.setZoom(initialZoomRef.current)

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

        // Skip creating markers for the excluded police stations
        if (EXCLUDED_MARKERS.includes(location.name)) {
          console.log(`Skipping marker creation for ${location.name} - will create fixed version instead`)
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

      // Add the police station markers using the same approach as project markers
      markers["مركز شرطة رماح"] = createMarker({
        name: "مركز شرطة رماح",
        coordinates: FIXED_MARKER_COORDINATES["مركز شرطة رماح"],
        alignment: "left-aligned",
        map: map.current!,
      })

      markers["مركز شرطة سويحان"] = createMarker({
        name: "مركز شرطة سويحان",
        coordinates: FIXED_MARKER_COORDINATES["مركز شرطة سويحان"],
        alignment: "left-aligned",
        map: map.current!,
      })

      markers["مركز شرطة الهير"] = createMarker({
        name: "مركز شرطة الهير",
        coordinates: FIXED_MARKER_COORDINATES["مركز شرطة الهير"],
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

      map.current.on("zoom", () => {
        const zoom = map.current!.getZoom()

        // Enforce minimum zoom level
        if (zoom < initialZoomRef.current) {
          map.current!.setZoom(initialZoomRef.current)
          return
        }

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
          const position = marker.getLngLat()
          const point = map.current!.project(position)
          const element = marker.getElement()

          // Update marker position directly if needed
          if (element.style.display !== "none") {
            marker.setLngLat(position)
          }
        })
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

    // Remove navigation controls
    // Add navigation controls with custom styles but disable the compass to prevent rotation
    // const nav = new mapboxgl.NavigationControl({
    //   visualizePitch: false,
    //   showZoom: true,
    //   showCompass: false,
    // })
    // map.current.addControl(nav, "bottom-right")

    // Disable map rotation to keep it fixed
    map.current.touchZoomRotate.disableRotation()
    map.current.keyboard.disable()

    return () => {
      map.current?.remove()
      document.head.removeChild(styleSheet)
      // Remove any dynamically added styles
      document.querySelectorAll("style[data-marker-style]").forEach((el) => el.remove())
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
