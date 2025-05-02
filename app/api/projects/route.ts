import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const formData = await request.formData()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const latitude = Number.parseFloat(formData.get("latitude") as string)
    const longitude = Number.parseFloat(formData.get("longitude") as string)
    const imageFile = formData.get("image") as File | null

    // Validate required fields
    if (!name || !description || !location || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    let imageUrl = null

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`

      const { error: uploadError, data } = await supabase.storage.from("project-images").upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    // Create project record
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name,
          description,
          location,
          latitude,
          longitude,
          image_url: imageUrl,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ message: "Failed to create project" }, { status: 500 })
  }
}
