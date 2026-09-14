"use client"

import { useQuery } from "@tanstack/react-query"

import { StorageItemCard } from "@/components/dashboard/storage-item-card"
import { TrashEmptyState } from "@/components/dashboard/trash-empty-state"
import { clientApi } from "@/lib/api/client"
import { trashItemsQueryKey } from "@/lib/query-keys"
import {
  storageItemsSchema,
  type StorageItem,
} from "@workspace/validation/storage"

type TrashItemGridClientProps = {
  initialItems: StorageItem[]
}

export function TrashItemGridClient({
  initialItems,
}: TrashItemGridClientProps) {
  const { data: items } = useQuery({
    queryKey: trashItemsQueryKey,
    queryFn: () =>
      clientApi("/api/storage/trash", {
        output: storageItemsSchema,
      }),
    initialData: initialItems,
  })

  if (items.length === 0) {
    return <TrashEmptyState />
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <StorageItemCard key={item.id} item={item} location="trash" />
      ))}
    </div>
  )
}
