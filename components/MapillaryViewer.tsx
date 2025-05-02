"use client"

import { useEffect, useRef, useState } from "react"
import { Viewer } from "mapillary-js"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapillaryViewerProps {
  accessToken: string
  mapboxAccessToken?: string
  className?: string
  imageId?: string
}

export default function MapillaryViewer({
  accessToken,
  mapboxAccessToken,
  className = "",
  imageId,
}: MapillaryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Store markers as refs to access them in event handlers
  const cameraMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const lngLatMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const originalMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const positionMarkerRef = useRef<mapboxgl.Marker | null>(null)

  // Constants for conversions
  const RAD2DEG = 180 / Math.PI
  const DEG2RAD = Math.PI / 180

  useEffect(() => {
    if (!containerRef.current) return

    // Use the Abu Dhabi image ID provided by the user
    const actualImageId = imageId || "958596254871529" // Default to the Abu Dhabi image ID provided

    // Create the split view containers
    const containers = makeContainers(containerRef.current)

    // Event handlers
    const onImage = (image: any) => {
      if (!mapRef.current || !lngLatMarkerRef.current || !originalMarkerRef.current) return

      const lngLat = [image.lngLat.lng, image.lngLat.lat]
      lngLatMarkerRef.current.setLngLat(lngLat as [number, number])

      if (!mapRef.current.getBounds().contains(lngLat as mapboxgl.LngLatLike)) {
        mapRef.current.setCenter(lngLat as [number, number])
      }

      const originalPos = [image.originalLngLat.lng, image.originalLngLat.lat]
      originalMarkerRef.current.setLngLat(originalPos as [number, number])
    }

    const onFov = async () => {
      if (!viewerRef.current || !cameraMarkerRef.current) return

      try {
        const viewerContainer = viewerRef.current.getContainer()
        const height = viewerContainer.offsetHeight
        const width = viewerContainer.offsetWidth
        const aspect = height === 0 ? 0 : width / height

        const verticalFov = DEG2RAD * (await viewerRef.current.getFieldOfView())
        const horizontalFov = RAD2DEG * Math.atan(aspect * Math.tan(0.5 * verticalFov)) * 2

        const cameraElement = cameraMarkerRef.current.getElement()
        const path = cameraElement.querySelector("path")
        if (path) {
          path.setAttribute("d", makeArc(horizontalFov))
        }
      } catch (err) {
        console.error("Error updating FOV:", err)
      }
    }

    const onPov = async () => {
      if (!viewerRef.current || !cameraMarkerRef.current) return

      try {
        const pov = await viewerRef.current.getPointOfView()
        const cameraElement = cameraMarkerRef.current.getElement()
        const svg = cameraElement.querySelector("svg")
        if (svg) {
          svg.style.transform = rotateArc(pov.bearing)
        }
      } catch (err) {
        console.error("Error updating POV:", err)
      }
    }

    const onPosition = async () => {
      if (!viewerRef.current || !positionMarkerRef.current || !cameraMarkerRef.current) return

      try {
        const position = await viewerRef.current.getPosition()
        const pos = [position.lng, position.lat]
        positionMarkerRef.current.setLngLat(pos as [number, number])
        cameraMarkerRef.current.setLngLat(pos as [number, number])
      } catch (err) {
        console.error("Error updating position:", err)
      }
    }

    try {
      // Initialize Mapillary viewer
      const viewer = new Viewer({
        accessToken,
        component: { cover: false },
        container: containers.viewer,
      })

      viewerRef.current = viewer

      // Move to the specified image
      viewer.moveTo(actualImageId).catch((err) => {
        console.error("Error moving to image:", err)
        setError(`Failed to load street view: ${err.message || "Unknown error"}`)
        setIsLoading(false)
      })

      // Initialize Mapbox map if access token is provided
      if (mapboxAccessToken) {
        mapboxgl.accessToken = mapboxAccessToken

        const map = new mapboxgl.Map({
          container: containers.map,
          pitch: 45,
          style: "mapbox://styles/mapbox/streets-v11",
          zoom: 18,
        })

        mapRef.current = map

        // Create camera visualization
        const camera = makeCamera(0, 90)
        const cameraMarker = new mapboxgl.Marker({
          color: "#FFFFFF",
          element: camera,
          rotationAlignment: "map",
        })
        cameraMarkerRef.current = cameraMarker

        // Create other markers
        const originalMarker = makeMapboxMarker({ radius: 14, color: "#f00" })
        const lngLatMarker = makeMapboxMarker({ radius: 14, color: "#00f" })
        const positionMarker = makeMapboxMarker({ radius: 10, color: "#f0f" })

        originalMarkerRef.current = originalMarker
        lngLatMarkerRef.current = lngLatMarker
        positionMarkerRef.current = positionMarker

        // Set up event handlers
        viewer.on("load", async () => {
          try {
            const image = await viewer.getImage()
            onImage(image)

            await onFov()
            await onPov()
            await onPosition()

            lngLatMarker.addTo(map)
            originalMarker.addTo(map)
            positionMarker.addTo(map)
            cameraMarker.addTo(map)

            setIsLoading(false)
            setError(null)
          } catch (err) {
            console.error("Error in load event handler:", err)
            setError(`Error initializing view: ${err instanceof Error ? err.message : "Unknown error"}`)
            setIsLoading(false)
          }
        })

        viewer.on("image", (event) => onImage(event.image))
        viewer.on("position", onPosition)
        viewer.on("fov", onFov)
        viewer.on("pov", onPov)

        window.addEventListener("resize", onFov)
      } else {
        // If no Mapbox token, just show the viewer
        viewer.on("load", () => {
          setIsLoading(false)
          setError(null)
        })
      }
    } catch (err) {
      console.error("Error initializing viewer:", err)
      setError(`Failed to initialize street view: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsLoading(false)
    }

    // Cleanup function
    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove()
        viewerRef.current = null
      }

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      window.removeEventListener("resize", onFov)
    }
  }, [accessToken, mapboxAccessToken, DEG2RAD, RAD2DEG, imageId])

  // Helper functions
  function makeContainers(container: HTMLDivElement) {
    const boundingRect = container.getBoundingClientRect()
    const height = `calc(100vh - ${boundingRect.top}px)`

    const viewerContainer = document.createElement("div")
    viewerContainer.style.position = "absolute"
    viewerContainer.style.height = height
    viewerContainer.style.width = "61.8%"

    const mapContainer = document.createElement("div")
    mapContainer.style.position = "absolute"
    mapContainer.style.right = "0px"
    mapContainer.style.height = height
    mapContainer.style.width = "calc(38.2% - 2px)"
    mapContainer.style.marginLeft = "2px"

    container.appendChild(viewerContainer)
    container.appendChild(mapContainer)

    return {
      viewer: viewerContainer,
      map: mapContainer,
    }
  }

  function makeMapboxMarker(options: { radius: number; color: string }) {
    const size = `${2 * options.radius}px`
    const circle = document.createElement("div")
    circle.style.border = `3px solid ${options.color}`
    circle.style.backgroundColor = "rgba(255, 255, 255, 0.6)"
    circle.style.height = size
    circle.style.borderRadius = "50%"
    circle.style.width = size

    return new mapboxgl.Marker({
      element: circle,
      rotationAlignment: "map",
    })
  }

  function rotateArc(bearing: number) {
    return `rotateZ(${bearing}deg)`
  }

  function makeArc(fov: number) {
    const radius = 45
    const centerX = 50
    const centerY = 50

    const fovRad = DEG2RAD * fov

    const arcStart = -Math.PI / 2 - fovRad / 2
    const arcEnd = arcStart + fovRad

    const startX = centerX + radius * Math.cos(arcStart)
    const startY = centerY + radius * Math.sin(arcStart)

    const endX = centerX + radius * Math.cos(arcEnd)
    const endY = centerY + radius * Math.sin(arcEnd)

    const center = `M ${centerX} ${centerY}`
    const line = `L ${startX} ${startY}`
    const arc = `A ${radius} ${radius} 0 0 1 ${endX} ${endY}`

    return `${center} ${line} ${arc} Z`
  }

  function makeCamera(bearing: number, fov: number) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")

    path.setAttribute("d", makeArc(fov))
    path.setAttribute("fill", "yellow")
    path.setAttribute("fill-opacity", "0.5")
    path.setAttribute("stroke", "black")
    path.setAttribute("stroke-width", "1")
    path.setAttribute("stroke-linejoin", "round")

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 100 100")
    svg.appendChild(path)

    svg.style.height = "100%"
    svg.style.width = "100%"
    svg.style.transform = rotateArc(bearing)

    const container = document.createElement("div")
    container.style.height = "200px"
    container.style.width = "200px"
    container.appendChild(svg)

    return container
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading street view...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded-lg max-w-md text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-600 mb-4">
              The specified location may not have street view imagery available.
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
