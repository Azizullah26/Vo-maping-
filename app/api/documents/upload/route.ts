import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in environment variables for /api/documents/upload")
    console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "present" : "missing")
    console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "present" : "missing")
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    if (!supabaseAdmin) {
      console.error("Supabase client not initialized - missing environment variables")
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Missing Supabase credentials. Please check environment variables.",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectName = formData.get("projectName") as string

    if (!file || !projectName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: file or projectName" },
        { status: 400 },
      )
    }

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`
    const filePath = `projects/${projectName}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("project-documents")
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Error uploading file to Supabase Storage:", uploadError)
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = await supabaseAdmin.storage.from("project-documents").getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to get public URL for the uploaded file" },
        { status: 500 },
      )
    }

    const fileUrl = urlData.publicUrl

    const { data: insertedData, error: documentError } = await supabaseAdmin
      .from("project_documents")
      .insert({
        project_name: projectName,
        file_name: file.name,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString(),
      })
      .select()

    if (documentError) {
      await supabaseAdmin.storage.from("project-documents").remove([filePath])
      console.error("Error inserting document metadata:", documentError)
      return NextResponse.json({ success: false, error: documentError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      document: {
        id: insertedData?.[0]?.id || `temp-${Date.now()}`,
        file_url: fileUrl,
        file_name: file.name,
      },
    })
  } catch (error) {
    console.error("Error in document upload API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
