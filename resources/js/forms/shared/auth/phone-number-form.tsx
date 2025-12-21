import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Field, FieldError } from "@/components/ui/field.tsx";
import { Loader2 } from "lucide-react";
import { formatUzbekPhone } from "@/lib/utils.ts";

interface PhoneNumberFormProps {
  phoneNumber?: string;
}

export function PhoneNumberForm({ phoneNumber }: PhoneNumberFormProps) {
  const { data, setData, post, processing, errors } = useForm({
    phone_number: phoneNumber || '+998',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register/phone-number');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('phone_number', formatUzbekPhone(e.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Add your phone number</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We'll send you notifications via Telegram
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Field data-invalid={!!errors.phone_number}>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            type="tel"
            placeholder="+998 90 123 45 67"
            value={data.phone_number}
            onChange={handlePhoneChange}
            aria-invalid={!!errors.phone_number}
            className="h-11"
            autoFocus
          />
          <FieldError>{errors.phone_number}</FieldError>
        </Field>

        <Button type="submit" className="w-full h-11" disabled={processing}>
          {processing && <Loader2 className="animate-spin" />}
          Continue
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground leading-relaxed">
        Your phone number will be used to link your Telegram account for receiving notifications.
      </p>
    </form>
  );
}
