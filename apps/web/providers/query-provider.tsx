"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (typeof window === "undefined" || failureCount >= 2) return false

          if (error instanceof BetterFetchError) {
            return error.status >= 500 && error.status < 600
          }

          return error instanceof TypeError
        },
      },
      mutations: { retry: false },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient()

  // Keep the browser cache stable even if the initial render suspends.
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}
