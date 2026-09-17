import Link from "next/link"
import { FolderClosed } from "lucide-react"
import { Suspense } from "react"

import { DashboardNavigation } from "@/components/dashboard-navigation"
import { StorageCreateMenu } from "@/components/storage-create-menu"
import { StorageUsageFooter } from "@/components/storage-usage-footer"
import { StorageUsageFooterSkeleton } from "@/components/storage-usage-footer-skeleton"
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

type DashboardSidebarProps = {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader>
        <SidebarMenu className="gap-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard" />}
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
            <StorageCreateMenu />
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

      <Suspense fallback={<StorageUsageFooterSkeleton />}>
        <StorageUsageFooter />
      </Suspense>
      <SidebarRail />
    </Sidebar>
  )
}
