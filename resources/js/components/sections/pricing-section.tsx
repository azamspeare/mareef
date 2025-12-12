import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { getTeacherUrl, getContactUrl } from '@/lib/utils';

export default function PricingSection() {
    const teacherUrl = getTeacherUrl();
    const contactUrl = getContactUrl();

    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl">
                        Start Free. Upgrade When Ready.
                    </h2>
                    <p className="text-muted-foreground">
                        Choose the plan that fits your teaching needs. All features are currently free during beta.
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        All features free during beta
                    </div>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
                    {/* Free Plan */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-medium">Free</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$0 <span className="text-base font-normal text-muted-foreground">/ month</span></span>
                            <CardDescription className="text-sm">Perfect for individual tutors starting out</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {[
                                    '1 Teacher',
                                    'Up to 20 Students',
                                    'All task types (Writing, Reading, Speaking, Listening)',
                                    'Manual workflow',
                                    'Basic analytics',
                                    'Inline feedback & scoring',
                                    'Email notifications',
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full">
                                <a href={teacherUrl}>Get Started Free</a>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="relative flex flex-col">
                        <span className="bg-gradient-to-r absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-primary to-primary/60 px-3 py-1 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                            Popular
                        </span>

                        <CardHeader>
                            <CardTitle className="font-medium">Premium</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$29 <span className="text-base font-normal text-muted-foreground">/ month</span></span>
                            <CardDescription className="text-sm">For growing tutors who want AI assistance</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {[
                                    '1 Teacher',
                                    '3 Assistants',
                                    'Up to 200 Students',
                                    'Everything in Free',
                                    'AI task generation',
                                    'AI feedback assistant',
                                    'Advanced analytics',
                                    'Auto-grading for quizzes',
                                    'Priority support',
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto">
                            <Button
                                asChild
                                className="w-full">
                                <a href={teacherUrl}>Get Started</a>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* VIP Plan */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-medium">VIP</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$49 <span className="text-base font-normal text-muted-foreground">/ month</span></span>
                            <CardDescription className="text-sm">For academies and multi-teacher teams</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {[
                                    '10 Teachers',
                                    '20 Assistants',
                                    'Up to 500 Students',
                                    'Everything in Premium',
                                    'Multi-teacher support',
                                    'Team collaboration tools',
                                    'Custom branding',
                                    'Dedicated account manager',
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full">
                                <a href={contactUrl} target="_blank" rel="noopener noreferrer">Contact Sales</a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    💡 Pricing may change as we expand functionality. All beta users will receive early-adopter benefits.
                </p>
            </div>
        </section>
    );
}
