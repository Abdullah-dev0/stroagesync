"use client"

import { EllipsisVertical, File, Folder } from "lucide-react"
import type { MouseEvent, ReactNode } from "react"

import { formatFileSize } from "@/lib/format-size"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { StorageItem } from "@/lib/validation/storage"

type StorageItemCardProps = {
  item: StorageItem
  actions: ReactNode
  muted?: boolean
  onOpen?: () => void
  pending?: boolean
}

export function StorageItemCard({
  item,
  actions,
  muted = false,
  onOpen,
  pending,
}: StorageItemCardProps) {
  const Icon = item.type === "folder" ? Folder : File

  function handleDoubleClick(event: MouseEvent<HTMLElement>) {
    if (
      !onOpen ||
      (event.target instanceof Element && event.target.closest("button"))
    ) {
      return
    }

    onOpen()
  }

  return (
    <article
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-4",
        onOpen && "cursor-pointer"
      )}
      onDoubleClick={handleDoubleClick}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          muted ? "text-muted-foreground" : "text-primary"
        )}
        aria-hidden="true"
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
          {pending ? <Spinner /> : <EllipsisVertical />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} className="w-52">
          {actions}
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  )
}
