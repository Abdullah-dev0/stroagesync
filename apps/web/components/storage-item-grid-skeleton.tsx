import { Skeleton } from "@workspace/ui/components/skeleton"

const SKELETON_ITEMS = Array.from({ length: 8 }, (_, index) => index)

export function StorageItemGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SKELETON_ITEMS.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
        >
          <Skeleton className="size-5 shrink-0 rounded-sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
