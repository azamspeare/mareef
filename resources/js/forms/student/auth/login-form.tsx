import { useForm } from "@inertiajs/react"
import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons.tsx"

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { data, setData, post, processing, errors, reset } = useForm<LoginFormData>({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('student.auth.login.store'), {
      onFinish: () => reset('password'),
    })
  }

  const handleGoogleLogin = () => {
    window.location.href = route('student.auth.google.redirect')
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your credentials to access your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            required
          />
          <FieldError errors={[{ message: errors.email }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={e => setData('password', e.target.value)}
            required
          />
          <FieldError errors={[{ message: errors.password }]} />
        </Field>
        <Field>
          <Button type="submit" className="w-full" disabled={processing}>
            {processing && <Loader2 className="animate-spin" />}
            {processing ? 'Signing in...' : 'Sign In'}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full gap-2"
            disabled={processing}
            onClick={handleGoogleLogin}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </Field>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href={route('student.auth.register')} className="underline underline-offset-4 hover:text-primary">
            Sign up
          </a>
        </p>
      </FieldGroup>
    </form>
  )
}
