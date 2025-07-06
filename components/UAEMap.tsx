"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import * as ol from "ol"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import "ol/ol.css"

const UAEMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      map.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: ol.proj.fromLonLat([54.366669, 24.466667]), // Abu Dhabi coordinates
          zoom: 7,
        }),
      })
    }

    return () => {
      if (map.current) {
        map.current.dispose()
      }
    }
  }, [])

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
}

export default UAEMap
