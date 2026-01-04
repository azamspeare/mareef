<?php

declare(strict_types=1);

namespace App\Http\Requests\Teacher\Quiz;

use App\Contracts\Enums\QuizTypeEnum;
use App\Models\QuizOption\QuizOption;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateQuizRequest extends FormRequest
{
    /**
     * Question types that require options.
     */
    private const OPTION_TYPES = [
        QuizTypeEnum::SINGLE_CHOICE,
        QuizTypeEnum::MULTIPLE_CHOICE,
        QuizTypeEnum::TRUE_FALSE,
    ];

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
            'description' => ['required', 'string'],
            'allocated_time' => ['nullable', 'date_format:H:i:s'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.id' => [
                'nullable',
                'numeric',
                Rule::exists('quiz_questions', 'id')
                    ->where('quiz_id', $this->route('id'))
                    ->whereNull('deleted_at'),
            ],
            'questions.*.type' => ['required', 'string', Rule::in(QuizTypeEnum::toArray())],
            'questions.*.content' => ['required', 'string', 'min:3'],
            'questions.*.order' => ['required', 'numeric', 'min:1'],
            'questions.*.point' => ['nullable', 'numeric', 'min:1'],
            'questions.*.options' => ['nullable', 'array'],
            'questions.*.options.*.id' => ['nullable', 'numeric', Rule::exists('quiz_options', 'id')->whereNull('deleted_at')],
            'questions.*.options.*.content' => ['required', 'string', 'max:255'],
            'questions.*.options.*.is_correct' => ['required', 'boolean'],
            'questions.*.options.*.order' => ['required', 'numeric', 'min:1'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $this->validateQuestionsOptions($validator);
            $this->validateOptionsBelongToQuestions($validator);
        });
    }

    /**
     * Validate options for each question based on its type.
     */
    private function validateQuestionsOptions(Validator $validator): void
    {
        $questions = $this->input('questions', []);

        foreach ($questions as $index => $question) {
            $type = $question['type'] ?? null;
            $options = $question['options'] ?? [];

            if (! $type) {
                continue;
            }

            if ($this->requiresOptions($type)) {
                $this->validateOptionsRequired($validator, $index, $options, $type);
            }
        }
    }

    /**
     * Check if a question type requires options.
     */
    private function requiresOptions(string $type): bool
    {
        $optionTypeValues = array_map(fn ($enum) => $enum->value, self::OPTION_TYPES);

        return in_array($type, $optionTypeValues, true);
    }

    /**
     * Validate that options are properly set for option-based questions.
     */
    private function validateOptionsRequired(Validator $validator, int $index, array $options, string $type): void
    {
        $attribute = "questions.{$index}.options";

        if (count($options) < 2) {
            $validator->errors()->add($attribute, 'At least 2 options are required for this question type.');

            return;
        }

        $correctCount = collect($options)->filter(fn ($opt) => ($opt['is_correct'] ?? false) === true)->count();

        match ($type) {
            QuizTypeEnum::SINGLE_CHOICE->value,
            QuizTypeEnum::TRUE_FALSE->value => $this->validateSingleCorrect($validator, $attribute, $correctCount),
            QuizTypeEnum::MULTIPLE_CHOICE->value => $this->validateAtLeastOneCorrect($validator, $attribute, $correctCount),
            default => null,
        };
    }

    /**
     * Validate that exactly one correct answer is selected.
     */
    private function validateSingleCorrect(Validator $validator, string $attribute, int $correctCount): void
    {
        if ($correctCount === 0) {
            $validator->errors()->add($attribute, 'Please select one correct answer.');
        } elseif ($correctCount > 1) {
            $validator->errors()->add($attribute, 'Only one correct answer is allowed for this question type.');
        }
    }

    /**
     * Validate that at least one correct answer is selected.
     */
    private function validateAtLeastOneCorrect(Validator $validator, string $attribute, int $correctCount): void
    {
        if ($correctCount === 0) {
            $validator->errors()->add($attribute, 'Please select at least one correct answer.');
        }
    }

    /**
     * Validate that option IDs belong to their respective questions.
     */
    private function validateOptionsBelongToQuestions(Validator $validator): void
    {
        $questions = $this->input('questions', []);

        foreach ($questions as $qIndex => $question) {
            $questionId = $question['id'] ?? null;
            $options = $question['options'] ?? [];

            if (! $questionId) {
                continue;
            }

            foreach ($options as $oIndex => $option) {
                $optionId = $option['id'] ?? null;

                if (! $optionId) {
                    continue;
                }

                $exists = QuizOption::query()
                    ->where('id', $optionId)
                    ->where('question_id', $questionId)
                    ->whereNull('deleted_at')
                    ->exists();

                if (! $exists) {
                    $validator->errors()->add(
                        "questions.{$qIndex}.options.{$oIndex}.id",
                        'This option does not belong to the specified question.'
                    );
                }
            }
        }
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->prepareAllocatedTime();
        $this->prepareQuestionOptions();
    }

    /**
     * Prepare allocated time - set to null if zero.
     */
    private function prepareAllocatedTime(): void
    {
        if (! $this->allocated_time) {
            return;
        }

        $parts = explode(':', $this->allocated_time);
        if (count($parts) !== 3) {
            return;
        }

        [$hours, $minutes, $seconds] = $parts;

        if ((int) $hours === 0 && (int) $minutes === 0) {
            $this->merge(['allocated_time' => null]);
        }
    }

    /**
     * Prepare question options - remove options for non-option types.
     */
    private function prepareQuestionOptions(): void
    {
        $questions = $this->input('questions', []);

        foreach ($questions as $index => $question) {
            $type = $question['type'] ?? null;

            if ($type && ! $this->requiresOptions($type)) {
                $questions[$index]['options'] = [];
            }
        }

        $this->merge(['questions' => $questions]);
    }
}
