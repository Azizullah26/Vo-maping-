"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, FileIcon, ImageIcon, VideoIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UploadedFile {
  id: string
  name: string
  type: "image" | "video" | "document"
  size: number
  projectId: string
  uploadDate: string
  status: "uploading" | "success" | "error"
  url?: string
}

export default function MediaUploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const projects = [
    { id: "prj-001", name: "Al Ain Police Headquarters" },
    { id: "prj-002", name: "Al Saad Police Center" },
    { id: "prj-003", name: "Hili Police Station" },
    { id: "prj-004", name: "Al Ain Development Project" },
    { id: "prj-005", name: "Cultural Infrastructure" },
  ]

  const getFileType = (file: File): "image" | "video" | "document" => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    return "document"
  }

  const getFileIcon = (type: "image" | "video" | "document") => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-cyan-400" />
      case "video":
        return <VideoIcon className="w-5 h-5 text-purple-400" />
      default:
        return <FileIcon className="w-5 h-5 text-emerald-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const handleUpload = async () => {
    if (!selectedProject || files.length === 0) {
      alert("Please select a project and files to upload")
      return
    }

    setIsUploading(true)
    const uploaded: UploadedFile[] = []

    for (const file of files) {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const fileType = getFileType(file)

      // Simulate upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress((prev) => ({ ...prev, [fileId]: i }))
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        size: file.size,
        projectId: selectedProject,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "success",
        url: URL.createObjectURL(file),
      }

      uploaded.push(uploadedFile)
      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))
    }

    setUploadedFiles([...uploadedFiles, ...uploaded])
    setFiles([])
    setIsUploading(false)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_60%)] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="relative z-20 sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800/50 border border-cyan-500/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Media Upload
              </h1>
              <p className="text-cyan-300 text-sm">Upload project media and documents to Supabase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-lg p-6 shadow-lg shadow-cyan-900/20 mb-8">
          <h2 className="text-lg font-semibold mb-6 text-cyan-300">Upload Media to Project</h2>

          {/* Project Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-cyan-300 mb-2">Select Project</label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                <SelectValue placeholder="Choose a project..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/90 border-cyan-500/30">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-cyan-300 mb-3">Select Files</label>
            <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-400/50 transition-colors cursor-pointer bg-slate-800/20">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
                disabled={isUploading}
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto mb-2 text-cyan-400" />
                <p className="text-cyan-300 font-medium">Click to select files or drag & drop</p>
                <p className="text-cyan-300/70 text-sm">Images, videos, and documents supported</p>
              </label>
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-cyan-300 mb-3">Selected Files ({files.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3 border border-cyan-500/10">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(getFileType(file))}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-cyan-300 truncate">{file.name}</p>
                        <p className="text-xs text-cyan-300/60">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-red-400 hover:text-red-300 transition-colors ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0 || !selectedProject}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-6 shadow-lg shadow-emerald-900/20">
            <h2 className="text-lg font-semibold mb-4 text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Successfully Uploaded ({uploadedFiles.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file) => {
                const project = projects.find((p) => p.id === file.projectId)
                return (
                  <div key={file.id} className="bg-slate-700/30 rounded-lg p-3 border border-emerald-500/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-emerald-300 font-medium truncate">{file.name}</p>
                          <p className="text-xs text-emerald-300/60">{formatFileSize(file.size)}</p>
                          <p className="text-xs text-cyan-300/70">{project?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-xs text-emerald-300/60">{file.uploadDate}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
