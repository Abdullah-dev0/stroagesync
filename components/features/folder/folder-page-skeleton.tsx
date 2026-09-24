import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import {
  BreadcrumbSeparator,
  DriveBreadcrumbItem,
} from "@/components/features/folder/folder-breadcrumbs"
import { Skeleton } from "@/components/ui/skeleton"

export function FolderBreadcrumbsSkeleton() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-0.5 text-sm">
        <DriveBreadcrumbItem />
        <li className="flex items-center">
          <BreadcrumbSeparator />
          <Skeleton className="ml-1.5 h-4 w-24 rounded-sm" />
        </li>
      </ol>
    </nav>
  )
}

export function FolderPageSkeleton() {
  return (
    <>
      <FolderBreadcrumbsSkeleton />
      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </>
  )
}
