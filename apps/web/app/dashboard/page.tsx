import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function Page() {
  return (
    <div className="w-full">
      <DashboardHeader />
      <DashboardContent />
    </div>
  )
}
