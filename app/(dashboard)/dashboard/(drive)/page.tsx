import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { getDriveItems } from "@/lib/data/storage-data"
import { getQueryClient } from "@/lib/get-query-client"
import { storageItemsByParentQueryKey } from "@/lib/query-keys"

export default function Page() {
  const queryClient = getQueryClient()

  void queryClient
    .query({
      queryKey: storageItemsByParentQueryKey(null),
      queryFn: () => getDriveItems(null),
    })
    .catch(() => {})

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        My Drive
      </h1>

      <div className="mt-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<StorageItemGridSkeleton />}>
            <StorageItemGridClient />
          </Suspense>
        </HydrationBoundary>
      </div>
    </>
  )
}
