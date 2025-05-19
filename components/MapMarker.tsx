"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import mapboxgl from "mapbox-gl"
import { useEffect } from "react"

interface MapMarkerProps {
  x: number
  y: number
  isActive?: boolean
  name: string
  size?: "small" | "medium" | "large"
  colorIndex: number
  onClick?: () => void
  direction?: "default" | "left" | "right"
}

const colorCombinations = [
  ["#ffffff", "#000000"],
  ["#ffffff", "#000000"],
  ["#ffffff", "#000000"],
  ["#ffffff", "#000000"],
]

// Add this function to determine if a marker is for Abu Dhabi
const getMarkerPositionClasses = (name: string) => {
  if (
    name.includes("Abu Dhabi") ||
    name.includes("Al Ain") ||
    name.includes("Dubai") ||
    name.includes("West Region") ||
    name.includes("Other Cities")
  ) {
    return "transform -translate-x-2/3 -translate-y-full -mt-4 -ml-4" // Adjusted for pointer
  }
  return "transform -translate-x-1/2 -translate-y-full -mt-1" // Adjusted for pointer
}

// Add keyframes for the animations
const animationKeyframes = `
@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0.0;
  }
  50% {
    opacity: 1.0;
  }
  100% {
    transform: scale(1.2, 1.2);
    opacity: 0;
  }
}

@keyframes bounce {
  0% {
    opacity: 0;
    transform: translateY(-2000px);
  }
  60% {
    opacity: 1;
    transform: translateY(30px);
  }
  80% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}
`

