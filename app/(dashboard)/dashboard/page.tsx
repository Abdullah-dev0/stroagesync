import { dehydrate, HydrationBoundary, noop, QueryClient } from "@tanstack/react-query"
import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { getDriveItems } from "@/lib/services/storage"
import { storageItemsQueryKey } from "@/lib/query-keys"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Drive
        </h1>

        <div className="mt-6">
          <Suspense fallback={<StorageItemGridSkeleton />}>
            <DriveItemsStream />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function DriveItemsStream() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: storageItemsQueryKey,
      queryFn: () => getDriveItems(),
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StorageItemGridClient />
    </HydrationBoundary>
  )
}
