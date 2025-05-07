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
      return NextResponse.json({
        success: true,
        message: "Documents table already exists",
      })
    }

    // Create documents table
    console.log("Creating documents table...")

    // Try multiple approaches to create the table

    // Approach 1: Using _sql
    try {
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
        throw createDocumentsError
      } else {
        console.log("Documents table created successfully with _sql")
        return NextResponse.json({
          success: true,
          message: "Documents table created successfully",
        })
      }
    } catch (err) {
      console.error("Error with _sql approach:", err)
      // Continue to next approach
    }

    // Approach 2: Using rpc exec
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
        throw sqlError
      } else {
        console.log("Documents table created successfully with rpc")
        return NextResponse.json({
          success: true,
          message: "Documents table created successfully",
        })
      }
    } catch (err) {
      console.error("Error with rpc approach:", err)
      // Continue to next approach
    }

    // Approach 3: Using raw SQL query
    try {
      const { error: rawSqlError } = await supabase.auth.admin.executeRaw(`
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

      if (rawSqlError) {
        console.error("Error creating documents table with raw SQL:", rawSqlError)
        throw rawSqlError
      } else {
        console.log("Documents table created successfully with raw SQL")
        return NextResponse.json({
          success: true,
          message: "Documents table created successfully",
        })
      }
    } catch (err) {
      console.error("Error with raw SQL approach:", err)
      // All approaches failed
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create documents table after trying multiple approaches. Please create it manually in the Supabase dashboard.",
          error: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error initializing documents table:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error initializing documents table: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
