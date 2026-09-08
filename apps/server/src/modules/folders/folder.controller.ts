import type { Request, Response } from "express"
import { createFolderInputSchema } from "../../../../../packages/validation/src/folders"

export const createFolder = async (req: Request, res: Response) => {
  const validation = createFolderInputSchema.safeParse(req.body)

  if (!validation.success) {
    return res
      .status(400)
      .json({ error: validation.error.issues[0]?.message ?? "Invalid input." })
  }


  

  // return res.json(session)
}
