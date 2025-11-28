<?php

declare(strict_types=1);

namespace App\Filters\Submission;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use App\Contracts\Enums\ModelStatusEnum;
use App\Contracts\Enums\SubmissionStatusEnum;
use Illuminate\Http\Request;

final readonly class SubmissionFilter extends AbstractFilter
{
    public function __construct(
        int $teacherId,
        ?string $search,
        string $sortBy,
        string $sortDirection,
        int $perPage,
        ModelStatusEnum $trashed,
        public SubmissionStatusEnum $status,
    ) {
        parent::__construct($teacherId, $search, $sortBy, $sortDirection, $perPage, $trashed);
    }

    public static function sortables(): array
    {
        return ['id', 'submitted_at', 'spent_time', 'created_at', 'evaluated_at'];
    }

    public static function fromRequest(Request $request, int $teacher_id): self
    {
        [$search, $sortBy, $sortDirection, $perPage, $trashed] = self::resolveDefaultValues($request);

        $sortBy = self::validateSortBy($request->input('sort_by', 'submitted_at'));
        $status = self::validateStatus($request->input('status', 'not_reviewed'));

        return new self(
            teacherId: $teacher_id,
            search: $search,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
            perPage: $perPage,
            trashed: $trashed,
            status: $status,
        );
    }

    protected static function validateStatus(mixed $input): SubmissionStatusEnum
    {
        $enum = SubmissionStatusEnum::tryFrom((string) $input);

        return $enum ?? SubmissionStatusEnum::NOT_REVIEWED;
    }
}
