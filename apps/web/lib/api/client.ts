import { createFetch } from "@better-fetch/fetch"
import { authClient } from "../authClient"
import { apiUrl } from "./config"

let isHandlingUnauthorized = false

export const clientApi = createFetch({
  baseURL: apiUrl,
  credentials: "include",
  throw: true,
  timeout: 10_000,
  retry: 0,
  onError: async ({ response }) => {
    if (
      response.status !== 401 ||
      typeof window === "undefined" ||
      isHandlingUnauthorized
    ) {
      return
    }

    isHandlingUnauthorized = true

    try {
      await authClient.signOut()
    } finally {
      window.location.replace("/login")
    }
  },
})
