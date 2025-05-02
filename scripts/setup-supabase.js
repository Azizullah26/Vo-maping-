import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log("Setting up Supabase database...")

  try {
    // Check if documents table exists
    const { data: tableExists, error: checkError } = await supabase.from("documents").select("id").limit(1)

    if (checkError && checkError.message.includes("does not exist")) {
      console.log("Documents table does not exist. Please create it manually using the SQL below:")
      console.log(`
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT,
  size BIGINT,
  file_path TEXT NOT NULL,
  project_id TEXT NOT NULL,
  project_name TEXT NOT NULL,
  document_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`)

      console.log("\nPlease run this SQL in your Supabase SQL Editor.")
    } else {
      console.log("Documents table already exists")
    }

    // Check if storage bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error checking storage buckets:", bucketsError)
    } else {
      const projectDocumentsBucket = buckets.find((bucket) => bucket.name === "project-documents")

      if (!projectDocumentsBucket) {
        console.log('Storage bucket "project-documents" does not exist. Please create it in the Supabase dashboard.')
      } else {
        console.log('Storage bucket "project-documents" already exists')
      }
    }

    console.log("Database setup check completed")
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

setupDatabase()
