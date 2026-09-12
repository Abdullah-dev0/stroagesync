import "server-only"

import { getSessionCookie } from "better-auth/cookies"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { apiUrl } from "./api/config"

export async function redirectIfAuthenticated(): Promise<void> {
  const cookieStore = await cookies()
  const sessionCookie = getSessionCookie(
    new Headers({ cookie: cookieStore.toString() }),
    { cookiePrefix: "auth-token" }
  )

  if (!sessionCookie) {
    return
  }

  const response = await fetch(
    new URL(
      "/api/auth/get-session?disableCookieCache=true",
      process.env.API_URL ?? apiUrl
    ),
    {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to validate session")
  }

  const session: unknown = await response.json()

  if (session) {
    redirect("/dashboard")
  }

  redirect("/api/session/invalidate")
}
