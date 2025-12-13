@component('emails.components.layout', ['title' => 'New Submission'])
    <p class="greeting">Hi {{ $teacherName }},</p>

    <div class="content">
        <p><strong>{{ $studentName }}</strong> just submitted their response for:</p>
    </div>

    <div class="highlight-box">
        <p class="label">Task</p>
        <p class="value">{{ $taskTitle }}</p>
    </div>

    <div class="content">
        <p>You can now review, give feedback, and assign a score — all from your dashboard.</p>
    </div>

    <p style="text-align: center; margin: 32px 0;">
        <a href="{{ $submissionUrl }}" class="btn-primary">View Submission</a>
    </p>

    <div class="divider"></div>

    <div class="secondary-section">
        <p><strong>Need to check others too?</strong></p>
        <p>Your dashboard shows all pending and completed submissions.</p>
        <a href="{{ $dashboardUrl }}" class="btn-secondary">Go to Dashboard</a>
    </div>
@endcomponent
