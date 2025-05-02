"use client"

import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SupabaseExample() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch documents
        const { data: documentsData, error: documentsError } = await supabase.from("documents").select("*").limit(5)

        if (documentsError) throw new Error(`Documents error: ${documentsError.message}`)

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase.from("projects").select("*").limit(5)

        if (projectsError) throw new Error(`Projects error: ${projectsError.message}`)

        setDocuments(documentsData || [])
        setProjects(projectsData || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection</CardTitle>
          <CardDescription>Testing connection to your Supabase database</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Connection Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="p-4 bg-green-50 text-green-800 rounded-md">
              <p className="font-medium">Connection Successful</p>
              <p className="text-sm">Successfully connected to Supabase database</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              setLoading(true)
              setTimeout(() => window.location.reload(), 500)
            }}
            disabled={loading}
          >
            {loading ? "Testing..." : "Test Connection Again"}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents Card */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Recent documents from your Supabase database</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <p className="text-muted-foreground">No documents found</p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="p-3 bg-muted rounded-md">
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.description || "No description"}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Projects Card */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Recent projects from your Supabase database</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="text-muted-foreground">No projects found</p>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.id} className="p-3 bg-muted rounded-md">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.description || "No description"}</p>
                    <p className="text-xs text-muted-foreground">Status: {project.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
