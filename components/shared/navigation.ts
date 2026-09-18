import type { LucideIcon } from "lucide-react"
import { Clock3, House, Star, Trash2, Users } from "lucide-react"

export type DashboardNavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  disabled?: boolean
}

export const dashboardNavigation: DashboardNavigationItem[] = [
  { label: "My Drive", href: "/dashboard", icon: House },
  {
    label: "Shared with me",
    href: "/dashboard/shared",
    icon: Users,
    disabled: true,
  },
  { label: "Recent", href: "/dashboard/recent", icon: Clock3, disabled: true },
  { label: "Starred", href: "/dashboard/starred", icon: Star, disabled: true },
  { label: "Trash", href: "/dashboard/trash", icon: Trash2 },
]
