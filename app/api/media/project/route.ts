import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 })
    }

    console.log("[v0] Fetching media for project:", projectId)

    // Get media from database
    const { data: mediaData, error } = await supabase
      .from("project_media")
      .select("*")
      .eq("project_id", projectId)
      .order("uploaded_at", { ascending: false })

    if (error) {
      console.error("[v0] Database query error:", error)
      return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
    }

    console.log(`[v0] Found ${mediaData?.length || 0} media items for project ${projectId}`)

    return NextResponse.json({
      success: true,
      projectId,
      media: mediaData || [],
      count: mediaData?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
