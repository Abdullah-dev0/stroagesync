"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

const inputClassName =
  "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 hover:border-input focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="full-name" className="text-sm font-medium text-foreground">
          Full name
        </label>
        <input
          id="full-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jordan Lee"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className={`${inputClassName} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="size-4.5" />
            ) : (
              <Eye className="size-4.5" />
            )}
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-muted-foreground">
        <input
          type="checkbox"
          name="terms"
          className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <span>
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <Button
        type="button"
        size="lg"
        className="h-11 w-full rounded-xl font-semibold shadow-sm shadow-primary/20"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
