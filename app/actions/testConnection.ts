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
