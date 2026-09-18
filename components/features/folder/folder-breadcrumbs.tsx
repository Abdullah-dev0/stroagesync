import { ChevronRight, HardDrive } from "lucide-react"
import Link from "next/link"

import type { Folder } from "@/lib/validations/storage"

type FolderBreadcrumbsProps = {
  ancestors: Folder[]
  currentFolder: Folder
}

export function FolderBreadcrumbs({
  ancestors,
  currentFolder,
}: FolderBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        {/* Root — My Drive */}
        <li className="flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <HardDrive className="size-3.5" aria-hidden="true" />
            <span className="max-sm:sr-only">My Drive</span>
          </Link>
        </li>

        {/* Ancestor folders */}
        {ancestors.map((ancestor) => (
          <li key={ancestor.id} className="hidden items-center gap-1.5 sm:flex">
            <ChevronRight
              className="size-3.5 shrink-0 text-muted-foreground/60"
              aria-hidden="true"
            />
            <Link
              href={`/dashboard/folder/${ancestor.id}`}
              className="max-w-32 truncate rounded-md px-1.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
            >
              {ancestor.name}
            </Link>
          </li>
        ))}

        {/* Collapsed indicator for mobile when there are ancestors */}
        {ancestors.length > 0 ? (
          <li className="flex items-center gap-1.5 sm:hidden">
            <ChevronRight
              className="size-3.5 shrink-0 text-muted-foreground/60"
              aria-hidden="true"
            />
            <span className="text-muted-foreground/60">…</span>
          </li>
        ) : null}

        {/* Current folder */}
        <li className="flex items-center gap-1.5">
          <ChevronRight
            className="size-3.5 shrink-0 text-muted-foreground/60"
            aria-hidden="true"
          />
          <span
            className="max-w-48 truncate px-1.5 py-1 font-medium text-foreground"
            aria-current="page"
          >
            {currentFolder.name}
          </span>
        </li>
      </ol>
    </nav>
  )
}
