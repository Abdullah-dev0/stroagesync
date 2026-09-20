import "server-only"

import { cacheLife } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "./config"

export async function getSession() {
  "use cache: private"

  // Match Better Auth's short cookie cache window so auth stays responsive
  // while per-link navigation can reuse the resolved private session.
  cacheLife({ stale: 180 })

  const auth = await getAuth()
  return auth.api.getSession({ headers: await headers() })
}

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    redirect("/login?unauthorized=true")
  }
  return session
}
