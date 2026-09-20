"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { clearBrowserQueryClient, getQueryClient } from "@/lib/get-query-client"

export function QueryProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const queryClient = getQueryClient(() => {
    clearBrowserQueryClient()
    router.replace("/login?unauthorized=true")
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
