import { Bell, FolderClosed, Search, Settings } from "lucide-react"
import { Suspense } from "react"

import { requireSession } from "@/lib/auth/session"
import { LogoutMenuItem } from "@/components/shared/logout-menu-item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger />

      <div className="hidden items-center gap-2 font-semibold sm:flex md:hidden">
        <FolderClosed className="size-5 text-primary" />
        Storumi
      </div>

      <div className="relative mr-auto max-w-lg flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label="Search in Storumi"
          placeholder="Search in Storumi"
          className="h-10 rounded-full pr-4 pl-9 shadow-none focus-visible:border-input focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell />
      </Button>

      <Suspense
        fallback={
          <div
            className="flex size-10 shrink-0 items-center justify-center"
            role="status"
          >
            <Skeleton className="size-8 rounded-full motion-reduce:animate-none" />
            <span className="sr-only">Loading user menu</span>
          </div>
        }
      >
        <UserMenu />
      </Suspense>
    </header>
  )
}

async function UserMenu() {
  const { user } = await requireSession()
  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || user.email.charAt(0).toUpperCase()

  return (
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
          {user.image ? <AvatarImage src={user.image} alt="" /> : null}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-normal">
            <span className="block truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {user.email}
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
  )
}
