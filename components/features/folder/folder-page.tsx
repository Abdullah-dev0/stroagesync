import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { getFolderDetails } from "@/lib/queries/storage"

export async function FolderPage({ folderId }: { folderId: string }) {
  const data = await getFolderDetails(folderId)

  return (
    <div className="w-full p-4 sm:p-7">
      <FolderBreadcrumbs
        ancestors={data.ancestors}
        currentFolder={data.folder}
      />
      <div className="mt-6">
        <StorageItemGridClient
          folderId={folderId}
          initialItems={data.children}
          emptyState={<FolderEmptyState />}
        />
      </div>
    </div>
  )
}
