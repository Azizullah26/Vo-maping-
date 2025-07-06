"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import * as ol from "ol"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import { OSM, Vector as VectorSource } from "ol/source"
import { Point } from "ol/geom"
import { fromLonLat } from "ol/proj"
import "ol/ol.css"

interface MapWeatherProps {
  latitude: number
  longitude: number
}

const MapWeather: React.FC<MapWeatherProps> = ({ latitude, longitude }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const map = useRef<ol.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      const initialCoordinates = fromLonLat([longitude, latitude])

      map.current = new ol.Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new ol.View({
          center: initialCoordinates,
          zoom: 10,
        }),
      })

      // Add a marker
      const marker = new ol.Feature({
        geometry: new Point(initialCoordinates),
      })

      const vectorSource = new VectorSource({
        features: [marker],
      })

      const markerLayer = new VectorLayer({
        source: vectorSource,
      })

      map.current.addLayer(markerLayer)
    }

    return () => {
      if (map.current) {
        map.current.dispose()
      }
    }
  }, [latitude, longitude])

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
}

export { MapWeather }
export default MapWeather
