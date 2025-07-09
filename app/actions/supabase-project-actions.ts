"use server"

import { supabase, supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface Project {
  id: string
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  status: "planned" | "active" | "completed" | "on_hold"
  location?: string
  coordinates?: { lat: number; lng: number }
  start_date?: string
  end_date?: string
  budget?: number
  progress?: number
  created_at: string
  updated_at: string
}

export interface ProjectStats {
  total: number
  active: number
  completed: number
  planned: number
  on_hold: number
}

// Get project statistics
export async function getProjectStats(): Promise<ProjectStats> {
  try {
    const { data: projects, error } = await supabase.from("projects").select("status")

    if (error) throw error

    const stats = {
      total: projects?.length || 0,
      active: projects?.filter((p) => p.status === "active").length || 0,
      completed: projects?.filter((p) => p.status === "completed").length || 0,
      planned: projects?.filter((p) => p.status === "planned").length || 0,
      on_hold: projects?.filter((p) => p.status === "on_hold").length || 0,
    }

    return stats
  } catch (error) {
    console.error("Error fetching project stats:", error)
    return {
      total: 0,
      active: 0,
      completed: 0,
      planned: 0,
      on_hold: 0,
    }
  }
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

// Get project by ID
export async function getProject(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

// Create new project
export async function createProject(projectData: Omit<Project, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([
        {
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath("/al-ain/admin")
    revalidatePath("/projects")

    return { success: true, data }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    }
  }
}

// Update project
export async function updateProject(id: string, updates: Partial<Project>) {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/al-ain/admin")
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)

    return { success: true, data }
  } catch (error) {
    console.error("Error updating project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    }
  }
}

// Delete project
export async function deleteProject(id: string) {
  try {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/al-ain/admin")
    revalidatePath("/projects")

    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    }
  }
}

// Search projects
export async function searchProjects(query: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%,description.ilike.%${query}%,description_ar.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error searching projects:", error)
    return []
  }
}

// Filter projects by status
export async function getProjectsByStatus(status: Project["status"]): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching projects by status:", error)
    return []
  }
}
