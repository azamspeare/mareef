<?php

declare(strict_types=1);

namespace Database\Factories\Traits;

use Illuminate\Support\Str;

trait HasBlockNoteContent
{
    /**
     * Create a BlockNote paragraph block.
     */
    protected function createBlockNoteParagraph(string $text, array $styles = []): array
    {
        $content = [];

        if ($text !== '') {
            $content[] = [
                'type' => 'text',
                'text' => $text,
                'styles' => (object) $styles,
            ];
        }

        return [
            'id' => Str::uuid()->toString(),
            'type' => 'paragraph',
            'props' => [
                'textColor' => 'default',
                'textAlignment' => 'left',
                'backgroundColor' => 'default',
            ],
            'content' => $content,
            'children' => [],
        ];
    }

    /**
     * Create a BlockNote heading block.
     */
    protected function createBlockNoteHeading(string $text, int $level = 2): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'type' => 'heading',
            'props' => [
                'textColor' => 'default',
                'textAlignment' => 'left',
                'backgroundColor' => 'default',
                'level' => $level,
            ],
            'content' => [
                [
                    'type' => 'text',
                    'text' => $text,
                    'styles' => (object) [],
                ],
            ],
            'children' => [],
        ];
    }

    /**
     * Create a BlockNote bullet list item.
     */
    protected function createBlockNoteBulletListItem(string $text): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'type' => 'bulletListItem',
            'props' => [
                'textColor' => 'default',
                'textAlignment' => 'left',
                'backgroundColor' => 'default',
            ],
            'content' => [
                [
                    'type' => 'text',
                    'text' => $text,
                    'styles' => (object) [],
                ],
            ],
            'children' => [],
        ];
    }

    /**
     * Create a BlockNote numbered list item.
     */
    protected function createBlockNoteNumberedListItem(string $text): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'type' => 'numberedListItem',
            'props' => [
                'textColor' => 'default',
                'textAlignment' => 'left',
                'backgroundColor' => 'default',
            ],
            'content' => [
                [
                    'type' => 'text',
                    'text' => $text,
                    'styles' => (object) [],
                ],
            ],
            'children' => [],
        ];
    }

    /**
     * Generate instructions content in BlockNote format.
     */
    protected function generateBlockNoteInstructions(): array
    {
        $blocks = [];
        $paragraphs = fake()->paragraphs(fake()->numberBetween(2, 4));

        // Main instruction paragraph
        foreach ($paragraphs as $paragraph) {
            $blocks[] = $this->createBlockNoteParagraph($paragraph);
            $blocks[] = $this->createBlockNoteParagraph('');
        }

        // Requirements section
        $blocks[] = $this->createBlockNoteHeading('Requirements', 2);

        $wordCount = fake()->randomElement([150, 200, 250, 300, 400, 500]);
        $blocks[] = $this->createBlockNoteBulletListItem("Write at least {$wordCount} words.");
        $blocks[] = $this->createBlockNoteBulletListItem(fake()->sentence());
        $blocks[] = $this->createBlockNoteBulletListItem(fake()->sentence());

        $blocks[] = $this->createBlockNoteParagraph('');

        return $blocks;
    }

    /**
     * Generate essay/submission content in BlockNote format.
     */
    protected function generateBlockNoteEssay(): array
    {
        $blocks = [];
        $paragraphCount = fake()->numberBetween(4, 10);

        // Title
        $blocks[] = $this->createBlockNoteHeading(fake()->sentence(6), 1);
        $blocks[] = $this->createBlockNoteParagraph('');

        // Introduction
        $blocks[] = $this->createBlockNoteParagraph(fake()->paragraph());
        $blocks[] = $this->createBlockNoteParagraph('');

        // Body paragraphs
        for ($i = 0; $i < $paragraphCount - 2; $i++) {
            if ($i > 0 && $i % 3 === 0) {
                $blocks[] = $this->createBlockNoteHeading(fake()->sentence(4), 2);
                $blocks[] = $this->createBlockNoteParagraph('');
            }

            $blocks[] = $this->createBlockNoteParagraph(fake()->paragraph());
            $blocks[] = $this->createBlockNoteParagraph('');
        }

        // Conclusion
        $blocks[] = $this->createBlockNoteParagraph(fake()->paragraph());
        $blocks[] = $this->createBlockNoteParagraph('');

        return $blocks;
    }

    /**
     * Generate feedback content in BlockNote format.
     */
    protected function generateBlockNoteFeedback(): array
    {
        $blocks = [];

        // Strengths
        $blocks[] = $this->createBlockNoteHeading('Strengths', 2);
        foreach (fake()->sentences(3) as $sentence) {
            $blocks[] = $this->createBlockNoteBulletListItem($sentence);
        }
        $blocks[] = $this->createBlockNoteParagraph('');

        // Areas for Improvement
        $blocks[] = $this->createBlockNoteHeading('Areas for Improvement', 2);
        foreach (fake()->sentences(3) as $sentence) {
            $blocks[] = $this->createBlockNoteBulletListItem($sentence);
        }
        $blocks[] = $this->createBlockNoteParagraph('');

        // Grammar Notes (optional)
        if (fake()->boolean(70)) {
            $blocks[] = $this->createBlockNoteHeading('Grammar Notes', 2);
            foreach (fake()->sentences(2) as $sentence) {
                $blocks[] = $this->createBlockNoteBulletListItem($sentence);
            }
            $blocks[] = $this->createBlockNoteParagraph('');
        }

        return $blocks;
    }
}
