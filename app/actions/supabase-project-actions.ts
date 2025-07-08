"use server"

import { getSupabaseServerClient } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface Project {
  id: string
  name: string
  description?: string
  location?: string
  status: "active" | "completed" | "planned"
  created_at: string
  updated_at: string
}

export async function createProject(formData: FormData): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const supabase = getSupabaseServerClient()

    const projectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      status: (formData.get("status") as "active" | "completed" | "planned") || "planned",
    }

    const { data, error } = await supabase.from("projects").insert([projectData]).select().single()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/al-ain/admin/projects")
    return { success: true, data }
  } catch (error) {
    console.error("Error in createProject:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function updateProject(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const supabase = getSupabaseServerClient()

    const projectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      status: (formData.get("status") as "active" | "completed" | "planned") || "planned",
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("projects").update(projectData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/al-ain/admin/projects")
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateProject:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/al-ain/admin/projects")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteProject:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getProjects(): Promise<{ success: boolean; data?: Project[]; error?: string }> {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getProjects:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getProject(id: string): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getProject:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
