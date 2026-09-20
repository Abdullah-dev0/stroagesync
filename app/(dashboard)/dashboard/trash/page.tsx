import { Suspense } from "react"

import { TrashPageContent } from "@/components/features/trash/trash-page-content"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  return (
    <Suspense fallback={<TrashPageSkeleton />}>
      <TrashPageContent />
    </Suspense>
  )
}

function TrashPageSkeleton() {
  return (
    <div className="w-full p-4 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <Skeleton className="mt-6 h-14 w-full rounded-lg" />
      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </div>
  )
}
