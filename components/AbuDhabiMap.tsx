"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapboxToken } from "@/hooks/useMapboxToken"
import { projects, type Project, type ProjectRegion } from "@/data/abu-dhabi-projects"
import { regions } from "@/data/abu-dhabi-regions"
import { MapControls } from "./MapControls"

export interface AbuDhabiMapProps {
  onProjectSelect?: (project: Project) => void
  selectedProject?: Project | null
  onRegionSelect?: (region: ProjectRegion) => void
  selectedRegion?: ProjectRegion | null
  filterType?: string
  onMarkerHover?: (project: Project | null) => void
}

export default function AbuDhabiMap({
  onProjectSelect,
  selectedProject,
  onRegionSelect,
  selectedRegion,
  filterType = "all",
  onMarkerHover,
}: AbuDhabiMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const { token, loading, error } = useMapboxToken()
  const [markers, setMarkers] = useState<{ [key: string]: mapboxgl.Marker }>({})
  const [regionPolygons, setRegionPolygons] = useState<any[]>([])
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [showDottedLines, setShowDottedLines] = useState(false) // New state to control dotted lines

  // Memoize filtered projects to prevent recalculation on every render
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (filterType === "all") return true
      return project.type.toLowerCase() === filterType.toLowerCase()
    })
  }, [filterType])

  // Initialize map
  useEffect(() => {
    if (map.current) return // already initialized
    if (loading) return
    if (error || !token) {
      setMapError("Mapbox access token error: " + (error || "Token not available"))
      return
    }

    try {
      console.log("Initializing Abu Dhabi map with token:", token.substring(0, 5) + "...")
      mapboxgl.accessToken = token

      // Initialize map with satellite-streets style
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/satellite-streets-v12", // Satellite with streets
        center: [54.37, 24.47], // Abu Dhabi coordinates
        zoom: 11,
        pitch: 30, // Add slight tilt for 3D effect
        bearing: 0,
        preserveDrawingBuffer: true,
        renderWorldCopies: false,
      })

      // Set up event handlers
      map.current.on("load", () => {
        console.log("Abu Dhabi map loaded successfully")
        setMapLoaded(true)

        if (!map.current) return

        // Add region polygons
        regions.forEach((region, index) => {
          const id = `region-${region.id}`

          // Add region polygon source
          map.current!.addSource(id, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {
                name: region.name,
                id: region.id,
              },
              geometry: {
                type: "Polygon",
                coordinates: [region.coordinates],
              },
            },
          })

          // Add fill layer
          map.current!.addLayer({
            id: `${id}-fill`,
            type: "fill",
            source: id,
            layout: {},
            paint: {
              "fill-color": region.color || "#ffffff",
              "fill-opacity": 0.1,
            },
          })

          // Add outline layer - only if showDottedLines is true
          if (showDottedLines) {
            map.current!.addLayer({
              id: `${id}-line`,
              type: "line",
              source: id,
              layout: {},
              paint: {
                "line-color": "#ffffff",
                "line-width": 2,
                "line-opacity": 0.8,
              },
            })
          }

          // Add region label
          map.current!.addLayer({
            id: `${id}-label`,
            type: "symbol",
            source: id,
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 14,
              "text-offset": [0, 0],
              "text-anchor": "center",
            },
            paint: {
              "text-color": "#ffffff",
              "text-halo-color": "rgba(0, 0, 0, 0.7)",
              "text-halo-width": 2,
            },
          })

          // Add click event for region
          map.current!.on("click", `${id}-fill`, (e) => {
            if (e.features && e.features[0] && onRegionSelect) {
              const regionId = e.features[0].properties?.id
              const selectedRegion = regions.find((r) => r.id === regionId)
              if (selectedRegion) {
                onRegionSelect(selectedRegion)
              }
            }
          })

          // Change cursor on hover
          map.current!.on("mouseenter", `${id}-fill`, () => {
            map.current!.getCanvas().style.cursor = "pointer"
          })

          map.current!.on("mouseleave", `${id}-fill`, () => {
            map.current!.getCanvas().style.cursor = ""
          })
        })

        // Add project markers
        const newMarkers: { [key: string]: mapboxgl.Marker } = {}

        filteredProjects.forEach((project) => {
          // Create custom marker element
          const markerEl = document.createElement("div")
          markerEl.className = "project-marker"
          markerEl.innerHTML = `
          <div class="marker-container">
            <div class="marker-pulse"></div>
            <div class="marker-dot"></div>
          </div>
        `

          // Add project data attributes
          markerEl.setAttribute("data-project-id", project.id)
          markerEl.setAttribute("data-project-name", project.name)
          markerEl.setAttribute("data-project-region", project.region)

          // Create marker
          const marker = new mapboxgl.Marker({
            element: markerEl,
            anchor: "center",
          })
            .setLngLat(project.coordinates)
            .addTo(map.current!)

          // Add popup with project name
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 25,
            className: "project-popup",
          }).setHTML(`
          <div class="popup-content">
            <h3>${project.name}</h3>
            <p>${project.plots} Plots · ${project.type}</p>
          </div>
        `)

          // Add hover events
          markerEl.addEventListener("mouseenter", () => {
            marker.setPopup(popup).togglePopup()
            if (onMarkerHover) onMarkerHover(project)

            // Highlight this marker and dim others
            document.querySelectorAll(".project-marker").forEach((el) => {
              if (el !== markerEl) {
                el.classList.add("dimmed")
              } else {
                el.classList.add("highlighted")
              }
            })
          })

          markerEl.addEventListener("mouseleave", () => {
            marker.getPopup().remove()
            if (onMarkerHover) onMarkerHover(null)

            // Reset all markers
            document.querySelectorAll(".project-marker").forEach((el) => {
              el.classList.remove("dimmed", "highlighted")
            })
          })

          // Add click event
          markerEl.addEventListener("click", () => {
            if (onProjectSelect) {
              onProjectSelect(project)

              // Fly to the project location
              map.current!.flyTo({
                center: project.coordinates,
                zoom: 15,
                pitch: 45,
                bearing: 30,
                duration: 1500,
                essential: true,
              })
            }
          })

          newMarkers[project.id] = marker
        })

        setMarkers(newMarkers)
      })

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setMapError(`Map error: ${e.error?.message || "Unknown error"}`)
      })
    } catch (err) {
      console.error("Error initializing map:", err)
      setMapError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`)
    }

    // Cleanup function
    return () => {
      try {
        if (map.current) {
          console.log("Cleaning up Abu Dhabi map")
          map.current.remove()
          map.current = null
        }
      } catch (err) {
        console.error("Error during map cleanup:", err)
      }
    }
  }, [token, loading, error])

  // Only update markers when filterType changes, not on every render
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Skip marker recreation if the map was just initialized
    if (Object.keys(markers).length === 0) return

    // Clear existing markers
    Object.values(markers).forEach((marker) => marker.remove())

    // Create new markers for filtered projects
    const newMarkers: { [key: string]: mapboxgl.Marker } = {}

    filteredProjects.forEach((project) => {
      // Create custom marker element
      const markerEl = document.createElement("div")
      markerEl.className = "project-marker"
      markerEl.innerHTML = `
        <div class="marker-container">
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
        </div>
      `

      // Add project data attributes
      markerEl.setAttribute("data-project-id", project.id)
      markerEl.setAttribute("data-project-name", project.name)
      markerEl.setAttribute("data-project-region", project.region)

      // Create marker
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat(project.coordinates)
        .addTo(map.current!)

      // Add popup with project name
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: "project-popup",
      }).setHTML(`
        <div class="popup-content">
          <h3>${project.name}</h3>
          <p>${project.plots} Plots · ${project.type}</p>
        </div>
      `)

      // Add hover events
      markerEl.addEventListener("mouseenter", () => {
        marker.setPopup(popup).togglePopup()
        if (onMarkerHover) onMarkerHover(project)

        // Highlight this marker and dim others
        document.querySelectorAll(".project-marker").forEach((el) => {
          if (el !== markerEl) {
            el.classList.add("dimmed")
          } else {
            el.classList.add("highlighted")
          }
        })
      })

      markerEl.addEventListener("mouseleave", () => {
        marker.getPopup().remove()
        if (onMarkerHover) onMarkerHover(null)

        // Reset all markers
        document.querySelectorAll(".project-marker").forEach((el) => {
          el.classList.remove("dimmed", "highlighted")
        })
      })

      // Add click event
      markerEl.addEventListener("click", () => {
        if (onProjectSelect) {
          onProjectSelect(project)
        }
      })

      newMarkers[project.id] = marker
    })

    setMarkers(newMarkers)
  }, [filterType, mapLoaded, onMarkerHover, onProjectSelect])

  // Update markers when selected project changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedProject || Object.keys(markers).length === 0) return

    // Fly to the selected project
    map.current.flyTo({
      center: selectedProject.coordinates,
      zoom: 15,
      pitch: 45,
      bearing: 30,
      duration: 1500,
      essential: true,
    })

    // Update marker styles
    Object.keys(markers).forEach((key) => {
      const markerEl = markers[key].getElement()
      if (key === selectedProject.id) {
        markerEl.classList.add("highlighted")
        markerEl.classList.remove("dimmed")
      } else {
        markerEl.classList.add("dimmed")
        markerEl.classList.remove("highlighted")
      }
    })
  }, [selectedProject, mapLoaded])

  // Reset markers when selection is cleared
  useEffect(() => {
    if (!map.current || !mapLoaded || selectedProject || Object.keys(markers).length === 0) return

    // Reset all markers
    Object.keys(markers).forEach((key) => {
      const markerEl = markers[key].getElement()
      markerEl.classList.remove("dimmed", "highlighted")
    })

    // Reset map view
    map.current.flyTo({
      center: [54.37, 24.47],
      zoom: 11,
      pitch: 30,
      bearing: 0,
      duration: 1500,
    })
  }, [selectedProject, mapLoaded])

  // Handle toggle terrain
  const handleToggleTerrain = useCallback(() => {
    if (!map.current) return

    const currentPitch = map.current.getPitch()
    map.current.easeTo({
      pitch: currentPitch > 0 ? 0 : 45,
      duration: 1000,
    })
  }, [])

  // Handle reset view
  const handleResetView = useCallback(() => {
    if (!map.current) return

    map.current.flyTo({
      center: [54.37, 24.47],
      zoom: 11,
      pitch: 30,
      bearing: 0,
      duration: 1500,
    })
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* Map error display */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold text-red-600">Map Error</h3>
            <p className="mt-2">{mapError}</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />

      {/* Map controls */}
      <MapControls onResetView={handleResetView} onToggleTerrain={handleToggleTerrain} />

      {/* Add custom styles for markers */}
      <style jsx global>{`
        .project-marker {
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          will-change: transform, opacity;
        }
        
        .marker-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .marker-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background-color: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 2;
        }
        
        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          z-index: 1;
          animation: pulse 2s infinite;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }
        
        .project-marker.highlighted .marker-dot {
          background-color: #00ffff;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
        }
        
        .project-marker.highlighted .marker-pulse {
          background-color: rgba(0, 255, 255, 0.4);
          animation: pulse-highlight 1.5s infinite;
        }
        
        .project-marker.dimmed {
          opacity: 0.3;
        }
        
        .project-popup {
          max-width: 200px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .popup-content {
          padding: 10px;
          color: white;
        }
        
        .popup-content h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
          font-weight: bold;
        }
        
        .popup-content p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes pulse-highlight {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
