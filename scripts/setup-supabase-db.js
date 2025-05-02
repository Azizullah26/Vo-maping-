// This script helps set up the Supabase database by executing the stored procedures
import { createClient } from "@supabase/supabase-js"
import { Pool } from "pg"

async function setupSupabaseDatabase() {
  try {
    console.log("Setting up Supabase database...")

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const databaseUrl = process.env.DATABASE_URL

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Missing Supabase environment variables")

      if (!databaseUrl) {
        throw new Error("No database connection information available")
      }

      console.log("Falling back to direct PostgreSQL connection")
      await setupWithDirectConnection(databaseUrl)
      return
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log("Supabase client created")

    // Test connection
    const { data: versionData, error: versionError } = await supabase.rpc("get_db_version")

    if (versionError) {
      if (versionError.message.includes('function "get_db_version" does not exist')) {
        console.log("Stored procedures need to be created first")

        if (databaseUrl) {
          console.log("Attempting to create stored procedures using direct connection")
          await setupWithDirectConnection(databaseUrl)
          return
        } else {
          console.log("Please run the SQL from supabase/stored-procedures.sql in the Supabase SQL editor")
          return
        }
      }
      throw versionError
    }

    console.log("Connected to Supabase PostgreSQL:", versionData)

    // Create tables
    console.log("Creating projects table if it doesn't exist...")
    const { error: projectsError } = await supabase.rpc("create_projects_table_if_not_exists")
    if (projectsError) throw projectsError

    console.log("Creating documents table if it doesn't exist...")
    const { error: documentsError } = await supabase.rpc("create_documents_table_if_not_exists")
    if (documentsError) throw documentsError

    console.log("Database setup completed successfully!")

    // List tables
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .order("table_name")

    if (tablesError) throw tablesError

    console.log("Available tables:")
    tables.forEach((table) => console.log(`- ${table.table_name}`))
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

async function setupWithDirectConnection(databaseUrl) {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    // Test connection
    const versionResult = await pool.query("SELECT version()")
    console.log("Connected to PostgreSQL:", versionResult.rows[0].version)

    // Create stored procedures
    console.log("Creating stored procedures...")

    // Read the SQL file content
    const fs = require("fs")
    const path = require("path")
    const sqlPath = path.join(process.cwd(), "supabase", "stored-procedures.sql")

    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, "utf8")
      await pool.query(sql)
      console.log("Stored procedures created successfully")
    } else {
      console.error("Could not find stored procedures SQL file at:", sqlPath)
      return
    }

    // Create tables
    console.log("Creating projects and documents tables...")
    await pool.query("SELECT create_projects_table_if_not_exists()")
    await pool.query("SELECT create_documents_table_if_not_exists()")

    console.log("Database setup completed successfully!")

    // List tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log("Available tables:")
    tablesResult.rows.forEach((row) => console.log(`- ${row.table_name}`))
  } catch (error) {
    console.error("Error setting up database with direct connection:", error)
  } finally {
    await pool.end()
  }
}

// Run the setup
setupSupabaseDatabase()
