"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import mapboxgl from "mapbox-gl"

interface MapMarkerProps {
  x: number
  y: number
  isActive?: boolean
  name: string
  size?: "small" | "medium" | "large"
  colorIndex: number
  onClick?: () => void
}

const colorCombinations = [
  ["#ffbc00", "#ff0058"],
  ["#03a9f4", "#ff0058"],
  ["#4dff03", "#00d0ff"],
]

// Add this function to determine if a marker is for Abu Dhabi
const getMarkerPositionClasses = (name: string) => {
  if (name.includes("Abu Dhabi")) {
    return "-translate-x-2/3 -translate-y-full -mt-8 -ml-4" // Move up and left
  }
  return "-translate-x-1/2 -translate-y-full -mt-3" // Default positioning
}

const MapMarker: React.FC<MapMarkerProps> = ({
  x,
  y,
  isActive = false,
  name,
  size = "medium",
  colorIndex,
  onClick,
}) => {
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

  return (
    <div
      className={cn("absolute pointer-events-auto cursor-pointer", isActive && "z-10")}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      onClick={onClick}
    >
      <div className={`relative ${getMarkerPositionClasses(name)} ${sizes[size].offset}`}>
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
            className="absolute inset-x-0 -top-1 bottom-0 -z-10 opacity-75 blur-md"
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

const markerAlignments = {
  "Saadiyat Island": "bottom-right-aligned",
  "Louvre Abu Dhabi": "top-right-aligned",
  "Zayed National Museum": "bottom-left-aligned",
  "Guggenheim Abu Dhabi": "top-aligned",
  "New York University Abu Dhabi": "left-aligned",
}

export const createMapMarker = ({ name, coordinates, alignment, onClick, map }) => {
  const el = document.createElement("div")
  el.className = "marker"
  el.style.backgroundColor = "white"
  el.style.width = "10px"
  el.style.height = "10px"
  el.style.borderRadius = "50%"
  el.style.cursor = "pointer"

  el.addEventListener("click", () => {
    onClick(name)
  })

  new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map)
}

export const getMarkerAlignment = (name: string) => {
  return markerAlignments[name] || "right-aligned"
}

export default MapMarker
