"use client"
import MapComponent from "./MapComponent"

export default function UAEMap() {
  return <MapComponent center={[54.37, 24.474]} zoom={7} style="mapbox://styles/mapbox/streets-v11" />
}
