"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { alainBoundaryData } from "@/data/alainCoordinates"
import { westRegionBoundary } from "@/data/westRegionCoordinates"
import { dubaiCityBoundary } from "@/data/dubaiCityCoordinates"
import { otherCitiesBoundary } from "@/data/otherCitiesCoordinates"
import { abuDhabiCityBoundary } from "@/data/abuDhabiCityCoordinates"

const uaeData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [51.59112113593443, 24.267541247022507],
            [51.5906446311775, 24.253465939734525],
            [51.591120897437435, 24.26753907893641],
          ],
        ],
      },
    },
  ],
}

// Define region coordinates based on their actual centers
const regionCoordinates = {
  "Abu Dhabi": [54.37, 24.47], // Abu Dhabi city coordinates
  "Al Ain": [55.76, 24.13], // Al Ain city coordinates
  Dubai: [55.27, 25.2], // Dubai city coordinates
  "West Region": [52.9, 23.65], // Approximate center of West Region
  // Exact coordinates for Other Cities as specified
  "Other Cities": [56.03246975729596, 25.744486521694355],
}

const UAEMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  const initialZoom = 7.0
  const maxZoom = 12

  // Fetch the Mapbox token from the API
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const response = await fetch("/api/mapbox-token")
        const data = await response.json()
        if (data.token) {
          setMapboxToken(data.token)
        } else {
          console.error("Failed to fetch Mapbox token")
        }
      } catch (error) {
        console.error("Error fetching Mapbox token:", error)
      }
    }

    fetchMapboxToken()
  }, [])

  useEffect(() => {
    if (mapInitialized || !mapboxToken) return
    if (map.current) return // initialize map only once

    mapboxgl.accessToken = mapboxToken

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
      center: [54.73843071839528, 24.0329102507836], // Updated center coordinates
      zoom: initialZoom,
      minZoom: initialZoom - 0.5, // Allow slightly more zoom out for 3D view
      maxZoom: maxZoom,
      pitch: 45, // Add 45-degree pitch for 3D effect
      bearing: 0, // Keep bearing at 0 to maintain north orientation
    })

    mapInstance.on("load", () => {
      setMapLoaded(true)
    })

    // Add zoom end event listener to prevent zooming out beyond the initial zoom level
    mapInstance.on("zoomend", () => {
      if (mapInstance && mapInstance.getZoom() < initialZoom) {
        mapInstance.setZoom(initialZoom)
      }
    })

    map.current = mapInstance
    setMapInitialized(true)

    return () => {
      // Clean up markers when component unmounts
      markersRef.current.forEach((marker) => marker.remove())
      mapInstance?.remove()
    }
  }, [mapInitialized, mapboxToken])

  useEffect(() => {
    if (!mapLoaded || !map.current) return

    // Remove any existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Function to calculate the center of a polygon
    const calculatePolygonCenter = (coordinates) => {
      if (!coordinates || !coordinates.length || !coordinates[0].length) {
        return null
      }

      let sumX = 0
      let sumY = 0
      let pointCount = 0

      // For simplicity, we'll use the first ring of the polygon
      const ring = coordinates[0]

      ring.forEach((coord) => {
        sumX += coord[0]
        sumY += coord[1]
        pointCount++
      })

      return [sumX / pointCount, sumY / pointCount]
    }

    // Add UAE boundary
    if (!map.current.getSource("uae-boundary")) {
      map.current.addSource("uae-boundary", {
        type: "geojson",
        data: uaeData,
      })
    }

    if (!map.current.getLayer("uae-boundary-fill")) {
      map.current.addLayer({
        id: "uae-boundary-fill",
        type: "fill",
        source: "uae-boundary",
        layout: {},
        paint: {
          "fill-color": "#D3D3D3", // Light gray color
          "fill-opacity": 0.5,
        },
      })
    }

    if (!map.current.getLayer("uae-boundary-outline")) {
      map.current.addLayer({
        id: "uae-boundary-outline",
        type: "line",
        source: "uae-boundary",
        layout: {},
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 4, // Increased from 2px to 4px
        },
      })
    }

    // Add Abu Dhabi city polygon
    if (!map.current.getSource("abu-dhabi-boundary")) {
      map.current.addSource("abu-dhabi-boundary", {
        type: "geojson",
        data: abuDhabiCityBoundary,
      })
    }

    // Update Abu Dhabi city polygon fill color
    if (!map.current.getLayer("abu-dhabi-boundary-fill")) {
      map.current.addLayer({
        id: "abu-dhabi-boundary-fill",
        type: "fill",
        source: "abu-dhabi-boundary",
        layout: {},
        paint: {
          "fill-color": "#333333", // Dark gray color
          "fill-opacity": 0.4, // Transparent
        },
      })
    }

    if (!map.current.getLayer("abu-dhabi-boundary-line")) {
      map.current.addLayer({
        id: "abu-dhabi-boundary-line",
        type: "line",
        source: "abu-dhabi-boundary",
        layout: {},
        paint: {
          "line-color": "#ffffff",
          "line-width": 4, // Increased from 2px to 4px
        },
      })
    }

    // Add Al Ain polygon
    if (!map.current.getSource("alain-boundary")) {
      map.current.addSource("alain-boundary", {
        type: "geojson",
        data: alainBoundaryData,
      })
    }

    // Update Al Ain polygon fill color
    if (!map.current.getLayer("alain-boundary-fill")) {
      map.current.addLayer({
        id: "alain-boundary-fill",
        type: "fill",
        source: "alain-boundary",
        layout: {},
        paint: {
          "fill-color": "#333333", // Dark gray color
          "fill-opacity": 0.4, // Transparent
        },
      })
    }

    if (!map.current.getLayer("alain-boundary-line")) {
      map.current.addLayer({
        id: "alain-boundary-line",
        type: "line",
        source: "alain-boundary",
        layout: {},
        paint: {
          "line-color": "#ffffff",
          "line-width": 4, // Increased from 2px to 4px
        },
      })
    }

    // Add West Region polygon
    if (!map.current.getSource("west-region-boundary")) {
      map.current.addSource("west-region-boundary", {
        type: "geojson",
        data: westRegionBoundary,
      })
    }

    // Update West Region polygon fill color
    if (!map.current.getLayer("west-region-boundary-fill")) {
      map.current.addLayer({
        id: "west-region-boundary-fill",
        type: "fill",
        source: "west-region-boundary",
        layout: {},
        paint: {
          "fill-color": "#333333", // Dark gray color
          "fill-opacity": 0.4, // Transparent
        },
      })
    }

    if (!map.current.getLayer("west-region-boundary-line")) {
      map.current.addLayer({
        id: "west-region-boundary-line",
        type: "line",
        source: "west-region-boundary",
        layout: {},
        paint: {
          "line-color": "#ffffff",
          "line-width": 4, // Increased from 2px to 4px
        },
      })
    }

    // Add Dubai City polygon
    if (!map.current.getSource("dubai-city-boundary")) {
      map.current.addSource("dubai-city-boundary", {
        type: "geojson",
        data: dubaiCityBoundary,
      })
    }

    // Update Dubai City polygon fill color
    if (!map.current.getLayer("dubai-city-boundary-fill")) {
      map.current.addLayer({
        id: "dubai-city-boundary-fill",
        type: "fill",
        source: "dubai-city-boundary",
        layout: {},
        paint: {
          "fill-color": "#333333", // Dark gray color
          "fill-opacity": 0.4, // Transparent
        },
      })
    }

    if (!map.current.getLayer("dubai-city-boundary-line")) {
      map.current.addLayer({
        id: "dubai-city-boundary-line",
        type: "line",
        source: "dubai-city-boundary",
        layout: {},
        paint: {
          "line-color": "#ffffff",
          "line-width": 4, // Increased from 2px to 4px
        },
      })
    }

    // Add Other Cities polygon
    if (!map.current.getSource("other-cities-boundary")) {
      map.current.addSource("other-cities-boundary", {
        type: "geojson",
        data: otherCitiesBoundary,
      })
    }

    // Update Other Cities polygon fill color
    if (!map.current.getLayer("other-cities-boundary-fill")) {
      map.current.addLayer({
        id: "other-cities-boundary-fill",
        type: "fill",
        source: "other-cities-boundary",
        layout: {},
        paint: {
          "fill-color": "#333333", // Dark gray color
          "fill-opacity": 0.4, // Transparent
        },
      })
    }

    if (!map.current.getLayer("other-cities-boundary-line")) {
      map.current.addLayer({
        id: "other-cities-boundary-line",
        type: "line",
        source: "other-cities-boundary",
        layout: {},
        paint: {
          "line-color": "#ffffff",
          "line-width": 4, // Increased from 2px to 4px
        },
      })
    }

    // Calculate centers for each region from their boundary data
    const abuDhabiCenter =
      calculatePolygonCenter(abuDhabiCityBoundary.features[0].geometry.coordinates) || regionCoordinates["Abu Dhabi"]
    const alAinCenter =
      calculatePolygonCenter(alainBoundaryData.features[0].geometry.coordinates) || regionCoordinates["Al Ain"]
    const dubaiCenter =
      calculatePolygonCenter(dubaiCityBoundary.features[0].geometry.coordinates) || regionCoordinates["Dubai"]
    const westRegionCenter =
      calculatePolygonCenter(westRegionBoundary.features[0].geometry.coordinates) || regionCoordinates["West Region"]

    // IMPORTANT: Use the exact coordinates for Other Cities - no calculation or fallback
    const otherCitiesCenter = [56.03246975729596, 25.744486521694355]

    // Log the coordinates to verify
    console.log("Other Cities marker coordinates:", otherCitiesCenter)

    // Add custom markers for each region with dashed lines
    const addRegionMarker = (name, coordinates, colorIndex = 0) => {
      const colors = [
        ["#ffbc00", "#ff0058"], // Orange to pink
        ["#03a9f4", "#ff0058"], // Blue to pink
        ["#4dff03", "#00d0ff"], // Green to blue
        ["#9c27b0", "#03a9f4"], // Purple to blue
        ["#ff9800", "#4caf50"], // Orange to green
      ]

      const [color1, color2] = colors[colorIndex % colors.length]

      // Create standard marker element
      const markerElement = document.createElement("div")
      markerElement.className = "region-marker"
      markerElement.id = `marker-${name.toLowerCase().replace(/\s+/g, "-")}`
      markerElement.style.position = "relative"
      markerElement.style.width = "0"
      markerElement.style.height = "0"

      // Create the marker container - IDENTICAL FOR ALL MARKERS
      const markerContainer = document.createElement("div")
      markerContainer.className = "marker-container"
      markerContainer.style.position = "relative"
      markerContainer.style.width = "0"
      markerContainer.style.height = "0"

      // Create the marker label - IDENTICAL STRUCTURE FOR ALL MARKERS
      const markerLabel = document.createElement("div")
      markerLabel.className = "marker-label"
      markerLabel.textContent = name
      markerLabel.style.background = `linear-gradient(45deg, ${color1}, ${color2})`
      markerLabel.style.color = "white"
      markerLabel.style.padding = "5px 10px"
      markerLabel.style.borderRadius = "15px"
      markerLabel.style.fontWeight = "bold"
      markerLabel.style.whiteSpace = "nowrap"
      markerLabel.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.3)"
      markerLabel.style.transform = "translate(-50%, -100%)"
      markerLabel.style.marginBottom = "10px"
      markerLabel.style.position = "absolute"
      markerLabel.style.zIndex = "10"

      // Create the vertical dashed line - IDENTICAL FOR ALL MARKERS
      const dashedLine = document.createElement("div")
      dashedLine.className = "dashed-line"
      dashedLine.style.position = "absolute"
      dashedLine.style.top = "0"
      dashedLine.style.left = "0"
      dashedLine.style.transform = "translateX(-50%)"
      dashedLine.style.width = "2px"
      dashedLine.style.height = "80px"
      dashedLine.style.backgroundImage = "linear-gradient(0deg, white 50%, transparent 50%)"
      dashedLine.style.backgroundSize = "2px 8px"
      dashedLine.style.backgroundRepeat = "repeat-y"
      dashedLine.style.zIndex = "5"

      // Create the endpoint circle - IDENTICAL FOR ALL MARKERS
      const endpoint = document.createElement("div")
      endpoint.className = "marker-endpoint"
      endpoint.style.position = "absolute"
      endpoint.style.top = "80px"
      endpoint.style.left = "0"
      endpoint.style.transform = "translate(-50%, -50%)"
      endpoint.style.width = "12px"
      endpoint.style.height = "12px"
      endpoint.style.backgroundColor = "white"
      endpoint.style.borderRadius = "50%"
      endpoint.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.8)"
      endpoint.style.zIndex = "6"

      // Assemble the marker - IDENTICAL ASSEMBLY FOR ALL MARKERS
      markerContainer.appendChild(markerLabel)
      markerContainer.appendChild(dashedLine)
      markerContainer.appendChild(endpoint)
      markerElement.appendChild(markerContainer)

      // Add click handler
      markerElement.addEventListener("click", () => {
        // Zoom to the region when clicked
        const sourceId = name.toLowerCase().replace(/\s+/g, "-") + "-boundary"
        if (map.current?.getSource(sourceId)) {
          // Get the bounds of the region
          const features = map.current?.querySourceFeatures(sourceId)
          if (features && features.length > 0) {
            const coordinates = features[0].geometry.coordinates[0]
            const bounds = coordinates.reduce((bounds, coord) => {
              return bounds.extend(coord as mapboxgl.LngLatLike)
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

            map.current?.fitBounds(bounds, {
              padding: 50,
              duration: 1000,
            })
          }
        }
      })

      // Add the marker to the map with precise coordinates - IDENTICAL FOR ALL MARKERS
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: "bottom",
        offset: [0, 0],
      })
        .setLngLat(coordinates)
        .addTo(map.current!)

      // Store the marker reference for cleanup
      markersRef.current.push(marker)

      return marker
    }

    // Create all markers with the standardized function
    const abuDhabiMarker = addRegionMarker("Abu Dhabi", abuDhabiCenter, 0)
    const alAinMarker = addRegionMarker("Al Ain", alAinCenter, 1)
    const dubaiMarker = addRegionMarker("Dubai", dubaiCenter, 2)
    const westRegionMarker = addRegionMarker("West Region", westRegionCenter, 3)
    const otherCitiesMarker = addRegionMarker("Other Cities", otherCitiesCenter, 4)

    // Add verification for all markers
    setTimeout(() => {
      // Verify all markers have the correct elements
      const verifyMarker = (name, marker) => {
        if (!marker) {
          console.error(`${name} marker not created properly`)
          return
        }

        const position = marker.getLngLat()
        console.log(`Verified ${name} marker position:`, position)

        // Check if the marker element has the required components
        const markerElement = document.getElementById(`marker-${name.toLowerCase().replace(/\s+/g, "-")}`)
        if (!markerElement) {
          console.error(`${name} marker element not found in DOM`)
          return
        }

        const hasLabel = markerElement.querySelector(".marker-label") !== null
        const hasDashedLine = markerElement.querySelector(".dashed-line") !== null
        const hasEndpoint = markerElement.querySelector(".marker-endpoint") !== null

        console.log(`${name} marker components check:`, {
          hasLabel,
          hasDashedLine,
          hasEndpoint,
        })

        if (!hasLabel || !hasDashedLine || !hasEndpoint) {
          console.error(`${name} marker is missing components!`)
        } else {
          console.log(`${name} marker has all required components ✓`)
        }
      }

      // Verify all markers
      verifyMarker("Abu Dhabi", abuDhabiMarker)
      verifyMarker("Al Ain", alAinMarker)
      verifyMarker("Dubai", dubaiMarker)
      verifyMarker("West Region", westRegionMarker)
      verifyMarker("Other Cities", otherCitiesMarker)
    }, 1500)

    // Add click event for zoom effect
    map.current.on("click", "alain-boundary-fill", (e) => {
      if (e.features && e.features[0].geometry.type === "Polygon") {
        const coordinates = e.features[0].geometry.coordinates as number[][][]
        const bounds = coordinates.reduce((bounds, polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as mapboxgl.LngLatLike)
            })
          })
          return bounds
        }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]))

        map.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        })
      }
    })

    // Update hover effects for Al Ain
    map.current.on("mouseenter", "alain-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("alain-boundary-fill", "fill-color", "#555555") // Lighter dark gray on hover
        map.current.setPaintProperty("alain-boundary-fill", "fill-opacity", 0.6)
        map.current.getCanvas().style.cursor = "pointer"
      }
    })

    map.current.on("mouseleave", "alain-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("alain-boundary-fill", "fill-color", "#333333") // Back to dark gray
        map.current.setPaintProperty("alain-boundary-fill", "fill-opacity", 0.4)
        map.current.getCanvas().style.cursor = ""
      }
    })

    // Add hover effect for West Region
    map.current.on("mouseenter", "west-region-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("west-region-boundary-fill", "fill-color", "#555555") // Lighter dark gray on hover
        map.current.setPaintProperty("west-region-boundary-fill", "fill-opacity", 0.6)
        map.current.setPaintProperty("west-region-boundary-line", "line-opacity", 1)
        map.current.getCanvas().style.cursor = "pointer"
      }
    })

    map.current.on("mouseleave", "west-region-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("west-region-boundary-fill", "fill-color", "#333333") // Back to dark gray
        map.current.setPaintProperty("west-region-boundary-fill", "fill-opacity", 0.4)
        map.current.setPaintProperty("west-region-boundary-line", "line-opacity", 0.8)
        map.current.getCanvas().style.cursor = ""
      }
    })

    // Add click event for West Region
    map.current.on("click", "west-region-boundary-fill", (e) => {
      if (e.features && e.features[0].geometry.type === "Polygon") {
        const coordinates = e.features[0].geometry.coordinates as number[][][]
        const bounds = coordinates.reduce((bounds, polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as mapboxgl.LngLatLike)
            })
          })
          return bounds
        }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]))

        map.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        })
      }
    })

    // Add hover and click effects for Dubai City
    map.current.on("mouseenter", "dubai-city-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("dubai-city-boundary-fill", "fill-color", "#555555") // Lighter dark gray on hover
        map.current.setPaintProperty("dubai-city-boundary-fill", "fill-opacity", 0.6)
        map.current.setPaintProperty("dubai-city-boundary-line", "line-opacity", 1)
        map.current.getCanvas().style.cursor = "pointer"
      }
    })

    map.current.on("mouseleave", "dubai-city-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("dubai-city-boundary-fill", "fill-color", "#333333") // Back to dark gray
        map.current.setPaintProperty("dubai-city-boundary-fill", "fill-opacity", 0.4)
        map.current.setPaintProperty("dubai-city-boundary-line", "line-opacity", 0.8)
        map.current.getCanvas().style.cursor = ""
      }
    })

    map.current.on("click", "dubai-city-boundary-fill", (e) => {
      if (e.features && e.features[0].geometry.type === "Polygon") {
        const coordinates = e.features[0].geometry.coordinates as number[][][]
        const bounds = coordinates.reduce((bounds, polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as mapboxgl.LngLatLike)
            })
          })
          return bounds
        }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]))

        map.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        })
      }
    })

    // Add hover and click effects for Other Cities
    map.current.on("mouseenter", "other-cities-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("other-cities-boundary-fill", "fill-color", "#555555") // Lighter dark gray on hover
        map.current.setPaintProperty("other-cities-boundary-fill", "fill-opacity", 0.6)
        map.current.setPaintProperty("other-cities-boundary-line", "line-opacity", 1)
        map.current.getCanvas().style.cursor = "pointer"
      }
    })

    map.current.on("mouseleave", "other-cities-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("other-cities-boundary-fill", "fill-color", "#333333") // Back to dark gray
        map.current.setPaintProperty("other-cities-boundary-fill", "fill-opacity", 0.4)
        map.current.setPaintProperty("other-cities-boundary-line", "line-opacity", 0.8)
        map.current.getCanvas().style.cursor = ""
      }
    })

    map.current.on("click", "other-cities-boundary-fill", (e) => {
      if (e.features && e.features[0].geometry.type === "Polygon") {
        const coordinates = e.features[0].geometry.coordinates as number[][][]
        const bounds = coordinates.reduce((bounds, polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as mapboxgl.LngLatLike)
            })
          })
          return bounds
        }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]))

        map.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        })
      }
    })

    // Add hover and click effects for Abu Dhabi
    map.current.on("mouseenter", "abu-dhabi-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("abu-dhabi-boundary-fill", "fill-color", "#555555") // Lighter dark gray on hover
        map.current.setPaintProperty("abu-dhabi-boundary-fill", "fill-opacity", 0.6)
        map.current.setPaintProperty("abu-dhabi-boundary-line", "line-opacity", 1)
        map.current.getCanvas().style.cursor = "pointer"
      }
    })

    map.current.on("mouseleave", "abu-dhabi-boundary-fill", () => {
      if (map.current) {
        map.current.setPaintProperty("abu-dhabi-boundary-fill", "fill-color", "#333333") // Back to dark gray
        map.current.setPaintProperty("abu-dhabi-boundary-fill", "fill-opacity", 0.4)
        map.current.setPaintProperty("abu-dhabi-boundary-line", "line-opacity", 1)
        map.current.getCanvas().style.cursor = ""
      }
    })

    map.current.on("click", "abu-dhabi-boundary-fill", (e) => {
      if (e.features && e.features[0].geometry.type === "Polygon") {
        const coordinates = e.features[0].geometry.coordinates as number[][][]
        const bounds = coordinates.reduce((bounds, polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as mapboxgl.LngLatLike)
            })
          })
          return bounds
        }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]))

        map.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        })
      }
    })
  }, [mapLoaded])

  return <div ref={mapContainer} className="w-full h-[calc(100vh-4rem)]" />
}

export default UAEMap
