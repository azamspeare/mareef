import { Head, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginProps {
  flash?: {
    error?: string;
  };
}

export default function Login() {
  const { flash } = usePage<LoginProps>().props;
  const mainDomain = `${window.location.protocol}//${import.meta.env.VITE_APP_DOMAIN || 'localhost'}`;
  const googleRedirectUrl = '/auth/google/redirect';

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <Head title="Login - Mareef" />
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href={mainDomain} className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <span className="font-bold text-xs">M</span>
            </div>
            Mareef
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

              {flash?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-4">
                <a href={googleRedirectUrl}>
                    <Button variant="outline" className="w-full gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                        <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                        />
                    </svg>
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
    </div>
  );
}
