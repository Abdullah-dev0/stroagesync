import { withAuth } from "@/lib/auth/with-auth"
import { getStorageUsageByOwnerId } from "@/lib/db/queries/storage"

export const GET = withAuth(async (_request, session) => {
  const usage = await getStorageUsageByOwnerId(session.user.id)
  return Response.json(usage)
})
