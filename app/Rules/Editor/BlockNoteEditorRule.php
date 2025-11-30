<?php

declare(strict_types=1);

namespace App\Rules\Editor;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

final class BlockNoteEditorRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param Closure(string, ?string=): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_array($value) || empty($value)) {
            $fail('The :attribute must be a valid BlockNote document.');
            return;
        }

        // Validate each block has the required BlockNote structure
        foreach ($value as $index => $block) {
            if (!is_array($block)) {
                $fail("The :attribute contains invalid block at position {$index}.");
                return;
            }

            // Required fields: id, type, props, children
            if (!isset($block['id']) || !is_string($block['id']) || empty($block['id'])) {
                $fail("The :attribute block at position {$index} must have a valid 'id' field.");
                return;
            }

            if (!isset($block['type']) || !is_string($block['type']) || empty($block['type'])) {
                $fail("The :attribute block at position {$index} must have a valid 'type' field.");
                return;
            }

            if (!isset($block['props']) || !is_array($block['props'])) {
                $fail("The :attribute block at position {$index} must have a 'props' object.");
                return;
            }

            if (!isset($block['children']) || !is_array($block['children'])) {
                $fail("The :attribute block at position {$index} must have a 'children' array.");
                return;
            }
        }
    }
}
