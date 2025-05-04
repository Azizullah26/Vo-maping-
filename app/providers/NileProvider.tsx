"use client"

import type { ReactNode } from "react"

interface NileProviderProps {
  children: ReactNode
  basePath?: string
}

// This is now just a pass-through component that doesn't use Nile
export function NileProvider({ children }: NileProviderProps) {
  return <>{children}</>
}
