import { getSession } from "@/lib/auth/session"
import { listStorageItemsByOwnerId } from "@/lib/db/queries/storage"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const items = await listStorageItemsByOwnerId(session.user.id)
  return Response.json(items)
}
