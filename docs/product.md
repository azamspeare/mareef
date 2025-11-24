# Mareff – Product Overview (MVP)

## 1. What Mareff Is

Mareff is a web-based platform designed for **private language tutors** to create, collect, and grade **writing assignments** in a fast, clean, and centralized way.
It replaces the current workflow where teachers juggle Word/Google Docs, messaging apps, and manual document sharing.

Mareff focuses only on **writing tasks**, not full LMS functionality.

---

## 2. Target Users

### Primary Users

- Private language tutors (English, Russian, Arabic, Korean, Turkish, etc.)

### Secondary Users

- Students who receive and submit writing tasks
- Admin (platform owner) who manages system-level operations

---

## 3. Core Problem

Most tutors currently evaluate writing assignments through a long, inefficient workflow:

1. Create assignment in Word/Google Doc
2. Send file or link to students
3. Students write in a separate document
4. Students send file back through WhatsApp/Telegram/email
5. Teacher opens document, comments/highlights
6. Teacher sends edited file back
7. No clean tracking, no centralization, no progress overview

This wastes time and causes friction for both teacher and student.

---

## 4. Mareff’s Core Solution

A simple, streamlined workflow:

1. **Teacher creates a writing task**
    - Title, instructions, optional media
    - Mareff generates a **shareable link**

2. **Students open link, login, write, and submit**
    - Everything happens inside Mareff
    - One submission per student per task

3. **Teacher sees all submissions in a dashboard**
    - Filter: not evaluated / all
    - Open any submission to grade

4. **Teacher evaluates the submission**
    - Inline highlighting and comments (simplified in MVP)
    - Score (optional)
    - Overall feedback text

5. **Student later views feedback**
    - They return to the same link
    - They see their writing with comments and grade

This removes document chaos and keeps the whole writing process in one place.

---

## 5. Product Scope (MVP)

### Included in MVP

- Google OAuth login (students + teachers)
- Teacher dashboard
- Create / update / archive writing tasks
- Shareable links for writing tasks
- Student writing submission flow
- Submission list per writing task
- View + evaluate submissions
- General + inline feedback structure (can evolve)
- Student feedback viewing
- Admin role (basic platform control)

### Explicitly Not Included in MVP (v0.1)

- AI scoring or AI-generated feedback
- Payments or subscriptions
- Multi-language interface (UI)
- Organization/teams for teachers
- Advanced analytics or progress dashboards
- Rich editor plugins beyond basic writing needs
- Native mobile apps
- In-app messaging or chat
- Anything beyond basic email notifications (if used at all)

These can be considered only after validating the core writing workflow with real teachers.

---

## 6. Core Principles for the MVP

1. **One problem → one solution**
   Focus only on writing assignments. No listening, reading, or speaking modules.

2. **Fast teacher workflow**
   Creating and grading a writing task in Mareff should feel noticeably faster and cleaner than doing it via Google Docs + messaging apps.

3. **Low friction for students**
   Open link → login → write → submit. No complex registration or onboarding steps.

4. **Editor simplicity over complexity**
   The editor must be stable and predictable. Fancy features are less important than reliability.

5. **Ship small, iterate fast**
   The MVP should be usable by real tutors within 1–2 weeks of development and improved based on live feedback.

---

## 7. User Roles and Responsibilities

### Teacher

- Logs in via Google
- Creates writing tasks
- Shares links with students
- Views submissions for their tasks
- Evaluates submissions (score + feedback)
- Manages their tasks (archive/delete/update)

### Student

- Logs in via Google when accessing a task link
- Writes and submits one answer per writing task
- Cannot edit after submission
- Returns to the task link to view feedback when the teacher has evaluated

### Admin

- Has full access to the platform
- Can view and (if necessary) manage users, writings, and submissions
- Used mainly for platform maintenance, debugging, and manual interventions

---

## 8. High-Level User Flows

### Teacher Flow

1. Login
2. Go to dashboard
3. Create a writing task
4. Copy and share the task link with students
5. Wait for submissions
6. Open submissions list
7. Evaluate each submission
8. Students view feedback through the same link

### Student Flow

1. Open task link from teacher
2. Login with Google (if not already logged in)
3. Read the instructions
4. Write the answer in the editor
5. Submit the answer
6. Later, revisit the same link
7. View teacher’s score and feedback

---

## 9. Product Philosophy

Mareff is intentionally **not** trying to be:

- A full LMS
- A replacement for every teaching platform
- An all-in-one school management solution

Instead, Mareff is a **focused workflow tool** that fixes one specific, painful part of online teaching:

> Managing and evaluating student writing in a fast, clean, and organized way.

If teachers feel that Mareff is:

- Easier than their current method
- Faster to use for real assignments
- And worth continuing to use for the next writing task

Then the MVP is considered successful and ready to be expanded.

---

## 10. MVP Success Criteria

The Mareff MVP is successful if:

- Real tutors use the platform for real writing assignments
- Students are able to submit and view feedback without confusion
- The evaluation process feels smooth and reliable
- At least some tutors say they **prefer Mareff** over their previous method for handling writing tasks
- Tutors are willing to reuse Mareff for future assignments

If these criteria are met, the product can move into the next phases:

- UX polishing
- AI assistance
- Payments/subscriptions
- More features for analytics and institutions.
