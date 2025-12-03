"use client"

import { useEffect, useState } from "react"
import { getProjectById } from "@/app/actions/project-actions"
import { getProjectDocuments } from "@/app/actions/document-actions"
import { TopNav } from "@/components/TopNav"
import ProjectDetails from "@/components/ProjectDetails"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

export default function ProjectPage() {
  const params = useParams()
  const id = params?.id as string
  const [project, setProject] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        const projectData = await getProjectById(id)
        if (!projectData) {
          setError(true)
          setLoading(false)
          return
        }
        setProject(projectData)

        const docs = await getProjectDocuments(id)
        setDocuments(docs || [])
      } catch (err) {
        console.error("Error loading project:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
        <TopNav />
        <div className="container mx-auto px-4 py-8 mt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b1464]"></div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
        <TopNav />
        <div className="container mx-auto px-4 py-8 mt-16 text-center">
          <h1 className="text-2xl font-bold text-[#1b1464] mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
      <TopNav />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/projects">
            <Button variant="outline" size="icon" className="rounded-full bg-transparent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#1b1464]">Project Details</h1>
        </div>

        <ProjectDetails project={project} documents={documents} />
      </div>
    </div>
  )
}
