import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export default function Page() {
  return (
    <TooltipProvider>
      <SidebarProvider className="dashboard-theme bg-background">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          <DashboardHeader />
          <DashboardContent />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
