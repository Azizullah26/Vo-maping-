"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CuboidIcon as Cube, Radio, FileText, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import Image from "next/image"
import { TopNav } from "@/components/TopNav"
import styles from "@/styles/saadiyat-view.module.css"
import { cn } from "@/lib/utils"

const projectDetails = {
  name: "Zayed National Museum",
  startDate: "2023-01-15",
  endDate: "2025-06-30",
  progress: 35,
  teamMembers: 150,
  contractorName: "EL RACE",
  contractEngineer: "Mohammed Al Hashimi",
  policeDepartmentEngineer: "Khalid Al Mansoori",
  challenges: "Structural engineering, Environmental control systems",
  amount: 500000000,
  workOrderNumber: "WO-2023-001",
}

const images = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dfOaaHUYBV5CkIRnOXNUlhlgAAyxek.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/looking-south-to-zayed-national-cxYxt7S1aFm4n6ANr6Rf5St8JFQxxW.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/znm3-0PIm0GFbhL6ajV87Z5o0dQRK9AuysH.png",
]

const documents = [
  {
    title: "Zayed National Museum Overview",
    type: "image",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Zayed-National.jpg-h5g2Fd3RhcRX8esoWl1MwlYlAZpjCo.jpeg",
  },
  {
    title: "Project Documentation",
    type: "pdf",
    url: "/documents/project-doc.pdf",
  },
]

export default function ZayedNationalMuseumPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showDocuments, setShowDocuments] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const router = useRouter()

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300/50 via-orange-300/50 to-fuchsia-900/50">
      <TopNav />
      <Button
        onClick={() => router.push("/abu-dhabi")}
        className="fixed top-20 left-4 z-50 bg-[#1B1464] hover:bg-[#1B1464]/80 text-white rounded-full w-10 h-10 p-0"
        aria-label="Back to Abu Dhabi Map"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="container mx-auto px-4 py-8 mt-8">
        <h1 className="text-4xl font-bold mb-6 text-[#1b1f3a] mt-4">Zayed National Museum</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-filter backdrop-blur-md">
            <CardContent className="p-4">
              <Carousel className="w-full" onSelect={(index) => setActiveIndex(index)}>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Zayed National Museum architectural view ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
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
          <Card className="bg-white/10 backdrop-filter backdrop-blur-md">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#1b1f3a]">Project Details</h2>
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
        </div>
        <div className="mt-8 flex flex-col items-center">
          <ul className={`${styles.iconList} mb-4`}>
            <li className={styles.iconItem}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <Cube className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>3D</p>
            </li>
            <li className={styles.iconItem}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <Radio className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>Live</p>
            </li>
            <li className={styles.iconItem} onClick={() => setShowDocuments(!showDocuments)}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.iconSpan}>
                  <FileText className={styles.icon} />
                </span>
              ))}
              <p className={styles.label}>Documents</p>
            </li>
          </ul>
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
          <div className="flex-1 overflow-auto p-4">
            <div
              className="relative w-full transition-transform duration-300 ease-in-out"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transformOrigin: "top left",
              }}
            >
              <Image
                src={documents[0].url || "/placeholder.svg"}
                alt="Zayed National Museum Document"
                width={1200}
                height={1600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
