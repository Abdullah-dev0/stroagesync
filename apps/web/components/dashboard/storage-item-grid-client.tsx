"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Eye, Pencil, Share2, Trash2 } from "lucide-react"
import { useState } from "react"

import { PreviewFile } from "@/components/dashboard/preview-stroage-item-dialog"
import { RenameStorageItemDialog } from "@/components/dashboard/rename-storage-item-dialog"
import { StorageEmptyState } from "@/components/dashboard/storage-empty-state"
import { StorageItemCard } from "@/components/dashboard/storage-item-card"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { clientApi } from "@/lib/api/client"
import { storageItemsQueryKey, trashItemsQueryKey } from "@/lib/query-keys"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
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
  const [previewItem, setPreviewItem] = useState<StorageItem | null>(null)
  const [renameItem, setRenameItem] = useState<StorageItem | null>(null)
  const queryClient = useQueryClient()
  const { data: items } = useQuery({
    queryKey: storageItemsQueryKey,
    queryFn: () =>
      clientApi("/api/storage/items", {
        output: storageItemsSchema,
      }),
    initialData: initialItems,
  })

  const deleteItem = useMutation({
    mutationFn: (item: StorageItem) =>
      clientApi(`/api/storage/items/${item.id}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, item) => {
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (currentItems = []) =>
          currentItems.filter((currentItem) => currentItem.id !== item.id)
      )
      void queryClient.invalidateQueries({ queryKey: trashItemsQueryKey })
      toast.add({
        type: "success",
        title: "Item moved to trash",
        description: `${item.name} is now in trash.`,
      })
    },
    onError: (error) => {
      if (error instanceof BetterFetchError && error.status === 401) {
        return
      }

      toast.add({
        type: "error",
        title: "Delete failed",
        description: getApiErrorMessage(
          error,
          "Failed to move the item to trash. Please try again."
        ),
      })
    },
  })

  if (items.length === 0) {
    return <StorageEmptyState />
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <StorageItemCard
            key={item.id}
            item={item}
            onOpen={
              item.type === "file" ? () => setPreviewItem(item) : undefined
            }
            actions={
              <>
                {item.type === "folder" && (
                  <DropdownMenuItem className="cursor-pointer gap-2 px-2 py-2">
                    <Eye />
                    Open
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer gap-2 px-2 py-2"
                  onClick={() => setRenameItem(item)}
                >
                  <Pencil />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 px-2 py-2" disabled>
                  <Share2 />
                  Share
                  <DropdownMenuShortcut className="tracking-normal">
                    Coming soon
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer gap-2 px-2 py-2"
                  disabled={
                    deleteItem.isPending && deleteItem.variables?.id === item.id
                  }
                  onClick={() => deleteItem.mutate(item)}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </>
            }
          />
        ))}
      </div>

      {renameItem && (
        <RenameStorageItemDialog
          item={renameItem}
          open
          onOpenChange={(open) => !open && setRenameItem(null)}
        />
      )}
      {previewItem && (
        <PreviewFile
          item={previewItem}
          isPreviewOpen
          onOpenChange={(open) => !open && setPreviewItem(null)}
        />
      )}
    </>
  )
}
