import { FolderClosed } from "lucide-react"
import Image from "next/image"

import Link from "next/link"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-svh bg-background lg:grid lg:grid-cols-12">
      <section className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary to-primary/70 text-primary-foreground lg:col-span-6 lg:flex lg:min-h-svh lg:flex-col lg:p-12 xl:p-16">
        <div className="absolute top-1/3 -left-24 size-80 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute -top-16 -right-20 size-96 rounded-full bg-primary-foreground/15 blur-3xl" />

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:outline-none"
            aria-label="SyncNest home"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground text-primary shadow-sm">
              <FolderClosed className="size-4.5" strokeWidth={2.4} />
            </span>
            <span>SyncNest</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center">
          <Image
            src="/storage-cards.svg"
            width={960}
            height={640}
            alt=""
            className="h-auto w-full max-w-lg animate-[bounce_1s_ease-in-out_3.5]"
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
        <div className="w-full max-w-lg">{children}</div>
      </section>
    </main>
  )
}
