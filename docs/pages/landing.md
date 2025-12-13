# Mareef Landing Page Redesign Specification

This document describes the full creative and structural requirements for generating a modern, attractive, teacher-focused landing page for **Mareef**.
Any AI agent reading this file should follow this specification when producing landing page designs, layouts, mockups, or copywriting.

---

# 1. Product Summary

**Mareef** is a platform for language teachers to create writing tasks, collect student submissions, and evaluate them easily. It replaces the chaotic workflow of:

- Google Docs
- Word files
- Screenshots
- Telegram/WhatsApp submissions
- Messy feedback loops
- No progress tracking

Mareef simplifies everything into a clean, unified interface.

Target users:
- Private language tutors
- Online teachers (English, Russian, Korean, Arabic, etc.)
- Small academies
- Instructors who teach via Zoom, Telegram, WhatsApp
- Teachers looking for a fast, organized writing-evaluation workflow

---

# 2. Visual & Style Inspirations

The landing page should draw inspiration from the following designs:

1. https://claude-code-dev.netlify.app/
2. https://neural-flow.netlify.app/
3. https://plasma-nextjs-template.vercel.app/
4. https://canvas-dev-0.netlify.app/
5. https://athel-dev.netlify.app/
6. https://prismadev.netlify.app/


**Desired style qualities:**

- Modern
- Clean
- Minimal
- Slightly futuristic
- Professional
- Warm and welcoming
- Trustworthy and calm
- Soft gradients or subtle glassmorphism
- Not childish, not corporate

---

# 3. Tone & Emotional Goals

The landing page should make teachers feel:

- Confident in the product
- Understood (we know their struggles)
- Safe (simple tool, no complexity)
- Excited to try
- Supported (the product solves real pain)
- Motivated to click "Get Started"

---

# 4. Landing Page Structure

AI agents must follow or adapt this structure when generating designs.

---

## 4.1 Hero Section

### Headline
**Tasks don’t have to be chaos.**

### Subheadline
Mareef helps language teachers create, share, and evaluate structured tasks — all in one place.
Start with writing, expand to reading, speaking, and more.

### CTA Buttons
This buttons should redirect to VITE_APP_TEACHER_DOMAIN
- [ Get Started for Free ]
- [ View Demo ]

### Hero Visual
Display a smooth mockup carousel or short animation showing:
- Writing task creation screen
- Student writing submission view
- Teacher feedback panel in dashboard

### Background Style
Use a soft gradient or blurred abstract background for a clean and modern feel. Avoid harsh contrasts or dark overlays.

---

## 4.2 The Problem

Language teachers are stuck using five tools to manage one task.

- 📄 Google Docs for writing
- 🖨 Printed worksheets for reading
- 🎧 Voice messages for speaking
- 📲 Telegram for submissions
- 📉 Zero tracking, no feedback history

Everything is scattered.
Grading takes hours.
Students don’t even know what they missed.

Whether you teach online or in person — managing tasks shouldn’t be this painful.

---

## 4.3 The Solution

Mareef turns scattered task chaos into a clean, structured flow — built for language teachers.

- ✍️ Create tasks in minutes (writing, reading, speaking, listening)
- 🔗 Share a single submission link with students
- 📥 Collect and manage all responses in one dashboard
- 📝 Give inline feedback, scores, or instant auto-grading
- 📊 Track student progress over time

No more PDFs. No more retyping grades. No more lost work.

Just smart, repeatable workflows — designed for how language is actually taught.

---

## 4.4 Product Preview

Show how Mareef works in real use.

### Suggested UI Screens (animated or scroll-triggered):

1. **Writing Task Creation**
   Block-based editor with title, instructions, and allocated time popup.

2. **Student Submission View**
   Clean writing interface with autosave and one-click submit.

3. **Teacher Evaluation Flow**
   Inline comments, highlights, scoring, and feedback popup.

4. **Dashboard Overview**
   3 analytics cards + filtered submission table (Not Reviewed | Evaluated)

> ✅ Focus on writing flow — it's live and usable today.
> 🛠 Mention other task types briefly: “Reading, Speaking, Listening — coming soon.”

---

## 4.5 Feature Highlights

### Built for Language Teachers
- Create writing, reading, listening, and speaking tasks (writing live now)
- Task flows designed for async or classroom use
- Structured creation → submission → evaluation loop

