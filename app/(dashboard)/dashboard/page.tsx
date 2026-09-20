import { StorageItemGridClient } from "@/components/features/dashboard/storage-item-grid-client"

export default function Page() {
  return (
    <div className="w-full">
      <div className="w-full p-4 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Drive
        </h1>

        <div className="mt-6">
          <StorageItemGridClient />
        </div>
      </div>
    </div>
  )
}
