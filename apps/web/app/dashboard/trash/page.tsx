import { Suspense } from "react"

import { DashboardHeader } from "@/components/dashboard-header"
import { StorageItemGridSkeleton } from "@/components/storage-item-grid-skeleton"
import { TrashItemGrid } from "@/components/trash/trash-item-grid"

export default function Page() {
  return (
    <div className="w-full">
      <DashboardHeader />
      <Suspense
        fallback={
          <div className="w-full p-4 sm:p-7">
            <StorageItemGridSkeleton />
          </div>
        }
      >
        <TrashItemGrid />
      </Suspense>
    </div>
  )
}
