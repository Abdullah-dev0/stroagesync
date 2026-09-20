import { Suspense } from "react"

import { DriveItemsServer } from "@/components/features/dashboard/drive-items-server"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"

export default function Page() {
  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Drive
        </h1>

        <div className="mt-6">
          <Suspense fallback={<StorageItemGridSkeleton />}>
            <DriveItemsServer />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
