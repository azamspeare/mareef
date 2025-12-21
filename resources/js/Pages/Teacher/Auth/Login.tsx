import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button.tsx";
import { FlashToaster } from "@/components/flash-toaster.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { MareefLogo } from "@/components/logo.tsx";
import { GoogleIcon } from "@/components/icons.tsx";
import { getMainUrl } from "@/lib/utils.ts";

export default function Login() {
  const googleRedirectUrl = '/auth/google/redirect';

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <Head title="Login - Mareef" />
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href={getMainUrl()}>
            <MareefLogo size="xs" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Login with your Google account to continue
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a href={googleRedirectUrl}>
                    <Button variant="outline" className="w-full gap-2">
                      <GoogleIcon />
                      Login with Google
                    </Button>
                </a>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 h-full w-full bg-zinc-900 object-cover dark:brightness-[0.2] dark:grayscale" />
        <div className="absolute inset-0 flex items-center justify-center text-white p-10">
            <div className="max-w-md space-y-4">
                <blockquote className="space-y-2">
                    <p className="text-lg font-medium">
                        &ldquo;Mareef has completely transformed how I handle writing assignments. It's simple, fast, and my students love it.&rdquo;
                    </p>
                    <footer className="text-sm text-zinc-400">Sofia Davis, ESL Teacher</footer>
                </blockquote>
            </div>
        </div>
      </div>

      <FlashToaster />
      <Toaster />
    </div>
  );
}
