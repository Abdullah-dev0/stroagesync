import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

const AUTH_ROUTES = new Set(["/login", "/signup"])

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "auth-token",
  })
  const isDashboardRoute =
    path === "/dashboard" || path.startsWith("/dashboard/")

  if (!sessionCookie && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (sessionCookie && AUTH_ROUTES.has(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
