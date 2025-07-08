"use server"

import { supabase, supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface Project {
  id: string
  name: string
  description?: string
  location?: string
  status: "planned" | "active" | "completed"
  created_at: string
  updated_at: string
  coordinates?: [number, number]
  image_url?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  location?: string
  status?: "planned" | "active" | "completed"
  coordinates?: [number, number]
  image_url?: string
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string
}

// Get all projects
export async function getProjects(): Promise<{ success: boolean; data?: Project[]; error?: string }> {
  try {
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

// Get project by ID
export async function getProject(id: string): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
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

// Create new project
export async function createProject(
  projectData: CreateProjectData,
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const client = supabaseAdmin || supabase

    const { data, error } = await client
      .from("projects")
      .insert([
        {
          ...projectData,
          status: projectData.status || "planned",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

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

// Update project
export async function updateProject(
  projectData: UpdateProjectData,
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const client = supabaseAdmin || supabase
    const { id, ...updateData } = projectData

    const { data, error } = await client
      .from("projects")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

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

// Delete project
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = supabaseAdmin || supabase

    const { error } = await client.from("projects").delete().eq("id", id)

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

// Get project statistics
export async function getProjectStats(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data: projects, error } = await supabase.from("projects").select("status")

    if (error) {
      console.error("Error fetching project stats:", error)
      return { success: false, error: error.message }
    }

    const stats = {
      total: projects?.length || 0,
      planned: projects?.filter((p) => p.status === "planned").length || 0,
      active: projects?.filter((p) => p.status === "active").length || 0,
      completed: projects?.filter((p) => p.status === "completed").length || 0,
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error in getProjectStats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
