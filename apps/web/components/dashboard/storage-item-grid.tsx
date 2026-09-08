import { getServerApi } from "@/lib/api/server"
import { StorageEmptyState } from "@/components/dashboard/storage-empty-state"
import { StorageItemCard } from "@/components/dashboard/storage-item-card"
import { storageItemsSchema } from "@workspace/validation/storage"

export async function StorageItemGrid() {
  const serverApi = await getServerApi()
  const items = await serverApi("/api/storage/items", {
    output: storageItemsSchema,
  })

  console.log("items", items)

  if (items.length === 0) {
    return <StorageEmptyState />
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <StorageItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
