<?php

declare(strict_types=1);

namespace Database\Factories\Traits;

use Illuminate\Support\Str;

trait HasEditorJSContent
{
    /**
     * Create an EditorJS document structure.
     */
    protected function createEditorJSDoc(array $blocks): array
    {
        return [
            'time' => now()->timestamp * 1000,
            'blocks' => $blocks,
            'version' => '2.28.0',
        ];
    }

    /**
     * Create an EditorJS header block.
     */
    protected function createEditorJSHeader(string $text, int $level = 2): array
    {
        return [
            'id' => Str::random(10),
            'type' => 'header',
            'data' => [
                'text' => $text,
                'level' => $level,
            ],
        ];
    }

    /**
     * Create an EditorJS paragraph block.
     */
    protected function createEditorJSParagraph(string $text): array
    {
        return [
            'id' => Str::random(10),
            'type' => 'paragraph',
            'data' => [
                'text' => $text,
            ],
        ];
    }

    /**
     * Create an EditorJS list block.
     */
    protected function createEditorJSList(array $items, string $style = 'unordered'): array
    {
        return [
            'id' => Str::random(10),
            'type' => 'list',
            'data' => [
                'style' => $style,
                'items' => $items,
            ],
        ];
    }

    /**
     * Generate instructions content in EditorJS format.
     */
    protected function generateEditorJSInstructions(): array
    {
        $paragraphs = fake()->paragraphs(fake()->numberBetween(3, 5));
        $blocks = [];

        $blocks[] = $this->createEditorJSHeader('Instructions', 2);

        foreach ($paragraphs as $paragraph) {
            $blocks[] = $this->createEditorJSParagraph($paragraph);
        }

        $blocks[] = $this->createEditorJSHeader('Requirements', 3);

        $blocks[] = $this->createEditorJSList([
            'Word count: ' . fake()->numberBetween(250, 500) . ' words',
            'Topic: ' . fake()->sentence(),
        ]);

        return $this->createEditorJSDoc($blocks);
    }

    /**
     * Generate essay/submission content in EditorJS format.
     */
    protected function generateEditorJSEssay(): array
    {
        $paragraphCount = fake()->numberBetween(5, 15);
        $blocks = [];

        $blocks[] = $this->createEditorJSHeader(fake()->sentence(6), 1);
        $blocks[] = $this->createEditorJSParagraph(fake()->paragraph());

        for ($i = 0; $i < $paragraphCount - 2; $i++) {
            if ($i > 0 && $i % 3 === 0) {
                $blocks[] = $this->createEditorJSHeader(fake()->sentence(4), 2);
            }

            $blocks[] = $this->createEditorJSParagraph(fake()->paragraph());
        }

        $blocks[] = $this->createEditorJSParagraph(fake()->paragraph());

        return $this->createEditorJSDoc($blocks);
    }

    /**
     * Generate feedback content in EditorJS format.
     */
    protected function generateEditorJSFeedback(): array
    {
        $blocks = [];

        $blocks[] = $this->createEditorJSHeader('Strengths', 2);
        $blocks[] = $this->createEditorJSList(fake()->sentences(3));

        $blocks[] = $this->createEditorJSHeader('Areas for Improvement', 2);
        $blocks[] = $this->createEditorJSList(fake()->sentences(3));

        if (fake()->boolean(70)) {
            $blocks[] = $this->createEditorJSHeader('Grammar Notes', 2);
            $blocks[] = $this->createEditorJSList(fake()->sentences(2));
        }

        return $this->createEditorJSDoc($blocks);
    }

    /**
     * Use EditorJS format for content.
     */
    public function asEditorJS(): self
    {
        return $this->state(fn (array $attributes) => [
            'content' => $this->generateEditorJSContent(),
        ]);
    }
}
