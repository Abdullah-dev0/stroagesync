"use client"

import { RotateCcw, TriangleAlert } from "lucide-react"
import { unstable_catchError, type ErrorInfo } from "next/error"

import { Button } from "@workspace/ui/components/button"

type DataErrorBoundaryProps = {
  title?: string
  description?: string
}

function DataErrorFallback(
  { title = "Couldn't load this section", description }: DataErrorBoundaryProps,
  { error, unstable_retry }: ErrorInfo
) {
  // Errors reaching this boundary are sanitized by Next.js when they
  // originate in Server Components, so only log them — never render
  // error.message. Wire an error reporting service (e.g. Sentry) here.
  console.error(error)

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        <TriangleAlert
          className="size-4 shrink-0 text-destructive"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-destructive">{title}</p>
        <Button
          variant="outline"
          size="xs"
          className="ml-auto"
          onClick={unstable_retry}
        >
          <RotateCcw />
          Try again
        </Button>
      </div>
      {description ? (
        <p className="text-sm leading-5 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}

export default unstable_catchError(DataErrorFallback)
