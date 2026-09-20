import { Suspense } from "react"
import { dehydrate, HydrationBoundary, noop, QueryClient } from "@tanstack/react-query"
import { FolderPageClient } from "@/components/features/folder/folder-page-client"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { getDriveItems, getFolderDetails } from "@/lib/services/storage"
import {
  folderDetailsQueryKey,
  storageItemsByParentQueryKey,
} from "@/lib/query-keys"

type FolderPageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: FolderPageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<FolderPageSkeleton />}>
      <FolderStream folderId={id} />
    </Suspense>
  )
}

async function FolderStream({ folderId }: { folderId: string }) {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient
      .query({
        queryKey: folderDetailsQueryKey(folderId),
        queryFn: () => getFolderDetails(folderId),
      })
      .catch(noop),
    queryClient
      .query({
        queryKey: storageItemsByParentQueryKey(folderId),
        queryFn: () => getDriveItems(folderId),
      })
      .catch(noop),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FolderPageClient folderId={folderId} />
    </HydrationBoundary>
  )
}

function FolderPageSkeleton() {
  return (
    <div className="w-full p-4 sm:p-7">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="size-3.5 rounded-sm" />
        <Skeleton className="h-7 w-32 rounded-md" />
      </div>
      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </div>
  )
}
