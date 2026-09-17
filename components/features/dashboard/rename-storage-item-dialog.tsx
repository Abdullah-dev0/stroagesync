"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useState, type SubmitEvent } from "react"

import { renameStorageItemAction } from "@/lib/actions/storage"
import { storageItemsQueryKey } from "@/lib/query-keys"
import { ExpectedResultError } from "@/lib/utils/result"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import {
  renameStorageItemInputSchema,
  type RenameStorageItemInput,
  type StorageItem,
} from "@/lib/validations/storage"

type RenameStorageItemDialogProps = {
  item: StorageItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RenameStorageItemDialog({
  item,
  open,
  onOpenChange,
}: RenameStorageItemDialogProps) {
  const [name, setName] = useState(item.name)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const renameItem = useMutation({
    mutationFn: async (input: RenameStorageItemInput) => {
      const result = await renameStorageItemAction(item.id, input)
      if (!result.success) throw new ExpectedResultError(result.error)
      return result.data
    },
    onSuccess: (renamedItem) => {
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (items = []) =>
          items.map((currentItem) =>
            currentItem.id === renamedItem.id ? renamedItem : currentItem
          )
      )
      setName(renamedItem.name)
      onOpenChange(false)
      toast.add({
        type: "success",
        title: "Item renamed",
        description: `${renamedItem.name} is ready.`,
      })
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof ExpectedResultError
          ? error.message
          : "Failed to rename the item. Please try again."
      )
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    setErrorMessage(null)
    renameItem.reset()

    if (!nextOpen) {
      setName(item.name)
    }
  }

  function handleRename(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const input = renameStorageItemInputSchema.safeParse({ name })

    if (!input.success) {
      setErrorMessage(input.error.issues[0]?.message ?? "Enter a valid name.")
      return
    }

    renameItem.mutate(input.data)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form className="grid gap-4" onSubmit={handleRename}>
          <DialogHeader>
            <DialogTitle>
              Rename {item.type === "folder" ? "folder" : "file"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor={`rename-${item.id}`}>Name</Label>
            <Input
              id={`rename-${item.id}`}
              name="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setErrorMessage(null)
              }}
              maxLength={255}
              disabled={renameItem.isPending}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={
                errorMessage ? `rename-${item.id}-error` : undefined
              }
              autoComplete="off"
              autoFocus
            />
            {errorMessage && (
              <p
                id={`rename-${item.id}-error`}
                className="text-sm text-destructive"
              >
                {errorMessage}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" />}
              disabled={renameItem.isPending}
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={renameItem.isPending}
              aria-busy={renameItem.isPending}
            >
              {renameItem.isPending && (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              )}
              {renameItem.isPending ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
