import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export function FolderPageSkeleton() {
  return (
    <div className="w-full p-4 sm:p-7">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="size-3.5 rounded-sm" />
        <Skeleton className="h-7 w-32 rounded-md" />
      </div>
      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </div>
  )
}
