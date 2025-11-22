<?php

declare(strict_types=1);

namespace Database\Factories\Traits;

trait HasTipTapContent
{
    /**
     * Create a TipTap document structure.
     */
    protected function createTipTapDoc(array $content): array
    {
        return [
            'type' => 'doc',
            'content' => $content,
        ];
    }

    /**
     * Create a TipTap heading.
     */
    protected function createTipTapHeading(string $text, int $level = 2): array
    {
        return [
            'type' => 'heading',
            'attrs' => ['level' => $level],
            'content' => [
                ['type' => 'text', 'text' => $text],
            ],
        ];
    }

    /**
     * Create a TipTap paragraph.
     */
    protected function createTipTapParagraph(string $text): array
    {
        return [
            'type' => 'paragraph',
            'content' => [
                ['type' => 'text', 'text' => $text],
            ],
        ];
    }

    /**
     * Create a TipTap bullet list.
     */
    protected function createTipTapBulletList(array $items): array
    {
        return [
            'type' => 'bulletList',
            'content' => array_map(
                fn($item) => [
                    'type' => 'listItem',
                    'content' => [
                        [
                            'type' => 'paragraph',
                            'content' => [
                                ['type' => 'text', 'text' => $item],
                            ],
                        ],
                    ],
                ],
                $items
            ),
        ];
    }

    /**
     * Generate instructions content in TipTap format.
     */
    protected function generateTipTapInstructions(): array
    {
        $paragraphs = fake()->paragraphs(fake()->numberBetween(3, 5));
        $content = [];

        $content[] = $this->createTipTapHeading('Instructions', 2);

        foreach ($paragraphs as $paragraph) {
            $content[] = $this->createTipTapParagraph($paragraph);
        }

        $content[] = $this->createTipTapHeading('Requirements', 3);

        $content[] = $this->createTipTapBulletList([
            'Word count: ' . fake()->numberBetween(250, 500) . ' words',
            'Topic: ' . fake()->sentence(),
        ]);

        return $this->createTipTapDoc($content);
    }

    /**
     * Generate essay/submission content in TipTap format.
     */
    protected function generateTipTapEssay(): array
    {
        $paragraphCount = fake()->numberBetween(5, 15);
        $content = [];

        $content[] = $this->createTipTapHeading(fake()->sentence(6), 1);
        $content[] = $this->createTipTapParagraph(fake()->paragraph());

        for ($i = 0; $i < $paragraphCount - 2; $i++) {
            if ($i > 0 && $i % 3 === 0) {
                $content[] = $this->createTipTapHeading(fake()->sentence(4), 2);
            }

            $content[] = $this->createTipTapParagraph(fake()->paragraph());
        }

        $content[] = $this->createTipTapParagraph(fake()->paragraph());

        return $this->createTipTapDoc($content);
    }

    /**
     * Generate feedback content in TipTap format.
     */
    protected function generateTipTapFeedback(): array
    {
        $content = [];

        $content[] = $this->createTipTapHeading('Strengths', 2);
        $content[] = $this->createTipTapBulletList(fake()->sentences(3));

        $content[] = $this->createTipTapHeading('Areas for Improvement', 2);
        $content[] = $this->createTipTapBulletList(fake()->sentences(3));

        if (fake()->boolean(70)) {
            $content[] = $this->createTipTapHeading('Grammar Notes', 2);
            $content[] = $this->createTipTapBulletList(fake()->sentences(2));
        }

        return $this->createTipTapDoc($content);
    }

    /**
     * Use TipTap format for content.
     */
    public function asTipTap(): self
    {
        return $this->state(fn (array $attributes) => [
            'content' => $this->generateTipTapContent(),
        ]);
    }
}
