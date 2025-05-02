"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CuboidIcon as Cube,
  FileText,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ImageIcon,
  Download,
  Eye,
} from "lucide-react"
import Image from "next/image"
import { TopNav } from "@/components/TopNav"
import { cn } from "@/lib/utils"
import { DocumentPreview } from "@/components/DocumentPreview"
import { Skeleton } from "@/components/ui/skeleton"
import { SaadPoliceStationMap } from "@/components/SaadPoliceStationMap"
import { AnimatedButton } from "@/components/AnimatedButton"

const projectDetails = {
  id: "saad-police-station",
  name: "مركز شرطة الساد",
  startDate: "2023-03-15",
  endDate: "2024-12-30",
  progress: 45,
  teamMembers: 75,
  contractorName: "EL RACE",
  contractEngineer: "Ahmed Al Shamsi",
  policeDepartmentEngineer: "Mohammed Al Dhaheri",
  challenges: "Site accessibility, Desert environment conditions",
  amount: 25000000,
  workOrderNumber: "WO-2023-015",
  coordinates: [55.5789, 24.1942], // Added coordinates for the map
}

const images = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alain%205-YfHNRkcz5hlQXfxrwZJFksDu9n1Dw5.png", // Actual building photo
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alain%203-snIxFxIo9F8zHhX4vaqZ3viOIMf0tX.png", // Aerial city view
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alain%204-wnferl475ULBxIGWEk00snirHGi1Ci.png", // 3D rendering
]

// Document type definition
interface Document {
  id: string
  name: string
  type: string
  size: string | number
  date: string
  url: string
  project: string
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
}

