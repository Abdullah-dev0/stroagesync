"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"

import { dashboardNavigation } from "@/components/shared/navigation"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils/cn"

export function DashboardNavigation() {
  return (
    <nav aria-label="Dashboard navigation">
      <SidebarMenu className="gap-1">
        {dashboardNavigation.map((item) =>
          item.disabled ? (
            <DashboardNavigationItem key={item.label} item={item} />
          ) : (
            <Suspense
              key={item.label}
              fallback={<DashboardNavigationItem item={item} />}
            >
              <ActiveDashboardNavigationItem item={item} />
            </Suspense>
          )
        )}
      </SidebarMenu>
    </nav>
  )
}

type DashboardNavigationItemProps = {
  item: (typeof dashboardNavigation)[number]
  isActive?: boolean
}

function ActiveDashboardNavigationItem({
  item,
}: DashboardNavigationItemProps) {
  const pathname = usePathname()
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))

  return <DashboardNavigationItem item={item} isActive={isActive} />
}

function DashboardNavigationItem({
  item,
  isActive = false,
}: DashboardNavigationItemProps) {
  const Icon = item.icon

  return (
    <SidebarMenuItem
      className={cn(
        isActive && "bg-sidebar-active rounded-full",
        item.disabled && "opacity-90"
      )}
    >
      <SidebarMenuButton
        render={item.disabled ? undefined : <Link href={item.href} />}
        tooltip={item.disabled ? "Coming soon" : item.label}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={item.disabled || undefined}
        isActive={item.disabled ? false : isActive}
        className={cn(
          "group h-10 gap-3 rounded-full px-5 text-[16px] font-medium ring-inset",
          "hover:text-current",
          isActive
            ? "bg-sidebar-active hover:bg-sidebar-active text-foreground hover:text-foreground"
            : !item.disabled && "hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon
          className={cn(
            "size-4.5",
            isActive
              ? "text-primary group-hover:text-primary"
              : "group-hover:text-current"
          )}
        />

        <span className="truncate group-data-[collapsible=icon]:hidden">
          {item.label}
        </span>

        {item.disabled && (
          <span className="ml-auto text-[9px] font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase">
            Soon
          </span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
