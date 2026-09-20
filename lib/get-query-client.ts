import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query"
import { cache } from "react"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
      dehydrate: {
        // Include pending queries in dehydration so streaming works with Next.js App Router
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}

// Server: React.cache ensures a single QueryClient per request across layout, page, and components
const getQueryClientServer = cache(makeQueryClient)

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === "undefined") {
    return getQueryClientServer()
  } else {
    // Browser: reuse the existing query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
