import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts any value to a string for rendering
 * Prevents "[object Error]" React rendering issues
 */
export function safeRender(value: unknown): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"

  if (value instanceof Error) {
    return value.message || String(value)
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value)
    } catch (e) {
      return "[Complex Object]"
    }
  }

  return String(value)
}
