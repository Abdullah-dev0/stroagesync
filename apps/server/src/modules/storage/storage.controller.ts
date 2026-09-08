import { createFolderInputSchema } from "@workspace/validation/storage"
import type { AuthenticatedHandler } from "../../middleware/auth.middleware"
import { createFolder as createFolderRecord } from "./storage.service"

export const createFolder: AuthenticatedHandler = async (req, res) => {
  const validation = createFolderInputSchema.safeParse(req.body)

  if (!validation.success) {
    res.status(400).json({
      message: validation.error.issues[0]?.message ?? "Invalid input.",
      code: "INVALID_FOLDER_INPUT",
    })
    return
  }

  const newFolder = await createFolderRecord(
    validation.data.name,
    res.locals.auth.user.id,
    validation.data.parentId
  )

  res.status(201).json(newFolder)
}
