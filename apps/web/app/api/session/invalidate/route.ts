import { NextResponse, type NextRequest } from "next/server"

import { apiUrl } from "@/lib/api/config"

export async function GET(request: NextRequest) {
  const signOutResponse = await fetch(
    new URL("/api/auth/sign-out", process.env.API_URL ?? apiUrl),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: request.headers.get("cookie") ?? "",
        origin: request.nextUrl.origin,
      },
      body: "{}",
      cache: "no-store",
    }
  )

  if (!signOutResponse.ok) {
    throw new Error("Failed to invalidate session")
  }

  const response = NextResponse.redirect(
    new URL("/login?unauthorized=true", request.url)
  )

  for (const cookie of signOutResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie)
  }

  return response
}
