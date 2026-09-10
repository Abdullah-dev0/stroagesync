import type { ErrorRequestHandler } from "express"
import multer from "multer"
import { AppError } from "../lib/app-error"

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  void _next

  if (error instanceof multer.MulterError) {
    const isTooLarge = error.code === "LIMIT_FILE_SIZE"

    response.status(isTooLarge ? 413 : 400).json({
      message: isTooLarge
        ? "Each file must be 16 MB or smaller."
        : "You can upload up to 3 files at a time.",
      code: error.code,
    })

    return
  }

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
