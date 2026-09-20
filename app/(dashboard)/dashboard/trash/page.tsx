import { Clock3 } from "lucide-react"
import { Suspense } from "react"

import {
  TrashEmptyActionContent,
  TrashGridContent,
} from "@/components/features/trash/trash-page-content"
import { StorageItemGridSkeleton } from "@/components/features/dashboard/storage-item-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  return (
    <div className="w-full p-4 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Trash
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Restore items or remove them permanently.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="h-9 w-28 rounded-md" />}>
          <TrashEmptyActionContent />
        </Suspense>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-card p-4">
        <Clock3
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p className="text-sm leading-5 text-muted-foreground">
          Items in trash still use storage until you delete them permanently.
        </p>
      </div>

      <div className="mt-6">
        <Suspense fallback={<StorageItemGridSkeleton />}>
          <TrashGridContent />
        </Suspense>
      </div>
    </div>
  )
}
