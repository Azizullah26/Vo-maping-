"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

// Get environment variables with fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL ||
  "https://igxzfbxlfptgthfxtbae.supabase.co"

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneHpmYnhsZnB0Z3RoZnh0YmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDAwNzcsImV4cCI6MjA1NjgxNjA3N30.OFjYjmuwJ2a_VHqoWdwFy6HxIk9phU0skCoaaBkIxhQ"

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [bucketExists, setBucketExists] = useState<boolean | null>(null)

  const checkBucket = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket("project-documents")

      if (error) {
        if (error.message.includes("The resource was not found")) {
          setBucketExists(false)
          setError('Bucket "project-documents" does not exist')
        } else {
          setError(`Error checking bucket: ${error.message}`)
        }
      } else {
        setBucketExists(true)
        setSuccess('Bucket "project-documents" exists')
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError(null)
      setSuccess(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      // Check if bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("project-documents")

      if (bucketError && bucketError.message.includes("The resource was not found")) {
        setError('Bucket "project-documents" does not exist. Please create it in the Supabase dashboard.')
        setUploading(false)
        return
      }

      // Upload file
      const { data, error } = await supabase.storage.from("project-documents").upload(`test/${file.name}`, file)

      if (error) {
        setError(`Upload failed: ${error.message}`)
      } else {
        setSuccess(`File uploaded successfully: ${data.path}`)
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Supabase Upload</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Check Bucket</h2>
        <button onClick={checkBucket} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Check if bucket exists
        </button>
        {bucketExists === true && <p className="text-green-600 mt-2">✅ Bucket exists</p>}
        {bucketExists === false && <p className="text-red-600 mt-2">❌ Bucket does not exist</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select a file to upload:</label>
        <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {success && <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <p>
          <strong>URL:</strong> {supabaseUrl}
        </p>
        <p>
          <strong>Key:</strong> {supabaseKey.substring(0, 10)}...
        </p>
      </div>
    </div>
  )
}
