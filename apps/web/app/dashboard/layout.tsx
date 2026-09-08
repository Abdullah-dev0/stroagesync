import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="dashboard-theme">
      <DashboardSidebar />
      <main className="flex min-h-screen w-full flex-col bg-background">
        {children}
      </main>
    </SidebarProvider>
  )
}
