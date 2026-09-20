import { getDriveItems } from "@/lib/queries/storage"
import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import type { ReactNode } from "react"

type StorageItemGridProps = {
  emptyState?: ReactNode
  folderId?: string
}

export async function StorageItemGrid({
  emptyState,
  folderId,
}: StorageItemGridProps) {
  const items = await getDriveItems(folderId ?? null)

  return (
    <StorageItemGridClient
      folderId={folderId}
      initialItems={items}
      emptyState={emptyState}
    />
  )
}
