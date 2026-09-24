import { Clock3 } from "lucide-react"

export function TrashNotice() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-card p-4">
      <Clock3
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <p className="text-sm leading-5 text-muted-foreground">
        Items in trash still use storage until you delete them permanently.
      </p>
    </div>
  )
}
