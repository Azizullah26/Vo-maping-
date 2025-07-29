import { isDemoMode, isStaticMode } from "./client-env"

/**
 * Demo mode utilities for the application
 */

export function getDemoMode(): boolean {
  return isDemoMode()
}

export function getStaticMode(): boolean {
  return isStaticMode()
}

export function shouldUseDemoData(): boolean {
  return isDemoMode() || isStaticMode()
}

export function getDemoConfig() {
  return {
    demoMode: getDemoMode(),
    staticMode: getStaticMode(),
    useDemoData: shouldUseDemoData(),
  }
}

// Export for backward compatibility
export const DEMO_MODE = getDemoMode()
export const STATIC_MODE = getStaticMode()
