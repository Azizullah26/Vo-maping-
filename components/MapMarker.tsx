"use client"

import type React from "react"
import mapboxgl from "mapbox-gl"
import { useEffect } from "react"

interface MapMarkerProps {
  id: string
  position: { top: number; left: number }
  size?: { width: number; height: number }
  onClick: () => void
  onHover: (id: string | null) => void
  hoveredLabel: string | null
  children: React.ReactNode
  className?: string
  isActive?: boolean
  name: string
  colorIndex: number
  direction?: "default" | "left" | "right"
  coordinates?: [number, number]
}

const colorCombinations = [
  ["#ffffff", "#000000"],
  ["#ffffff", "#000000"],
  ["#ffffff", "#000000"],
  ["#ffffff", "#000000"],
]

// Replace the existing getMarkerPositionClasses function with this responsive version
const getMarkerPositionClasses = (name: string) => {
  if (
    name.includes("Abu Dhabi") ||
    name.includes("Al Ain") ||
    name.includes("Dubai") ||
    name.includes("West Region") ||
    name.includes("Other Cities") ||
    name.includes("Western Region")
  ) {
    return "transform -translate-x-2/3 -translate-y-full -mt-2 sm:-mt-4 -ml-2 sm:-ml-4" // Responsive margins
  }
  return "transform -translate-x-1/2 -translate-y-full -mt-1" // Responsive positioning
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
  id,
  position,
  size = { width: 50, height: 50 },
  onClick,
  onHover,
  hoveredLabel,
  children,
  className = "",
  isActive = false,
  name,
  colorIndex,
  direction = "default",
  coordinates,
}) => {
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

  const getElementOpacity = (elementId?: string) => {
    if (!hoveredLabel) return "opacity-100"
    return hoveredLabel === elementId ? "opacity-100" : "opacity-30"
  }

  const getElementScale = (elementId?: string) => {
    if (!hoveredLabel) return "scale-100"
    return hoveredLabel === elementId ? "scale-110" : "scale-95"
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className={`absolute transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 ${getElementOpacity(id)} ${getElementScale(id)} ${className}`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: `translate(${position.left}px, ${position.top}px)`,
        position: "absolute",
        willChange: "transform",
        transformOrigin: "center center",
        zIndex: isActive ? "20" : "10",
      }}
    >
      <div
        className={`relative ${getMarkerPositionClasses(name)}`}
        style={{
          transform: "translateY(-30px)",
          animation: "bounce 1s both",
        }}
      >
        <div
          className={`
rounded-lg
transition-all duration-300 flex items-center justify-center
relative overflow-visible
${isActive ? "scale-110" : "scale-100"}
group
`}
          style={{
            backgroundColor: color1,
            color: color2,
            transition: "all 0.3s ease",
            position: "relative",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = color2
            e.currentTarget.style.color = color1
            const arrow = e.currentTarget.querySelector(".pointer-arrow")
            if (arrow) arrow.style.borderTopColor = color2
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = color1
            e.currentTarget.style.color = color2
            const arrow = e.currentTarget.querySelector(".pointer-arrow")
            if (arrow) arrow.style.borderTopColor = color1
          }}
        >
          <span className={`font-bold font-calvin truncate px-2 relative z-10`}>{name}</span>
          <div
            className="pointer-arrow absolute w-0 h-0 left-1/2 -bottom-2 -translate-x-1/2"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `8px solid ${color1}`,
              zIndex: 5,
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
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
      {children}
    </button>
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
