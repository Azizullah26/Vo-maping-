"use client"
import MapComponent from "./MapComponent"

export default function AbuDhabiMap() {
  return <MapComponent center={[54.37, 24.474]} zoom={12} style="mapbox://styles/mapbox/streets-v11" />
}
