"use client"
import MapComponent from "./MapComponent"

export default function AlAinMap() {
  return <MapComponent center={[55.76, 24.13]} zoom={12} style="mapbox://styles/mapbox/streets-v11" />
}
