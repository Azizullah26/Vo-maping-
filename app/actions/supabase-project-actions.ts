"use server"

import { supabase, supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface Project {
  id: string
  name: string
  name_ar?: string
  description?: string
  status: "planned" | "active" | "completed"
  location?: string
  coordinates?: [number, number]
  created_at: string
  updated_at: string
}

export interface CreateProjectData {
  name: string
  name_ar?: string
  description?: string
  status: "planned" | "active" | "completed"
  location?: string
  coordinates?: [number, number]
}

export interface ProjectStats {
  total: number
  planned: number
  active: number
  completed: number
}

export async function getProjects(): Promise<{ data: Project[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { data: null, error: error.message }
    }

    return { data: data as Project[], error: null }
  } catch (error) {
    console.error("Unexpected error fetching projects:", error)
    return { data: null, error: "Failed to fetch projects" }
  }
}

export async function getProject(id: string): Promise<{ data: Project | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return { data: null, error: error.message }
    }

    return { data: data as Project, error: null }
  } catch (error) {
    console.error("Unexpected error fetching project:", error)
    return { data: null, error: "Failed to fetch project" }
  }
}

export async function createProject(
  projectData: CreateProjectData,
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
    return { data: data as Project, error: null }
  } catch (error) {
    console.error("Unexpected error creating project:", error)
    return { data: null, error: "Failed to create project" }
  }
}

export async function updateProject(
  id: string,
  projectData: Partial<CreateProjectData>,
): Promise<{ data: Project | null; error: string | null }> {
  try {
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from("projects")
      .update({
        ...projectData,
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
    return { data: data as Project, error: null }
  } catch (error) {
    console.error("Unexpected error updating project:", error)
    return { data: null, error: "Failed to update project" }
  }
}

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
    return { success: false, error: "Failed to delete project" }
  }
}

export async function searchProjects(query: string): Promise<{ data: Project[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error searching projects:", error)
      return { data: null, error: error.message }
    }

    return { data: data as Project[], error: null }
  } catch (error) {
    console.error("Unexpected error searching projects:", error)
    return { data: null, error: "Failed to search projects" }
  }
}

export async function getProjectStats(): Promise<{ data: ProjectStats | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from("projects").select("status")

    if (error) {
      console.error("Error fetching project stats:", error)
      return { data: null, error: error.message }
    }

    const stats: ProjectStats = {
      total: data?.length || 0,
      planned: data?.filter((p) => p.status === "planned").length || 0,
      active: data?.filter((p) => p.status === "active").length || 0,
      completed: data?.filter((p) => p.status === "completed").length || 0,
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error("Unexpected error fetching project stats:", error)
    return { data: null, error: "Failed to fetch project stats" }
  }
}
