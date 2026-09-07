import Link from "next/link"
import {
  Clock3,
  FolderClosed,
  House,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
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
    <Sidebar collapsible="offcanvas" className={className}>
      <SidebarHeader className="p-4 pb-0">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex w-fit items-center gap-2.5 rounded-lg px-1 font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="StorageSync dashboard"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FolderClosed className="size-4" strokeWidth={2.4} />
          </span>
          StorageSync
        </Link>

        <Button
          variant="outline"
          size="lg"
          className="mb-4 w-fit rounded-full px-4 shadow-sm"
        >
          <Plus data-icon="inline-start" />
          New
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-4">
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
                        aria-current={item.active ? "page" : undefined}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          item.active && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="size-4.5" />
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-6">
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
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
