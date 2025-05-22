"use client"

import { Button } from "@/components/ui/button"
import { Compass, Layers } from "lucide-react"

interface MapControlsProps {
  onResetView: () => void
  onToggleTerrain: () => void
}

export function MapControls({ onResetView, onToggleTerrain }: MapControlsProps) {
  return (
    <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-black/50 backdrop-blur-sm border-white/20 hover:bg-black/70 hover:border-white/40 text-white rounded-full h-10 w-10"
        onClick={onResetView}
        title="Reset View"
      >
        <Compass className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="bg-black/50 backdrop-blur-sm border-white/20 hover:bg-black/70 hover:border-white/40 text-white rounded-full h-10 w-10"
        onClick={onToggleTerrain}
        title="Toggle 3D View"
      >
        <Layers className="h-5 w-5" />
      </Button>
    </div>
  )
}