export default function SaadPoliceStationPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showDocuments, setShowDocuments] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"live" | "3d" | "documents">("live")

  // Add state for document preview
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  const setDemoDocuments = () => {
    setDocuments([
      {
        id: "1",
        name: "Project Overview.pdf",
        type: "PDF",
        size: "2.4 MB",
        date: "2023-12-15",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطة الساد",
      },
      {
        id: "2",
        name: "Construction Blueprint.pdf",
        type: "PDF",
        size: "5.7 MB",
        date: "2023-12-10",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
        project: "مركز شرطة الساد",
      },
      {
        id: "3",
        name: "Site Photos.jpg",
        type: "JPG",
        size: "12.8 MB",
        date: "2023-11-28",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
        project: "مركز شرطة الساد",
      },
    ])
  }

  // Fetch documents from Supabase
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)

        try {
          // Fetch documents from Nile API for the Saad Police Station project
          const response = await fetch("/api/nile/documents/project/saad-police-station")

          if (!response.ok) {
            console.warn(`API returned status ${response.status}. Using demo data instead.`)
            throw new Error(`Failed to fetch documents: ${response.status}`)
          }

          const result = await response.json()

          if (result.success && result.data && result.data.length > 0) {
            // Format documents
            const formattedDocs = result.data.map((doc) => ({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              size: formatFileSize(doc.size),
              date: new Date(doc.created_at).toLocaleDateString(),
              url: doc.file_path,
              project: doc.project_name,
            }))

            setDocuments(formattedDocs)
          } else {
            // No documents found, use demo data
            console.log("No documents found. Using demo data.")
            setDemoDocuments()
          }
        } catch (err) {
          console.error("Error fetching documents:", err)
          console.log("Failed to fetch documents. Using demo data.")
          setDemoDocuments()
          // Don't set error state here to avoid showing error message
        } finally {
          setLoading(false)
        }
      } catch (finalErr) {
        console.error("Critical error in document handling:", finalErr)
        setLoading(false)
        setError("An unexpected error occurred. Please try again later.")
      }
    }

    fetchDocuments()

    // Listen for custom document update events from admin page
    const handleDocumentUpdate = (e: CustomEvent) => {
      console.log("Document update event received:", e.detail)
      if (e.detail && Array.isArray(e.detail)) {
        const updatedDocs = e.detail.filter((doc) => doc.project === projectDetails.name)
        if (updatedDocs.length > 0) {
          setDocuments(updatedDocs)
        }
      }
    }

    window.addEventListener("documentUpdate" as any, handleDocumentUpdate as any)

    return () => {
      window.removeEventListener("documentUpdate" as any, handleDocumentUpdate as any)
    }
  }, [])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document)
  }

  const handleDownloadDocument = (document: Document) => {
    window.open(document.url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300/50 via-orange-300/50 to-fuchsia-900/50">
      <TopNav />
      <Button
        onClick={() => router.push("/al-ain")}
        className="fixed top-20 left-4 z-50 bg-[#1B1464]/80 hover:bg-[#1B1464] text-white rounded-full w-10 h-10 p-0 shadow-lg transition-all duration-300 hover:scale-105"
        aria-label="Back to Al Ain Map"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="container mx-auto px-4 py-8 mt-8">
        <h1 className="text-4xl font-bold mb-6 text-[#1b1f3a] mt-4 text-right">مركز شرطة الساد</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Project Details */}
          <Card className="bg-white/10 backdrop-filter backdrop-blur-md">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#1b1f3a] text-center">Project Details</h2>
              <div className="space-y-2 text-[#1b1f3a]">
                <p>
                  <strong className="text-[#1e549f]">Project Name:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.name}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Start Date:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.startDate}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">End Date:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.endDate}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Progress:</strong>{" "}
                  <span className="text-[#a64942]">{projectDetails.progress}%</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Team Members:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.teamMembers}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Contractor Name:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.contractorName}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Contract Engineer:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.contractEngineer}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Police Department Engineer:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.policeDepartmentEngineer}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Challenges:</strong>{" "}
                  <span className="text-[#1b1f3a]">{projectDetails.challenges}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Amount:</strong>{" "}
                  <span className="text-[#a64942]">AED {projectDetails.amount.toLocaleString()}</span>
                </p>
                <p>
                  <strong className="text-[#1e549f]">Work Order Number:</strong>{" "}
                  <span className="text-[#ff7844]">{projectDetails.workOrderNumber}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Middle - Image Slider */}
          <Card className="bg-white/10 backdrop-filter backdrop-blur-md">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#1b1f3a] text-center">Project Images</h2>
              <Carousel className="w-full" onSelect={(index) => setActiveIndex(index)}>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={
                            index === 0
                              ? "Front view of Saad Police Station building"
                              : index === 1
                                ? "Aerial view of Al Ain city"
                                : "3D architectural rendering of Saad Police Station"
                          }
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          {/* Right side - Map Widget */}
          <Card className="bg-white/10 backdrop-filter backdrop-blur-md">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#1b1f3a] text-center">Location</h2>
              <div className="w-full h-[300px] rounded-lg overflow-hidden">
                <SaadPoliceStationMap coordinates={projectDetails.coordinates as [number, number]} />
              </div>
              <p className="text-center text-sm mt-2 text-gray-700">Satellite view of مركز شرطة الساد</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex flex-wrap gap-8 mb-6 mt-4 justify-center">
            <AnimatedButton onClick={() => setActiveTab("live")} icon={<Eye className="h-4 w-4" />}>
              Live
            </AnimatedButton>
            <AnimatedButton onClick={() => setActiveTab("3d")} icon={<Cube className="h-4 w-4" />}>
              3D
            </AnimatedButton>
            <AnimatedButton
              onClick={() => {
                setActiveTab("documents")
                setShowDocuments(true)
              }}
              icon={<FileText className="h-4 w-4" />}
            >
              Documents
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Document Viewer Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
          showDocuments ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-[#1b1f3a] text-white">
            <h3 className="text-xl font-semibold">Project Documents</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                className="text-white hover:bg-white/20"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                className="text-white hover:bg-white/20"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRotate}
                className="text-white hover:bg-white/20"
                aria-label="Rotate"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDocuments(false)}
                className="text-white hover:bg-white/20"
                aria-label="Close documents panel"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Document list */}
          <div className="p-4 border-b bg-gray-50">
            <h4 className="text-lg font-medium mb-2">Available Documents</h4>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                <p>{error}</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setError(null)
                    setDemoDocuments()
                  }}
                >
                  Load Demo Documents
                </Button>
              </div>
            ) : documents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No documents available for this project.</div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handlePreviewDocument(doc)}
                  >
                    {doc.type === "PDF" ? (
                      <FileText className="h-10 w-10 p-2 bg-red-100 text-red-500 rounded-md" />
                    ) : doc.type === "DOCX" || doc.type === "DOC" ? (
                      <FileText className="h-10 w-10 p-2 bg-blue-100 text-blue-500 rounded-md" />
                    ) : doc.type === "XLSX" || doc.type === "XLS" ? (
                      <FileText className="h-10 w-10 p-2 bg-green-100 text-green-500 rounded-md" />
                    ) : doc.type === "JPG" || doc.type === "JPEG" || doc.type === "PNG" ? (
                      <ImageIcon className="h-10 w-10 p-2 bg-purple-100 text-purple-500 rounded-md" />
                    ) : (
                      <FileText className="h-10 w-10 p-2 bg-gray-100 text-gray-500 rounded-md" />
                    )}

                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{doc.name}</h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewDocument(doc)
                        }}
                        aria-label={`Preview ${doc.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadDocument(doc)
                        }}
                        aria-label={`Download ${doc.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document preview area */}
          <div className="flex-1 overflow-auto p-4 bg-gray-100">
            {previewDocument ? (
              previewDocument.type === "JPG" || previewDocument.type === "JPEG" || previewDocument.type === "PNG" ? (
                <div
                  className="relative w-full transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: "top left",
                  }}
                >
                  <Image
                    src={previewDocument.url || "/placeholder.svg"}
                    alt={previewDocument.name}
                    width={1200}
                    height={1600}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              ) : previewDocument.type === "PDF" ? (
                <iframe
                  src={`${previewDocument.url}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full min-h-[600px] border-0"
                  title={previewDocument.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{previewDocument.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">This document type cannot be previewed directly.</p>
                    <Button className="bg-[#1B1464]" onClick={() => handleDownloadDocument(previewDocument)}>
                      Download Document
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Select a document to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Dialog */}
      {previewDocument && (
        <DocumentPreview
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          document={previewDocument}
        />
      )}
    </div>
  )
}