const MapMarker: React.FC<MapMarkerProps> = ({
  x,
  y,
  isActive = false,
  name,
  size = "medium",
  colorIndex,
  onClick,
  direction = "default",
}) => {
  const sizes = {
    small: {
      width: "w-12 sm:w-14", // Further reduced from w-14 sm:w-16
      height: "h-4 sm:h-5", // Further reduced from h-5 sm:h-6
      text: "text-[10px]", // Smaller text size
      offset: "translate-y-0",
    },
    medium: {
      width: "w-14 sm:w-16", // Further reduced from w-16 sm:w-20
      height: "h-5 sm:h-6", // Further reduced from h-6 sm:h-7
      text: "text-[10px] sm:text-xs", // Smaller text size
      offset: "translate-y-1 sm:translate-y-2", // Adjusted offset
    },
    large: {
      width: "w-16 sm:w-20", // Further reduced from w-20 sm:w-24
      height: "h-6 sm:h-7", // Further reduced from h-7 sm:h-8
      text: "text-xs", // Smaller text size
      offset: "translate-y-2 sm:translate-y-4", // Adjusted offset
    },
  }

  const [color1, color2] = colorCombinations[colorIndex % colorCombinations.length]

  // Add the keyframes to the document
  useEffect(() => {
    // Check if the style already exists
    if (!document.getElementById("marker-animations")) {
      const styleElement = document.createElement("style")
      styleElement.id = "marker-animations"
      styleElement.innerHTML = animationKeyframes
      document.head.appendChild(styleElement)

      return () => {
        // Clean up on unmount
        const element = document.getElementById("marker-animations")
        if (element) {
          element.remove()
        }
      }
    }
  }, [])

  return (
    <div
      className={cn("absolute pointer-events-auto cursor-pointer z-10", isActive && "z-20")}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        position: "absolute", // Ensure absolute positioning
        willChange: "transform", // Optimize for animations
        transformOrigin: "center center", // Ensure proper scaling
      }}
      onClick={onClick}
    >
      <div
        className={`relative ${getMarkerPositionClasses(name)} ${sizes[size].offset}`}
        style={{
          transform: "translateY(-30px)",
          animation: "bounce 1s both",
        }}
      >
        <div
          className={`
${sizes[size].width} ${sizes[size].height} rounded-lg
transition-all duration-300 flex items-center justify-center
relative overflow-visible
${isActive ? "scale-110" : "scale-100"}
hover:scale-110 group
`}
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            transition: "all 0.3s ease",
            position: "relative",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#000000"
            e.currentTarget.style.color = "#ffffff"
            const arrow = e.currentTarget.querySelector(".pointer-arrow")
            if (arrow) arrow.style.borderTopColor = "#000000"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff"
            e.currentTarget.style.color = "#000000"
            const arrow = e.currentTarget.querySelector(".pointer-arrow")
            if (arrow) arrow.style.borderTopColor = "#ffffff"
          }}
        >
          <span className={`${sizes[size].text} font-bold font-calvin truncate px-2 relative z-10`}>{name}</span>
          <div
            className="pointer-arrow absolute w-0 h-0 left-1/2 -bottom-2 -translate-x-1/2"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid #ffffff",
              zIndex: 5,
            }}
          />
        </div>

        {/* Add dashed lines with direction support - FUTURISTIC VERSION */}
        {direction === "left" ? (
          <>
            {/* Left-pointing dashed line - FUTURISTIC */}
            <div
              className="absolute right-full top-1/2 -translate-y-1/2 h-[2px] w-[50px]"
              style={{
                background: "linear-gradient(90deg, #00f2fe, #4facfe, #00f2fe)",
                backgroundSize: "200% auto",
                animation: "flow 3s linear infinite",
                boxShadow: "0 0 8px rgba(0, 242, 254, 0.7)",
                opacity: 0.8,
              }}
            ></div>
            {/* Circle at the end of the line with pulse effect */}
            <div
              className="absolute right-[calc(100%+50px)] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                background: "radial-gradient(circle, #4facfe 0%, #00f2fe 100%)",
                boxShadow: "0 0 10px #00f2fe, 0 0 20px rgba(0, 242, 254, 0.5)",
              }}
            >
              {/* Pulse effect for the endpoint */}
              <div
                style={{
                  position: "absolute",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "rgba(1,4,2,0.2)",
                  transform: "translate(-50%, -50%) rotateX(55deg)",
                  top: "50%",
                  left: "50%",
                  zIndex: -1,
                }}
              >
                <div
                  style={{
                    content: '""',
                    position: "absolute",
                    borderRadius: "50%",
                    height: "20px",
                    width: "20px",
                    margin: "-10px 0 0 -10px",
                    background:
                      "radial-gradient(circle, rgba(0, 247, 255, 0.92) 0%, rgba(136, 227, 252, 1) 38%, rgba(0, 55, 207, 1) 53%, rgba(217, 0, 0, 1) 100%)",
                    boxShadow: "0 0 1px 2px #FFFFFF",
                    animation: "pulsate 1s ease-out infinite",
                    animationDelay: "1.1s",
                    opacity: 0,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Circle at the end of the line with pulse effect */}
            <div
              className="absolute left-1/2 top-[calc(100%+50px)] -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                background: "radial-gradient(circle, #4facfe 0%, #00f2fe 100%)",
                boxShadow: "0 0 10px #00f2fe, 0 0 20px rgba(0, 242, 254, 0.5)",
              }}
            >
              {/* Pulse effect for the endpoint */}
              <div
                style={{
                  position: "absolute",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "rgba(1,4,2,0.2)",
                  transform: "translate(-50%, -50%) rotateX(55deg)",
                  top: "50%",
                  left: "50%",
                  zIndex: -1,
                }}
              >
                <div
                  style={{
                    content: '""',
                    position: "absolute",
                    borderRadius: "50%",
                    height: "20px",
                    width: "20px",
                    margin: "-10px 0 0 -10px",
                    background:
                      "radial-gradient(circle, rgba(0, 247, 255, 0.92) 0%, rgba(136, 227, 252, 1) 38%, rgba(0, 55, 207, 1) 53%, rgba(217, 0, 0, 1) 100%)",
                    boxShadow: "0 0 1px 2px #FFFFFF",
                    animation: "pulsate 1s ease-out infinite",
                    animationDelay: "1.1s",
                    opacity: 0,
                  }}
                />
              </div>
            </div>
          </>
        )}
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

export const CUSTOM_MARKER_COORDINATES = {
  latitude: 24.566557378557178,
  longitude: 54.707019986771485,
}

export default MapMarker
