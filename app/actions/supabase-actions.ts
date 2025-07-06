"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getProjects() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function createProject(formData: FormData) {
  const supabase = createClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string

  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name,
          description,
          location,
          status: "planned",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/projects")
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const status = formData.get("status") as string

  try {
    const { data, error } = await supabase
      .from("projects")
      .update({
        name,
        description,
        location,
        status,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/projects")
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteProject(id: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
