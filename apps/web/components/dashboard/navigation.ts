import type { LucideIcon } from "lucide-react"
import { Clock3, House, Star, Trash2, Users } from "lucide-react"

export type DashboardNavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  active?: boolean
}

export const dashboardNavigation: DashboardNavigationItem[] = [
  { label: "My Drive", href: "/dashboard", icon: House, active: true },
  { label: "Shared with me", href: "/dashboard/shared", icon: Users },
  { label: "Recent", href: "/dashboard/recent", icon: Clock3 },
  { label: "Starred", href: "/dashboard/starred", icon: Star },
  { label: "Trash", href: "/dashboard/trash", icon: Trash2 },
]
