import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex min-h-screen w-full flex-col bg-background">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
