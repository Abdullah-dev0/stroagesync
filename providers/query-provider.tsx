"use client"

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { UnauthorizedError } from "@/lib/utils/result"
import { authClient } from "@/lib/auth/client"

function makeQueryClient(onUnauthorized: () => void) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof UnauthorizedError) onUnauthorized()
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: false,
      },
      mutations: { retry: false },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient(onUnauthorized: () => void) {
  if (typeof window === "undefined") return makeQueryClient(onUnauthorized)

  // Keep the browser cache stable even if the initial render suspends.
  browserQueryClient ??= makeQueryClient(onUnauthorized)
  return browserQueryClient
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  async function handleUnauthorized() {
    browserQueryClient?.clear()
    await authClient.signOut()
    router.replace("/login")
  }

  return (
    <QueryClientProvider client={getQueryClient(handleUnauthorized)}>
      {children}
    </QueryClientProvider>
  )
}
