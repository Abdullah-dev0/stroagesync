"use client"

import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFolderDetails } from "@/lib/api/storage"
import { folderDetailsQueryKey } from "@/lib/query-keys"

type FolderPageClientProps = {
  folderId: string
}

export function FolderPageClient({ folderId }: FolderPageClientProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: folderDetailsQueryKey(folderId),
    queryFn: () => fetchFolderDetails(folderId),
  })

  if (isPending) {
    return <FolderPageSkeleton />
  }

  if (isError || !data) {
    notFound()
  }

  return (
    <div className="w-full p-4 sm:p-7">
      <FolderBreadcrumbs
        ancestors={data.ancestors}
        currentFolder={data.folder}
      />
      <div className="mt-6">
        <StorageItemGridClient
          folderId={folderId}
          emptyState={<FolderEmptyState />}
        />
      </div>
    </div>
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
