import { Suspense } from "react"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { getDriveItems } from "@/lib/db/queries/storage"

export default function Page() {
  const itemsPromise = getDriveItems()

  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Drive
        </h1>

        <div className="mt-6">
          <Suspense fallback={<StorageItemGridSkeleton />}>
            <StorageItemGridClient itemsPromise={itemsPromise} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
