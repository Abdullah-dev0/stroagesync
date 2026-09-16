import { Separator } from "@workspace/ui/components/separator"
import { SidebarFooter } from "@workspace/ui/components/sidebar"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function StorageUsageFooterSkeleton() {
  return (
    <SidebarFooter aria-busy="true">
      <div className="hidden h-8 items-center justify-center group-data-[collapsible=icon]:flex">
        <Skeleton className="size-4 rounded-sm" />
      </div>
      <div className="p-2 pt-4 group-data-[collapsible=icon]:hidden">
        <Separator className="mb-4" />
        <div className="mb-2 flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="mt-3 h-3 w-24" />
      </div>
      <span className="sr-only">Loading storage usage</span>
    </SidebarFooter>
  )
}
