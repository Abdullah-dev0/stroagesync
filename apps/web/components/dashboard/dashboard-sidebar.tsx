import Link from "next/link"
import { FolderClosed } from "lucide-react"
import { Suspense } from "react"

import { StorageCreateMenu } from "@/components/dashboard/storage-create-menu.tsx"
import { dashboardNavigation } from "@/components/dashboard/navigation"
import { StorageUsageFooter } from "@/components/dashboard/storage-usage-footer"
import { StorageUsageFooterSkeleton } from "@/components/dashboard/storage-usage-footer-skeleton"
import { cn } from "@workspace/ui/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@workspace/ui/components/sidebar"

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
              tooltip="StorageSync"
              aria-label="StorageSync dashboard"
              className="font-semibold tracking-tight"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FolderClosed className="size-4" strokeWidth={2.4} />
              </span>
              <span className="group-data-[collapsible=icon]:hidden">
                StorageSync
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
            <nav aria-label="Dashboard navigation">
              <SidebarMenu className="gap-1">
                {dashboardNavigation.map((item) => {
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem
                      key={item.label}
                      className={cn(
                        item.active && "rounded-full bg-sidebar-active"
                      )}
                    >
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        tooltip={item.label}
                        aria-label={item.label}
                        aria-current={item.active ? "page" : undefined}
                        className={cn(
                          "group h-10 gap-3 rounded-full px-5 text-[16px] font-medium",
                          "hover:text-current",
                          item.active
                            ? "bg-sidebar-active text-foreground hover:bg-sidebar-active hover:text-foreground"
                            : "hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4.5",
                            item.active
                              ? "text-primary group-hover:text-primary"
                              : "group-hover:text-current"
                          )}
                        />

                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </nav>
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
