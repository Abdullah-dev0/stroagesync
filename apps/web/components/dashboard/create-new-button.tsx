"use client"

import { CloudUpload, FolderPlus, LoaderCircle, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, type SubmitEvent } from "react"
import { BetterFetchError } from "@better-fetch/fetch"
import { useMutation } from "@tanstack/react-query"

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
import {
  createFolderInputSchema,
  folderSchema,
  type CreateFolderInput,
} from "@workspace/validation/storage"
import { cn } from "cn"

export function CreateNewButton() {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [folderName, setFolderName] = useState("")
  const router = useRouter()

  const createFolder = useMutation({
    mutationFn: (input: CreateFolderInput) =>
      clientApi("/api/storage/folders", {
        method: "POST",
        body: input,
        output: folderSchema,
      }),
    onSuccess: (folder) => {
      router.refresh()
      setFolderName("")
      setErrorMessage(null)
      setIsFolderDialogOpen(false)
      toast.add({
        type: "success",
        title: "Folder created",
        description: `${folder.name} is ready.`,
      })
    },
    onError: (error) => {
      if (error instanceof BetterFetchError && error.status === 401) {
        return
      }

      setErrorMessage("Failed to create folder. Please try again.")
    },
  })

  function handleCreateFolder(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const input = createFolderInputSchema.safeParse({
      name: folderName,
      parentId: null,
    })

    if (!input.success) {
      setErrorMessage(
        input.error.issues[0]?.message ?? "Enter a valid folder name."
      )
      return
    }

    setErrorMessage(null)
    createFolder.mutate(input.data)
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
                onChange={(event) => {
                  setFolderName(event.target.value)
                  setErrorMessage(null)
                }}
                placeholder="Untitled folder"
                maxLength={255}
                disabled={createFolder.isPending}
                aria-invalid={Boolean(errorMessage)}
                className={cn(
                  "focus:ring-0 focus-visible:ring-0",
                  errorMessage &&
                    "border-red-500! focus:border-red-500! focus-visible:border-red-500!"
                )}
                aria-describedby={
                  errorMessage ? "folder-name-error" : undefined
                }
                autoComplete="off"
                autoFocus
              />
              {errorMessage && (
                <p id="folder-name-error" className="text-sm text-red-500">
                  {errorMessage}
                </p>
              )}
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
