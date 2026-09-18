export function FolderEmptyState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center text-center">
      <svg
        viewBox="0 0 320 220"
        className="h-44 w-full max-w-xs"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="160" cy="110" r="90" className="fill-muted/60" />

        {/* Open folder — back panel */}
        <path
          d="M80 88a10 10 0 0 1 10-10h46l18 18h66a10 10 0 0 1 10 10v14H80V88Z"
          className="fill-card stroke-border"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Open folder — front flap (tilted open) */}
        <path
          d="M74 114h172l-14 64a10 10 0 0 1-10 8H100a10 10 0 0 1-10-8L74 114Z"
          className="fill-card stroke-border"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Dashed empty indicator inside folder */}
        <rect
          x="128"
          y="136"
          width="64"
          height="8"
          rx="4"
          className="fill-muted-foreground/15"
        />
        <rect
          x="140"
          y="152"
          width="40"
          height="6"
          rx="3"
          className="fill-muted-foreground/10"
        />

        {/* Decorative dots */}
        <circle cx="244" cy="60" r="6" className="fill-primary/25" />
        <circle cx="72" cy="164" r="4.5" className="fill-primary/15" />
        <circle cx="256" cy="148" r="3" className="fill-primary/20" />
      </svg>

      <h2 className="text-lg font-semibold text-foreground">
        This folder is empty
      </h2>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
        Upload files or create a new folder to get started.
      </p>
    </div>
  )
}
