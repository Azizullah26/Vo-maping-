import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      status: "static",
      message: "Application using static data",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Status check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
