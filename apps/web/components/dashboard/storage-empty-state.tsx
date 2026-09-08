export function StorageEmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center text-center">
      <svg
        viewBox="0 0 320 220"
        className="h-52 w-full max-w-sm"
        aria-hidden="true"
      >
        <circle cx="160" cy="110" r="96" className="fill-muted" />
        <path
          d="M74 78a12 12 0 0 1 12-12h54l20 20h74a12 12 0 0 1 12 12v18H74V78Z"
          className="fill-card stroke-border"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M70 108h180l-16 70a12 12 0 0 1-12 9H94a12 12 0 0 1-12-9l-12-70Z"
          className="fill-card stroke-border"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M129 143h62M160 123v40"
          className="stroke-primary"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="248" cy="54" r="8" className="fill-primary/30" />
        <circle cx="66" cy="161" r="6" className="fill-primary/20" />
      </svg>

      <h2 className="text-lg font-semibold text-foreground">
        Your storage is empty
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create a folder or upload a file to get started.
      </p>
    </div>
  )
}
