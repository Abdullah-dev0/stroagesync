"use client"

import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Download, FileText, LoaderCircle, X } from "lucide-react"

import { clientApi } from "@/lib/api/client"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { toast } from "@workspace/ui/components/toast"
import { fileDownloadSchema } from "@workspace/validation/storage"
import type {
  FilePreview as FilePreviewData,
  StorageItem,
} from "@workspace/validation/storage"

const DOWNLOAD_URL_CACHE_MS = 50_000

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
  const queryClient = useQueryClient()
  const downloadFile = useMutation({
    mutationFn: () =>
      queryClient.query({
        queryKey: ["file-download", item.id],
        queryFn: () =>
          clientApi(`/api/storage/items/${item.id}/download`, {
            output: fileDownloadSchema,
          }),
        staleTime: DOWNLOAD_URL_CACHE_MS,
        gcTime: DOWNLOAD_URL_CACHE_MS,
      }),
    onSuccess: ({ url }) => {
      window.location.assign(url)
    },
    onError: (error) => {
      if (error instanceof BetterFetchError && error.status === 401) {
        return
      }

      toast.add({
        type: "error",
        title: "Download failed",
        description: "This file could not be downloaded. Please try again.",
      })
    },
  })

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
          <Button
            variant="ghost"
            className="ml-auto gap-2 text-foreground hover:bg-muted"
            disabled={downloadFile.isPending}
            aria-busy={downloadFile.isPending}
            onClick={() => downloadFile.mutate()}
          >
            {downloadFile.isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Download aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Download</span>
          </Button>
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
            // Signed preview URLs expire quickly and do not provide intrinsic dimensions.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.data.url}
              alt={item.name}
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          )}

          {preview.data?.mimeType === "application/pdf" && (
            <div className="size-full overflow-hidden">
              <iframe
                src={`${preview.data.url}#navpanes=1`}
                title={`Preview of ${item.name}`}
                className="h-[calc(100%+3.5rem)] w-full -translate-y-14 border-0"
              />
            </div>
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
