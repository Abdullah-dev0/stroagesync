import { eq } from "drizzle-orm"
import { db } from "../../db/client"
import { user } from "../../db/schema/auth.schema"
import { AppError } from "../../errors/app-error"

export const updateUserName = async (userId: string, name: unknown) => {
  if (typeof name !== "string" || name.trim().length < 2) {
    throw new AppError(
      "Name must contain at least 2 characters",
      400,
      "INVALID_NAME"
    )
  }

  const [updatedUser] = await db
    .update(user)
    .set({ name: name.trim() })
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      updatedAt: user.updatedAt,
    })

  if (!updatedUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND")
  }

  return updatedUser
}
