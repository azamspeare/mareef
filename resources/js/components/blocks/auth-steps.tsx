import { Phone, Bot, Send, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { getTelegramBotUrl } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: React.ReactNode;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Enter your phone number",
    description: "We’ll use this to match your account inside our Telegram bot.",
    icon: Phone,
  },
  {
    id: 2,
    title: "Open the Telegram bot",
    description: (
      <>
        Click the button below to open our official bot.{" "}
        <a
          href={getTelegramBotUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
        >
          Open Bot <ExternalLink className="size-3" />
        </a>
      </>
    ),
    icon: Bot,
  },
  {
    id: 3,
    title: "Send your phone number and grab your code",
    description: "Once you start the bot, send your phone number. The bot will reply with a 6-digit code.",
    icon: Send,
  },
  {
    id: 4,
    title: "Didn’t get a code? Regenerate it",
    description: "If your code expired or you lost it, just type /code in the bot again. You’ll receive a new one.",
    icon: RefreshCw,
  },
  {
    id: 5,
    title: "Enter the code here",
    description: "Paste the 6-digit code in the field on the left. Once verified, your account will be linked.",
    icon: CheckCircle,
  },
];

export function AuthSteps() {
  return (
    <div className="flex min-h-full flex-col bg-muted/30 p-8 lg:p-12">
      <div className="flex flex-1 flex-col">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight">Getting Started</h2>
          <p className="mt-2 text-sm text-muted-foreground">Follow these 5 simple steps to link your Telegram account.</p>
        </div>

        <div className="relative space-y-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex gap-6">
              {index !== steps.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="absolute left-[19px] top-10 h-[calc(100%-16px)]"
                />
              )}

              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-background font-bold text-sm shadow-sm ring-4 ring-muted/20">
                {step.id}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight lg:text-md">
                  <step.icon className="size-5 shrink-0 text-primary hidden lg:block" />
                  {step.title}
                </h3>
                <div className="text-sm leading-relaxed text-muted-foreground max-w-[400px]">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-12">
          <Card className="bg-background/60 backdrop-blur-sm py-2">
            <CardContent className="p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Why Telegram?
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Most students in Uzbekistan use Telegram for daily communication.
                This integration ensures you never miss important feedback or task updates from your teachers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
