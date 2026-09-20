import { getSession } from "@/lib/auth/session"
import { listStorageItemsByOwnerId } from "@/lib/db/queries/storage"

export async function GET(request: Request) {
  const session = await getSession()

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const parentId = searchParams.get("parentId") || null

  const items = await listStorageItemsByOwnerId(session.user.id, parentId)
  return Response.json(items)
}
