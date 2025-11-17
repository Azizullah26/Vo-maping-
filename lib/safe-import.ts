import type React from "react"
/**
 * Safe import utilities for handling dynamic imports with error recovery
 */

export async function safeImport<T>(importFn: () => Promise<T>, fallback: T, errorMessage?: string): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    console.error(errorMessage || "Import failed:", error)
    return fallback
  }
}

export async function safeDynamicImport<T>(modulePath: string, fallback: T): Promise<T> {
  try {
    const module = await import(modulePath)
    return module.default || module
  } catch (error) {
    console.error(`Failed to import ${modulePath}:`, error)
    return fallback
  }
}

export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null,
) {
  return {
    Component: async () => {
      try {
        const module = await importFn()
        return module.default
      } catch (error) {
        console.error("Lazy component import failed:", error)
        return () => fallback
      }
    },
  }
}
