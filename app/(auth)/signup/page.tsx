import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { SignupForm } from "@/components/features/auth/signup-form"
import { Skeleton } from "@/components/ui/skeleton"
import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Storumi account and start storing files securely.",
}

export default function Page() {
  return (
    <Suspense fallback={<SignupPageSkeleton />}>
      <SignupPageContent />
    </Suspense>
  )
}

async function SignupPageContent() {
  if (await getSession()) redirect("/dashboard")

  return (
    <>
      <div className="mb-12 flex items-center justify-between lg:hidden">
        <Link
          href="/login"
          className="rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Sign in
        </Link>
      </div>

      <div className="mb-9">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Start storing and sharing your files in minutes.
        </p>
      </div>

      <SignupForm />
    </>
  )
}

function SignupPageSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Checking your account...</span>
      <div
        aria-hidden="true"
        className="**:data-[slot=skeleton]:motion-reduce:animate-none"
      >
        <Skeleton className="mb-12 h-5 w-20 lg:hidden" />
        <div className="mb-9 space-y-2">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>
        <div className="space-y-5">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="mx-auto h-5 w-56 max-w-full" />
        </div>
      </div>
    </div>
  )
}
