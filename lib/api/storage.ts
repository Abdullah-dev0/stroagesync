import type { ZodType } from "zod"

import {
  filePreviewSchema,
  storageItemsResponseSchema,
  storageUsageSchema,
} from "@/lib/validations/storage"

async function fetchJson<T>(url: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(url, { cache: "no-store" })

  if (!response.ok) {
    throw new Error("Request failed.")
  }

  const data: unknown = await response.json()
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
