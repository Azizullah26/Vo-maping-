"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Document {
  id: string
  name: string
  type: string
  size: string
  date: string
  url: string
  project: string
}

interface DocumentPreviewProps {
  isOpen: boolean
  onClose: () => void
  document: Document
}

export function DocumentPreview({ isOpen, onClose, document }: DocumentPreviewProps) {
  if (!isOpen) return null

  const isImage = ["JPG", "JPEG", "PNG", "GIF"].includes(document.type)
  const isPDF = document.type === "PDF"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{document.name}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 min-h-[300px] flex items-center justify-center">
          {isImage ? (
            <img
              src={document.url || "/placeholder.svg"}
              alt={document.name}
              className="max-w-full max-h-[70vh] object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src =
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg"
              }}
            />
          ) : isPDF ? (
            <iframe
              src={document.url}
              className="w-full h-[70vh]"
              title={document.name}
              onError={() => {
                // We can't easily handle iframe errors, so we'll just let it show the browser's error page
              }}
            />
          ) : (
            <div className="text-center p-8">
              <p className="mb-4">Preview not available for this file type.</p>
              <Button onClick={() => window.open(document.url, "_blank")}>Download to View</Button>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              {document.type} • {document.size} • Uploaded: {document.date}
            </p>
          </div>
          <Button onClick={() => window.open(document.url, "_blank")}>Download</Button>
        </div>
      </div>
    </div>
  )
}
