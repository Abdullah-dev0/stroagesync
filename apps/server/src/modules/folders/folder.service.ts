import { eq } from "drizzle-orm"
import { db } from "../../db/client"
import { user } from "../../db/schema/auth.schema"
import { AppError } from "../../lib/app-error"

export const createFolder = async (name: string) => {
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
