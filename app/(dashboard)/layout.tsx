import type { Metadata } from "next"

import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar"
import { QueryProvider } from "@/providers/query-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { requireSession } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

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
          {children}
        </main>
      </SidebarProvider>
    </QueryProvider>
  )
}
