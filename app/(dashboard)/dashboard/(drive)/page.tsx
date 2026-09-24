import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
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
    <PageShell>
      <PageHeader title="My Drive" />

      <div className="mt-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <StorageItemGridClient />
        </HydrationBoundary>
      </div>
    </PageShell>
  )
}
