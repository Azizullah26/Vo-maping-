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

    // Check if tables already exist - using a simpler approach
    // Try to query the projects table directly instead of using information_schema
    const { data: projectsExists, error: projectsError } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .limit(1)

    console.log("Checking if projects table exists...")

    let existingTables = []

    if (projectsError) {
      // If error contains "relation \"projects\" does not exist", the table doesn't exist
      if (projectsError.message.includes("relation") && projectsError.message.includes("does not exist")) {
        console.log("Projects table does not exist, will create it")
        existingTables = []
      } else {
        console.error("Error checking projects table:", projectsError)
      }
    } else {
      console.log("Projects table exists")
      existingTables.push("projects")
    }

    // Check if documents table exists
    const { data: documentsExists, error: documentsError } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .limit(1)

    if (documentsError) {
      // If error contains "relation \"documents\" does not exist", the table doesn't exist
      if (documentsError.message.includes("relation") && documentsError.message.includes("does not exist")) {
        console.log("Documents table does not exist, will create it")
      } else {
        console.error("Error checking documents table:", documentsError)
      }
    } else {
      console.log("Documents table exists")
      existingTables.push("documents")
    }

    console.log("Existing tables:", existingTables)

    // Create projects table if it doesn't exist
    if (!existingTables.includes("projects")) {
      console.log("Creating projects table...")

      // Use a direct SQL query instead of RPC
      const { error: createProjectsError } = await supabase
        .from("_sql")
        .select("*")
        .execute(`
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
        console.error("Error creating projects table with _sql:", createProjectsError)

        // Try alternative approach with direct SQL query
        try {
          const { error: sqlError } = await supabase.rpc("exec", {
            query: `
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
            `,
          })

          if (sqlError) {
            console.error("Error creating projects table with rpc:", sqlError)
            return NextResponse.json(
              { success: false, message: `Error creating projects table: ${sqlError.message}` },
              { status: 500 },
            )
          }
        } catch (err) {
          console.error("Error executing SQL via RPC:", err)
          return NextResponse.json(
            {
              success: false,
              message: `Error creating projects table: ${err instanceof Error ? err.message : String(err)}`,
            },
            { status: 500 },
          )
        }
      }
    }

    // Create documents table if it doesn't exist
    if (!existingTables.includes("documents")) {
      console.log("Creating documents table...")

      // Use a direct SQL query instead of RPC
      const { error: createDocumentsError } = await supabase
        .from("_sql")
        .select("*")
        .execute(`
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
        console.error("Error creating documents table with _sql:", createDocumentsError)

        // Try alternative approach with direct SQL query
        try {
          const { error: sqlError } = await supabase.rpc("exec", {
            query: `
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
            `,
          })

          if (sqlError) {
            console.error("Error creating documents table with rpc:", sqlError)
            return NextResponse.json(
              { success: false, message: `Error creating documents table: ${sqlError.message}` },
              { status: 500 },
            )
          }
        } catch (err) {
          console.error("Error executing SQL via RPC:", err)
          return NextResponse.json(
            {
              success: false,
              message: `Error creating documents table: ${err instanceof Error ? err.message : String(err)}`,
            },
            { status: 500 },
          )
        }
      }
    }

    // Insert sample data if projects table is empty
    const { data: projectCount, error: countError } = await supabase.from("projects").select("*", { count: "exact" })

    if (countError) {
      console.error("Error counting projects:", countError)
    }

    const count = projectCount?.length || 0

    if (!countError && count === 0) {
      console.log("No projects found, inserting sample data...")

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

    // Create storage bucket for documents if it doesn't exist
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) {
        console.error("Error listing storage buckets:", bucketsError)
      } else {
        const projectDocumentsBucket = buckets?.find((b) => b.name === "project-documents")

        if (!projectDocumentsBucket) {
          console.log("Creating project-documents storage bucket...")

          const { error: createBucketError } = await supabase.storage.createBucket("project-documents", {
            public: true,
            fileSizeLimit: 52428800, // 50MB
          })

          if (createBucketError) {
            console.error("Error creating project-documents bucket:", createBucketError)
          } else {
            console.log("Created project-documents bucket successfully")
          }
        } else {
          console.log("project-documents bucket already exists")
        }
      }
    } catch (err) {
      console.error("Error managing storage buckets:", err)
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
