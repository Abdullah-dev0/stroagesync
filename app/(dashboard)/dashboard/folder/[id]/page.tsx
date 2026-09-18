import { Folder } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { getFolderContent } from "@/lib/db/queries/storage"

type FolderPageProps = {
  params: Promise<{ id: string }>
}

export default function Page({ params }: FolderPageProps) {
  return (
    <Suspense fallback={<FolderPageSkeleton />}>
      <FolderPageContent params={params} />
    </Suspense>
  )
}

async function FolderPageContent({ params }: FolderPageProps) {
  const { id } = await params
  const result = await getFolderContent(id)

  if (!result.success) {
    notFound()
  }

  const folder = result.data
  const itemsPromise = Promise.resolve(folder.children)

  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <FolderBreadcrumbs ancestors={[]} currentFolder={folder} />

        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Folder className="size-4.5 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {folder.name}
          </h1>
        </div>

        <div className="mt-6">
          <StorageItemGridClient
            folderId={id}
            itemsPromise={itemsPromise}
            emptyState={<FolderEmptyState />}
          />
        </div>
      </div>
    </div>
  )
}

function FolderPageSkeleton() {
  return (
    <div className="w-full p-4 sm:p-7">
      <Skeleton className="h-7 w-40" />
      <div className="mt-4 flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-8 w-52" />
      </div>
      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </div>
  )
}
