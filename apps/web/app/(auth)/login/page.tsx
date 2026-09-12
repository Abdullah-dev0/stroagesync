import { CircleCheck, CircleX } from "lucide-react"
import Link from "next/link"

import { LoginForm } from "@/components/auth/login-form"

type LoginPageProps = {
  searchParams: Promise<{
    signup?: string
    unauthorized?: string
  }>
}

export default async function Page({ searchParams }: LoginPageProps) {
  const signup = (await searchParams).signup
  const unauthorized = (await searchParams).unauthorized === "true"
  const signupSucceeded = signup === "success"

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

      <LoginForm />
    </>
  )
}
