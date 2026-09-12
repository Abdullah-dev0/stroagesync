import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

import { apiUrl } from "@/lib/api/config"

const AUTH_ROUTES = new Set(["/login", "/signup"])

export async function proxy(request: NextRequest) {
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
    const sessionResponse = await fetch(
      new URL(
        "/api/auth/get-session?disableCookieCache=true",
        process.env.API_URL ?? apiUrl
      ),
      {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      }
    )
    const session: unknown = sessionResponse.ok
      ? await sessionResponse.json()
      : null
    const response = session
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next()

    for (const cookie of sessionResponse.headers.getSetCookie()) {
      response.headers.append("set-cookie", cookie)
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
