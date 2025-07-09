"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface Project {
  id: string
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  status: "planned" | "active" | "completed" | "on_hold"
  location?: string
  location_ar?: string
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

export async function getProjects(search?: string, status?: string) {
  try {
    let query = supabaseAdmin.from("projects").select("*").order("created_at", { ascending: false })

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,name_ar.ilike.%${search}%,description.ilike.%${search}%,description_ar.ilike.%${search}%`,
      )
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getProjects:", error)
    return { success: false, error: "Failed to fetch projects", data: [] }
  }
}

export async function getProject(id: string) {
  try {
    const { data, error } = await supabaseAdmin.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getProject:", error)
    return { success: false, error: "Failed to fetch project", data: null }
  }
}

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

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message, data: null }
    }

    revalidatePath("/al-ain/admin/projects")
    return { success: true, data }
  } catch (error) {
    console.error("Error in createProject:", error)
    return { success: false, error: "Failed to create project", data: null }
  }
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  try {
    const { data, error } = await supabaseAdmin
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
      return { success: false, error: error.message, data: null }
    }

    revalidatePath("/al-ain/admin/projects")
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateProject:", error)
    return { success: false, error: "Failed to update project", data: null }
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/al-ain/admin/projects")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteProject:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function getProjectStats(): Promise<{ success: boolean; data?: ProjectStats; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.from("projects").select("status")

    if (error) {
      console.error("Error fetching project stats:", error)
      return { success: false, error: error.message }
    }

    const stats: ProjectStats = {
      total: data?.length || 0,
      active: data?.filter((p) => p.status === "active").length || 0,
      completed: data?.filter((p) => p.status === "completed").length || 0,
      planned: data?.filter((p) => p.status === "planned").length || 0,
      on_hold: data?.filter((p) => p.status === "on_hold").length || 0,
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error in getProjectStats:", error)
    return { success: false, error: "Failed to fetch project statistics" }
  }
}

export async function searchProjects(query: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%,description.ilike.%${query}%,description_ar.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error searching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in searchProjects:", error)
    return { success: false, error: "Failed to search projects", data: [] }
  }
}
