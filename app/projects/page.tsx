import { getProjects } from "@/app/actions/project-actions"
import { TopNav } from "@/components/TopNav"
import Link from "next/link"
import { MapPin, Calendar, ArrowRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ProjectsPage() {
  let projects = []
  let error = null

  try {
    projects = await getProjects()
  } catch (err) {
    console.error("Error loading projects:", err)
    error = err instanceof Error ? err.message : "Failed to load projects"
  }

  // If projects is empty but no error, use a fallback message
  const hasProjects = projects && projects.length > 0
  const errorMessage = error || (!hasProjects ? "No projects found or unable to connect to database" : null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
      <TopNav />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1b1464]">UAE Projects</h1>
            <p className="text-gray-600">Explore development projects across the UAE</p>
          </div>
          <Link href="/projects/new">
            <Button className="bg-[#1B1464] hover:bg-[#1B1464]/90 text-white">Add New Project</Button>
          </Link>
        </div>

        {errorMessage ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Notice</h2>
            <p className="text-gray-500 mt-2">{errorMessage}</p>
            <p className="text-gray-500 mt-2">
              {hasProjects
                ? "Showing available projects."
                : "Showing sample projects until database connection is restored."}
            </p>
          </div>
        ) : null}

        {!hasProjects && !error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">No projects found</h2>
            <p className="text-gray-500 mt-2">Get started by adding your first project</p>
            <Link href="/projects/new">
              <Button className="mt-4 bg-[#1B1464] hover:bg-[#1B1464]/90 text-white">Add New Project</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#1b1464] mb-2">{project.name}</h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
                    <span className="text-[#1b1464] font-medium flex items-center">
                      View Details <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
