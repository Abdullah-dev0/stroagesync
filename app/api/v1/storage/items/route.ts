import { getSession } from "@/lib/server/session"
import { listStorageItemsByOwnerId } from "@/lib/server/storage"
import { AppError } from "@/lib/server/app-error"

export async function GET() {
  try {
    const session = await getSession()
    if (!session)
      return Response.json({ message: "Please sign in." }, { status: 401 })
    return Response.json(await listStorageItemsByOwnerId(session.user.id), {
      headers: { "Cache-Control": "private, no-store" },
    })
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        { message: error.message },
        { status: error.statusCode }
      )
    }
    return Response.json({ message: "Unable to load data." }, { status: 500 })
  }
}
