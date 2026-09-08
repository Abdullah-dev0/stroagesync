# Frontend API requests

Better Fetch sends requests directly to Express. TanStack Query manages browser
query state. Better Auth remains the authentication client.

Copy `apps/web/.env.example` to `apps/web/.env.local` to configure the API URLs.
Local development defaults to `http://localhost:4000`. Set `NEXT_PUBLIC_API_URL`
for the deployed browser before building; optionally set `API_URL` for an internal
server address. Neither URL should contain credentials.

## Server Components

Create the client inside the current request:

```tsx
import { getServerApi } from "@/lib/api/server"

const api = await getServerApi()
const health = await api<{ status: string }>("/health")
```

The client forwards incoming cookies and defaults to `cache: "no-store"`.
Only call trusted Express paths with this client, never user-supplied URLs.
Cookies must reach the Next.js host for forwarding to work. A cookie restricted
to an API subdomain will not reach the frontend subdomain. This helper does not
forward response Set-Cookie headers; keep login/logout in Better Auth.

## Client Components

The dashboard layout already includes `QueryProvider`:

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { clientApi } from "@/lib/api/client"

export function ApiStatus() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["health"],
    queryFn: ({ signal }) =>
      clientApi<{ status: string }>("/health", { signal }),
  })

  if (isPending) return <p>Checking API...</p>
  if (isError) {
    return <button onClick={() => void refetch()}>Retry API check</button>
  }

  return <p>{data.status}</p>
}
```

Browser requests include cookies. Queries stay fresh for 30 seconds and retry
server HTTP errors and network TypeErrors at most twice. Other HTTP errors,
timeouts, and cancellations are not retried. Mutations are not retried. Better
Fetch retries are disabled; both clients throw on HTTP failures and have a
10-second timeout.

For important server data, allow failures to reach the nearest `error.tsx`;
catch only when providing a meaningful recovery. For browser queries, render
their error state. For mutations, use `onError` for feedback and invalidate the
affected query keys on success. Never substitute an empty file list for failure.

Use user-scoped query keys for private data and clear private queries when
implementing logout or account switching. If server-rendered data later powers
an interactive query, use initial data or hydration so both views stay in sync.

The generic types above are compile-time hints. Add response schemas from
`packages/validation` through Better Fetch's `output` option when defining real
API contracts. No file operations or endpoint contracts are implemented here.
