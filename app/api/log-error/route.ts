import { type NextRequest, NextResponse } from "next/server"

interface ErrorReport {
  type: "build" | "runtime" | "deployment"
  message: string
  stack?: string
  timestamp: string
  context?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const errorReport: ErrorReport = await request.json()

    // Log to console (in production, you'd send to external service)
    console.error("[ERROR COLLECTOR]", {
      type: errorReport.type,
      message: errorReport.message,
      timestamp: errorReport.timestamp,
      stack: errorReport.stack,
      context: errorReport.context,
    })

    // In production, send to external logging service like Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      // Example: await sendToExternalService(errorReport)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to log error:", error)
    return NextResponse.json({ error: "Failed to log error" }, { status: 500 })
  }
}
