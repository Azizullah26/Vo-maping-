"use server"

import { createClient } from "@/lib/supabase"

export async function testSupabaseConnection() {
  try {
    const supabase = createClient()

    // Test basic connection
    const { data, error } = await supabase.from("projects").select("count").limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      }
    }

    return {
      success: true,
      message: "Supabase connection successful",
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}

// Add this function after the existing testSupabaseConnection function

export async function testNileConnection() {
  try {
    // Test Nile connection - this is a placeholder implementation
    // You would replace this with actual Nile connection testing logic
    const nileUrl = process.env.NILEDB_URL
    const nileApiToken = process.env.NILEDB_API_TOKEN

    if (!nileUrl || !nileApiToken) {
      return {
        success: false,
        error: "Missing Nile environment variables",
        details: "NILEDB_URL or NILEDB_API_TOKEN not configured",
      }
    }

    // Placeholder for actual Nile connection test
    // Replace with real Nile API call
    return {
      success: true,
      message: "Nile connection test placeholder - implement actual connection logic",
      data: { status: "placeholder" },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}
