import { Head } from "@inertiajs/react"
import { RegisterForm } from "@/forms/student/auth/register-form.tsx"
import { FlashToaster } from "@/components/flash-toaster.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { MareefLogo } from "@/components/logo.tsx"
import { getMainUrl } from "@/lib/utils.ts"

export default function Register() {
  return (
    <>
      <Head title="Register - Mareef" />
      <div className="grid h-full lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href={getMainUrl()}>
              <MareefLogo size="xs" />
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <RegisterForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <div className="absolute inset-0 h-full w-full bg-zinc-900 object-cover dark:brightness-[0.2] dark:grayscale" />
          <div className="absolute inset-0 flex items-center justify-center text-white p-10">
            <div className="max-w-md space-y-4">
              <blockquote className="space-y-2">
                <p className="text-lg font-medium">
                  &ldquo;With Mareef, I can focus on improving my writing skills while getting instant feedback from my teacher.&rdquo;
                </p>
                <footer className="text-sm text-zinc-400">Ahmed, IELTS Student</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      <FlashToaster />
      <Toaster />
    </>
  )
}
