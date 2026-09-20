import { getTrashItems } from "@/lib/queries/storage"
import { TrashItemGridClient } from "@/components/features/trash/trash-item-grid-client"

export async function TrashItemGrid() {
  const items = await getTrashItems()
  return <TrashItemGridClient initialItems={items} />
}
