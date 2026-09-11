import { FileText, LoaderCircle, X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import type {
  FilePreview as FilePreviewData,
  StorageItem,
} from "@workspace/validation/storage"
import Image from "next/image"

type PreviewFileProps = {
  item: StorageItem
  isPreviewOpen: boolean
  onOpenChange: (open: boolean) => void
  preview: {
    data: FilePreviewData | undefined
    isError: boolean
    isPending: boolean
  }
}

export function PreviewFile({
  item,
  isPreviewOpen,
  onOpenChange,
  preview,
}: PreviewFileProps) {
  return (
    <Dialog open={isPreviewOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="dark top-0 left-0 flex h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none bg-background p-0 text-foreground ring-0 sm:max-w-none"
      >
        <DialogHeader className="flex h-16 shrink-0 flex-row items-center gap-3 border-b border-border px-4 py-0">
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close preview"
                className="shrink-0 text-foreground hover:bg-muted"
              />
            }
          >
            <X />
          </DialogClose>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-destructive text-destructive-foreground">
            <FileText className="size-4" aria-hidden="true" />
          </span>
          <DialogTitle className="truncate text-base">{item.name}</DialogTitle>
        </DialogHeader>

        <div
          className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-8"
          aria-busy={preview.isPending}
        >
          {preview.isPending && (
            <LoaderCircle
              className="size-6 animate-spin text-muted-foreground"
              aria-label="Loading preview"
            />
          )}

          {preview.isError && (
            <div className="grid max-w-sm gap-1 p-6 text-center">
              <p className="font-medium text-foreground">Preview unavailable</p>
              <p className="text-sm text-muted-foreground">
                This file could not be previewed. Please try again.
              </p>
            </div>
          )}

          {preview.data?.mimeType.startsWith("image/") && (
            <Image
              src={preview.data.url}
              alt={item.name}
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          )}

          {preview.data?.mimeType === "application/pdf" && (
            <iframe
              src={preview.data.url}
              title={`Preview of ${item.name}`}
              className="size-full border-0"
            />
          )}

          {preview.data &&
            !preview.data.mimeType.startsWith("image/") &&
            preview.data.mimeType !== "application/pdf" && (
              <div className="grid max-w-sm gap-1 p-6 text-center">
                <p className="font-medium text-foreground">
                  Preview unavailable
                </p>
                <p className="text-sm text-muted-foreground">
                  This file type is not supported yet.
                </p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
