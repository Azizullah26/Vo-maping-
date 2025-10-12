import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const projectName = formData.get("projectName") as string
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ success: false, error: "No project ID provided" }, { status: 400 })
    }

    // Generate a unique file path
    const fileExtension = file.name.split(".").pop() || ""
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const filePath = `${projectId}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("project-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    // Get file metadata
    const fileType = file.name.split(".").pop()?.toUpperCase() || ""
    const fileSize = file.size

    // Insert document metadata into Supabase
    const { data: documentData, error: documentError } = await supabase
      .from("documents")
      .insert({
        name: file.name,
        type: fileType,
        size: fileSize,
        file_path: fileName,
        project_id: projectId,
        project_name: projectName,
        document_type: documentType,
      })
      .select()
      .single()

    if (documentError) {
      // If metadata insertion fails, delete the uploaded file
      await supabase.storage.from("project-documents").remove([filePath])

      throw documentError
    }

    // Get the URL for the uploaded file
    const { data: urlData } = await supabase.storage.from("project-documents").createSignedUrl(filePath, 60 * 60) // 1 hour expiry

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      fileId: documentData.id,
      url: urlData?.signedUrl || null,
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload document",
      },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
