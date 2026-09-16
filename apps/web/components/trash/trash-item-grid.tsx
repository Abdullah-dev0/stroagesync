import { TrashItemGridClient } from "@/components/trash/trash-item-grid-client"
import { getServerApi } from "@/lib/api/server"
import { storageItemsSchema } from "@workspace/validation/storage"

export async function TrashItemGrid() {
  const serverApi = await getServerApi()
  const items = await serverApi("/api/storage/trash", {
    output: storageItemsSchema,
  })

  return <TrashItemGridClient initialItems={items} />
}
