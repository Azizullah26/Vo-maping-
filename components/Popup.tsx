"use client"

import Image from "next/image"
import { X } from "lucide-react"

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  image: string
}

export function Popup({ isOpen, onClose, title, description, image }: PopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close popup</span>
        </button>
        <div className="relative h-48 w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
