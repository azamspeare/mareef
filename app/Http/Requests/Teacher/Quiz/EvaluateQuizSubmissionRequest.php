<?php

declare(strict_types=1);

namespace App\Http\Requests\Teacher\Quiz;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class EvaluateQuizSubmissionRequest extends FormRequest
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
            'submission_id' => ['required', 'integer', 'exists:quiz_submissions,id'],
            'feedback' => ['required', 'string', 'max:10000'],
        ];
    }
}
