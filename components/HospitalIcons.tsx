"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface HospitalIconsProps {
  className?: string
  icon: React.ReactNode
  property1?: string
  iconType?: string
}

export function HospitalIcons({ className, icon, property1 = "default", iconType = "hospital" }: HospitalIconsProps) {
  return (
    <div
      className={cn(
        "relative w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg",
        "flex items-center justify-center cursor-pointer",
        "hover:bg-white hover:scale-110 transition-all duration-300",
        "border border-white/20",
        className,
      )}
    >
      <div className="text-gray-700 hover:text-black transition-colors duration-300">{icon}</div>
    </div>
  )
}

// Also export as default for compatibility
export default HospitalIcons
