"use client"

import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import { FolderPageSkeleton } from "@/components/features/folder/folder-page-skeleton"
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

