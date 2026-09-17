"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { dashboardNavigation } from "@/components/navigation"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DashboardNavigation() {
  const pathname = usePathname()

  return (
    <nav aria-label="Dashboard navigation">
      <SidebarMenu className="gap-1">
        {dashboardNavigation.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))

          return (
            <SidebarMenuItem
              key={item.label}
              className={cn(isActive && "rounded-full bg-sidebar-active")}
            >
              <SidebarMenuButton
                render={<Link href={item.href} />}
                tooltip={item.label}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                isActive={isActive}
                className={cn(
                  "group h-10 gap-3 rounded-full px-5 text-[16px] font-medium ring-inset",
                  "hover:text-current",
                  isActive
                    ? "bg-sidebar-active text-foreground hover:bg-sidebar-active hover:text-foreground"
                    : "hover:bg-muted hover:text-foreground"
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

                <span className="group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </nav>
  )
}
