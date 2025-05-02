"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Check authentication
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          setError("Not authenticated. Please sign in.")
          setLoading(false)
          return
        }
        setUser(session.user)

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })

        if (projectsError) throw new Error(`Error fetching projects: ${projectsError.message}`)
        setProjects(projectsData || [])

        // Fetch documents
        const { data: documentsData, error: documentsError } = await supabase
          .from("documents")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (documentsError) throw new Error(`Error fetching documents: ${documentsError.message}`)
        setDocuments(documentsData || [])
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "An error occurred while fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleInitDatabase = async () => {
    try {
      const response = await fetch("/api/init-supabase-tables", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to initialize database")
      }

      const data = await response.json()
      alert(data.message || "Database initialized successfully")
      router.refresh()
    } catch (error: any) {
      console.error("Error initializing database:", error)
      alert(`Error initializing database: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={handleInitDatabase}>Initialize Database</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {user && <div className="text-sm text-gray-500">Logged in as: {user.email}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Manage your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total Projects: {projects.length}</p>
          </CardContent>
          <CardFooter>
            <Link href="/al-ain/admin/projects">
              <Button>View All Projects</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Manage your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total Documents: {documents.length}</p>
          </CardContent>
          <CardFooter>
            <Link href="/al-ain/documents">
              <Button>View All Documents</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="p-2 border rounded hover:bg-gray-50">
                    <Link href={`/al-ain/documents/${doc.id}`} className="flex justify-between">
                      <span>{doc.title || doc.filename || "Untitled Document"}</span>
                      <span className="text-gray-500 text-sm">{new Date(doc.created_at).toLocaleDateString()}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents found.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/al-ain/documents/upload">
              <Button>Upload New Document</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <ul className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.id} className="p-2 border rounded hover:bg-gray-50">
                    <Link href={`/projects/${project.id}`} className="flex justify-between">
                      <span>{project.name || "Untitled Project"}</span>
                      <span className="text-gray-500 text-sm">{new Date(project.created_at).toLocaleDateString()}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects found.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/projects/new">
              <Button>Create New Project</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Initialize or reset the database tables</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleInitDatabase}>Initialize Database</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
