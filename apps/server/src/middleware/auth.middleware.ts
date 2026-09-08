import type { RequestHandler } from "express"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../modules/auth/auth"

export type AuthSession = typeof auth.$Infer.Session

export type AuthLocals = {
  auth: AuthSession
}

export type AuthenticatedHandler = RequestHandler<
  Record<string, string>,
  unknown,
  unknown,
  Record<string, string>,
  AuthLocals
>

export const requireAuth: AuthenticatedHandler = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  res.locals.auth = session
  next()
}
