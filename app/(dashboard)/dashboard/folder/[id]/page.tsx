import { Folder } from "lucide-react"
import { use } from "react"

import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"
import { FolderBreadcrumbs } from "@/components/features/folder/folder-breadcrumbs"
import { FolderEmptyState } from "@/components/features/folder/folder-empty-state"
import type { StorageItem } from "@/lib/validations/storage"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  // TODO: Wire up to real data
  // const { folderResult, items, breadcrumbs } = await getFolderItems(id)
  // if (!folderResult.success) notFound()

  // Placeholder data for design — remove when wiring up
  const folder = { id, name: "Design Assets" }
  const ancestors = [{ id: "parent-1", name: "Projects" }]
  const itemsPromise = Promise.resolve<StorageItem[]>([])

  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        {/* Breadcrumb navigation */}
        <FolderBreadcrumbs ancestors={ancestors} currentFolder={folder} />

        {/* Folder header */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Folder className="size-4.5 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {folder.name}
          </h1>
        </div>

        {/* Content grid */}
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
