import { Clock3 } from "lucide-react"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { EmptyTrashAction } from "@/components/features/trash/empty-trash-action"
import { TrashItemGridClient } from "@/components/features/trash/trash-item-grid-client"
import { Suspense } from "react"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { getTrashItems } from "@/lib/services/storage"
import { trashItemsQueryKey } from "@/lib/query-keys"

export default function Page() {
  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Trash
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Restore items or remove them permanently.
            </p>
          </div>

          <EmptyTrashAction />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-card p-4">
          <Clock3
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-sm leading-5 text-muted-foreground">
            Items in trash still use storage until you delete them permanently.
          </p>
        </div>

        <div className="mt-6">
          <Suspense fallback={<StorageItemGridSkeleton />}>
            <TrashItemsStream />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function TrashItemsStream() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: trashItemsQueryKey,
      queryFn: getTrashItems,
    })
    .catch(() => {})

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrashItemGridClient />
    </HydrationBoundary>
  )
}
