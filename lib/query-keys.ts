export const storageItemsQueryKey = ["storage-items"] as const
export const storageItemsByParentQueryKey = (parentId: string | null) =>
  parentId
    ? ([...storageItemsQueryKey, parentId] as const)
    : storageItemsQueryKey
export const trashItemsQueryKey = ["trash-items"] as const
export const storageUsageQueryKey = ["storage-usage"] as const
