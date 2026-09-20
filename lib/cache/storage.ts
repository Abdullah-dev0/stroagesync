export const storageTags = {
  items(ownerId: string, parentId: string | null) {
    return parentId
      ? `storage:${ownerId}:folder:${parentId}:items`
      : `storage:${ownerId}:drive`
  },
  folder(ownerId: string, folderId: string) {
    return `storage:${ownerId}:folder:${folderId}`
  },
  trash(ownerId: string) {
    return `storage:${ownerId}:trash`
  },
  usage(ownerId: string) {
    return `storage:${ownerId}:usage`
  },
} as const
