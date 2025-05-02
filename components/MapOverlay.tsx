"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type mapboxgl from "mapbox-gl"
import MapMarker from "./MapMarker"

interface Project {
  name: string
  coordinates: [number, number]
  size?: "small" | "medium" | "large"
  colorIndex: number
}

interface MapOverlayProps {
  map: mapboxgl.Map | null
  projects: Project[]
  activeProject?: string
}

const MapOverlay: React.FC<MapOverlayProps> = ({ map, projects, activeProject }) => {
  const [projectPoints, setProjectPoints] = useState<Project & { point: { x: number; y: number } }[]>([])

  const updateProjectPoints = useCallback(() => {
    if (map) {
      const points = projects
        .map((project) => {
          if (!project.coordinates || project.coordinates.length !== 2) {
            console.warn(`Invalid coordinates for project: ${project.name}`)
            return null
          }
          try {
            const point = map.project(project.coordinates as mapboxgl.LngLatLike)
            if (!point || typeof point.x !== "number" || typeof point.y !== "number") {
              console.warn(`Invalid projected point for project: ${project.name}`)
              return null
            }
            return {
              ...project,
              point,
            }
          } catch (error) {
            console.error(`Error projecting coordinates for ${project.name}:`, error)
            return null
          }
        })
        .filter((point): point is Project & { point: { x: number; y: number } } => point !== null)
      setProjectPoints(points)
    }
  }, [map, projects])

  useEffect(() => {
    if (map) {
      updateProjectPoints()
      map.on("move", updateProjectPoints)
      map.on("zoom", updateProjectPoints)
      map.on("resize", updateProjectPoints)

      return () => {
        map.off("move", updateProjectPoints)
        map.off("zoom", updateProjectPoints)
        map.off("resize", updateProjectPoints)
      }
    }
  }, [map, updateProjectPoints])

  if (!map || projectPoints.length === 0) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {projectPoints.map((project) => (
        <MapMarker
          key={project.name}
          x={project.point.x}
          y={project.point.y}
          name={project.name}
          size={project.size}
          isActive={project.name === activeProject}
          colorIndex={project.colorIndex}
        />
      ))}
    </div>
  )
}

export default MapOverlay
