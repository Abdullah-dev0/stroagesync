import type { RequestHandler } from "express"
import multer from "multer"

export const uploadFiles: RequestHandler = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 3,
    fileSize: 16 * 1024 * 1024,
    fields: 1,
    parts: 4,
  },
}).array("files", 3)
