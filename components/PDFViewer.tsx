"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Loader2, AlertCircle } from "lucide-react"

interface PDFViewerProps {
  fileUrl: string
  height?: string
  width?: string
}

export function PDFViewer({ fileUrl, height = "600px", width = "100%" }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNutrientLoaded, setIsNutrientLoaded] = useState(false)

  // Load Nutrient Web SDK script
  useEffect(() => {
    const loadNutrientSDK = () => {
      if (window.NutrientViewer) {
        setIsNutrientLoaded(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://cdn.nutrient.io/web-sdk/latest/nutrient-web-sdk.js"
      script.async = true
      script.onload = () => {
        setIsNutrientLoaded(true)
      }
      script.onerror = () => {
        setError("Failed to load Nutrient Web SDK")
        setIsLoading(false)
      }
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }

    loadNutrientSDK()
  }, [])

  // Initialize PDF viewer when SDK is loaded
  useEffect(() => {
    if (!isNutrientLoaded || !containerRef.current || !fileUrl) return

    const container = containerRef.current
    const { NutrientViewer } = window

    if (container && NutrientViewer) {
      setIsLoading(true)
      setError(null)

      NutrientViewer.load({
        container,
        document: fileUrl,
        // Additional configuration options
        licenseKey: "YOUR_LICENSE_KEY", // Replace with your actual license key
        toolbarItems: [
          "sidebar-thumbnails",
          "sidebar-document-outline",
          "sidebar-annotations",
          "pager",
          "pan",
          "zoom-out",
          "zoom-in",
          "zoom-mode",
          "spacer",
          "search",
          "export-pdf",
          "print",
        ],
        theme: "light",
        initialViewState: {
          zoom: "FIT_TO_WIDTH",
        },
      })
        .then(() => {
          setIsLoading(false)
        })
        .catch((loadError: Error) => {
          console.error("Error loading PDF:", loadError)
          setError(`Failed to load PDF: ${loadError.message}`)
          setIsLoading(false)
        })
    }

    // Cleanup function
    return () => {
      if (NutrientViewer && container) {
        try {
          NutrientViewer.unload(container)
        } catch (unloadError) {
          console.warn("Error unloading PDF viewer:", unloadError)
        }
      }
    }
  }, [isNutrientLoaded, fileUrl])

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a")
      link.href = fileUrl
      link.download = fileUrl.split("/").pop() || "document.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    // Force re-render by updating a state
    setIsNutrientLoaded(false)
    setTimeout(() => setIsNutrientLoaded(true), 100)
  }

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white/10 backdrop-filter backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">PDF Document Viewer</h3>
          <div className="flex gap-2">
            {error && (
              <Button onClick={handleRetry} variant="outline" size="sm">
                Retry
              </Button>
            )}
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-white mr-2" />
            <span className="text-white">Loading PDF viewer...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center p-8 text-red-400">
            <AlertCircle className="h-8 w-8 mr-2" />
            <div>
              <p className="font-semibold">Error loading PDF</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2">File URL: {fileUrl}</p>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          style={{
            height: height,
            width: width,
            display: isLoading || error ? "none" : "block",
          }}
          className="rounded-lg overflow-hidden border border-white/20"
        />
      </CardContent>
    </Card>
  )
}
