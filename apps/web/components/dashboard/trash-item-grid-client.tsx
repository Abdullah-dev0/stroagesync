"use client"

import { useQuery } from "@tanstack/react-query"
import { RotateCcw, Trash2 } from "lucide-react"

import { StorageItemCard } from "@/components/dashboard/storage-item-card"
import { TrashEmptyState } from "@/components/dashboard/trash-empty-state"
import { clientApi } from "@/lib/api/client"
import { trashItemsQueryKey } from "@/lib/query-keys"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@workspace/ui/components/dropdown-menu"
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
        <StorageItemCard
          key={item.id}
          item={item}
          muted
          actions={
            <>
              <DropdownMenuItem className="gap-2 px-2 py-2" disabled>
                <RotateCcw />
                Restore
                <DropdownMenuShortcut className="tracking-normal">
                  Coming soon
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="gap-2 px-2 py-2"
                disabled
              >
                <Trash2 />
                Delete forever
              </DropdownMenuItem>
            </>
          }
        />
      ))}
    </div>
  )
}
