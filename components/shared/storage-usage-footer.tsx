import Link from "next/link"
import { HardDrive } from "lucide-react"

import { STORAGE_LIMIT_BYTES } from "@/lib/constants"
import { getStorageUsage } from "@/lib/queries/storage"
import { formatFileSize } from "@/lib/utils/format"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export async function StorageUsageFooter() {
  const { usedBytes } = await getStorageUsage()
  const usedStorage = formatFileSize(usedBytes)
  const totalStorage = formatFileSize(STORAGE_LIMIT_BYTES)
  const percentage = Math.min((usedBytes / STORAGE_LIMIT_BYTES) * 100, 100)
  const storageLabel = `Storage: ${usedStorage} of ${totalStorage}`

  return (
    <SidebarFooter>
      <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link href="/dashboard/storage" />}
            tooltip={storageLabel}
            aria-label={storageLabel}
          >
            <HardDrive />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <div className="p-2 pt-4 group-data-[collapsible=icon]:hidden">
        <Separator className="mb-4" />
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-foreground">Storage</span>
          <span className="text-muted-foreground">
            {usedStorage} of {totalStorage}
          </span>
        </div>
        <Progress
          value={percentage}
          aria-label={`${Math.round(percentage)} percent of storage used`}
        />
        <Link
          href="/dashboard/storage"
          className="mt-3 inline-flex rounded text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Buy more storage
        </Link>
      </div>
    </SidebarFooter>
  )
}