### Feedback Made Simple
- Inline comments and highlights
- Score input + feedback notes
- Email notifications for both teacher and student

### Organized by Default
- All tasks and submissions in one dashboard
- Filter by status: Not Reviewed, Evaluated
- Full history of feedback per student

### Time-Saving Automations (Premium)
- Auto-grading for quizzes (reading/listening)
- AI task generator (coming soon)
- AI feedback assistant (coming soon)

> Writing task flow is fully live.
> Other task types and automation tools are coming soon.

---

## 4.6 Why Teachers Love Mareef

### 🕒 It saves hours
No more downloading files, marking by hand, or replying in chat threads. Mareef cuts grading and feedback time in half.

### 🧘 It reduces stress
Everything is in one place — tasks, submissions, feedback, history. Teachers don’t lose track of anything.

### 🧠 It feels built for them
Language teachers finally get task types that match how they actually teach — writing, speaking, reading, listening.

### 🔁 It improves student learning
Faster feedback = better outcomes. Students get clearer guidance, instantly.

> “I used to dread writing assignments. Now I look forward to reviewing them.”
> — Beta user, private English tutor

---

## 4.8 Pricing

Start free. Upgrade when you're ready to scale.

| Plan       | Teachers | Assistants | Students | Features                                          | Price      |
|------------|----------|------------|----------|---------------------------------------------------|------------|
| **Free**   | 1        | 0          | 20       | All task types, manual workflow, basic analytics  | Free       |
| **Premium**| 1        | 3          | 200      | AI task generation, AI assistant, advanced analytics | ~$29/mo   |
| **VIP**    | 10       | 20         | 500      | Everything in Premium, for multi-teacher teams     | ~$49/mo   |

> 💡 All features are currently free during beta.
> Pricing may change as we expand functionality.

## 4.9 FAQ

### Is Mareef just for online teaching?
No — Mareef works great for traditional classrooms too. Many teachers use it to replace paper tasks, save grading time, and keep student work organized.

### Do students need accounts?
No, students log in using Google and submit tasks directly. No registration required.

### What task types are supported?
Writing tasks are fully live. Reading, listening, and speaking tasks are under development and coming soon.

### Can I give scores and feedback?
Yes. Mareef supports inline comments, scoring, and feedback per student — with stored history for every submission.

### Is it free?
Yes. During early access, all features are free. Paid tiers will launch once premium features (like AI tools) are stable.

### Can I try it without inviting students?
Absolutely. You can create tasks and test the full flow yourself before sharing anything with your class.

---

# 5. Design Requirements

- Use Tailwind CSS component patterns (with ShadCN where needed)
- Follow React/Inertia-style section composition (conceptually)
- Structure each section as scrollable visual blocks
- Prefer:
  - glassmorphism touches (not everywhere — just for depth layers like cards or modals)
  - soft neutral colors (off-whites, light grays, pale indigos/blues)
  - light gradients as subtle section dividers
  - rounded components (xl or 2xl border radius)
  - modern font stack with strong readability

- Hero and CTA sections should feel premium but minimal
- UI previews should be embedded in device mockups or card frames

**Avoid:**

- Childish colors or edtech cartoon styles
- Overly corporate, lifeless SaaS UI
- Cluttered multi-column layouts or heavy dark backgrounds
- Too many shadows or overlapping effects — clarity > fancy

---

# 6. Deliverables AI Should Produce

Whenever asked to redesign or generate the landing page, AI agents should output:

- Full landing page section-by-section
- Improved headlines
- Improved microcopy
- Feature descriptions
- Layout structure (not code unless requested)
- UI mockup descriptions
- Color, typography, and spacing recommendations

---

# 7. Output Format

AI outputs should be:

- Clean
- Structured
- Written in Markdown unless otherwise requested
- Easy to plug directly into Figma / frontend implementation

---

# 8. Summary for AI Agents

To redesign Mareef’s landing page:

- Use inspiration from modern clean templates
- Make it understandable and attractive for teachers
- Clearly explain the workflow
- Highlight the pain points and solution
- Push teachers to sign up
- Stay minimal + modern
- Deliver section-by-section content

This file defines the full design spec.
Follow it every time when generating landing page ideas or layouts.
