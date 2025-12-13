# Mareef – Backend Specification (MVP)

This document describes the **backend architecture**, **models**, and **database design** of Mareef’s MVP.
Controllers, routes, and FormRequests are intentionally excluded.

---

# **1. Backend Architecture Overview**

Mareef’s backend is a **Laravel 12 monolithic application** with:

- **Database:** MySQL
- **ORM:** Eloquent
- **Frontend communication:** Inertia.js (React)
- **Auth:** Google OAuth (password column currently unused)
- **Soft deletes:** Enabled on major tables (`users`, `writings`)
- **Content storage:** JSON-based writing content

The whole backend revolves around **four main models**:

- User
- Writing
- WritingSubmission
- WritingFeedback

These models represent the full writing → submission → evaluation cycle.

---

# **2. Database Schema (Actual Implemented Tables)**

Below is the exact database design currently implemented in your system.

```sql
CREATE TABLE `users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL
);
ALTER TABLE `users` ADD UNIQUE `users_email_unique`(`email`);

CREATE TABLE `writings`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `teacher_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` JSON NOT NULL,
    `allocated_time` TIME NULL,
    `public_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL
);

CREATE TABLE `writing_submissions`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `writing_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    `content` JSON NOT NULL,
    `spent_time` TIME NOT NULL,
    `submitted_at` TIMESTAMP NOT NULL,
    `evaluated_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);

CREATE TABLE `writing_feedbacks`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `submission_id` BIGINT NOT NULL,
    `teacher_id` BIGINT NOT NULL,
    `content` JSON NOT NULL,
    `score` BIGINT NOT NULL,
    `feedback` MEDIUMTEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);

ALTER TABLE `writing_submissions`
    ADD CONSTRAINT `writing_submissions_student_id_foreign` FOREIGN KEY(`student_id`) REFERENCES `users`(`id`);
ALTER TABLE `writing_feedbacks`
    ADD CONSTRAINT `writing_feedbacks_teacher_id_foreign` FOREIGN KEY(`teacher_id`) REFERENCES `users`(`id`);
ALTER TABLE `writing_feedbacks`
    ADD CONSTRAINT `writing_feedbacks_submission_id_foreign` FOREIGN KEY(`submission_id`) REFERENCES `writing_submissions`(`id`);
ALTER TABLE `writing_submissions`
    ADD CONSTRAINT `writing_submissions_writing_id_foreign` FOREIGN KEY(`writing_id`) REFERENCES `writings`(`id`);
ALTER TABLE `writings`
    ADD CONSTRAINT `writings_teacher_id_foreign` FOREIGN KEY(`teacher_id`) REFERENCES `users`(`id`);
```

---

# **3. Model Descriptions (AI-Friendly)**

These descriptions help AI agents clearly understand the domain and what each entity represents.

---

## **3.1 User Model (`users`)**

### **Purpose**
Represents every user in the platform:
- Teachers
- Students
- Admins

### **Fields Explanation**
- `name` — user’s full name
- `email` — unique login identifier
- `password` — currently unused (OAuth)
- `role` — determines capabilities
- `avatar` — optional profile image
- `deleted_at` — soft delete indicator

### **Relationships**
- Teacher → has many writings
- Student → has many submissions
- Teacher → has many feedback items

### **Role Meanings**
- `student` — writes submissions
- `teacher` — creates writings & evaluates submissions
- `admin` — platform-wide access

---

## **3.2 Writing Model (`writings`)**

A writing task created by a teacher and shared with students.

### **Purpose**
- Store assignment instructions
- Provide a shareable link via `slug`
- Support scheduled publishing (`public_at`)
- Track optional time limits

### **Fields Explanation**
- `teacher_id` — owner/creator
- `title` — name of the writing
- `slug` — public URL identifier (`/w/:slug`)
- `content` (JSON) — includes instructions, media, blocks
- `allocated_time` — optional timer for students
- `public_at` — writing becomes visible from this moment
- `deleted_at` — soft delete

### **Relationships**
- Belongs to a teacher (`users`)
- Has many submissions (`writing_submissions`)

---

## **3.3 WritingSubmission Model (`writing_submissions`)**

A student's answer to a writing task.

### **Purpose**
- Store submitted writing text
- Track submission time
- Track time spent
- Provide data for teacher evaluation

### **Fields Explanation**
- `writing_id` — the writing assigned
- `student_id` — the submitting student
- `content` — JSON field to store writing content
- `spent_time` — how long writing took
- `submitted_at` — when student submitted
- `evaluated_at` — when teacher completed evaluation
- timestamps

### **Relationships**
- Belongs to writing
- Belongs to student
- Has one feedback record

---

## **3.4 WritingFeedback Model (`writing_feedbacks`)**

Represents a teacher’s evaluation of a student’s submission.

### **Purpose**
- Store structured & unstructured feedback
- Store a numeric score
- Link teacher → submission

### **Fields Explanation**
- `submission_id` — linked submission
- `teacher_id` — evaluator
- `content` (JSON) — structured details, inline notes
- `score` — numeric grade
- `feedback` — long text comment

### **Relationships**
- Belongs to submission
- Belongs to teacher

---

# **4. Backend Concepts (Without Controllers)**

Even without controllers, the backend design implies certain behaviors:

### **Writing Lifecycle**
- Teacher creates writing
- Writing becomes public via slug
- Students open the public link and submit

### **Submission Lifecycle**
- Student submits their writing
- Student can only submit once
- Teacher reviews submissions

### **Feedback Lifecycle**
- Teacher gives feedback
- Submission becomes evaluated
- Student can view feedback any time

---

# **5. Summary for AI Agents**

To build backend features, agents should understand:

- **Users** create or submit content based on role
- **Writings** are teacher-generated tasks stored as JSON
- **Submissions** are student responses
- **Feedbacks** evaluate submissions

Everything in the backend revolves around these four models.

They form a clean, predictable domain for building features.

---
