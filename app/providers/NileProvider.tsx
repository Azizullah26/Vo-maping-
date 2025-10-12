"use client"

import { NileContext } from "@niledatabase/react"
import type { ReactNode } from "react"

interface NileProviderProps {
  children: ReactNode
  basePath?: string
}

export function NileProvider({ children, basePath = "/api/nile" }: NileProviderProps) {
  return <NileContext.Provider value={{ basePath }}>{children}</NileContext.Provider>
}
