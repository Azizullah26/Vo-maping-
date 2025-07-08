"use server"

import { getSupabaseServerClient } from "@/lib/db"

export async function testNileConnection() {
  try {
    // Test Supabase connection
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("projects").select("count").limit(1)

    if (error) {
      return {
        success: false,
        error: `Database connection failed: ${error.message}`,
        details: error,
      }
    }

    return {
      success: true,
      message: "Database connection successful",
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: `Connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: error,
    }
  }
}

export async function testSupabaseConnection() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("projects").select("*").limit(1)

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
