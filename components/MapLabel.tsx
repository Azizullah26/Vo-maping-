"use client"

import type React from "react"

interface MapLabelProps {
  id: string
  text: string
  position: { top: number; left: number }
  size: { width: number; height: number }
  onClick: () => void
  onHover: (id: string | null) => void
  hoveredLabel: string | null
  fontSize?: number
}

export const MapLabel: React.FC<MapLabelProps> = ({
  id,
  text,
  position,
  size,
  onClick,
  onHover,
  hoveredLabel,
  fontSize = 14,
}) => {
  const getElementOpacity = (elementId?: string) => {
    if (!hoveredLabel) return "opacity-100"
    return hoveredLabel === elementId ? "opacity-100" : "opacity-30"
  }

  const getElementScale = (elementId?: string) => {
    if (!hoveredLabel) return "scale-100"
    return hoveredLabel === elementId ? "scale-110" : "scale-95"
  }

  const getLabelClasses = (labelId: string) => {
    const baseClasses =
      "group flex items-center justify-center px-3 py-2 bg-white hover:bg-black rounded-full border-2 border-solid transition-all duration-300 cursor-pointer font-sans font-medium"
    const isHovered = hoveredLabel === labelId

    if (isHovered) {
      return `${baseClasses} shadow-lg shadow-blue-500/50 ring-2 ring-blue-400 z-50 scale-110`
    }

    return `${baseClasses} ${getElementOpacity(labelId)} ${getElementScale(labelId)}`
  }

  const getTextClasses = () => {
    return "text-black group-hover:text-white tracking-normal leading-snug whitespace-nowrap overflow-hidden text-ellipsis font-sans font-semibold antialiased"
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className={getLabelClasses(id)}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <span className={`text-[${fontSize}px] ${getTextClasses()}`}>{text}</span>
    </button>
  )
}
