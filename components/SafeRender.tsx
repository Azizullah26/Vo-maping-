"use client"

import type React from "react"

interface SafeRenderProps {
  value: any
  fallback?: React.ReactNode
}

export function SafeRender({ value, fallback = "Error" }: SafeRenderProps) {
  try {
    if (value === null) return <>null</>
    if (value === undefined) return <>undefined</>

    if (value instanceof Error) {
      return <>{value.message || String(value)}</>
    }

    if (typeof value === "object") {
      try {
        return <>{JSON.stringify(value)}</>
      } catch (e) {
        return <>{fallback}</>
      }
    }

    return <>{String(value)}</>
  } catch (error) {
    console.error("Error in SafeRender:", error)
    return <>{fallback}</>
  }
}
