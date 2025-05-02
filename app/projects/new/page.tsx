import { TopNav } from "@/components/TopNav"
import ProjectUploader from "@/components/ProjectUploader"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
      <TopNav />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/projects">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#1b1464]">Add New Project</h1>
        </div>

        <ProjectUploader />
      </div>
    </div>
  )
}
