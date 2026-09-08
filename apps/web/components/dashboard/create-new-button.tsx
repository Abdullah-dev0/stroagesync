"use client"

import { CloudUpload, FolderPlus, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { SidebarMenuButton } from "@workspace/ui/components/sidebar"

export function CreateNewButton() {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              tooltip="New"
              aria-label="New"
              className="w-fit cursor-pointer gap-2 rounded-full border-2 border-primary bg-background p-4 text-sm font-medium text-foreground shadow-none hover:bg-background"
            />
          }
        >
          <Plus className="size-4 text-primary" strokeWidth={2.2} />
          <span className="group-data-[collapsible=icon]:hidden">New</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-52 p-2 shadow-lg"
        >
          <DropdownMenuItem
            className="cursor-pointer gap-3 px-2 py-2.5"
            onClick={() => setIsFolderDialogOpen(true)}
          >
            <FolderPlus className="size-4 text-muted-foreground" />
            New folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-3 px-2 py-2.5">
            <CloudUpload className="size-4 text-muted-foreground" />
            File upload
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-3 px-2 py-2.5">
            <CloudUpload className="size-4 text-muted-foreground" />
            Folder upload
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="folder-name">Folder name</Label>
            <Input id="folder-name" placeholder="Untitled folder" autoFocus />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="button">Create folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
