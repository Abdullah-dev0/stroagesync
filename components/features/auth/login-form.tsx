"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth/client"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

const inputClassName =
  "h-11 rounded-xl px-3.5 shadow-sm hover:border-input focus-visible:border-primary focus-visible:ring-ring/20"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const session = useQuery({
    queryKey: ["login-session"],
    queryFn: async () => {
      const { data, error } = await authClient.getSession({
        query: { disableCookieCache: true },
      })
      if (error)
        throw new Error(error.message || "Unable to check your session.")
      return data
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  })

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const { isSubmitting } = form.formState

  useEffect(() => {
    if (session.isSuccess && !session.isFetching && session.data) {
      router.replace("/dashboard")
    }
  }, [router, session.data, session.isFetching, session.isSuccess])

  useEffect(() => {
    if (session.isError) {
      toast.add({
        type: "error",
        description:
          "Unable to check your session. Please sign in to continue.",
      })
    }
  }, [session.isError])

  const onSubmit: SubmitHandler<LoginInput> = async (formData: LoginInput) => {
    const { email, password } = formData
    const { error } = await authClient.signIn.email({
      email,
      password,
    })
    if (error) {
      console.error("Login failed:", error)
      toast.add({
        type: "error",
        description: error.message || "Login failed. Please try again.",
      })
      return
    }

    router.push("/dashboard")
    toast.add({
      title: "Login successful",
      type: "success",
    })
  }

  if (
    session.isPending ||
    session.isFetching ||
    (session.isSuccess && session.data)
  ) {
    return (
      <div role="status">
        <div
          aria-hidden="true"
          className="space-y-5 **:data-[slot=skeleton]:motion-reduce:animate-none"
        >
          <FieldGroup>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </FieldGroup>
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="mx-auto h-5 w-56 max-w-full" />
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  inputMode="email"
                  placeholder="you@company.com"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between gap-4">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                    className={`${inputClassName} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4.5" />
                    ) : (
                      <Eye className="size-4.5" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          aria-busy={isSubmitting}
          className="h-11 w-full rounded-xl font-semibold shadow-sm shadow-primary/20"
        >
          {isSubmitting && (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          )}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </fieldset>

      <p className="text-center text-sm text-muted-foreground">
        New to Storumi?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}
