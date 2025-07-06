"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Loader2, AlertCircle, FileText, Maximize2, Minimize2 } from "lucide-react"

interface EnhancedPDFViewerProps {
  fileUrl: string
  fileName?: string
  projectName?: string
  category?: string
  height?: string
  width?: string
  showMetadata?: boolean
}

export function EnhancedPDFViewer({
  fileUrl,
  fileName = "Document",
  projectName,
  category,
  height = "700px",
  width = "100%",
  showMetadata = true,
}: EnhancedPDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNutrientLoaded, setIsNutrientLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewerInstance, setViewerInstance] = useState<any>(null)

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
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
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
        // Configuration for UAE project documents
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
          "annotate",
          "export-pdf",
          "print",
        ],
        theme: "light",
        initialViewState: {
          zoom: "FIT_TO_WIDTH",
        },
        // Enable annotations for project collaboration
        enableAnnotations: true,
        // Custom styling for UAE project theme
        styleSheets: ["/css/pdf-viewer-custom.css"],
      })
        .then((instance: any) => {
          setViewerInstance(instance)
          setIsLoading(false)

          // Add event listeners for better integration
          instance.addEventListener("document.loaded", () => {
            console.log("PDF document loaded successfully")
          })

          instance.addEventListener("annotations.create", (annotation: any) => {
            console.log("Annotation created:", annotation)
            // Here you could save annotations to your database
          })
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
      link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setIsNutrientLoaded(false)
    setTimeout(() => setIsNutrientLoaded(true), 100)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/10 backdrop-filter backdrop-blur-md">
      {showMetadata && (
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {fileName}
              </CardTitle>
              {projectName && <p className="text-white/70 text-sm mt-1">Project: {projectName}</p>}
            </div>
            <div className="flex gap-2">
              {category && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                  {category}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="flex items-center text-white/70">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {error && (
              <Button onClick={handleRetry} variant="outline" size="sm">
                Retry
              </Button>
            )}
            <Button onClick={handleFullscreen} variant="outline" size="sm">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-center p-8 text-red-400 bg-red-500/10 rounded-lg mb-4">
            <AlertCircle className="h-8 w-8 mr-2" />
            <div>
              <p className="font-semibold">Error loading PDF</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2 opacity-70">File: {fileUrl}</p>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          style={{
            height: isFullscreen ? "100vh" : height,
            width: width,
            display: error ? "none" : "block",
          }}
          className="rounded-lg overflow-hidden border border-white/20 bg-white"
        />
      </CardContent>
    </Card>
  )
}
