"use client"

import { RotateCcw, TriangleAlert } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@workspace/ui/components/button"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
        <main
          role="alert"
          className="flex w-full max-w-md flex-col items-start gap-4 rounded-xl border border-destructive/30 bg-card p-6"
        >
          <div className="flex items-center gap-2 font-medium text-destructive">
            <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
            Something went wrong
          </div>
          <p className="text-sm leading-5 text-muted-foreground">
            The application couldn&apos;t load. Try again to recover.
          </p>
          <Button variant="outline" onClick={unstable_retry}>
            <RotateCcw />
            Try again
          </Button>
        </main>
      </body>
    </html>
  )
}
