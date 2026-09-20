import { EmptyTrashAction } from "@/components/features/trash/empty-trash-action"
import { TrashItemGridClient } from "@/components/features/trash/trash-item-grid-client"
import { getTrashItems } from "@/lib/queries/storage"

export async function TrashEmptyActionContent() {
  const items = await getTrashItems()
  return <EmptyTrashAction initialItems={items} />
}

export async function TrashGridContent() {
  const items = await getTrashItems()
  return <TrashItemGridClient initialItems={items} />
}
