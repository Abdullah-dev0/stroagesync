import { dehydrate, HydrationBoundary, noop, QueryClient } from "@tanstack/react-query"
import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { getDriveItems } from "@/lib/services/storage"
import { storageItemsQueryKey } from "@/lib/query-keys"

export default async function Page() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: storageItemsQueryKey,
      queryFn: () => getDriveItems(),
    })
    .catch(noop)

  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Drive
        </h1>

        <div className="mt-6">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <StorageItemGridClient />
          </HydrationBoundary>
        </div>
      </div>
    </div>
  )
}
