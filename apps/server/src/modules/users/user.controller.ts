import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../auth/auth"
import type { Request, Response } from "express"
import { AppError } from "../../errors/app-error"
import { updateUserName } from "./user.service"

export const getUserSession = async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  return res.json(session)
}

export const changeCurrentUserName = async (
  request: Request,
  response: Response
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  })

  if (!session) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const updatedUser = await updateUserName(session.user.id, request.body.name)

  response.json(updatedUser)
}
