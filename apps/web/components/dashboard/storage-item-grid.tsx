import { getServerApi } from "@/lib/api/server"
import { StorageItemGridClient } from "@/components/dashboard/storage-item-grid-client"
import { storageItemsSchema } from "@workspace/validation/storage"

export async function StorageItemGrid() {
  const serverApi = await getServerApi()
  const items = await serverApi("/api/storage/items", {
    output: storageItemsSchema,
  })

  return <StorageItemGridClient initialItems={items} />
}
