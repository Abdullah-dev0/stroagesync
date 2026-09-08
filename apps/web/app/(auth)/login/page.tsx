import Image from "next/image"
import Link from "next/link"
import { CircleCheck, CircleX, FolderClosed } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

function Brand() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:outline-none"
      aria-label="StorageSync home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground text-primary shadow-sm">
        <FolderClosed className="size-4.5" strokeWidth={2.4} />
      </span>
      <span>StorageSync</span>
    </Link>
  )
}

type LoginPageProps = {
  searchParams: Promise<{
    signup?: string
    unauthorized?: boolean
  }>
}

export default async function Page({ searchParams }: LoginPageProps) {
  const signup = (await searchParams).signup
  const unauthorized = (await searchParams).unauthorized
  const signupSucceeded = signup === "success"

  return (
    <main className="min-h-svh bg-background lg:grid lg:grid-cols-12">
      <section className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary to-primary/70 text-primary-foreground lg:col-span-6 lg:flex lg:min-h-svh lg:flex-col lg:p-12 xl:p-16">
        <div className="absolute top-1/3 -left-24 size-80 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute -top-16 -right-20 size-96 rounded-full bg-primary-foreground/15 blur-3xl" />

        <div className="relative z-10">
          <Brand />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center">
          <Image
            src="/storage-cards.svg"
            width={960}
            height={640}
            alt=""
            className="h-auto w-full max-w-lg"
            preload
          />
        </div>

        <div className="relative z-10 max-w-md pb-2">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary-foreground/65 uppercase">
            Your files, in sync
          </p>
          <h2 className="max-w-sm text-3xl leading-tight font-semibold tracking-tight xl:text-4xl">
            Store everything. Find anything.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-primary-foreground/75">
            A calm, secure home for the files that keep your work moving.
          </p>
        </div>
      </section>

      <section className="flex min-h-svh items-center justify-center px-5 py-8 sm:px-8 lg:col-span-6 lg:px-10 xl:px-16">
        <div className="w-full max-w-lg">
          <div className="mb-12 flex items-center justify-between lg:hidden">
            <div className="text-foreground">
              <Brand />
            </div>
            <Link
              href="/signup"
              className="rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Create account
            </Link>
          </div>

          <div className="mb-9">
            <div className="mb-6 hidden items-center gap-2.5 text-sm font-semibold lg:flex">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FolderClosed className="size-4" strokeWidth={2.4} />
              </span>
              StorageSync
            </div>
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
              <p>
                You have been signed out please sign in again to continue using
                StorageSync.
              </p>
            </div>
          )}

          <LoginForm />
        </div>
      </section>
    </main>
  )
}
