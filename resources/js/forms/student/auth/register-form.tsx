import { useForm } from "@inertiajs/react"
import { cn, formatUzbekPhone } from "@/lib/utils.ts"
import { useDraft, useAutoSaveDraft } from "@/hooks/use-draft.ts"
import { Button } from "@/components/ui/button.tsx"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/icons.tsx"

interface RegisterFormData {
  name: string
  email: string
  phone_number: string
  password: string
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { getInitialValue, clearDraft } = useDraft<RegisterFormData>({
    key: 'register_form_data',
    excludeFields: ['password'],
  })

  const { data, setData, post, processing, errors, reset } = useForm(
    getInitialValue({
      name: '',
      email: '',
      phone_number: '+998',
      password: '',
    })
  )

  useAutoSaveDraft({
    key: 'register_form_data',
    data,
    dependencies: [data.name, data.email, data.phone_number],
    excludeFields: ['password'],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('student.auth.register.store'), {
      onSuccess: clearDraft,
      onFinish: () => reset('password'),
    })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('phone_number', formatUzbekPhone(e.target.value))
  }

  const handleGoogleLogin = () => {
    window.location.href = route('student.auth.google.redirect')
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to get started
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            required
          />
          <FieldError errors={[{ message: errors.name }]} />
        </Field>
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
          <FieldLabel htmlFor="phone_number">Phone Number</FieldLabel>
          <Input
            id="phone_number"
            type="tel"
            placeholder="+998 90 123 45 67"
            value={data.phone_number}
            onChange={handlePhoneChange}
            required
          />
          <FieldDescription>We'll send notifications via Telegram</FieldDescription>
          <FieldError errors={[{ message: errors.phone_number }]} />
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
            {processing ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{" "}
          <a href={route('student.auth.login')} className="underline underline-offset-4 hover:text-primary">
            Sign in
          </a>
        </p>
      </FieldGroup>
    </form>
  )
}
