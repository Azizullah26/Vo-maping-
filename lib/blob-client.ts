import { put, del, list, head } from "@vercel/blob"

// Upload a file to Vercel Blob
export async function uploadToBlob(
  file: File,
  folder = "",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const path = folder ? `${folder}/${file.name}` : file.name
    const blob = await put(path, file, {
      access: "public",
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Blob upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error uploading file",
    }
  }
}

// Delete a file from Vercel Blob
export async function deleteFromBlob(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Blob delete error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error deleting file",
    }
  }
}

// List files in a Vercel Blob folder
export async function listBlobFiles(prefix = ""): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const { blobs } = await list({ prefix })
    return { success: true, files: blobs }
  } catch (error) {
    console.error("Blob list error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error listing files",
    }
  }
}

// Check if a file exists in Vercel Blob
export async function checkBlobFile(url: string): Promise<{ success: boolean; exists: boolean; error?: string }> {
  try {
    const result = await head(url)
    return { success: true, exists: !!result }
  } catch (error) {
    console.error("Blob check error:", error)
    return {
      success: false,
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error checking file",
    }
  }
}
