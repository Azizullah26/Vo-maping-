"use client"

import type React from "react"
import mapboxgl from "mapbox-gl"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface MapMarkerProps {
  x: number
  y: number
  isActive?: boolean
  name: string
  size?: "small" | "medium" | "large"
  colorIndex: number
  coordinates: [number, number]
}

const colorCombinations = [
  ["#ffbc00", "#ff0058"],
  ["#03a9f4", "#ff0058"],
  ["#4dff03", "#00d0ff"],
]

const MapMarker: React.FC<MapMarkerProps> = ({ isActive = false, name, size = "medium", colorIndex, coordinates }) => {
  const sizes = {
    small: {
      width: "w-16 sm:w-20",
      height: "h-6 sm:h-7",
      text: "text-xs sm:text-sm",
      offset: "translate-y-0",
    },
    medium: {
      width: "w-20 sm:w-24",
      height: "h-7 sm:h-8",
      text: "text-sm",
      offset: "translate-y-2 sm:translate-y-4",
    },
    large: {
      width: "w-24 sm:w-28",
      height: "h-8 sm:h-9",
      text: "text-sm sm:text-base",
      offset: "translate-y-4 sm:translate-y-8",
    },
  }

  const [color1, color2] = colorCombinations[colorIndex % colorCombinations.length]

  useEffect(() => {
    const handleProjectHover = (event: CustomEvent) => {
      const hoveredName = event.detail
      const markerElement = document.querySelector(`[data-marker-name="${name}"]`)

      if (markerElement) {
        if (hoveredName === null) {
          // Reset all markers
          markerElement.classList.remove("marker-dimmed", "marker-highlighted")
        } else if (hoveredName === name) {
          // Highlight this marker
          markerElement.classList.add("marker-highlighted")
          markerElement.classList.remove("marker-dimmed")
        } else {
          // Dim other markers
          markerElement.classList.add("marker-dimmed")
          markerElement.classList.remove("marker-highlighted")
        }
      }
    }

    window.addEventListener("projectHover", handleProjectHover as EventListener)
    return () => {
      window.removeEventListener("projectHover", handleProjectHover as EventListener)
    }
  }, [name])

  // Special case for مركز شرطة الجيمي - only show circle
  if (name === "مركز شرطة الجيمي") {
    return (
      <div
        className={cn("absolute pointer-events-auto cursor-pointer transition-all duration-300", "marker-container")}
        style={{
          zIndex: isActive ? 2 : 1,
          marginTop: "-4px",
        }}
        data-lat={coordinates[1]}
        data-lng={coordinates[0]}
        data-marker-name={name}
      >
        <div className="relative -translate-x-1/2 -translate-y-full">
          <div
            className={`
              w-4 h-4 rounded-full
              transition-all duration-200
              animate-pulse
              relative overflow-hidden
              ${isActive ? "scale-110" : "scale-100"}
            `}
            style={{
              background: `conic-gradient(rgb(0 0 0 / 0.75) 0 0) padding-box, 
                         linear-gradient(45deg, ${color1}, ${color2}) border-box`,
              border: "solid 2px transparent",
            }}
          >
            <div
              className="absolute inset-0 -z-10 opacity-75 blur-sm"
              style={{
                background: `linear-gradient(45deg, ${color1}, ${color2})`,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Regular marker rendering for all other locations
  return (
    <div
      className={cn("absolute pointer-events-auto cursor-pointer transition-all duration-300", "marker-container")}
      style={{
        zIndex: isActive ? 2 : 1,
        marginTop: "-4px",
      }}
      data-lat={coordinates[1]}
      data-lng={coordinates[0]}
      data-marker-name={name}
    >
      <div className={`relative -translate-x-1/2 -translate-y-full ${sizes[size].offset}`}>
        <div
          className={`
            ${sizes[size].width} ${sizes[size].height} rounded-full
            transition-all duration-200 flex items-center justify-center
            animate-float relative overflow-hidden
            ${isActive ? "scale-110" : "scale-100"}
          `}
          style={{
            background: `conic-gradient(rgb(0 0 0 / 0.75) 0 0) padding-box, 
                       linear-gradient(45deg, ${color1}, ${color2}) border-box`,
            border: "solid 4px transparent",
          }}
        >
          <div
            className="absolute inset-0 -z-10 opacity-75 blur-md"
            style={{
              background: `linear-gradient(45deg, ${color1}, ${color2})`,
            }}
          />

          <span className={`${sizes[size].text} font-bold font-semibold text-white truncate px-2 relative z-10`}>
            {name}
          </span>
        </div>

        <div className="absolute left-1/2 top-full -translate-x-1/2">
          <div className="w-[2px] h-4 bg-white rounded-full" />
        </div>
      </div>
    </div>
  )
}

interface MarkerProps {
  name: string
  coordinates: [number, number]
  alignment?: "left" | "right" | "top" | "bottom" | "bottom-left" | "top-right" | "bottom-right"
  onClick?: (name: string) => void
  map: mapboxgl.Map
}

export function createMapMarker({ name, coordinates, alignment = "right", onClick, map }: MarkerProps) {
  // Create marker container
  const markerElement = document.createElement("div")
  markerElement.className = "marker-container"

  // Special case for مركز شرطة الجيمي - only create circle
  if (name === "مركز شرطة الجيمي") {
    const circleElement = document.createElement("div")
    circleElement.className = "w-4 h-4 rounded-full bg-[#E31E24] animate-pulse"
    markerElement.appendChild(circleElement)

    return new mapboxgl.Marker({
      element: markerElement,
      anchor: "center",
    })
      .setLngLat(coordinates)
      .addTo(map)
  }

  // Regular marker creation for all other locations
  const circleElement = document.createElement("div")
  circleElement.className = "marker-circle"
  markerElement.appendChild(circleElement)

  const contentWrapper = document.createElement("div")
  contentWrapper.className = "marker-content-wrapper"

  const lineElement = document.createElement("div")
  lineElement.className = "marker-dotted-line"
  contentWrapper.appendChild(lineElement)

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
    if (onClick) {
      onClick(name)
    }
  }
  textContainer.appendChild(buttonElement)

  markerElement.appendChild(contentWrapper)
  markerElement.className += ` ${alignment}-aligned`

  return new mapboxgl.Marker({
    element: markerElement,
    anchor: "center",
  })
    .setLngLat(coordinates)
    .addTo(map)
}

// Helper function to determine marker alignment
export function getMarkerAlignment(
  name: string,
): "left" | "right" | "top" | "bottom" | "bottom-left" | "top-right" | "bottom-right" {
  switch (name) {
    // Police Stations with left alignment
    case "مركز شرطة رماح":
    case "مركز شرطة سويحان":
    case "مركز شرطة زاخر":
    case "مركز شرطة الوقن":
      return "left"

    // Police Stations with bottom alignment
    case "مركز شرطة الساد":
    case "ميدان الشرطة بدع بنت سعود":
      return "bottom"

    // Police Stations with top alignment
    case "نادي ضباط الشرطة":
    case "قسم موسيقى شرطة أبوظبي":
    case "مديرية شرطة العين":
    case "مركز شرطة الهير":
      return "top"

    // Police Stations with bottom-left alignment
    case "قسم التفتيش الأمني K9":
      return "bottom-left"

    // Police Stations with bottom-right alignment
    case "إدارة المرور والترخيص":
    case "فرع النقل والمشاغل":
      return "bottom-right"

    // All other markers default to right alignment
    default:
      return "right"
  }
}

export default MapMarker
