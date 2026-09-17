import { z } from "zod"

import { getSession } from "@/lib/auth/session"
import { createFilePreview } from "@/lib/db/queries/storage"

type PreviewRouteContext = {
  params: Promise<{ itemId: string }>
}

export async function GET(_request: Request, context: PreviewRouteContext) {
  const session = await getSession()

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { itemId } = await context.params
  const parsedId = z.uuid().safeParse(itemId)

  if (!parsedId.success) {
    return Response.json({ error: "Invalid item ID." }, { status: 400 })
  }

  const result = await createFilePreview(parsedId.data, session.user.id)

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 422 })
  }

  return Response.json(result.data)
}
