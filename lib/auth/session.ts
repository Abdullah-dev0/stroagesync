import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import { getAuth } from "./config"

export const getSession = cache(async () => {
  const auth = await getAuth()
  return auth.api.getSession({ headers: await headers() })
})

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    redirect("/login?unauthorized=true")
  }
  return session
}
