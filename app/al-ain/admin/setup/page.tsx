"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, ExternalLink, Database, HardDrive } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default function SetupPage() {
  const [databaseStatus, setDatabaseStatus] = useState<"checking" | "success" | "error" | null>(null)
  const [databaseMessage, setDatabaseMessage] = useState("")
  const [bucketStatus, setBucketStatus] = useState<"checking" | "success" | "error" | null>(null)
  const [bucketMessage, setBucketMessage] = useState("")

  // Get environment variables with fallbacks
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.REACT_APP_SUPABASE_URL ||
    "https://igxzfbxlfptgthfxtbae.supabase.co"

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneHpmYnhsZnB0Z3RoZnh0YmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDAwNzcsImV4cCI6MjA1NjgxNjA3N30.OFjYjmuwJ2a_VHqoWdwFy6HxIk9phU0skCoaaBkIxhQ"

  const checkDatabaseStatus = async () => {
    setDatabaseStatus("checking")
    setDatabaseMessage("Checking database status...")

    try {
      const response = await fetch("/api/setup-database")
      const data = await response.json()

      if (data.success) {
        setDatabaseStatus("success")
        setDatabaseMessage(data.message)
      } else {
        setDatabaseStatus("error")
        setDatabaseMessage(data.message || "Failed to check database status")
      }
    } catch (error) {
      setDatabaseStatus("error")
      setDatabaseMessage("Error checking database status")
      console.error(error)
    }
  }

  const checkBucketStatus = async () => {
    setBucketStatus("checking")
    setBucketMessage("Checking bucket status...")

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase.storage.getBucket("project-documents")

      if (error) {
        if (error.message.includes("The resource was not found")) {
          setBucketStatus("error")
          setBucketMessage('Bucket "project-documents" does not exist. Please create it in the Supabase dashboard.')
        } else {
          setBucketStatus("error")
          setBucketMessage(`Error checking bucket: ${error.message}`)
        }
      } else {
        setBucketStatus("success")
        setBucketMessage('Bucket "project-documents" exists and is accessible.')
      }
    } catch (error: any) {
      setBucketStatus("error")
      setBucketMessage(`Error checking bucket: ${error.message || "Unknown error"}`)
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Database and Storage Setup</CardTitle>
          <CardDescription>Configure your Supabase database and storage for the Al Ain Admin Dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Create Documents Table</h3>
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {`CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={checkDatabaseStatus} disabled={databaseStatus === "checking"}>
                <Database className="mr-2 h-4 w-4" />
                {databaseStatus === "checking" ? "Checking..." : "Check Table Status"}
              </Button>
              {databaseStatus && (
                <span className="flex items-center gap-2">
                  {databaseStatus === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : databaseStatus === "error" ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                  {databaseMessage}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2. Create Storage Bucket</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to the Supabase dashboard</li>
              <li>Navigate to the Storage section</li>
              <li>Click "New Bucket"</li>
              <li>
                Enter the name: <strong>project-documents</strong>
              </li>
              <li>Make sure "Private" is selected</li>
              <li>Click "Create bucket"</li>
            </ol>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.open("https://app.supabase.com/project/_/storage/buckets", "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Supabase Dashboard
              </Button>
              <Button onClick={checkBucketStatus} disabled={bucketStatus === "checking"}>
                <HardDrive className="mr-2 h-4 w-4" />
                {bucketStatus === "checking" ? "Checking..." : "Check Bucket Status"}
              </Button>
            </div>
            {bucketStatus && (
              <Alert variant={bucketStatus === "success" ? "default" : "destructive"}>
                <AlertTitle className="flex items-center gap-2">
                  {bucketStatus === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  {bucketStatus === "success" ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>{bucketMessage}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">3. Environment Variables</h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm mb-2">Your current Supabase configuration:</p>
              <pre className="text-sm overflow-x-auto">
                {`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey.substring(0, 10)}...`}
              </pre>
            </div>
            <Alert>
              <AlertTitle>Next.js Environment Variables</AlertTitle>
              <AlertDescription>
                For Next.js projects, use <code className="bg-muted px-1 rounded">NEXT_PUBLIC_</code> prefix instead of{" "}
                <code className="bg-muted px-1 rounded">REACT_APP_</code> for client-side variables.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
