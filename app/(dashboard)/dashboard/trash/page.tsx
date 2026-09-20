import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Clock3 } from "lucide-react"

import { EmptyTrashAction } from "@/components/features/trash/empty-trash-action"
import { TrashItemGridClient } from "@/components/features/trash/trash-item-grid-client"
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
          <HydrationBoundary state={dehydrate(queryClient)}>
            <TrashItemGridClient />
          </HydrationBoundary>
        </div>
      </div>
    </div>
  )
}
