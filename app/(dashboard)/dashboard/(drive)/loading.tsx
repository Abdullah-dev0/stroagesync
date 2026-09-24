import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { PageHeader, PageShell } from "@/components/shared/page-shell"

export default function Loading() {
  return (
    <PageShell>
      <PageHeader title="My Drive" />

      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </PageShell>
  )
}
