"use client"

import { useEffect } from "react"

import { RotateCcw, TriangleAlert } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

type DashboardErrorProps = {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function DashboardError({
  error,
  unstable_retry,
}: DashboardErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service (e.g. Sentry) here.
    console.error(error)
  }, [error])

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-destructive">
        <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
        Couldn&apos;t load your items
      </div>
      <p className="text-sm leading-5 text-muted-foreground">
        Something went wrong while fetching your files. Check your connection
        and try again.
      </p>
      <Button variant="outline" size="sm" onClick={unstable_retry}>
        <RotateCcw />
        Try again
      </Button>
    </div>
  )
}
