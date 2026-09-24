import { ChevronRight, HardDrive } from "lucide-react"
import Link from "next/link"

import type { Folder } from "@/lib/validations/storage"

type FolderBreadcrumbsProps = {
  ancestors: Folder[]
  currentFolder: Folder
}

export function BreadcrumbSeparator() {
  return (
    <ChevronRight
      className="size-3.5 shrink-0 text-muted-foreground/50"
      aria-hidden="true"
    />
  )
}

// Shared with the loading skeleton so the root link never shifts.
export function DriveBreadcrumbItem() {
  return (
    <li className="flex items-center">
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
      >
        <HardDrive className="size-3.5 shrink-0" aria-hidden="true" />
        <span>My Drive</span>
      </Link>
    </li>
  )
}

export function FolderBreadcrumbs({
  ancestors,
  currentFolder,
}: FolderBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-0.5 text-sm">
        <DriveBreadcrumbItem />

        {/* Ancestor folders — hidden on mobile, collapsed to ellipsis */}
        {ancestors.map((ancestor) => (
          <li key={ancestor.id} className="hidden items-center sm:flex">
            <BreadcrumbSeparator />
            <Link
              href={`/dashboard/folder/${ancestor.id}`}
              prefetch={true}
              className="max-w-32 truncate rounded-md px-1.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
            >
              {ancestor.name}
            </Link>
          </li>
        ))}

        {/* Collapsed indicator on mobile when there are ancestors */}
        {ancestors.length > 0 ? (
          <li className="flex items-center sm:hidden" aria-hidden="true">
            <BreadcrumbSeparator />
            <span className="px-1 text-muted-foreground/50">…</span>
          </li>
        ) : null}

        {/* Current folder — always visible */}
        <li className="flex items-center">
          <BreadcrumbSeparator />
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
