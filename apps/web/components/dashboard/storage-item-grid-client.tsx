"use client"

import { useQuery } from "@tanstack/react-query"

import { StorageEmptyState } from "@/components/dashboard/storage-empty-state"
import { StorageItemCard } from "@/components/dashboard/storage-item-card"
import { clientApi } from "@/lib/api/client"
import { storageItemsQueryKey } from "@/lib/query-keys"
import {
  storageItemsSchema,
  type StorageItem,
} from "@workspace/validation/storage"

type StorageItemGridClientProps = {
  initialItems: StorageItem[]
}

export function StorageItemGridClient({
  initialItems,
}: StorageItemGridClientProps) {
  const { data: items } = useQuery({
    queryKey: storageItemsQueryKey,
    queryFn: () =>
      clientApi("/api/storage/items", {
        output: storageItemsSchema,
      }),
    initialData: initialItems,
  })

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
