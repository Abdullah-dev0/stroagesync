import { createFetch } from "@better-fetch/fetch"
import { apiUrl } from "./config"

export const clientApi = createFetch({
  baseURL: apiUrl,
  credentials: "include",
  throw: true,
  timeout: 10_000,
  retry: 0,
})
