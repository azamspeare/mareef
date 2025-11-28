<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard\Writing;

use App\Filters\Writing\WritingFilter;
use App\Http\Controllers\Controller;
use App\Queries\Writing\WritingFindByIDQuery;
use App\Queries\Writing\WritingFindForListQuery;
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
    public function store(Request $request)
    {
        //
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
    public function archive(Request $request, int $id)
    {
        //
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(Request $request, int $id)
    {
        //
    }

    /**
     * Delete the specified resource from storage.
     */
    public function delete(Request $request, int $id)
    {
        //
    }
}
