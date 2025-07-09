"use server"

import { supabase, supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface Project {
  id: string
  name: string
  name_ar?: string
  description?: string
  status: "planned" | "active" | "completed" | "on_hold"
  location?: string
  coordinates?: [number, number]
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

// Get all projects
export async function getProjects(): Promise<{ data: Project[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error fetching projects:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch projects",
    }
  }
}

// Get project by ID
export async function getProject(id: string): Promise<{ data: Project | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error fetching project:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch project",
    }
  }
}

// Create new project
export async function createProject(
  projectData: Omit<Project, "id" | "created_at" | "updated_at">,
): Promise<{ data: Project | null; error: string | null }> {
  try {
    const client = supabaseAdmin || supabase
    const { data, error } = await client
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

    if (error) {
      console.error("Error creating project:", error)
      return { data: null, error: error.message }
    }

    revalidatePath("/al-ain/admin/projects")
    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error creating project:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create project",
    }
  }
}

// Update project
export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, "id" | "created_at">>,
): Promise<{ data: Project | null; error: string | null }> {
  try {
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating project:", error)
      return { data: null, error: error.message }
    }

    revalidatePath("/al-ain/admin/projects")
    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error updating project:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update project",
    }
  }
}

// Delete project
export async function deleteProject(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const client = supabaseAdmin || supabase
    const { error } = await client.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/al-ain/admin/projects")
    return { success: true, error: null }
  } catch (error) {
    console.error("Unexpected error deleting project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    }
  }
}

// Get project statistics
export async function getProjectStats(): Promise<{ data: ProjectStats | null; error: string | null }> {
  try {
    const { data: projects, error } = await supabase.from("projects").select("status")

    if (error) {
      console.error("Error fetching project stats:", error)
      return { data: null, error: error.message }
    }

    const stats: ProjectStats = {
      total: projects.length,
      active: projects.filter((p) => p.status === "active").length,
      completed: projects.filter((p) => p.status === "completed").length,
      planned: projects.filter((p) => p.status === "planned").length,
      on_hold: projects.filter((p) => p.status === "on_hold").length,
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error("Unexpected error fetching project stats:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch project statistics",
    }
  }
}

// Search projects
export async function searchProjects(query: string): Promise<{ data: Project[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error searching projects:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error searching projects:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to search projects",
    }
  }
}

// Get projects by status
export async function getProjectsByStatus(
  status: Project["status"],
): Promise<{ data: Project[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects by status:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error fetching projects by status:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch projects by status",
    }
  }
}
