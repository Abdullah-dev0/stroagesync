"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  EllipsisVertical,
  Eye,
  File,
  Folder,
  Pencil,
  RotateCcw,
  Share2,
  Trash2,
} from "lucide-react"
import { useState, type MouseEvent } from "react"

import { getApiErrorMessage } from "@/lib/api/api-error"
import { clientApi } from "@/lib/api/client"
import { formatFileSize } from "@/lib/format-size"
import { storageItemsQueryKey, trashItemsQueryKey } from "@/lib/query-keys"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import type { StorageItem } from "@workspace/validation/storage"
import { PreviewFile } from "./preview-stroage-item-dialog"
import { RenameStorageItemDialog } from "./rename-storage-item-dialog"

type StorageItemCardProps = {
  item: StorageItem
  location?: "drive" | "trash"
}

export function StorageItemCard({
  item,
  location = "drive",
}: StorageItemCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const queryClient = useQueryClient()
  const Icon = item.type === "folder" ? Folder : File
  const isTrash = location === "trash"

  const deleteItem = useMutation({
    mutationFn: () =>
      clientApi(`/api/storage/items/${item.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (items = []) =>
          items.filter((currentItem) => currentItem.id !== item.id)
      )
      // update the cahce here after mutation
      toast.add({
        type: "success",
        title: "Item deleted",
        description: `${item.name} was removed successfully.`,
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
          "Failed to delete the item. Please try again."
        ),
      })
    },
  })

  function openPreview() {
    if (isTrash || item.type !== "file") return

    setIsPreviewOpen(true)
  }

  function handleItemDoubleClick(event: MouseEvent<HTMLElement>) {
    if (
      item.type !== "file" ||
      (event.target instanceof Element && event.target.closest("button"))
    ) {
      return
    }

    openPreview()
  }

  return (
    <>
      <article
        className={cn(
          "flex items-center gap-3 rounded-lg border border-border bg-card p-4",
          !isTrash && "cursor-pointer"
        )}
        onDoubleClick={handleItemDoubleClick}
      >
        <Icon
          className={cn(
            "size-5 shrink-0",
            isTrash ? "text-muted-foreground" : "text-primary"
          )}
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-medium text-foreground">
            {item.name}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {item.type === "folder"
              ? "Folder"
              : `${item.mimeType} · ${formatFileSize(item.size)}`}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${item.name}`}
              />
            }
          >
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="w-52">
            {isTrash ? (
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
            ) : (
              <>
                {item.type === "folder" && (
                  <DropdownMenuItem className="cursor-pointer gap-2 px-2 py-2">
                    <Eye />
                    Open
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer gap-2 px-2 py-2"
                  onClick={() => setIsRenameOpen(true)}
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
                  onClick={() => deleteItem.mutate()}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </article>
      {!isTrash && (
        <>
          <RenameStorageItemDialog
            item={item}
            open={isRenameOpen}
            onOpenChange={setIsRenameOpen}
          />
          <PreviewFile
            item={item}
            isPreviewOpen={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
          />
        </>
      )}
    </>
  )
}
