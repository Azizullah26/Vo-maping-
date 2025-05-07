import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Add security headers to all responses
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // For API routes, add cache control headers
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0")
  }

  return response
}

// Configure middleware to run for specific routes, not all routes
export const config = {
  matcher: [
    // Apply to API routes and exclude static files
    "/api/:path*",
    // Exclude static files, images, etc.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
