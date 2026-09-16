import { Suspense } from "react"

import { DashboardHeader } from "@/components/dashboard-header"
import { StorageItemGridClient } from "@/components/dashboard/storage-item-grid-client"
import { StorageItemGridSkeleton } from "@/components/storage-item-grid-skeleton"
import { getServerApi } from "@/lib/api/server"
import { storageItemsSchema } from "@workspace/validation/storage"

async function getDriveItems() {
  const serverApi = await getServerApi()

  return serverApi("/api/storage/items", {
    output: storageItemsSchema,
  })
}

export default function Page() {
  const itemsPromise = getDriveItems()

  return (
    <div className="w-full">
      <DashboardHeader />
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
