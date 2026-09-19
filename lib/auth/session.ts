import "server-only"

import { cacheLife } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "./config"

export async function getSession() {
  "use cache: private"
  // 5 min floor so routes qualify for App Shell / per-link prefetch.
  // Next.js uses the shortest stale time on a route, so this must not
  // undercut the per-query stale times or instant navigation is lost.
  cacheLife({ stale: 300 })

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
