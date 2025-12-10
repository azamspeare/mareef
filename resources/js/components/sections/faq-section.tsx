'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqSection() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'Is Mareff just for online teaching?',
            answer: 'No — Mareff works great for traditional classrooms too. Many teachers use it to replace paper tasks, save grading time, and keep student work organized.',
        },
        {
            id: 'item-2',
            question: 'Do students need accounts?',
            answer: 'No, students log in using Google and submit tasks directly. No registration required.',
        },
        {
            id: 'item-3',
            question: 'What task types are supported?',
            answer: 'Writing tasks are fully live. Reading, listening, and speaking tasks are under development and coming soon.',
        },
        {
            id: 'item-4',
            question: 'Can I give scores and feedback?',
            answer: 'Yes. Mareff supports inline comments, scoring, and feedback per student — with stored history for every submission.',
        },
        {
            id: 'item-5',
            question: 'Is it free?',
            answer: 'Yes. During early access, all features are free. Paid tiers will launch once premium features (like AI tools) are stable.',
        },
        {
            id: 'item-6',
            question: 'Can I try it without inviting students?',
            answer: "Absolutely. You can create tasks and test the full flow yourself before sharing anything with your class.",
        },
    ];

    return (
        <section className="py-16 md:py-24" id="faq">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground mt-4 text-balance">
                        Everything you need to know about Mareff and how it can help you teach better.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8 text-center">
                        Still have questions?{' '}
                        <a
                            href="mailto:support@mareff.uz"
                            className="text-primary font-medium hover:underline">
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
