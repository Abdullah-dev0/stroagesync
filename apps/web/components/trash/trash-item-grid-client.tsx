"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, RotateCcw, Trash2 } from "lucide-react"
import { useState } from "react"

import { StorageItemCard } from "@/components/storage-item-card"
import { TrashEmptyState } from "@/components/trash/trash-empty-state"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { clientApi } from "@/lib/api/client"
import { storageItemsQueryKey, trashItemsQueryKey } from "@/lib/query-keys"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
import {
  deleteStorageItemsResultSchema,
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
  const [deleteItem, setDeleteItem] = useState<StorageItem | null>(null)
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
      clientApi("/api/storage/items/" + item.id + "/trash", {
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
        description: item.name + " is back in My Drive.",
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

  const permanentlyDeleteItem = useMutation({
    mutationFn: (item: StorageItem) =>
      clientApi("/api/storage/items/" + item.id, {
        method: "DELETE",
        output: deleteStorageItemsResultSchema,
      }),
    onSuccess: ({ deletedIds }, item) => {
      const deletedIdSet = new Set(deletedIds)

      queryClient.setQueryData<StorageItem[]>(
        trashItemsQueryKey,
        (currentItems = []) =>
          currentItems.filter(
            (currentItem) => !deletedIdSet.has(currentItem.id)
          )
      )
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (currentItems = []) =>
          currentItems.filter(
            (currentItem) => !deletedIdSet.has(currentItem.id)
          )
      )
      setDeleteItem(null)
      toast.add({
        type: "success",
        title: "Item deleted permanently",
        description: item.name + " has been permanently deleted.",
      })
    },
    onError: (error) => {
      if (error instanceof BetterFetchError && error.status === 401) {
        return
      }

      toast.add({
        type: "error",
        title: "Permanent deletion failed",
        description: getApiErrorMessage(
          error,
          "Failed to delete the item permanently. Please try again."
        ),
      })
    },
  })

  return (
    <>
      {items.length === 0 ? (
        <TrashEmptyState />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <StorageItemCard
              key={item.id}
              item={item}
              muted
              pending={restoreItem.isPending || permanentlyDeleteItem.isPending}
              actions={
                <>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 px-2 py-2"
                    disabled={restoreItem.isPending}
                    onClick={() => restoreItem.mutate(item)}
                  >
                    {restoreItem.isPending &&
                    restoreItem.variables?.id === item.id ? (
                      <LoaderCircle
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <RotateCcw />
                    )}
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer gap-2 px-2 py-2"
                    disabled={permanentlyDeleteItem.isPending}
                    onClick={() => setDeleteItem(item)}
                  >
                    <Trash2 />
                    Delete forever
                  </DropdownMenuItem>
                </>
              }
            />
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(deleteItem)}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete permanently?</DialogTitle>
            <DialogDescription>
              {deleteItem?.type === "folder"
                ? "“" +
                  deleteItem.name +
                  "” and everything inside it will be permanently deleted."
                : "“" +
                  deleteItem?.name +
                  "” will be permanently deleted."}{" "}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" />}
              disabled={permanentlyDeleteItem.isPending}
            >
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!deleteItem || permanentlyDeleteItem.isPending}
              aria-busy={permanentlyDeleteItem.isPending}
              onClick={() =>
                deleteItem && permanentlyDeleteItem.mutate(deleteItem)
              }
            >
              {permanentlyDeleteItem.isPending && (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              )}
              {permanentlyDeleteItem.isPending
                ? "Deleting..."
                : "Delete forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
