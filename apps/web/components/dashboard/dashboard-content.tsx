import {
  FileChartColumn,
  FileSpreadsheet,
  FileText,
  Film,
  Folder,
  Image as ImageIcon,
  Presentation,
  Star,
} from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

const folders = [
  "Product Launch",
  "Design Assets",
  "Team Onboarding",
  "Finance 2026",
]

const files = [
  {
    name: "Q3 Roadmap.docx",
    meta: "2 hours ago · You",
    icon: FileText,
    previewClassName: "bg-chart-2/10",
    iconClassName: "text-chart-2",
    starred: true,
  },
  {
    name: "Marketing Budget.xlsx",
    meta: "Yesterday · Priya Nair",
    icon: FileSpreadsheet,
    previewClassName: "bg-chart-4/10",
    iconClassName: "text-chart-4",
  },
  {
    name: "Investor Deck.pptx",
    meta: "3 days ago · You",
    icon: Presentation,
    previewClassName: "bg-chart-3/10",
    iconClassName: "text-chart-3",
  },
  {
    name: "Vendor Agreement.pdf",
    meta: "Sep 1 · Tom Reyes",
    icon: FileChartColumn,
    previewClassName: "bg-destructive/10",
    iconClassName: "text-destructive",
  },
  {
    name: "Campaign Hero.png",
    meta: "Aug 24 · You",
    icon: ImageIcon,
    previewClassName: "bg-chart-1/10",
    iconClassName: "text-chart-1",
  },
  {
    name: "Demo Walkthrough.mp4",
    meta: "Aug 20 · You",
    icon: Film,
    previewClassName: "bg-chart-5/10",
    iconClassName: "text-chart-5",
  },
  {
    name: "Meeting Notes.docx",
    meta: "Aug 19 · You",
    icon: FileText,
    previewClassName: "bg-chart-2/10",
    iconClassName: "text-chart-2",
  },
  {
    name: "Hiring Tracker.xlsx",
    meta: "Aug 14 · You",
    icon: FileSpreadsheet,
    previewClassName: "bg-chart-4/10",
    iconClassName: "text-chart-4",
  },
]

export function DashboardContent() {
  return (
    <div className="w-full p-4 sm:p-7">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        My Drive
      </h1>

      <section className="mt-6" aria-labelledby="folders-heading">
        <h2
          id="folders-heading"
          className="mb-3 text-sm font-medium text-muted-foreground"
        >
          Folders
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {folders.map((folder) => (
            <button
              key={folder}
              type="button"
              className="flex h-12 items-center gap-3 rounded-lg border border-border bg-card px-4 text-left text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Folder className="size-5 text-primary" />
              <span className="truncate">{folder}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7" aria-labelledby="files-heading">
        <h2
          id="files-heading"
          className="mb-3 text-sm font-medium text-muted-foreground"
        >
          Files
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => {
            const Icon = file.icon

            return (
              <article
                key={file.name}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div
                  className={cn(
                    "relative flex h-26 items-center justify-center",
                    file.previewClassName
                  )}
                >
                  {file.starred && (
                    <span className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-full bg-background shadow-xs">
                      <Star
                        className="size-4 fill-chart-3 text-chart-3"
                        aria-label="Starred"
                      />
                    </span>
                  )}
                  <Icon className={cn("size-9", file.iconClassName)} />
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {file.meta}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
