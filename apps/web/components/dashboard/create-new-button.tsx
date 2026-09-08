"use client"

import { Plus } from "lucide-react"

import { SidebarMenuButton } from "@workspace/ui/components/sidebar"

export function CreateNewButton() {
  return (
    <SidebarMenuButton
      variant="outline"
      tooltip="New"
      aria-label="New"
      className="h-10 gap-3 rounded-xl"
    >
      <Plus />
      <span className="group-data-[collapsible=icon]:hidden">New</span>
    </SidebarMenuButton>
  )
}
