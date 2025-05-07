import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname

  // If the request is for the problematic API route and we're in a build environment
  if (pathname.startsWith("/api/db-test") && process.env.NODE_ENV === "production") {
    try {
      // Continue with the request, but catch any errors
      return NextResponse.next()
    } catch (error) {
      // Return a fallback response if there's an error
      return NextResponse.json(
        {
          success: false,
          message: "Database connection check is not available in this environment",
          error: "Runtime error",
        },
        { status: 500 },
      )
    }
  }

  // Continue with the request for all other routes
  return NextResponse.next()
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: ["/api/db-test/:path*"],
}
