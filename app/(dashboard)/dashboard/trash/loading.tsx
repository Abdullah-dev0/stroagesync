import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { TrashNotice } from "@/components/features/trash/trash-notice"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Trash
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Restore items or remove them permanently.
          </p>
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <TrashNotice />

      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </>
  )
}
