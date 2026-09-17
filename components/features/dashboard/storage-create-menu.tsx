"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CloudUpload, FolderPlus, LoaderCircle, Plus } from "lucide-react"
import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react"

import {
  createFolderAction,
  createUploadUrlsAction,
  completeUploadsAction,
} from "@/lib/actions/storage"
import {
  storageItemsQueryKey,
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
  completeUploadsInputSchema,
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  type CreateFolderInput,
  type CreateUploadUrlsInput,
  type StorageItem,
} from "@/lib/validations/storage"
import { cn } from "cn"

export function StorageCreateMenu() {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [folderName, setFolderName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const createFolder = useMutation({
    mutationFn: async (input: CreateFolderInput) => {
      const result = await createFolderAction(input)
      if (!result.success) throw new ExpectedResultError(result.error)
      return result.data
    },
    onSuccess: (folder) => {
      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (items) =>
          items
            ? [folder, ...items.filter((item) => item.id !== folder.id)]
            : items
      )
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

  const handleUploadFiles = useMutation({
    mutationFn: async ({
      files,
      uploadInput,
    }: {
      files: File[]
      uploadInput: CreateUploadUrlsInput
    }) => {
      const presign = await createUploadUrlsAction(uploadInput)
      if (!presign.success) throw new ExpectedResultError(presign.error)
      const uploads = presign.data

      if (uploads.length !== files.length) {
        throw new Error("Received an unexpected number of upload URLs.")
      }

      await Promise.all(
        uploads.map(async (upload, index) => {
          const file = files[index]

          if (!file) {
            throw new Error("Missing file for upload.")
          }

          const response = await fetch(upload.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": upload.mimeType },
            body: file,
          })

          if (!response.ok) {
            throw new Error("R2 upload failed.")
          }
        })
      )

      const completionInput = completeUploadsInputSchema.parse({
        fileIds: uploads.map(({ id }) => id),
      })

      const result = await completeUploadsAction(completionInput)
      if (!result.success) throw new ExpectedResultError(result.error)
      return result.data
    },
    onMutate: ({ files }) => {
      const toastId = toast.add({
        type: "loading",
        title: "Uploading files",
        description:
          files.length === 1
            ? `${files[0]?.name ?? "File"} is uploading.`
            : `${files.length} files are uploading.`,
        timeout: 0,
      })

      return { toastId }
    },
    onSuccess: (uploadedFiles, _variables, mutationContext) => {
      const uploadedFileIds = new Set(uploadedFiles.map(({ id }) => id))

      queryClient.setQueryData<StorageItem[]>(
        storageItemsQueryKey,
        (items) =>
          items
            ? [
                ...uploadedFiles,
                ...items.filter(({ id }) => !uploadedFileIds.has(id)),
              ]
            : items
      )
      void queryClient.invalidateQueries({ queryKey: storageUsageQueryKey })

      toast.update(mutationContext.toastId, {
        type: "success",
        title: "Files uploaded",
        description: "Your files have been uploaded successfully.",
        timeout: 5000,
      })
    },
    onSettled: (_data, error, _variables, mutationContext) => {
      if (!mutationContext) return

      if (!error) {
        toast.update(mutationContext.toastId, {
          type: "success",
          title: "Files uploaded",
          description: "Your files have been uploaded successfully.",
          timeout: 5000,
        })

        return
      }

      toast.update(mutationContext.toastId, {
        type: "error",
        title: "Upload failed",
        description:
          error instanceof ExpectedResultError
            ? error.message
            : "We couldn't upload your files. Please try again.",
        timeout: 5000,
        priority: "high",
      })
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

    handleUploadFiles.mutate({
      files,
      uploadInput: uploadInput.data,
    })
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
