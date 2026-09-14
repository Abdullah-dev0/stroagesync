import { Trash2 } from "lucide-react"

export function TrashEmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Trash2 className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Trash is empty
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        Items you move to trash will appear here until they are permanently
        deleted.
      </p>
    </div>
  )
}
