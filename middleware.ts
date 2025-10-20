import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-Middleware-Applied", "true")

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0")
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
