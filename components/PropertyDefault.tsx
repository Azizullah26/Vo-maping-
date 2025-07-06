"use client"

import type React from "react"

interface PropertyDefaultProps {
  className?: string
  variant?: "default" | "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

export const PropertyDefault: React.FC<PropertyDefaultProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  return null
}

// Named export

// Default export
export default PropertyDefault
