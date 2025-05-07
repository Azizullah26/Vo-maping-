// This file handles dynamic imports for browser-only libraries

// Function to dynamically import html2canvas
export async function getHtml2Canvas() {
  // Only import in browser environment
  if (typeof window !== "undefined") {
    try {
      const html2canvasModule = await import("html2canvas")
      return html2canvasModule.default
    } catch (error) {
      console.error("Failed to load html2canvas:", error)
      // Return mock implementation
      return async (element: HTMLElement) => {
        console.warn("html2canvas is mocked and will not produce actual output")
        const canvas = document.createElement("canvas")
        canvas.width = 800
        canvas.height = 600
        return canvas
      }
    }
  }
  return null
}

// Function to dynamically import canvg
export async function getCanvg() {
  // Only import in browser environment
  if (typeof window !== "undefined") {
    try {
      const canvgModule = await import("canvg")
      return canvgModule.Canvg
    } catch (error) {
      console.error("Failed to load canvg:", error)
      // Return mock implementation
      return {
        fromString: (ctx: CanvasRenderingContext2D, svg: string) => {
          console.warn("canvg is mocked and will not render actual SVG")
          return {
            render: () => Promise.resolve(),
            stop: () => {},
          }
        },
      }
    }
  }
  return null
}
