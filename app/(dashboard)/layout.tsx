import type { Metadata } from "next"

import { DashboardSidebar } from "@/components/shared/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { QueryProvider } from "@/providers/query-provider"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { requireSession } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

export const instant = false

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()

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
