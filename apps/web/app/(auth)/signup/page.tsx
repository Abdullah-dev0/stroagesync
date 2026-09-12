import Link from "next/link"

import { SignupForm } from "@/components/auth/signup-form"
import { redirectIfAuthenticated } from "@/lib/redirect-if-authenticated"

export default async function Page() {
  await redirectIfAuthenticated()

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
