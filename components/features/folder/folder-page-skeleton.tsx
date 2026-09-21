import { ChevronRight, HardDrive } from "lucide-react"
import Link from "next/link"

import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export function FolderBreadcrumbsSkeleton() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-0.5 text-sm">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <HardDrive className="size-3.5 shrink-0" aria-hidden="true" />
            <span>My Drive</span>
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight
            className="size-3.5 shrink-0 text-muted-foreground/50"
            aria-hidden="true"
          />
          <Skeleton className="ml-1.5 h-4 w-24 rounded-sm" />
        </li>
      </ol>
    </nav>
  )
}

export function FolderPageSkeleton() {
  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <FolderBreadcrumbsSkeleton />
        <div className="mt-6">
          <StorageItemGridSkeleton />
        </div>
      </div>
    </div>
  )
}

