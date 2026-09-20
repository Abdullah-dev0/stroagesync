import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { getDriveItems } from "@/lib/data/storage-data"

type DriveItemsServerProps = {
  folderId?: string
}

export async function DriveItemsServer({ folderId }: DriveItemsServerProps) {
  const items = await getDriveItems(folderId)

  return <StorageItemGridClient folderId={folderId} initialData={items} />
}
