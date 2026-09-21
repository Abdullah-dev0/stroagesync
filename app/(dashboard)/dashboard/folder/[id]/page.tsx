import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { z } from "zod"

import { FolderPageClient } from "@/components/features/folder/folder-page-client"
import { getDriveItems, getFolderDetails } from "@/lib/data/storage-data"
import { getQueryClient } from "@/lib/get-query-client"
import {
  folderDetailsQueryKey,
  storageItemsByParentQueryKey,
} from "@/lib/query-keys"

type FolderPageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: FolderPageProps) {
  const { id } = await params
  const parsedId = z.uuid().safeParse(id)

  if (!parsedId.success) {
    notFound()
  }

  const queryClient = getQueryClient()

  void queryClient
    .query({
      queryKey: folderDetailsQueryKey(parsedId.data),
      queryFn: () => getFolderDetails(parsedId.data),
    })
    .catch(() => {})

  void queryClient
    .query({
      queryKey: storageItemsByParentQueryKey(parsedId.data),
      queryFn: () => getDriveItems(parsedId.data),
    })
    .catch(() => {})

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FolderPageClient folderId={parsedId.data} />
    </HydrationBoundary>
  )
}
