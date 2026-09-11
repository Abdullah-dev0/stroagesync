import { Bell, FolderClosed, Search, Settings } from "lucide-react"

import { LogoutMenuItem } from "@/components/dashboard/logout-menu-item"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger />

      <div className="hidden items-center gap-2 font-semibold sm:flex md:hidden">
        <FolderClosed className="size-5 text-primary" />
        StorageSync
      </div>

      <div className="relative mr-auto max-w-lg flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label="Search in StorageSync"
          placeholder="Search in StorageSync"
          className="h-10 rounded-full pr-4 pl-9 shadow-none focus-visible:border-input focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-full"
              aria-label="Open user menu"
            />
          }
        >
          <Avatar className="ring-2 ring-primary ring-offset-2 ring-offset-background">
            <AvatarFallback className="bg-primary text-primary-foreground">
              AB
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-2">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-2 font-normal">
              <span className="block text-sm font-medium text-foreground">
                Alex Brown
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                alex@company.com
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-2 py-2">
              <Settings />
              Settings
            </DropdownMenuItem>
            <LogoutMenuItem />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
