"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, X, FileText, File, ImageIcon } from "lucide-react"

export default function UploadDocumentPage() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (id) => {
    const updatedFiles = files.filter((file) => file.id !== id)
    setFiles(updatedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload")
      return
    }

    setUploading(true)
    setError("")
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      // In a real implementation, you would upload the files to your API
      // For example:
      // const formData = new FormData()
      // files.forEach(file => formData.append('files', file.file))
      // const response = await fetch('/api/documents/upload', {
      //   method: 'POST',
      //   body: formData
      // })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(interval)
      setUploadProgress(100)
      setUploadComplete(true)

      // Reset after showing success message
      setTimeout(() => {
        setFiles([])
        setUploading(false)
        setUploadProgress(0)
        setUploadComplete(false)
      }, 3000)
    } catch (err) {
      setError("Failed to upload files. Please try again.")
      setUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-6 w-6 text-blue-400" />
    if (fileType.includes("pdf")) return <FileText className="h-6 w-6 text-red-400" />
    if (fileType.includes("word") || fileType.includes("doc")) return <FileText className="h-6 w-6 text-cyan-400" />
    return <File className="h-6 w-6 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/al-ain/documents"
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Documents</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Upload Documents</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Upload area */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/30 mb-8">
          <div
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Drag and drop files here</h3>
            <p className="text-slate-400 mb-4">or click to browse your files</p>
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors">
              Select Files
            </button>
          </div>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/30 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Selected Files</h2>

            <div className="space-y-3 mb-6">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                  <div className="flex items-center">
                    {getFileIcon(file.type)}
                    <div className="ml-3">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 bg-slate-600/50 text-slate-300 rounded-md hover:bg-red-900/50 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-900/30 text-red-300 p-3 rounded-md mb-4">{error}</div>
            )}

            {uploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Uploading...</span>
                  <span className="text-cyan-400">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadComplete && (
              <div className="bg-green-900/20 border border-green-900/30 text-green-300 p-3 rounded-md mb-4">
                Files uploaded successfully!
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className={`px-6 py-2 bg-cyan-600 text-white rounded-md transition-colors ${
                  uploading || files.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-cyan-700"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </button>
            </div>
          </div>
        )}

        {/* Upload tips */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/30">
          <h2 className="text-xl font-bold text-white mb-4">Upload Tips</h2>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-cyan-900/50 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-cyan-400">1</span>
              </div>
              <p>You can upload multiple files at once</p>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-cyan-900/50 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-cyan-400">2</span>
              </div>
              <p>Supported file types: PDF, Word, Excel, PowerPoint, Images</p>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-cyan-900/50 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-cyan-400">3</span>
              </div>
              <p>Maximum file size: 50MB per file</p>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-cyan-900/50 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-cyan-400">4</span>
              </div>
              <p>Files will be associated with the current project</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
