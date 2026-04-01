import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string

    if (!file || !projectId) {
      return NextResponse.json({ error: "Missing file or projectId" }, { status: 400 })
    }

    console.log("[v0] Uploading file:", file.name, "for project:", projectId)

    // Create unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    const fileName = `${timestamp}-${random}-${file.name}`
    const filePath = `projects/${projectId}/media/${fileName}`

    // Upload to Supabase Storage
    const buffer = await file.arrayBuffer()
    const { data: storageData, error: storageError } = await supabase.storage
      .from("project-media")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      console.error("[v0] Storage upload error:", storageError)
      return NextResponse.json({ error: "Upload failed: " + storageError.message }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage.from("project-media").getPublicUrl(filePath)

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase.from("project_media").insert({
      project_id: projectId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      public_url: publicUrl.publicUrl,
      uploaded_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("[v0] Database insert error:", dbError)
      // File was uploaded but metadata wasn't saved - not critical
      return NextResponse.json({
        success: true,
        message: "File uploaded but metadata save failed",
        file: {
          name: file.name,
          url: publicUrl.publicUrl,
          projectId,
        },
      })
    }

    console.log("[v0] File uploaded successfully:", fileName)
    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        url: publicUrl.publicUrl,
        projectId,
        uploadedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
