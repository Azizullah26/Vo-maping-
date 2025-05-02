import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-client"

export async function POST() {
  try {
    const supabase = getSupabaseAdminClient()

    // Create projects table if not exists
    const { error: projectsError } = await supabase.rpc("create_projects_table_if_not_exists")

    if (projectsError) {
      console.error("Error creating projects table:", projectsError)
      return NextResponse.json(
        {
          success: false,
          error: projectsError.message,
        },
        { status: 500 },
      )
    }

    // Create documents table if not exists
    const { error: documentsError } = await supabase.rpc("create_documents_table_if_not_exists")

    if (documentsError) {
      console.error("Error creating documents table:", documentsError)
      return NextResponse.json(
        {
          success: false,
          error: documentsError.message,
        },
        { status: 500 },
      )
    }

    // Check if we need to seed sample data
    const { data: projects, error: checkError } = await supabase.from("projects").select("id").limit(1)

    if (checkError) {
      console.error("Error checking projects table:", checkError)
      return NextResponse.json(
        {
          success: false,
          error: checkError.message,
        },
        { status: 500 },
      )
    }

    // If no projects found, seed with sample data
    if (!projects || projects.length === 0) {
      // Sample projects
      const sampleProjects = [
        {
          name: "مركز شرطة الساد",
          description: "مشروع بناء مركز شرطة الساد",
          location: "Al Ain",
          longitude: 55.2708,
          latitude: 24.4539,
          status: "Active",
          progress: 45,
          budget: "AED 24,500,000",
          manager: "Mohammed Al Shamsi",
          start_date: new Date("2023-01-15").toISOString(),
          end_date: new Date("2024-12-30").toISOString(),
          due_days: "250 days",
        },
        {
          name: "مركز شرطة هيلي",
          description: "مشروع تطوير مركز شرطة هيلي",
          location: "Al Ain",
          longitude: 55.3708,
          latitude: 24.3539,
          status: "Active",
          progress: 78,
          budget: "AED 18,750,000",
          manager: "Ahmed",
        },
      ]

      // Insert sample projects
      const { error: insertError } = await supabase.from("projects").insert(sampleProjects)

      if (insertError) {
        console.error("Error seeding projects table:", insertError)
        return NextResponse.json(
          {
            success: false,
            error: insertError.message,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ success: true, message: "Database initialized successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
