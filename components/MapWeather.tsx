"use client"

import { Sun } from "lucide-react"

export function MapWeather() {
  // Get current date and time
  const now = new Date()
  const day = now.toLocaleDateString("en-US", { weekday: "short" })
  const date = now.getDate()
  const month = now.toLocaleDateString("en-US", { month: "short" })
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })

  return (
    <div className="flex flex-col items-start">
      <div className="text-white/80 text-sm">
        {day}
        <span className="ml-2">
          {date} {month}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-4xl font-bold text-white">33°C</span>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Sun className="h-4 w-4 text-yellow-400" />
            <span className="text-white/80 text-xs">Clear sky</span>
          </div>
          <span className="text-white/60 text-xs">{time}</span>
        </div>
      </div>
    </div>
  )
}
