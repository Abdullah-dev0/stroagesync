import { TrashItemGridClient } from "@/components/features/trash/trash-item-grid-client"
import { getTrashItems } from "@/lib/data/storage-data"

export async function TrashItemsServer() {
  const items = await getTrashItems()

  return <TrashItemGridClient initialData={items} />
}
