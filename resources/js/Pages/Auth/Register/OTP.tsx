import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Loader2, BookOpen, ExternalLink } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { AuthSteps } from '@/components/blocks/AuthSteps';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getTelegramBotUrl } from '@/lib/utils';

export default function OTP() {
  const mainDomain = `${window.location.protocol}//${import.meta.env.VITE_APP_DOMAIN || 'localhost'}`;

  const { data, setData, post, processing, errors } = useForm({
    code: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register/otp');
  };

  const handleOTPComplete = (value: string) => {
    setData('code', value);
    if (value.length === 6) {
      post('/register/otp');
    }
  };

  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <Head title="Verify OTP - Mareef" />
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between p-6 md:px-10 md:py-8 lg:justify-start">
          <a href={mainDomain} className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <span className="font-bold text-xs">M</span>
            </div>
            Mareef
          </a>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <BookOpen className="size-4" />
                  Guide
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 border-l-0 sm:max-w-md">
                <SheetHeader className="sr-only">
                  <SheetTitle>Registration Guide</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto">
                  <AuthSteps />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Verify your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter the 6-digit code sent to your Telegram
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Field data-invalid={!!errors.code}>
                  <Label htmlFor="otp" className="sr-only">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                        id="otp"
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={data.code}
                        onChange={(value) => setData('code', value)}
                        onComplete={handleOTPComplete}
                        aria-invalid={!!errors.code}
                        autoFocus
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="size-11" />
                            <InputOTPSlot index={1} className="size-11" />
                            <InputOTPSlot index={2} className="size-11" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} className="size-11" />
                            <InputOTPSlot index={4} className="size-11" />
                            <InputOTPSlot index={5} className="size-11" />
                        </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <FieldError className="text-center">{errors.code}</FieldError>
                </Field>

                <Button type="submit" className="w-full h-11" disabled={processing || data.code.length !== 6}>
                  {processing && <Loader2 className="animate-spin" />}
                  Verify
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                <a
                  href={getTelegramBotUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  Open our Telegram bot <ExternalLink className="size-3" />
                </a>{" "}
                and send your phone number to receive the verification code.
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden h-full overflow-y-auto lg:block border-l">
        <AuthSteps />
      </div>
    </div>
  );
}
