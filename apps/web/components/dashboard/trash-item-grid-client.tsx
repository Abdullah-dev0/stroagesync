"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, RotateCcw, Trash2 } from "lucide-react"

import { StorageItemCard } from "@/components/dashboard/storage-item-card"
import { TrashEmptyState } from "@/components/dashboard/trash-empty-state"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { clientApi } from "@/lib/api/client"
import { storageItemsQueryKey, trashItemsQueryKey } from "@/lib/query-keys"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
import {
  storageItemsSchema,
  storageItemSchema,
  type StorageItem,
  type UpdateStorageItemTrashInput,
} from "@workspace/validation/storage"

type TrashItemGridClientProps = {
  initialItems: StorageItem[]
}

export function TrashItemGridClient({
  initialItems,
}: TrashItemGridClientProps) {
  const queryClient = useQueryClient()
  const { data: items } = useQuery({
    queryKey: trashItemsQueryKey,
    queryFn: () =>
      clientApi("/api/storage/trash", {
        output: storageItemsSchema,
      }),
    initialData: initialItems,
  })

  const restoreItem = useMutation({
    mutationFn: (item: StorageItem) =>
      clientApi(`/api/storage/items/${item.id}/trash`, {
        method: "PATCH",
        body: { trashed: false } satisfies UpdateStorageItemTrashInput,
        output: storageItemSchema,
      }),
    onSuccess: (restoredItem, item) => {
      queryClient.setQueryData<StorageItem[]>(
        trashItemsQueryKey,
        (currentItems = []) =>
          currentItems.filter((currentItem) => currentItem.id !== item.id)
      )
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (currentItems = []) => [
          restoredItem,
          ...currentItems.filter(
            (currentItem) => currentItem.id !== restoredItem.id
          ),
        ]
      )
      toast.add({
        type: "success",
        title: "Item restored",
        description: `${item.name} is back in My Drive.`,
      })
    },
    onError: (error) => {
      if (error instanceof BetterFetchError && error.status === 401) {
        return
      }

      toast.add({
        type: "error",
        title: "Restore failed",
        description: getApiErrorMessage(
          error,
          "Failed to restore the item. Please try again."
        ),
      })
    },
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
              <DropdownMenuItem
                className="cursor-pointer gap-2 px-2 py-2"
                disabled={restoreItem.isPending}
                onClick={() => restoreItem.mutate(item)}
              >
                {restoreItem.isPending &&
                restoreItem.variables?.id === item.id ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : (
                  <RotateCcw />
                )}
                Restore
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
