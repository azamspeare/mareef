import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button.tsx";
import { BookOpen } from "lucide-react";
import { AuthSteps } from '@/components/blocks/auth-steps.tsx';
import { PhoneNumberForm } from '@/forms/shared/auth/phone-number-form.tsx';
import { FlashToaster } from "@/components/flash-toaster.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { MareefLogo } from "@/components/logo.tsx";
import { getMainUrl } from "@/lib/utils.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";

export default function PhoneNumber({ phone_number }: { phone_number?: string }) {
  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <Head title="Register Phone Number - Mareef" />
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between p-6 md:px-10 md:py-8 lg:justify-start">
          <a href={getMainUrl()}>
            <MareefLogo size="xs" />
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
            <PhoneNumberForm phoneNumber={phone_number} />
          </div>
        </div>
      </div>
      <div className="relative hidden h-full overflow-y-auto lg:block border-l">
        <AuthSteps />
      </div>

      <FlashToaster />
      <Toaster />
    </div>
  );
}
