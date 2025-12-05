<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard\Writing;

use App\Actions\Writing\ArchiveWritingAction;
use App\Actions\Writing\DeleteWritingAction;
use App\Actions\Writing\RestoreWritingAction;
use App\DTOs\Writing\WritingDTO;
use App\Filters\Writing\WritingFilter;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Writing\StoreWritingRequest;
use App\Queries\Writing\WritingFindByIDQuery;
use App\Queries\Writing\WritingFindForListQuery;
use App\Services\Writing\CreateWritingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class WritingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, WritingFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = WritingFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Writings/Index', [
            'writings' => $query->query($filter),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Writings/Create');
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

        return Inertia::render('Writings/Show', [
            'writing' => $query->query(['id' => $id, 'teacher_id' => $teacher->id])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, int $id, WritingFindByIDQuery $query): Response
    {
        $teacher = $request->user();

        return Inertia::render('Writings/Edit', [
            'writing' => $query->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        //
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

    /**
     * Serve writing image from storage
     */
    public function serveImage(string $filename): StreamedResponse
    {
        $path = 'writings/images/' . $filename;

        if (!Storage::exists($path)) {
            abort(404);
        }

        $mimeType = Storage::mimeType($path);

        return Storage::response($path, null, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000', // Cache for 1 year
        ]);
    }
}
