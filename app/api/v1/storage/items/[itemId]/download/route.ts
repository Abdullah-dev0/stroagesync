import { z } from "zod"
import { getSession } from "@/lib/server/session"
import { createFileDownload } from "@/lib/server/storage"
import { AppError } from "@/lib/server/app-error"

export async function GET(
  _request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getSession()
    if (!session)
      return Response.json({ message: "Please sign in." }, { status: 401 })
    const { itemId } = await context.params
    const id = z.uuid().safeParse(itemId)
    if (!id.success)
      return Response.json({ message: "Invalid item ID." }, { status: 400 })
    return Response.json(await createFileDownload(id.data, session.user.id), {
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
