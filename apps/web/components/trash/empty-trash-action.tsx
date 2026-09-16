"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { use, useState } from "react"

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
import { Spinner } from "@workspace/ui/components/spinner"
import { toast } from "@workspace/ui/components/toast"
import {
  deleteStorageItemsResultSchema,
  storageItemsSchema,
  type StorageItem,
} from "@workspace/validation/storage"

type EmptyTrashActionProps = {
  itemsPromise: Promise<StorageItem[]>
}

export function EmptyTrashAction({ itemsPromise }: EmptyTrashActionProps) {
  const initialItems = use(itemsPromise)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const { data: items } = useQuery({
    queryKey: trashItemsQueryKey,
    queryFn: () =>
      clientApi("/api/storage/trash", {
        output: storageItemsSchema,
      }),
    initialData: initialItems,
  })

  const emptyTrash = useMutation({
    mutationFn: () =>
      clientApi("/api/storage/trash", {
        method: "DELETE",
        output: deleteStorageItemsResultSchema,
      }),
    onSuccess: ({ deletedIds }) => {
      const deletedIdSet = new Set(deletedIds)

      queryClient.setQueryData<StorageItem[]>(trashItemsQueryKey, [])
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (currentItems = []) =>
          currentItems.filter((item) => !deletedIdSet.has(item.id))
      )
      setIsDialogOpen(false)
      toast.add({
        type: "success",
        title: "Trash emptied",
        description: "All trashed items have been permanently deleted.",
      })
    },
    onError: (error) => {
      if (error instanceof BetterFetchError && error.status === 401) {
        return
      }

      toast.add({
        type: "error",
        title: "Could not empty trash",
        description: getApiErrorMessage(
          error,
          "Failed to empty the trash. Please try again."
        ),
      })
    },
  })

  return (
    <>
      <Button
        variant="destructive"
        className="self-start"
        disabled={items.length === 0 || emptyTrash.isPending}
        aria-busy={emptyTrash.isPending}
        onClick={() => setIsDialogOpen(true)}
      >
        {emptyTrash.isPending ? <Spinner /> : <Trash2 aria-hidden="true" />}
        Empty trash
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Empty trash?</DialogTitle>
            <DialogDescription>
              All {items.length} {items.length === 1 ? "item" : "items"} in
              trash will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" />}
              disabled={emptyTrash.isPending}
            >
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              disabled={emptyTrash.isPending}
              aria-busy={emptyTrash.isPending}
              onClick={() => emptyTrash.mutate()}
            >
              {emptyTrash.isPending && <Spinner />}
              {emptyTrash.isPending ? "Deleting..." : "Empty trash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
