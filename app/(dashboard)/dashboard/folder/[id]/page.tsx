import { notFound } from "next/navigation"
import { Suspense } from "react"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { getFolderAncestors, getFolderContent } from "@/lib/db/queries/storage"

type FolderPageProps = {
  params: Promise<{ id: string }>
}

export default function Page({ params }: FolderPageProps) {
  return (
    <div className="w-full">
      <Suspense fallback={<FolderPageSkeleton />}>
        <FolderPageContent params={params} />
      </Suspense>
    </div>
  )
}

async function FolderPageContent({ params }: FolderPageProps) {
  const { id } = await params

  // Fetch folder contents and its ancestor chain in parallel — no waterfall.
  const [result, ancestors] = await Promise.all([
    getFolderContent(id),
    getFolderAncestors(id),
  ])

  if (!result.success) {
    notFound()
  }

  const folder = result.data
  const itemsPromise = Promise.resolve(folder.children)

  return (
    <div className="w-full p-4 sm:p-7">
      <FolderBreadcrumbs ancestors={ancestors} currentFolder={folder} />
      <div className="mt-6">
        <StorageItemGridClient
          folderId={id}
          itemsPromise={itemsPromise}
          emptyState={<FolderEmptyState />}
        />
      </div>
    </div>
  )
}

function FolderPageSkeleton() {
  return (
    <div className="w-full p-4 sm:p-7">
      {/* Breadcrumb skeleton — matches the nav shape */}
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
