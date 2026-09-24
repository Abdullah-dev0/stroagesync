import "server-only"

import { getSession } from "@/lib/auth/session"

type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>

// Route handlers answer with 401 JSON instead of redirecting, so client fetchers
// can surface UnauthorizedError.
export function withAuth<Context>(
  handler: (
    request: Request,
    session: Session,
    context: Context
  ) => Promise<Response>
) {
  return async (request: Request, context: Context) => {
    const session = await getSession()

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(request, session, context)
  }
}
