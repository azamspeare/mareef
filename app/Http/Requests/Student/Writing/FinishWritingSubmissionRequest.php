<?php

declare(strict_types=1);

namespace App\Http\Requests\Student\Writing;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class FinishWritingSubmissionRequest extends FormRequest
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
            'writing_id' => ['required', 'integer', 'exists:writings,id'],
            'content' => ['required', 'string'],
            'spent_time' => ['required', 'string'],
        ];
    }
}
