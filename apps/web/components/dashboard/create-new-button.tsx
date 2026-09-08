"use client"

import { CloudUpload, FolderPlus, LoaderCircle, Plus } from "lucide-react"
import { useState, type SubmitEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientApi } from "@/lib/api/client"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from "@workspace/ui/components/toast"

export function CreateNewButton() {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [folderName, setFolderName] = useState("")

  const queryClient = useQueryClient()

  const createFolder = useMutation({
    mutationFn: (name: string) =>
      clientApi("/api/folders", {
        method: "POST",
        body: { name },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["files"] })
      setFolderName("")
      setIsFolderDialogOpen(false)
      toast.add({
        type: "success",
        title: "Folder created",
      })
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Could not create folder",
        description: "Please try again.",
      })
    },
  })

  function handleCreateFolder(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = folderName.trim()
    if (!name) {
      toast.add({
        type: "error",
        description: "Enter a folder name.",
      })
      return
    }

    createFolder.mutate(name)
  }

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
          <form className="grid gap-4" onSubmit={handleCreateFolder}>
            <DialogHeader>
              <DialogTitle>Create a new folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder name</Label>
              <Input
                id="folder-name"
                name="folder-name"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="Untitled folder"
                disabled={createFolder.isPending}
                autoComplete="off"
                autoFocus
              />
            </div>
            <DialogFooter>
              <DialogClose
                render={<Button variant="outline" />}
                disabled={createFolder.isPending}
              >
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={createFolder.isPending}
                aria-busy={createFolder.isPending}
              >
                {createFolder.isPending && (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                )}
                {createFolder.isPending ? "Creating..." : "Create folder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
