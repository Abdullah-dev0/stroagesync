import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { LoginForm } from "@/components/features/auth/login-form"
import { LoginStatus } from "@/components/features/auth/login-status"
import { QueryProvider } from "@/providers/query-provider"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Storumi account.",
}

export default function Page() {
  return (
    <>
      <div className="mb-12 flex items-center justify-between lg:hidden">
        <Link
          href="/signup"
          className="rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Create account
        </Link>
      </div>

      <div className="mb-9">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sign in to your account to continue.
        </p>
      </div>

      <Suspense fallback={null}>
        <LoginStatus />
      </Suspense>

      <QueryProvider>
        <LoginForm />
      </QueryProvider>
    </>
  )
}
