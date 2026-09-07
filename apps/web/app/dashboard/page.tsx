import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export default function Page() {
  return (
    <div className="w-full">
      <DashboardHeader />
      <DashboardContent />
    </div>
  )
}
