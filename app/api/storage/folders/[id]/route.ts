import { getSession } from "@/lib/auth/session"
import {
  getFolderAncestors,
  getFolderContentItems,
} from "@/lib/db/queries/storage"
import { z } from "zod"

type RouteProps = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const session = await getSession()

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const parsedId = z.uuid().safeParse(id)

  if (!parsedId.success) {
    return Response.json({ error: "Invalid item ID." }, { status: 400 })
  }

  const [result, ancestors] = await Promise.all([
    getFolderContentItems(parsedId.data, session.user.id),
    getFolderAncestors(parsedId.data, session.user.id),
  ])

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 404 })
  }

  return Response.json({
    folder: {
      id: result.data.id,
      name: result.data.name,
    },
    ancestors,
  })
}
