import { createAuthClient } from "better-auth/react"
import { apiUrl } from "./api/config"

export const authClient = createAuthClient({
  baseURL: apiUrl,
})
