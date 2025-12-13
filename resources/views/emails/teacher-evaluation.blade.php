@component('emails.components.layout', ['title' => $isUpdated ? 'Your Feedback Has Been Updated' : 'Your Task Has Been Reviewed', 'footerText' => 'Keep learning — you\'re doing great.'])
    <p class="greeting">Hi {{ $studentName }},</p>

    <div class="content">
        @if($isUpdated)
            <p><strong>{{ $teacherName }}</strong> has updated the feedback for your submission on <strong>{{ $taskTitle }}</strong>.</p>
        @else
            <p>Your submission for <strong>{{ $taskTitle }}</strong> has been reviewed by <strong>{{ $teacherName }}</strong>.</p>
        @endif
    </div>

    <div class="highlight-box">
        <p class="label">{{ $isUpdated ? 'What\'s new' : 'What you can now see' }}</p>
        <p class="value" style="font-size: 14px; font-weight: 400; color: #3f3f46;">
            @if($isUpdated)
                Check the updated comments, highlights, and score
            @else
                Inline comments, highlights, feedback summary, and your score
            @endif
        </p>
    </div>

    <p style="text-align: center; margin: 32px 0;">
        <a href="{{ $feedbackUrl }}" class="btn-primary">View Feedback</a>
    </p>

    <div class="divider"></div>

    <div class="secondary-section">
        <p><strong>Why this matters</strong></p>
        <p>Reviewing feedback is the fastest way to improve. We save every comment so you can revisit it anytime.</p>
    </div>
@endcomponent
