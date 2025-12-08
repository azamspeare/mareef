<?php

declare(strict_types=1);

namespace App\Http\Requests\Submission;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class EvaluateSubmissionRequest extends FormRequest
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
            'content' => ['required', 'string'],
            'score' => ['nullable', 'numeric'],
            'feedback' => ['nullable', 'string'],
        ];
    }
}
