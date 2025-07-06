"use server"

import { revalidatePath } from "next/cache"
import { xanoClient } from "@/lib/xano-client"

// Project actions
export async function getProjects() {
  try {
    const result = await xanoClient.getProjects()
    if (result.success) {
      return { success: true, data: result.data }
    }
    return { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch projects",
    }
  }
}

export async function createProject(formData: FormData) {
  try {
    const projectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      latitude: Number.parseFloat(formData.get("latitude") as string),
      longitude: Number.parseFloat(formData.get("longitude") as string),
      status: (formData.get("status") as string) || "Active",
      manager: formData.get("manager") as string,
      budget: formData.get("budget") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
    }

    const result = await xanoClient.createProject(projectData)

    if (result.success) {
      revalidatePath("/projects")
      revalidatePath("/al-ain/admin")
      return { success: true, data: result.data }
    }

    return { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    }
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const projectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as string,
      manager: formData.get("manager") as string,
      budget: formData.get("budget") as string,
      progress: Number.parseInt(formData.get("progress") as string),
    }

    const result = await xanoClient.updateProject(id, projectData)

    if (result.success) {
      revalidatePath("/projects")
      revalidatePath(`/projects/${id}`)
      revalidatePath("/al-ain/admin")
      return { success: true, data: result.data }
    }

    return { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    }
  }
}

// Document actions
export async function uploadDocument(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const metadata = {
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }

    const result = await xanoClient.uploadDocument(file, projectId, metadata)

    if (result.success) {
      revalidatePath("/al-ain/admin")
      revalidatePath("/al-ain/documents")
      return { success: true, data: result.data }
    }

    return { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload document",
    }
  }
}

export async function getProjectDocuments(projectId: string) {
  try {
    const result = await xanoClient.getDocumentsByProject(projectId)
    if (result.success) {
      return { success: true, data: result.data }
    }
    return { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch documents",
    }
  }
}

export async function deleteDocument(id: string) {
  try {
    const result = await xanoClient.deleteDocument(id)

    if (result.success) {
      revalidatePath("/al-ain/admin")
      revalidatePath("/al-ain/documents")
      return { success: true }
    }

    return { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete document",
    }
  }
}
