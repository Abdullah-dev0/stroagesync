import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { EmptyTrashAction } from "@/components/features/trash/empty-trash-action"
import { TrashItemGridClient } from "@/components/features/trash/trash-item-grid-client"
import { TrashNotice } from "@/components/features/trash/trash-notice"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
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
    <PageShell>
      <PageHeader
        title="Trash"
        description="Restore items or remove them permanently."
        action={<EmptyTrashAction />}
      />

      <TrashNotice />

      <div className="mt-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TrashItemGridClient />
        </HydrationBoundary>
      </div>
    </PageShell>
  )
}
