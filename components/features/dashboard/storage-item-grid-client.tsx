"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Eye, Pencil, Share2, Trash2 } from "lucide-react"
import { use, useState } from "react"

import { PreviewFile } from "@/components/features/dashboard/preview-storage-item-dialog"
import { RenameStorageItemDialog } from "@/components/features/dashboard/rename-storage-item-dialog"
import { StorageEmptyState } from "@/components/features/dashboard/storage-empty-state"
import { StorageItemCard } from "@/components/features/dashboard/storage-item-card"
import {
  getDriveItemsAction,
  updateStorageItemTrashAction,
} from "@/lib/actions/storage"
import { storageItemsQueryKey, trashItemsQueryKey } from "@/lib/query-keys"
import { ExpectedResultError } from "@/lib/utils/result"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import {
  type StorageItem,
  type UpdateStorageItemTrashInput,
} from "@/lib/validations/storage"

type StorageItemGridClientProps = {
  itemsPromise: Promise<StorageItem[]>
}

export function StorageItemGridClient({
  itemsPromise,
}: StorageItemGridClientProps) {
  const initialItems = use(itemsPromise)
  const [previewItem, setPreviewItem] = useState<StorageItem | null>(null)
  const [renameItem, setRenameItem] = useState<StorageItem | null>(null)
  const queryClient = useQueryClient()
  const { data: items } = useQuery({
    queryKey: storageItemsQueryKey,
    queryFn: () => getDriveItemsAction(),
    initialData: initialItems,
  })

  const { mutate, isPending, variables } = useMutation({
    mutationFn: async (item: StorageItem) => {
      const result = await updateStorageItemTrashAction(item.id, {
        trashed: true,
      } satisfies UpdateStorageItemTrashInput)
      if (!result.success) throw new ExpectedResultError(result.error)
      return result.data
    },
    onSuccess: (trashedItem, item) => {
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (currentItems = []) =>
          currentItems.filter((currentItem) => currentItem.id !== item.id)
      )
      queryClient.setQueryData<StorageItem[]>(
        trashItemsQueryKey,
        (currentItems = []) => [
          trashedItem,
          ...currentItems.filter(
            (currentItem) => currentItem.id !== trashedItem.id
          ),
        ]
      )
      toast.add({
        type: "success",
        title: "Item moved to trash",
        description: `${item.name} is now in trash.`,
      })
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Move failed",
        description:
          error instanceof ExpectedResultError
            ? error.message
            : "Failed to move the item to trash. Please try again.",
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
            pending={isPending && variables?.id === item.id}
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
                  disabled={isPending}
                  onClick={() => mutate(item)}
                >
                  <Trash2 />
                  Move to trash
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
