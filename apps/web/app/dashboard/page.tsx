import { StorageItemGrid } from "@/components/dashboard/storage-item-grid"
import { StorageItemGridSkeleton } from "@/components/dashboard/storage-item-grid-skeleton"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="w-full">
      <DashboardHeader />
      <div className="w-full p-4 sm:p-7">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
          My Drive
        </h1>

        <Suspense fallback={<StorageItemGridSkeleton />}>
          <StorageItemGrid />
        </Suspense>
      </div>
    </div>
  )
}
