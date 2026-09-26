"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CloudUpload, FolderPlus, LoaderCircle, Plus } from "lucide-react"
import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react"

import {
  createFolderAction,
  createUploadUrlsAction,
  cancelUploadsAction,
  completeUploadsAction,
} from "@/lib/actions/storage"
import {
  storageItemsByParentQueryKey,
  storageUsageQueryKey,
} from "@/lib/query-keys"
import { ExpectedResultError } from "@/lib/utils/result"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { toast } from "@/components/ui/toast"
import {
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  type CreateFolderInput,
  type CreateUploadUrlsInput,
  type StorageItem,
} from "@/lib/validations/storage"
import { cn } from "@/lib/utils/cn"
import { useParams } from "next/navigation"
import { putFileWithProgress } from "@/components/features/uploads/put-file-with-progress"
import { uploadStore } from "@/components/features/uploads/upload-store"

export function StorageCreateMenu() {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [folderName, setFolderName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const params = useParams<{ id?: string }>()
  const parentId = params.id ?? null
  const queryClient = useQueryClient()
  const itemsQueryKey = storageItemsByParentQueryKey(parentId)

  const createFolder = useMutation({
    mutationFn: async (input: CreateFolderInput) => {
      const result = await createFolderAction(input)
      if (!result.success) throw new ExpectedResultError(result.error)
      return result.data
    },
    onSuccess: (folder) => {
      queryClient.setQueryData<StorageItem[]>(itemsQueryKey, (items = []) => [
        folder,
        ...items.filter((item) => item.id !== folder.id),
      ])
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
      setErrorMessage(
        error instanceof ExpectedResultError
          ? error.message
          : "Failed to create folder. Please try again."
      )
    },
  })

  async function uploadFiles(
    files: File[],
    uploadInput: CreateUploadUrlsInput
  ) {
    // 1. Show every file in the upload panel.
    const uploads = files.map((file) => uploadStore.add(file))

    // 2. Ask the server for one upload URL per file.
    const presign = await createUploadUrlsAction(uploadInput)
    if (!presign.success) {
      uploads.forEach(({ id }) => uploadStore.update(id, { status: "error" }))
      toast.add({
        type: "error",
        title: "Upload failed",
        description: presign.error,
      })
      return
    }

    // 3. Send each file to R2. Canceled or failed files are cleaned up on the server.
    const finished: { fileId: string; uploadId: string }[] = []
    const unfinishedIds: string[] = []

    await Promise.all(
      presign.data.map(async ({ id: fileId, uploadUrl }, index) => {
        const file = files[index]
        const upload = uploads[index]
        if (!file || !upload) return

        try {
          await putFileWithProgress(
            uploadUrl,
            file,
            upload.controller.signal,
            (loadedBytes) => uploadStore.update(upload.id, { loadedBytes })
          )
          uploadStore.update(upload.id, { status: "finishing" })
          finished.push({ fileId, uploadId: upload.id })
        } catch {
          const canceled = upload.controller.signal.aborted
          uploadStore.update(upload.id, {
            status: canceled ? "canceled" : "error",
          })
          unfinishedIds.push(fileId)
        }
      })
    )

    if (unfinishedIds.length > 0) {
      void cancelUploadsAction({ fileIds: unfinishedIds })
    }
    if (finished.length === 0) return

    // 4. Tell the server which files finished so it marks them as ready.
    const finishedIds = finished.map(({ fileId }) => fileId)
    const result = await completeUploadsAction({ fileIds: finishedIds })
    finished.forEach(({ uploadId }) =>
      uploadStore.update(uploadId, {
        status: result.success ? "done" : "error",
      })
    )
    if (!result.success) return

    // 5. Show the new files in the grid and refresh the storage usage bar.
    queryClient.setQueryData<StorageItem[]>(itemsQueryKey, (items = []) => [
      ...result.data,
      ...items.filter((item) => !finishedIds.includes(item.id)),
    ])
    await queryClient.invalidateQueries({ queryKey: storageUsageQueryKey })
  }

  function handleCreateFolder(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const input = createFolderInputSchema.safeParse({
      name: folderName,
      parentId: parentId,
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

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])

    if (files.length === 0) return

    const uploadInput = createUploadUrlsInputSchema.safeParse({
      files: files.map((file) => ({
        name: file.name,
        mimeType: file.type,
        size: file.size,
      })),
    })

    if (!uploadInput.success) {
      toast.add({
        type: "error",
        title: "Upload failed",
        description:
          uploadInput.error.issues[0]?.message ??
          "One or more selected files are invalid.",
      })

      return
    }

    // Reset so selecting the same file again still fires onChange.
    event.currentTarget.value = ""
    void uploadFiles(files, uploadInput.data)
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="mx-auto mt-4 w-57"
          render={
            <SidebarMenuButton
              tooltip="New"
              aria-label="New"
              className="h-10 w-full cursor-pointer gap-3 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[background-color,scale] duration-150 ring-inset hover:bg-primary/90 hover:text-primary-foreground active:scale-96"
            />
          }
        >
          <Plus className="size-4" strokeWidth={2} />
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
          <DropdownMenuItem
            className="relative cursor-pointer gap-3 px-2 py-2.5"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload className="size-4 text-muted-foreground" />
            File upload
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 px-2 py-2.5" disabled>
            <CloudUpload className="size-4 text-muted-foreground" />
            Folder upload
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="sr-only"
        onChange={handleFileUpload}
      />

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
                    "border-destructive! focus:border-destructive! focus-visible:border-destructive!"
                )}
                aria-describedby={
                  errorMessage ? "folder-name-error" : undefined
                }
                autoComplete="off"
                autoFocus
              />
              {errorMessage && (
                <p id="folder-name-error" className="text-sm text-destructive">
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
