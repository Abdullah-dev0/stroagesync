import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import { FolderBreadcrumbsSkeleton } from "@/components/features/folder/folder-page-skeleton"
import { PageShell } from "@/components/shared/page-shell"
import { getDriveItems, getFolderDetails } from "@/lib/data/storage-data"
import { getQueryClient } from "@/lib/get-query-client"
import { storageItemsByParentQueryKey } from "@/lib/query-keys"
import { storageItemIdSchema } from "@/lib/validations/storage"

type FolderPageProps = {
  params: Promise<{ id: string }>
}

async function FolderBreadcrumbsSection({ folderId }: { folderId: string }) {
  const folderDetails = await getFolderDetails(folderId)

  if (!folderDetails) {
    notFound()
  }

  return (
    <FolderBreadcrumbs
      ancestors={folderDetails.ancestors}
      currentFolder={folderDetails.folder}
    />
  )
}

export default async function Page({ params }: FolderPageProps) {
  const { id } = await params
  const parsedId = storageItemIdSchema.safeParse(id)

  if (!parsedId.success) {
    notFound()
  }

  const queryClient = getQueryClient()

  void queryClient
    .query({
      queryKey: storageItemsByParentQueryKey(parsedId.data),
      queryFn: () => getDriveItems(parsedId.data),
    })
    .catch(() => {})

  return (
    <PageShell>
      <Suspense fallback={<FolderBreadcrumbsSkeleton />}>
        <FolderBreadcrumbsSection folderId={parsedId.data} />
      </Suspense>

      <div className="mt-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <StorageItemGridClient
            folderId={parsedId.data}
            emptyState={<FolderEmptyState />}
          />
        </HydrationBoundary>
      </div>
    </PageShell>
  )
}
