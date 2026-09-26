"use client"

import { ChevronDown, CircleAlert, CircleCheck, File, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils/cn"
import { formatFileSize } from "@/lib/utils/format"
import {
  isUploadActive,
  uploadStore,
  useUploads,
  type Upload,
} from "./upload-store"

export function UploadPanel() {
  const uploads = useUploads()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const activeCount = uploads.filter(isUploadActive).length

  // Ask "Leave site?" if the user refreshes or closes the tab mid-upload.
  useEffect(() => {
    if (activeCount === 0) return

    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [activeCount])

  if (uploads.length === 0) return null

  return (
    <section className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg sm:right-4 sm:left-auto sm:mx-0 sm:w-full">
      <header className="flex items-center gap-2 py-2 pr-2 pl-4">
        <h2
          aria-live="polite"
          className="flex-1 truncate text-sm font-semibold"
        >
          {activeCount > 0
            ? `Uploading ${activeCount} file${activeCount === 1 ? "" : "s"}`
            : "Uploads finished"}
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={isCollapsed ? "Expand uploads" : "Collapse uploads"}
          aria-expanded={!isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronDown
            className={cn(
              "transition-[rotate] duration-200",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={activeCount > 0 ? "Cancel all uploads" : "Close uploads"}
          onClick={activeCount > 0 ? uploadStore.cancelAll : uploadStore.clear}
        >
          <X />
        </Button>
      </header>

      {!isCollapsed && (
        <ul className="max-h-72 overflow-y-auto border-t py-1">
          {uploads.map((upload) => (
            <UploadRow key={upload.id} upload={upload} />
          ))}
        </ul>
      )}
    </section>
  )
}

function UploadRow({ upload }: { upload: Upload }) {
  const percent = Math.round((upload.loadedBytes / upload.size) * 100) || 0

  const statusText = {
    uploading: `${formatFileSize(upload.loadedBytes)} of ${formatFileSize(upload.size)} · ${percent}%`,
    finishing: "Finishing…",
    done: formatFileSize(upload.size),
    error: "Upload failed",
    canceled: "Canceled",
  }[upload.status]

  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <File className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      <div className="grid min-w-0 flex-1 gap-1.5">
        <p className="truncate text-sm font-medium">{upload.name}</p>
        {upload.status === "uploading" && (
          <Progress value={percent} aria-label={`Uploading ${upload.name}`} />
        )}
        <p
          className={cn(
            "text-xs text-muted-foreground tabular-nums",
            upload.status === "error" && "text-destructive"
          )}
        >
          {statusText}
        </p>
      </div>

      <span className="flex size-7 shrink-0 items-center justify-center">
        {upload.status === "uploading" && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Cancel upload of ${upload.name}`}
            onClick={() => upload.controller.abort()}
          >
            <X />
          </Button>
        )}
        {upload.status === "finishing" && (
          <Spinner className="text-muted-foreground" />
        )}
        {upload.status === "done" && (
          <CircleCheck className="size-4 text-primary" aria-label="Uploaded" />
        )}
        {upload.status === "error" && (
          <CircleAlert
            className="size-4 text-destructive"
            aria-label="Failed"
          />
        )}
      </span>
    </li>
  )
}
