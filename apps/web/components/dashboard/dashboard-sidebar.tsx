import Link from "next/link"
import { FolderClosed, HardDrive } from "lucide-react"

import { CreateNewButton } from "@/components/dashboard/create-new-button"
import { STORAGE_USAGE } from "./constants"
import { dashboardNavigation } from "@/components/dashboard/navigation"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
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
            <CreateNewButton />
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
                      className={cn(item.active && "rounded-full bg-[#E9ECFE]")}
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
                            ? "bg-[#E9ECFE] text-foreground hover:bg-[#E9ECFE] hover:text-foreground"
                            : "hover:bg-transparent hover:text-foreground"
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

      <SidebarFooter>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard/storage" />}
              tooltip={`Storage: ${STORAGE_USAGE.used} of ${STORAGE_USAGE.total}`}
              aria-label={`Storage: ${STORAGE_USAGE.used} of ${STORAGE_USAGE.total}`}
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
              {STORAGE_USAGE.used} of {STORAGE_USAGE.total}
            </span>
          </div>
          <Progress
            value={STORAGE_USAGE.percentage}
            aria-label={`${STORAGE_USAGE.percentage} percent of storage used`}
          />
          <Link
            href="/dashboard/storage"
            className="mt-3 inline-flex rounded text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Buy more storage
          </Link>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
