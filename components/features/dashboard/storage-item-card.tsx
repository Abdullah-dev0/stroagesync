"use client"

import { EllipsisVertical, File, Folder } from "lucide-react"
import Link from "next/link"
import type { MouseEvent, ReactNode } from "react"

import { formatFileSize } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils/cn"
import type { StorageItem } from "@/lib/validations/storage"

type StorageItemCardProps = {
  item: StorageItem
  actions: ReactNode
  href?: string
  muted?: boolean
  onOpen?: () => void
  pending?: boolean
}

export function StorageItemCard({
  item,
  actions,
  href,
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

  const itemContent = (
    <>
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
            : `${item.mimeType ?? "File"} · ${formatFileSize(item.size ?? 0)}`}
        </p>
      </div>
    </>
  )

  return (
    <article
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-4",
        (href || onOpen) && "cursor-pointer"
      )}
      onDoubleClick={onOpen ? handleDoubleClick : undefined}
    >
      {href ? (
        <Link
          href={href}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {itemContent}
        </Link>
      ) : (
        itemContent
      )}

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
