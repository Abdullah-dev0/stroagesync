import type { Metadata } from "next"

import { DashboardSidebar } from "@/components/shared/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { QueryProvider } from "@/providers/query-provider"
import { DashboardHeader } from "@/components/shared/dashboard-header"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <SidebarProvider className="dashboard-theme">
        <DashboardSidebar />
        <main className="flex min-h-screen w-full flex-col bg-background">
          <DashboardHeader />
          {children}
        </main>
      </SidebarProvider>
    </QueryProvider>
  )
}
