import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { Loader2, BookOpen } from "lucide-react";
import { AuthSteps } from '@/components/blocks/AuthSteps';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function PhoneNumber({ phone_number }: { phone_number?: string }) {
  const mainDomain = `${window.location.protocol}//${import.meta.env.VITE_APP_DOMAIN || 'localhost'}`;

  const { data, setData, post, processing, errors } = useForm({
    phone_number: phone_number || '+998',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register/phone-number');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Ensure it always starts with +998
    if (!value.startsWith('+998')) {
      value = '+998';
    }

    // Only allow digits after +998, max 9 digits
    const digits = value.slice(4).replace(/\D/g, '').slice(0, 9);
    setData('phone_number', '+998' + digits);
  };

  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <Head title="Register Phone Number - Mareef" />
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
          </div>
        </div>
      </div>
      <div className="relative hidden h-full overflow-y-auto lg:block border-l">
        <AuthSteps />
      </div>
    </div>
  );
}
