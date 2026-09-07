import type { ErrorRequestHandler } from "express"
import { AppError } from "../lib/app-error"

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  void _next

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    })

    return
  }

  console.error(error)
  response.status(500).json({ message: "Internal server error" })
}
