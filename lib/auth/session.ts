import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./config"

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
)

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    await auth.api.signOut({ headers: await headers() }).catch(() => {})
    redirect("/login?unauthorized=true") // do this after the signOut call, not inside a try/catch
  }
  return session
}
