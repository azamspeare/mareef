<?php

declare(strict_types=1);

namespace App\Http\Requests\Teacher\Writing;

use App\Rules\Editor\BlockNoteEditorRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateWritingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'array', new BlockNoteEditorRule],
            'allocated_time' => ['nullable', 'date_format:H:i:s'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->allocated_time) {
            // Parse time H:i:s
            [$hours, $minutes, $seconds] = explode(':', $this->allocated_time);

            // If less than 1 minute (only seconds provided), set to null
            if ((int) $hours === 0 && (int) $minutes === 0) {
                $this->merge(['allocated_time' => null]);
            }
        }
    }
}
