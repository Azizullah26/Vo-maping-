"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface DocumentPreviewProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: string | number
    name: string
    type: string
    url: string
  }
}

export function DocumentPreview({ isOpen, onClose, document }: DocumentPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const isPdf = document.type === "PDF" || document.name.toLowerCase().endsWith(".pdf")
  const isImage = ["JPG", "JPEG", "PNG", "GIF"].includes(document.type) || /\.(jpg|jpeg|png|gif)$/i.test(document.name)
  const isOffice =
    ["DOCX", "DOC", "XLSX", "XLS", "PPTX", "PPT"].includes(document.type) ||
    /\.(docx|doc|xlsx|xls|pptx|ppt)$/i.test(document.name)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] flex flex-col p-0 gap-0 bg-gray-100">
        <DialogHeader className="p-4 bg-[#1B1464] text-white flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold">{document.name}</DialogTitle>
            <DialogDescription className="text-gray-200">{document.type} Document</DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="text-white hover:bg-white/20">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="text-white hover:bg-white/20">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRotate} className="text-white hover:bg-white/20">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => window.open(document.url, "_blank")}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4 min-h-[60vh] bg-gray-100 flex items-center justify-center">
          {isPdf && (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-white shadow-md rounded-md overflow-hidden">
                <iframe
                  src={`${document.url}#page=${currentPage}`}
                  className="w-full h-full border-0"
                  title={document.name}
                />
              </div>
              <div className="flex justify-between items-center mt-4 px-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <span className="text-sm">Page {currentPage}</span>
                <Button variant="outline" onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {isImage && (
            <div
              className="relative transition-all duration-300 bg-white shadow-md p-4 rounded-md"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transformOrigin: "center",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <Image
                src={document.url || "/placeholder.svg"}
                alt={document.name}
                width={800}
                height={600}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          )}

          {isOffice && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Office Document Preview</h3>
                <p className="text-gray-500 mb-4">This document type cannot be previewed directly.</p>
                <Button
                  onClick={() => window.open(document.url, "_blank")}
                  className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                >
                  <Download className="h-4 w-4 mr-2" /> Download Document
                </Button>
              </div>
            </div>
          )}

          {!isPdf && !isImage && !isOffice && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Unsupported File Type</h3>
              <p className="text-gray-500 mb-4">This document type cannot be previewed.</p>
              <Button
                onClick={() => window.open(document.url, "_blank")}
                className="bg-[#1B1464] hover:bg-[#1B1464]/90"
              >
                <Download className="h-4 w-4 mr-2" /> Download Document
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
