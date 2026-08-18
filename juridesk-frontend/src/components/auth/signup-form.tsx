"use client"

import { useState, type ComponentProps } from "react"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper"

type SignUpValues = {
  name: string
  email: string
  password: string
  terms: boolean
}

export function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string>()
  const [submitSuccess, setSubmitSuccess] = useState<string>()

  const form = useForm<SignUpValues>({
    defaultValues: { name: "", email: "", password: "", terms: false },
    mode: "onBlur",
  })

  async function onSubmit(values: SignUpValues) {
    setSubmitError(undefined)
    setSubmitSuccess(undefined)

    try {
      const response = await authApi.register({
        username: values.name,
        email: values.email,
        password: values.password,
      })

      form.reset()
      setSubmitSuccess(response.message || "Account created successfully. Redirecting to your workspace...")
      
      setTimeout(() => {
        router.push("/dashboard")
      }, 1200)
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <AuthCardWrapper>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">Create your account</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Start organizing your legal work in one place.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Please enter your full name." }}
            render={({ field }) => (
              <FormInput
                label="Full name"
                id="name"
                placeholder="Alex Morgan"
                autoComplete="name"
                error={form.formState.errors.name?.message}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Please enter your email address.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
            }}
            render={({ field }) => (
              <FormInput
                label="Email address"
                id="email"
                type="email"
                placeholder="you@firm.com"
                autoComplete="email"
                error={form.formState.errors.email?.message}
                {...field}
              />
            )}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="password">
              Password
            </label>
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Please enter your password.",
                minLength: { value: 8, message: "Password must be at least 8 characters." },
              }}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    className="pr-11"
                    aria-invalid={Boolean(form.formState.errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-stone-400 transition hover:text-stone-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  </button>
                </div>
              )}
            />
            <p className="text-xs text-stone-500">Use at least 8 characters with a mix of letters and numbers.</p>
            {form.formState.errors.password && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name="terms"
            rules={{ validate: (value) => value || "You must accept the terms to continue." }}
            render={({ field }) => (
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-stone-500">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 rounded border-stone-300 accent-[#9c7130]"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <span>
                    I agree to the{" "}
                    <button type="button" className="font-medium text-[#946b29] hover:underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="font-medium text-[#946b29] hover:underline">
                      Privacy Policy
                    </button>.
                  </span>
                </label>
                {form.formState.errors.terms && (
                  <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                    {form.formState.errors.terms.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="h-11 w-full rounded-xl bg-[#121212] px-4 text-sm text-white hover:bg-[#222222] transition">
            {form.formState.isSubmitting ? "Please wait..." : "Create account"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          {submitError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{submitError}</p>}
          {submitSuccess && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">{submitSuccess}</p>}
        </form>
      </Form>

      <div className="my-7 flex items-center gap-4 text-xs text-stone-400 before:h-px before:flex-1 before:bg-stone-200 after:h-px after:flex-1 after:bg-stone-200">
        or continue with
      </div>

      <button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950">
        <GoogleMark />
        Google
      </button>

      <p className="mt-8 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#946b29] transition hover:text-[#6e4d19] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCardWrapper>
  )
}

function FormInput({ label, id, error, ...props }: { label: string; id: string; error?: string } & ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-700" htmlFor={id}>
        {label}
      </label>
      <Input id={id} aria-invalid={Boolean(error)} {...props} />
      {error && <p className="text-xs font-medium text-red-600" role="alert">{error}</p>}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3.1-4.4 3.1-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.2 13.7a6 6 0 0 1 0-3.5V7.6H2.9a10 10 0 0 0 0 8.8l3.3-2.7Z" />
      <path fill="#EA4335" d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.8-2.8A9.5 9.5 0 0 0 2.9 7.6l3.3 2.6C7 7.8 9.3 6 12 6Z" />
    </svg>
  )
}
