import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// GET /api/documents - Get all documents
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("projectId")

    // Check if the documents table exists
    const { error: tableCheckError } = await supabase.from("documents").select("count").limit(1).single()

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Documents table does not exist, using demo data")
      // Return demo data if table doesn't exist
      return NextResponse.json({
        success: true,
        data: [
          {
            id: "1",
            name: "Project Overview.pdf",
            type: "PDF",
            size: "2.4 MB",
            date: "2023-12-15",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
            project: "مركز شرطة الساد",
          },
          {
            id: "2",
            name: "Construction Blueprint.pdf",
            type: "PDF",
            size: "5.7 MB",
            date: "2023-12-10",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-pdf-file-YJXbxnXXXXXXXXXXXXXXXXXXXXXXXX.pdf",
            project: "مركز شرطة الساد",
          },
          {
            id: "3",
            name: "Site Photos.jpg",
            type: "JPG",
            size: "12.8 MB",
            date: "2023-11-28",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
            project: "مركز شرطة الساد",
          },
        ],
      })
    }

    // Query the documents from Supabase
    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .eq(projectId ? "project_id" : "id", projectId || "*")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    // Get the URLs for each document
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const { data: urlData } = await supabase.storage
          .from("project-documents")
          .createSignedUrl(`${doc.project_id}/${doc.file_path}`, 60 * 60) // 1 hour expiry

        return {
          id: doc.id,
          name: doc.name,
          type: doc.type,
          size: doc.size,
          date: doc.created_at,
          url: urlData?.signedUrl || "",
          project: doc.project_name,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: documentsWithUrls,
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch documents" }, { status: 500 })
  }
}
