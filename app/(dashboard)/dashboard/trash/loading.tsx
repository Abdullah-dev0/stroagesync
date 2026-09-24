import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { TrashNotice } from "@/components/features/trash/trash-notice"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageShell>
      <PageHeader
        title="Trash"
        description="Restore items or remove them permanently."
        action={<Skeleton className="h-9 w-28 rounded-md" />}
      />

      <TrashNotice />

      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </PageShell>
  )
}
