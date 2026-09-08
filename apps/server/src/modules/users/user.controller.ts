import { fromNodeHeaders } from "better-auth/node"
import type { Request, Response } from "express"
import { auth } from "../auth/auth"

export const getUserSession = async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  return res.json(session)
}
