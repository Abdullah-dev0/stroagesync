import { getSession } from "@/lib/auth/session"
import { getStorageUsageByOwnerId } from "@/lib/db/queries/storage"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const usage = await getStorageUsageByOwnerId(session.user.id)
  return Response.json(usage)
}
