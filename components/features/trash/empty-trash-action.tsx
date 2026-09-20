"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"

import { fetchTrashItems } from "@/lib/api/storage"
import { emptyTrashAction } from "@/lib/actions/storage"
import {
  storageItemsQueryKey,
  storageUsageQueryKey,
  trashItemsQueryKey,
} from "@/lib/query-keys"
import { ExpectedResultError } from "@/lib/utils/result"
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
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import type { StorageItem } from "@/lib/validations/storage"

export function EmptyTrashAction({
  initialItems,
}: {
  initialItems: StorageItem[]
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const { data: items = initialItems } = useQuery({
    queryKey: trashItemsQueryKey,
    queryFn: fetchTrashItems,
    initialData: initialItems,
  })

  const emptyTrash = useMutation({
    mutationFn: async () => {
      const result = await emptyTrashAction()
      if (!result.success) throw new ExpectedResultError(result.error)
      return result.data
    },
    onSuccess: async ({ deletedIds }) => {
      const deletedIdSet = new Set(deletedIds)

      queryClient.setQueryData<StorageItem[]>(trashItemsQueryKey, [])
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (currentItems) =>
          currentItems?.filter((item) => !deletedIdSet.has(item.id))
      )
      await queryClient.invalidateQueries({ queryKey: storageUsageQueryKey })
      setIsDialogOpen(false)
      toast.add({
        type: "success",
        title: "Trash emptied",
        description: "All trashed items have been permanently deleted.",
      })
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Could not empty trash",
        description:
          error instanceof ExpectedResultError
            ? error.message
            : "Failed to empty the trash. Please try again.",
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
