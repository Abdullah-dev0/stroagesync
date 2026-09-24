import { withAuth } from "@/lib/auth/with-auth"
import { createFilePreview } from "@/lib/db/queries/storage"
import { storageItemIdSchema } from "@/lib/validations/storage"

export const GET = withAuth<
  RouteContext<"/api/storage/items/[itemId]/preview">
>(async (_request, session, context) => {
  const { itemId } = await context.params
  const parsedId = storageItemIdSchema.safeParse(itemId)

  if (!parsedId.success) {
    return Response.json({ error: "Invalid item ID." }, { status: 400 })
  }

  const result = await createFilePreview(parsedId.data, session.user.id)

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 422 })
  }

  return Response.json(result.data)
})
