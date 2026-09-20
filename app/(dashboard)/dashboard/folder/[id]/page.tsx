import { Suspense } from "react"

import { FolderPage } from "@/components/features/folder/folder-page"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

type FolderPageProps = {
  params: Promise<{ id: string }>
}

export default function Page({ params }: FolderPageProps) {
  return (
    <Suspense fallback={<FolderPageSkeleton />}>
      {params.then(({ id }) => (
        <FolderPage folderId={id} />
      ))}
    </Suspense>
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
