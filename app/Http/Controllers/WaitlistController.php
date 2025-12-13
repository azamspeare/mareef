<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Waitlist\AddWaitlistRequest;
use App\Models\Waitlist\Waitlist;

final class WaitlistController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(AddWaitlistRequest $request)
    {
        $attributes = $request->validated();

        $waitlist = Waitlist::query()->where('email', '=', $attributes['email'])->first();
        if ($waitlist) {
            return redirect()->back()->with('success', 'You are already on the waitlist.');
        }

        Waitlist::query()->create($attributes);

        return redirect()->back()->with('success', 'You have been added to the waitlist.');
    }
}
