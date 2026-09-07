import Link from "next/link"
import {
  Clock3,
  FolderClosed,
  HardDrive,
  House,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react"

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

const navigation = [
  { label: "My Drive", href: "/dashboard", icon: House, active: true },
  { label: "Shared with me", href: "/dashboard/shared", icon: Users },
  { label: "Recent", href: "/dashboard/recent", icon: Clock3 },
  { label: "Starred", href: "/dashboard/starred", icon: Star },
  { label: "Trash", href: "/dashboard/trash", icon: Trash2 },
]

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
            <SidebarMenuButton
              variant="outline"
              tooltip="New"
              aria-label="New"
              className="h-10 gap-3 rounded-xl"
            >
              <Plus />
              <span className="group-data-[collapsible=icon]:hidden">New</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav aria-label="Dashboard navigation">
              <SidebarMenu className="gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={item.active}
                        tooltip={item.label}
                        aria-label={item.label}
                        aria-current={item.active ? "page" : undefined}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          item.active && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="size-4.5" />
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
              tooltip="Storage: 6.4 GB of 15 GB"
              aria-label="Storage: 6.4 GB of 15 GB"
            >
              <HardDrive />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2 pt-4 group-data-[collapsible=icon]:hidden">
          <Separator className="mb-4" />
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-foreground">Storage</span>
            <span className="text-muted-foreground">6.4 GB of 15 GB</span>
          </div>
          <Progress value={43} aria-label="43 percent of storage used" />
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
