"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  EllipsisVertical,
  Eye,
  File,
  Folder,
  Pencil,
  Share2,
  Trash2
} from "lucide-react"
import { useState, type MouseEvent } from "react"

import { clientApi } from "@/lib/api/client"
import { formatFileSize } from "@/lib/format-size"
import { storageItemsQueryKey } from "@/lib/query-keys"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"
import {
  filePreviewSchema,
  type StorageItem,
} from "@workspace/validation/storage"
import { PreviewFile } from "./preview-file"

const PREVIEW_URL_CACHE_MS = 50_000

type StorageItemCardProps = {
  item: StorageItem
}

export function StorageItemCard({ item }: StorageItemCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const queryClient = useQueryClient()
  const Icon = item.type === "folder" ? Folder : File

  const previewFile = useMutation({
    mutationFn: () =>
      queryClient.query({
        queryKey: ["file-preview", item.id],
        queryFn: () =>
          clientApi(`/api/storage/items/${item.id}/preview`, {
            output: filePreviewSchema,
          }),
        staleTime: PREVIEW_URL_CACHE_MS,
        gcTime: PREVIEW_URL_CACHE_MS,
      }),
  })

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
        description:
          error.message || "Failed to delete the item. Please try again.",
      })
    },
  })

  function openPreview() {
    if (item.type !== "file") return

    previewFile.reset()
    setIsPreviewOpen(true)
    previewFile.mutate()
  }

  function handlePreviewOpenChange(open: boolean) {
    setIsPreviewOpen(open)

    if (!open) {
      previewFile.reset()
    }
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
        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-4"
        onDoubleClick={handleItemDoubleClick}
      >
        <Icon className="size-5 shrink-0 text-primary" />
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
          <DropdownMenuContent align="end" sideOffset={6} className="w-44">
            {item.type === "folder" && (
              <DropdownMenuItem className="cursor-pointer gap-2 px-2 py-2">
                <Eye />
                Open
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer gap-2 px-2 py-2">
              <Pencil />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 px-2 py-2">
              <Share2 />
              Share
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
          </DropdownMenuContent>
        </DropdownMenu>
      </article>
      <PreviewFile
        item={item}
        isPreviewOpen={isPreviewOpen}
        onOpenChange={handlePreviewOpenChange}
        preview={previewFile}
      />
    </>
  )
}
