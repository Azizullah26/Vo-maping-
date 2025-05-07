import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, message: "Missing Supabase credentials in environment variables" },
        { status: 500 },
      )
    }

    // Initialize Supabase client with service role key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if tables already exist using direct SQL query
    const { data: tablesData, error: tablesError } = await supabase.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    if (tablesError) {
      console.error("Error checking tables:", tablesError)
      return NextResponse.json(
        { success: false, message: `Error checking tables: ${tablesError.message}` },
        { status: 500 },
      )
    }

    const existingTables = tablesData?.map((t) => t.table_name) || []
    console.log("Existing tables:", existingTables)

    // Create projects table if it doesn't exist
    if (!existingTables.includes("projects")) {
      const { error: createProjectsError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT,
          location TEXT,
          start_date TIMESTAMP WITH TIME ZONE,
          end_date TIMESTAMP WITH TIME ZONE,
          status TEXT DEFAULT 'Active',
          progress INTEGER DEFAULT 0,
          budget TEXT,
          manager TEXT,
          manager_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)

      if (createProjectsError) {
        console.error("Error creating projects table:", createProjectsError)
        return NextResponse.json(
          { success: false, message: `Error creating projects table: ${createProjectsError.message}` },
          { status: 500 },
        )
      }
    }

    // Create documents table if it doesn't exist
    if (!existingTables.includes("documents")) {
      const { error: createDocumentsError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT,
          file_name TEXT,
          type TEXT,
          file_type TEXT,
          size BIGINT,
          file_size BIGINT,
          file_path TEXT,
          file_url TEXT,
          project_id TEXT NOT NULL,
          project_name TEXT,
          document_type TEXT,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)

      if (createDocumentsError) {
        console.error("Error creating documents table:", createDocumentsError)
        return NextResponse.json(
          { success: false, message: `Error creating documents table: ${createDocumentsError.message}` },
          { status: 500 },
        )
      }
    }

    // Insert sample data if projects table is empty
    const { data: projectCount, error: countError } = await supabase.query(`
      SELECT COUNT(*) FROM projects
    `)

    if (countError) {
      console.error("Error counting projects:", countError)
    }

    const count = projectCount?.[0]?.count || 0

    if (countError || Number.parseInt(count) === 0) {
      // Insert sample projects
      const sampleProjects = [
        {
          name: "مركز شرطة الساد",
          description: "Construction of new police station in Al Saad area",
          location: "Al Saad, Al Ain",
          status: "Active",
          progress: 65,
          budget: "AED 12,500,000",
          manager: "Mohammed Al Shamsi",
        },
        {
          name: "مركز شرطة هيلي",
          description: "Renovation of existing police station in Hili",
          location: "Hili, Al Ain",
          status: "Completed",
          progress: 100,
          budget: "AED 8,750,000",
          manager: "Ahmed Al Dhaheri",
        },
        {
          name: "مركز شرطة المويجعي",
          description: "New police center with advanced security systems",
          location: "Al Muwaiji, Al Ain",
          status: "Pending",
          progress: 25,
          budget: "AED 15,200,000",
          manager: "Khalid Al Mansoori",
        },
      ]

      for (const project of sampleProjects) {
        const { error: insertError } = await supabase.from("projects").insert([project])

        if (insertError) {
          console.error("Error inserting sample project:", insertError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully!",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error initializing database: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
