"use client"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
  unstable_retry,
}: {
  unstable_retry: () => void
}) {
  return (
    <div role="alert" className="space-y-3 p-6">
      <p>Something went wrong. Please try again.</p>
      <Button variant="outline" onClick={unstable_retry}>
        Try again
      </Button>
    </div>
  )
}
