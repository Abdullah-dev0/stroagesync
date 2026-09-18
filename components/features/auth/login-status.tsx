"use client"

import { CircleCheck, CircleX } from "lucide-react"
import { useSearchParams } from "next/navigation"

export function LoginStatus() {
  const searchParams = useSearchParams()
  const signupSucceeded = searchParams.get("signup") === "success"
  const unauthorized = searchParams.get("unauthorized") === "true"

  return (
    <>
      {signupSucceeded && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground"
        >
          <CircleCheck
            className="mt-0.5 size-4.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>Your account was created successfully. Sign in to continue.</p>
        </div>
      )}

      {unauthorized && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground"
        >
          <CircleX
            className="mt-0.5 size-4.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>Your session expired. Sign in again to continue.</p>
        </div>
      )}
    </>
  )
}
