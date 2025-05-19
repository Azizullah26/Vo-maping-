import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path.startsWith("/_next") || path.startsWith("/api/") || path.includes(".") // For static files like images, css, etc.

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has("auth")

  // Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // For API routes, add cache control headers
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0")
  }

  // Redirect to login if not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  // Redirect to home if already authenticated and trying to access login
  if (isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

// Configure middleware to run for specific routes, not all routes
export const config = {
  matcher: [
    // Apply to all routes except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
