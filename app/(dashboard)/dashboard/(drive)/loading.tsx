import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"

export default function Loading() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        My Drive
      </h1>

      <div className="mt-6">
        <StorageItemGridSkeleton />
      </div>
    </>
  )
}
