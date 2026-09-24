import { withAuth } from "@/lib/auth/with-auth"
import { listStorageItemsByOwnerId } from "@/lib/db/queries/storage"

export const GET = withAuth(async (request, session) => {
  const { searchParams } = new URL(request.url)
  const parentId = searchParams.get("parentId") || null

  const items = await listStorageItemsByOwnerId(session.user.id, parentId)
  return Response.json(items)
})
