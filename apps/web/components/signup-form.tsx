"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { signupSchema, type SignupInput } from "@workspace/validation/auth"
import { authClient } from "@/lib/authClient"
import { useRouter } from "next/navigation"

const inputClassName =
  "h-11 rounded-xl px-3.5 shadow-sm hover:border-input focus-visible:border-primary focus-visible:ring-ring/20"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<SignupInput> = async (
    formData: SignupInput
  ) => {
    const { name, email, password } = formData
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    })
    if (error) {
      console.error("Signup failed:", error)
      alert(error.message || "There is an error please try again later")
      return
    }

    router.push("/login?signup=success")
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="full-name">Full name</FieldLabel>
              <Input
                {...field}
                id="full-name"
                type="text"
                autoComplete="name"
                placeholder="Jordan Lee"
                aria-invalid={fieldState.invalid}
                className={inputClassName}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
                inputMode="email"
                placeholder="you@company.com"
                aria-invalid={fieldState.invalid}
                className={inputClassName}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-invalid={fieldState.invalid}
                  className={`${inputClassName} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Label className="cursor-pointer items-start gap-3 text-muted-foreground">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        />
        <span className="leading-5">
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
      </Label>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-xl font-semibold shadow-sm shadow-primary/20"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
