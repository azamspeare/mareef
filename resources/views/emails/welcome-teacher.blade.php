@component('emails.components.layout', ['title' => 'Welcome to Mareef', 'footerText' => 'Thanks for joining us — you\'re building the future of teaching.'])
    <p class="greeting">Hi {{ $teacherName }},</p>

    <div class="content">
        <p>Welcome to <strong>Mareef</strong> — the platform built for language teachers who are tired of messy workflows.</p>
        <p>We're here to help you:</p>
    </div>

    <ul class="feature-list">
        <li>Create structured writing tasks in minutes</li>
        <li>Share a simple link with your students</li>
        <li>Review submissions with inline feedback tools</li>
        <li>Keep everything organized and trackable</li>
    </ul>

    <div class="divider"></div>

    <div class="content">
        <p><strong>You're all set up. Here's what to do next:</strong></p>
    </div>

    <div class="highlight-box" style="margin-bottom: 16px;">
        <p class="label">Step 1</p>
        <p class="value" style="font-size: 14px;">Create your first writing task</p>
    </div>

    <div class="highlight-box" style="margin-bottom: 16px;">
        <p class="label">Step 2</p>
        <p class="value" style="font-size: 14px;">Send the link to your students</p>
    </div>

    <div class="highlight-box">
        <p class="label">Step 3</p>
        <p class="value" style="font-size: 14px;">Review submissions inside your dashboard</p>
    </div>

    <p style="text-align: center; margin: 32px 0;">
        <a href="{{ $createTaskUrl }}" class="btn-primary">Create Your First Task</a>
    </p>

    <div class="secondary-section">
        <p><strong>Got questions?</strong></p>
        <p>Just reply to this email — we read every message.</p>
    </div>
@endcomponent
