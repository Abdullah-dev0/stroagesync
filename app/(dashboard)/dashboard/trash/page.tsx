import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { EmptyTrashAction } from "@/components/features/trash/empty-trash-action"
import { TrashItemGridClient } from "@/components/features/trash/trash-item-grid-client"
import { TrashNotice } from "@/components/features/trash/trash-notice"
import { Skeleton } from "@/components/ui/skeleton"
import { getTrashItems } from "@/lib/data/storage-data"
import { getQueryClient } from "@/lib/get-query-client"
import { trashItemsQueryKey } from "@/lib/query-keys"

export default function Page() {
  const queryClient = getQueryClient()

  void queryClient
    .query({
      queryKey: trashItemsQueryKey,
      queryFn: () => getTrashItems(),
    })
    .catch(() => {})

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Trash
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Restore items or remove them permanently.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-9 w-28 rounded-md" />}>
          <EmptyTrashAction />
        </Suspense>
      </div>

      <TrashNotice />

      <div className="mt-6">
        <Suspense fallback={<StorageItemGridSkeleton />}>
          <TrashItemGridClient />
        </Suspense>
      </div>
    </HydrationBoundary>
  )
}
