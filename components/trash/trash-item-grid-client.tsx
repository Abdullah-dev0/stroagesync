"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, RotateCcw, Trash2 } from "lucide-react"
import { use, useState } from "react"

import { StorageItemCard } from "@/components/storage-item-card"
import { TrashEmptyState } from "@/components/trash/trash-empty-state"
import { clientApi } from "@/lib/fetch"
import {
  updateStorageItemTrashAction,
  deleteTrashedItemAction,
} from "@/app/dashboard/actions"
import { storageItemsQueryKey, trashItemsQueryKey } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import {
  storageItemsSchema,
  type StorageItem,
  type UpdateStorageItemTrashInput,
} from "@/lib/validation/storage"

type TrashItemGridClientProps = {
  itemsPromise: Promise<StorageItem[]>
}

export function TrashItemGridClient({
  itemsPromise,
}: TrashItemGridClientProps) {
  const initialItems = use(itemsPromise)
  const [deleteItem, setDeleteItem] = useState<StorageItem | null>(null)
  const queryClient = useQueryClient()
  const { data: items } = useQuery({
    queryKey: trashItemsQueryKey,
    queryFn: () =>
      clientApi("/api/v1/storage/trash", {
        output: storageItemsSchema,
      }),
    initialData: initialItems,
  })

  const restoreItem = useMutation({
    mutationFn: async (item: StorageItem) => {
      const result = await updateStorageItemTrashAction(item.id, {
        trashed: false,
      } satisfies UpdateStorageItemTrashInput)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
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
      toast.add({
        type: "error",
        title: "Restore failed",
        description:
          error.message || "Failed to restore the item. Please try again.",
      })
    },
  })

  const permanentlyDeleteItem = useMutation({
    mutationFn: async (item: StorageItem) => {
      const result = await deleteTrashedItemAction(item.id)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
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
      toast.add({
        type: "error",
        title: "Permanent deletion failed",
        description:
          error.message ||
          "Failed to delete the item permanently. Please try again.",
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
              pending={
                restoreItem.isPending && restoreItem.variables?.id === item.id
              }
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
