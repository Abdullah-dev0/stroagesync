import type { ZodType } from "zod"

import {
  filePreviewSchema,
  storageItemsResponseSchema,
  storageUsageSchema,
} from "@/lib/validations/storage"
import { ExpectedResultError } from "@/lib/utils/result"

async function fetchJson<T>(url: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(url, { cache: "no-store" })
  const data: unknown = await response.json()

  if (!response.ok) {
    const error =
      typeof data === "object" && data !== null && "error" in data
        ? data.error
        : null

    if (response.status < 500 && typeof error === "string") {
      throw new ExpectedResultError(error)
    }

    throw new Error("Request failed.")
  }

  return schema.parse(data)
}

export const fetchDriveItems = () =>
  fetchJson("/api/storage/items", storageItemsResponseSchema)

export const fetchTrashItems = () =>
  fetchJson("/api/storage/trash", storageItemsResponseSchema)

export const fetchStorageUsage = () =>
  fetchJson("/api/storage/usage", storageUsageSchema)

export const fetchFilePreview = (itemId: string) =>
  fetchJson(`/api/storage/items/${itemId}/preview`, filePreviewSchema)
