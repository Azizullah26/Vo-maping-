// Mock implementation for html2canvas
export const html2canvas = async (element) => {
  console.warn("html2canvas is mocked and will not produce actual output")
  const canvas = document.createElement("canvas")
  canvas.width = 800
  canvas.height = 600
  return canvas
}

// Mock implementation for canvg
export const Canvg = {
  fromString: (ctx, svg) => {
    console.warn("canvg is mocked and will not render actual SVG")
    return {
      render: () => Promise.resolve(),
      stop: () => {},
    }
  },
}

export default {
  html2canvas,
  Canvg,
}
