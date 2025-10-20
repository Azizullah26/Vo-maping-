import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Add custom header to identify processed requests
  response.headers.set("X-Middleware-Applied", "true")

  return response
}

// Configure middleware to run for specific routes, not all routes
export const config = {
  matcher: [
    // Apply to all routes except static files, API routes, image optimization files, and favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
