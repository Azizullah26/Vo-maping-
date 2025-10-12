import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Continue with the request, but catch any errors in the response
    return NextResponse.next()
  }

  // For non-API routes, just continue
  return NextResponse.next()
}

// Configure middleware to run only for API routes
export const config = {
  matcher: "/api/:path*",
}
