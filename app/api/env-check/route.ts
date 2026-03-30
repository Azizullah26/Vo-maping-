import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN
    const cesiumToken = process.env.CESIUM_ACCESS_TOKEN

    return NextResponse.json({
      success: true,
      envVars: {
        SUPABASE_URL: !!supabaseUrl,
        SUPABASE_ANON_KEY: !!supabaseAnonKey,
        MAPBOX_TOKEN: !!mapboxToken,
        CESIUM_TOKEN: !!cesiumToken,
        // Mask the actual values for security
        SUPABASE_URL_VALUE: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : null,
      },
    })
  } catch (error) {
    console.error("Error checking environment variables:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error checking environment variables",
    })
  }
}
