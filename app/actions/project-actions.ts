"use server"
import { deleteCache } from "@/lib/redis-client"
import { revalidatePath } from "next/cache"

// Cache keys
const PROJECT_LIST_CACHE_KEY = "project:list"
const PROJECT_CACHE_PREFIX = "project:"

// Cache expiration in seconds
const CACHE_EXPIRATION = 60 * 5 // 5 minutes

// Types
export interface Project {
  id: string
  name: string
  description: string
  location: string
  coordinates: [number, number]
  created_at: string
  updated_at: string
}

// Get Supabase client from our utility
import { getSupabaseAdminClient } from "@/lib/supabase-client"

// Function to get Supabase client
function getSupabaseClient() {
  return getSupabaseAdminClient()
}

// Create project table if it doesn't exist
export async function ensureProjectTable() {
  const supabase = getSupabaseClient()

  // Using RPC to create table if it doesn't exist
  const { error } = await supabase.rpc("create_projects_table_if_not_exists")

  if (error) {
    console.error("Error creating projects table:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Get all projects with Redis caching
export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    // Transform the data
    const projects = data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      location: row.location,
      coordinates: [row.longitude || 0, row.latitude || 0] as [number, number],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    return projects
  } catch (error) {
    console.error("Error in getProjects:", error)
    return []
  }
}

// Get a project by ID with Redis caching
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error || !data) {
      console.error(`Error fetching project ${id}:`, error)
      return null
    }

    const project = {
      id: data.id,
      name: data.name,
      description: data.description,
      location: data.location,
      coordinates: [data.longitude || 0, data.latitude || 0] as [number, number],
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return project
  } catch (error) {
    console.error("Error in getProjectById:", error)
    return null
  }
}

// Create a new project
export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        name: project.name,
        description: project.description,
        location: project.location,
        longitude: project.coordinates[0],
        latitude: project.coordinates[1],
      },
    ])
    .select("id")

  if (error || !data || data.length === 0) {
    return { success: false, error: error?.message || "Failed to create project" }
  }

  // Invalidate cache
  await deleteCache(PROJECT_LIST_CACHE_KEY)

  // Revalidate paths
  revalidatePath("/projects")
  revalidatePath("/")

  return { success: true, id: data[0].id }
}

// Update a project
export async function updateProject(
  id: string,
  project: Partial<Omit<Project, "id" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()

  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (project.name !== undefined) updateData.name = project.name
  if (project.description !== undefined) updateData.description = project.description
  if (project.location !== undefined) updateData.location = project.location
  if (project.coordinates !== undefined) {
    updateData.longitude = project.coordinates[0]
    updateData.latitude = project.coordinates[1]
  }

  const { error } = await supabase.from("projects").update(updateData).eq("id", id)

  if (error) {
    return { success: false, error: error.message || "Failed to update project" }
  }

  // Invalidate cache
  await deleteCache(PROJECT_LIST_CACHE_KEY)
  await deleteCache(`${PROJECT_CACHE_PREFIX}${id}`)

  // Revalidate paths
  revalidatePath("/projects")
  revalidatePath(`/projects/${id}`)
  revalidatePath("/")

  return { success: true }
}

// Delete a project
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message || "Failed to delete project" }
  }

  // Invalidate cache
  await deleteCache(PROJECT_LIST_CACHE_KEY)
  await deleteCache(`${PROJECT_CACHE_PREFIX}${id}`)

  // Revalidate paths
  revalidatePath("/projects")
  revalidatePath("/")

  return { success: true }
}
