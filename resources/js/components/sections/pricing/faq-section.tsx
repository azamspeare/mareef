export default function FAQSection() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32" id="faq">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Frequently <br className="hidden lg:block" /> Asked <br className="hidden lg:block" />
                            Questions
                        </h2>
                        <p className="text-muted-foreground">Everything you need to know about Mareff pricing.</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">Is Mareff really free during early access?</h3>
                            <p className="text-muted-foreground mt-4">Yes! During our early access period, all features are completely free. This includes unlimited students, AI-powered feedback, and all premium features. We want you to experience the full power of Mareff before we introduce paid plans.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">What happens when early access ends?</h3>
                            <p className="text-muted-foreground mt-4">When we launch paid plans, early access users will receive special grandfather pricing and extended free access as a thank you for helping us improve Mareff.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Can I upgrade or downgrade my plan?</h3>
                            <p className="text-muted-foreground my-4">Yes, you can change your plan at any time. When upgrading:</p>
                            <ul className="list-outside list-disc space-y-2 pl-4">
                                <li className="text-muted-foreground">You'll be charged the prorated difference for the current billing period.</li>
                                <li className="text-muted-foreground">New features will be available immediately.</li>
                            </ul>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Do you offer discounts for schools?</h3>
                            <p className="text-muted-foreground mt-4">Yes! We offer special pricing for schools and educational institutions. Contact us at support@mareff.com to discuss your needs and get a custom quote.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
