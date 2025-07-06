"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function DocumentUploadPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "plans", // Updated default value
    project: "16-projects", // Updated default value
    tags: "",
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-fill name if empty
      if (!formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    setUploadStatus("idle")

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", selectedFile)
      uploadFormData.append("name", formData.name)
      uploadFormData.append("description", formData.description)
      uploadFormData.append("category", formData.category)
      uploadFormData.append("project", formData.project)
      uploadFormData.append("tags", formData.tags)

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (response.ok) {
        setUploadStatus("success")
        // Reset form after successful upload
        setTimeout(() => {
          router.push("/al-ain/documents")
        }, 2000)
      } else {
        setUploadStatus("error")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Upload Document</h1>
              <p className="text-gray-400">Add a new document to the system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Upload Status */}
          {uploadStatus === "success" && (
            <Alert className="mb-6 border-green-600 bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Document uploaded successfully! Redirecting to documents page...
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="mb-6 border-red-600 bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">Failed to upload document. Please try again.</AlertDescription>
            </Alert>
          )}

          {/* Upload Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Selection */}
                <div>
                  <Label htmlFor="file" className="text-white">
                    Select File
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls,.ppt,.pptx"
                      className="bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md"
                      required
                    />
                  </div>
                  {selectedFile && (
                    <div className="mt-2 p-3 bg-gray-700 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{selectedFile.name}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Size: {formatFileSize(selectedFile.size)} | Type: {selectedFile.type || "Unknown"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Document Name */}
                <div>
                  <Label htmlFor="name" className="text-white">
                    Document Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter document name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter document description"
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Category and Project */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-white">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="plans">Plans & Drawings</SelectItem>
                        <SelectItem value="reports">Reports</SelectItem>
                        <SelectItem value="permits">Permits & Licenses</SelectItem>
                        <SelectItem value="contracts">Contracts</SelectItem>
                        <SelectItem value="specifications">Specifications</SelectItem>
                        <SelectItem value="photos">Photos</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="project" className="text-white">
                      Project (Optional)
                    </Label>
                    <Select
                      value={formData.project}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, project: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="16-projects">16 Projects</SelectItem>
                        <SelectItem value="7-projects">7 Projects</SelectItem>
                        <SelectItem value="2-projects">2 Projects</SelectItem>
                        <SelectItem value="1-project">1 Project</SelectItem>
                        <SelectItem value="al-saad-police">Al Saad Police Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags" className="text-white">
                    Tags (Optional)
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-gray-400 text-sm mt-1">Example: construction, blueprint, phase-1</p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={!selectedFile || uploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Upload Guidelines */}
          <Card className="mt-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300">
              <p>• Maximum file size: 50MB</p>
              <p>• Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, XLSX, XLS, PPT, PPTX</p>
              <p>• Use descriptive names for better organization</p>
              <p>• Add relevant tags to improve searchability</p>
              <p>• Associate documents with projects when applicable</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
