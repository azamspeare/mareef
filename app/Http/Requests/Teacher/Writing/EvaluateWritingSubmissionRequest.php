<?php

declare(strict_types=1);

namespace App\Http\Requests\Teacher\Writing;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class EvaluateWritingSubmissionRequest extends FormRequest
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
            'submission_id' => ['required', 'integer', 'exists:writing_submissions,id'],
            'content' => ['required', 'string', 'json'],
            'score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'feedback' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
