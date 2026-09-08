import "server-only"

import { createFetch } from "@better-fetch/fetch"
import { cookies } from "next/headers"
import { apiUrl } from "./config"

// Create within each request so cookies are never shared between users.
export async function getServerApi() {
  const cookieStore = await cookies()

  return createFetch({
    baseURL: process.env.API_URL ?? apiUrl,
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
    throw: true,
    timeout: 10_000,
    retry: 0,
  })
}
