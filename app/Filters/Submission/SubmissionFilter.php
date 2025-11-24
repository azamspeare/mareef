<?php

declare(strict_types=1);

namespace App\Filters\Submission;

use App\Contracts\Enums\SubmissionStatusEnum;
use Illuminate\Http\Request;

final readonly class SubmissionFilter
{
    public function __construct(
        public int $teacherId,
        public ?string $search,
        public string $sortBy,
        public string $sortDirection,
        public int $perPage,
        public SubmissionStatusEnum $status,
    ) {
    }

    public static function fromRequest(Request $request, int $teacher_id): self
    {
        $search = $request->filled('search') ? $request->string('search')->trim()->value() : null;
        $sortBy = self::validateSortBy($request->input('sort_by', 'submitted_at'));
        $sortDirection = self::validateSortDirection($request->input('sort_direction', 'desc'));
        $perPage =$request->input('per_page', 10);
        $status = self::validateStatus($request->input('status', 'not_reviewed'));

        return new self(
            teacherId: $teacher_id,
            search: $search,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
            perPage: $perPage,
            status: $status,
        );
    }

    private static function validateSortBy(mixed $input): string
    {
        return match (strtolower((string) $input)) {
            'id', 'submitted_at', 'spent_time', 'created_at', 'evaluated_at' => $input,
            default => 'submitted_at',
        };
    }

    private static function validateSortDirection(mixed $input): string
    {
        return match (strtolower((string) $input)) {
            'asc', 'desc' => strtolower((string) $input),
            default => 'desc',
        };
    }

    private static function validateStatus(mixed $input): SubmissionStatusEnum
    {
        $enum = SubmissionStatusEnum::tryFrom((string) $input);

        return $enum ?? SubmissionStatusEnum::NOT_REVIEWED;
    }
}
