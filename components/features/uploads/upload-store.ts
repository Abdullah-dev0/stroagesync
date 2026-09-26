"use client"

import { useSyncExternalStore } from "react"

export type Upload = {
  id: string
  name: string
  size: number
  loadedBytes: number
  status: "uploading" | "finishing" | "done" | "error" | "canceled"
  controller: AbortController
}

export const isUploadActive = (upload: Upload) =>
  upload.status === "uploading" || upload.status === "finishing"

// A list shared by the "New" menu (starts uploads) and the upload panel
// (shows them). Lives outside React so both components see the same list.
const noUploads: Upload[] = []
let uploads = noUploads
const listeners = new Set<() => void>()

function setUploads(next: Upload[]) {
  uploads = next
  for (const listener of listeners) listener()
}

export const uploadStore = {
  add(file: File) {
    const upload: Upload = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      loadedBytes: 0,
      status: "uploading",
      controller: new AbortController(),
    }
    setUploads([upload, ...uploads])
    return upload
  },

  update(id: string, changes: Partial<Upload>) {
    setUploads(uploads.map((u) => (u.id === id ? { ...u, ...changes } : u)))
  },

  cancelAll() {
    uploads.forEach((upload) => upload.controller.abort())
  },

  clear() {
    setUploads(noUploads)
  },
}

export function useUploads() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => uploads,
    () => noUploads
  )
}
