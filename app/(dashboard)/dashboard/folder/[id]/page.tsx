import { dehydrate, HydrationBoundary, noop, QueryClient } from "@tanstack/react-query"
import { FolderPageClient } from "@/components/features/folder/folder-page-client"
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
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient
      .query({
        queryKey: folderDetailsQueryKey(id),
        queryFn: () => getFolderDetails(id),
      })
      .catch(noop),
    queryClient
      .query({
        queryKey: storageItemsByParentQueryKey(id),
        queryFn: () => getDriveItems(id),
      })
      .catch(noop),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FolderPageClient folderId={id} />
    </HydrationBoundary>
  )
}
