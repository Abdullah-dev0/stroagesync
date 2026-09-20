import {
  defaultShouldDehydrateQuery,
  environmentManager,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query"

import { UnauthorizedError } from "@/lib/utils/result"

function makeQueryClient(onUnauthorized?: () => void) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof UnauthorizedError) onUnauthorized?.()
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: false,
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        // Include pending queries so Next.js can stream server-prefetched data.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient(onUnauthorized?: () => void) {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  }

  browserQueryClient ??= makeQueryClient(onUnauthorized)
  return browserQueryClient
}
