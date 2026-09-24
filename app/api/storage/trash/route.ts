import { withAuth } from "@/lib/auth/with-auth"
import { listTrashStorageItemsByOwnerId } from "@/lib/db/queries/storage"

export const GET = withAuth(async (_request, session) => {
  const items = await listTrashStorageItemsByOwnerId(session.user.id)
  return Response.json(items)
})
