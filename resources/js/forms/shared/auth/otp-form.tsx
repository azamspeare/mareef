import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Field, FieldError } from "@/components/ui/field.tsx";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp.tsx";
import { Loader2, ExternalLink } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { getTelegramBotUrl } from '@/lib/utils.ts';

export function OTPForm() {
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
  );
}
