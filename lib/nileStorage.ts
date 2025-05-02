import { put, del } from "@vercel/blob"

// Upload a file to storage
export async function uploadFile(file: File, projectId: string, fileName: string) {
  try {
    // Use Vercel Blob for storage but track in Nile database
    const blob = await put(`${projectId}/${fileName}`, file, {
      access: "public",
    })

    return { success: true, data: blob }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error uploading file",
    }
  }
}

// Delete a file from storage
export async function deleteFile(url: string) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error deleting file",
    }
  }
}
