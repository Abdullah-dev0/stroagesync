import Link from "next/link"
import { FolderClosed } from "lucide-react"
import { Suspense } from "react"

import { DashboardNavigation } from "@/components/shared/dashboard-navigation"
import { StorageCreateMenu } from "@/components/features/dashboard/storage-create-menu"
import { StorageUsageFooter } from "@/components/shared/storage-usage-footer"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="gap-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard" prefetch={true} />}
              size="lg"
              tooltip="Storumi"
              aria-label="Storumi dashboard"
              className="font-semibold tracking-tight"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FolderClosed className="size-4" strokeWidth={2.4} />
              </span>
              <span className="group-data-[collapsible=icon]:hidden">
                Storumi
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Suspense
              fallback={
                <Skeleton className="mx-auto mt-4 h-10 w-57 rounded-xl group-data-[collapsible=icon]:size-8" />
              }
            >
              <StorageCreateMenu />
            </Suspense>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <DashboardNavigation />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <StorageUsageFooter />
      <SidebarRail />
    </Sidebar>
  )
}
