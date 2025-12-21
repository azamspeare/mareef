<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher\Writing;

use App\Actions\Writing\ArchiveWritingAction;
use App\Actions\Writing\DeleteWritingAction;
use App\Actions\Writing\RestoreWritingAction;
use App\DTOs\Writing\WritingDTO;
use App\Filters\Writing\WritingFilter;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\Writing\StoreWritingRequest;
use App\Http\Requests\Teacher\Writing\UpdateWritingRequest;
use App\Queries\Writing\WritingFindByIDQuery;
use App\Queries\Writing\WritingFindForListQuery;
use App\Services\Writing\CreateWritingService;
use App\Services\Writing\UpdateWritingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class WritingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, WritingFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = WritingFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Teacher/Writings/Index', [
            'writings' => $query->query($filter),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Teacher/Writings/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWritingRequest $request, ServiceHandler $handler): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $dto = WritingDTO::make($attributes, $teacher->id);

        $result = $handler->handle(new CreateWritingService($dto));
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to create writing.']);
        }

        return redirect()->route('writings.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id, WritingFindByIDQuery $query): Response
    {
        $teacher = $request->user();

        return Inertia::render('Teacher/Writings/Show', [
            'writing' => $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, int $id, WritingFindByIDQuery $query): Response
    {
        $teacher = $request->user();

        return Inertia::render('Teacher/Writings/Edit', [
            'writing' => $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWritingRequest $request, int $id, WritingFindByIDQuery $query, ServiceHandler $handler): RedirectResponse
    {
        $teacher = $request->user();
        $writing = $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $dto = WritingDTO::make($request->validated(), $teacher->id);

        $request = $handler->handle(new UpdateWritingService($writing, $dto));
        if (! $request) {
            return redirect()->back()->withErrors(['message' => 'Failed to update writing.']);
        }

        return redirect()->route('writings.show', ['id' => $id])
            ->with('success', 'Writing updated successfully.');
    }

    /**
     * Archive the specified resource from storage.
     */
    public function archive(Request $request, int $id, WritingFindByIDQuery $query, ArchiveWritingAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $writing = $query->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $result = $action->run($writing);
        if (! $result) {
            return redirect()->back()->with('error', 'Failed to archive writing.');
        }

        $filter = WritingFilter::fromRequest($request, $teacher->id);

        return redirect()->route('writings.index', $filter->toRedirectParams())
            ->with('success', 'Writing archived successfully.');
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(Request $request, int $id, WritingFindByIDQuery $query, RestoreWritingAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $writing = $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $result = $action->run($writing);
        if (! $result) {
            return redirect()->back()->with('error', 'Failed to restore writing.');
        }

        $filter = WritingFilter::fromRequest($request, $teacher->id);

        return redirect()->route('writings.index', $filter->toRedirectParams())
            ->with('success', 'Writing restored successfully.');
    }

    /**
     * Delete the specified resource from storage.
     */
    public function delete(Request $request, int $id, WritingFindByIDQuery $query, DeleteWritingAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $writing = $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $result = $action->run($writing);
        if (! $result) {
            return redirect()->back()->with('error', 'Failed to delete writing.');
        }

        $filter = WritingFilter::fromRequest($request, $teacher->id);

        return redirect()->route('writings.index', $filter->toRedirectParams())
            ->with('success', 'Writing deleted successfully.');
    }
}
