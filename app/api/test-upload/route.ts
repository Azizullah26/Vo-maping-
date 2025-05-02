import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET() {
  try {
    // Create a simple text file
    const testContent = "This is a test file created at " + new Date().toISOString()
    const testFile = new Blob([testContent], { type: "text/plain" })

    // Upload to Supabase
    const filePath = `test/test-file-${Date.now()}.txt`

    console.log("Testing upload to Supabase storage...")
    console.log("File path:", filePath)

    const { data, error } = await supabase.storage.from("project-documents").upload(filePath, testFile, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Test upload error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("Test upload successful:", data)

    // Insert test record
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert({
        name: "Test Document",
        type: "TXT",
        size: testContent.length,
        file_path: filePath,
        project_id: "test",
        project_name: "Test Project",
        document_type: "test",
      })
      .select()

    if (docError) {
      console.error("Test database insert error:", docError)
      return NextResponse.json({ success: false, error: docError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test upload successful",
      storageData: data,
      databaseData: docData,
    })
  } catch (error) {
    console.error("Test upload exception:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
