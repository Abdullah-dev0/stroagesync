import { Suspense } from "react"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ChevronRight, HardDrive } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { z } from "zod"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { getDriveItems, getFolderDetails } from "@/lib/data/storage-data"
import { getQueryClient } from "@/lib/get-query-client"
import { storageItemsByParentQueryKey } from "@/lib/query-keys"

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

function FolderBreadcrumbsSkeleton() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-0.5 text-sm">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <HardDrive className="size-3.5 shrink-0" aria-hidden="true" />
            <span>My Drive</span>
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight
            className="size-3.5 shrink-0 text-muted-foreground/50"
            aria-hidden="true"
          />
          <Skeleton className="ml-1.5 h-4 w-24 rounded-sm" />
        </li>
      </ol>
    </nav>
  )
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
      queryKey: storageItemsByParentQueryKey(parsedId.data),
      queryFn: () => getDriveItems(parsedId.data),
    })
    .catch(() => {})

  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
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
      </div>
    </div>
  )
}
