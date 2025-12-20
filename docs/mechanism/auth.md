# auth.md

## 1. Current Flow (Before Telegram Integration)

- All users log in via **Google OAuth** (students and teachers)
- After login, users are authenticated and land in their respective views:
    - Teachers → Dashboard
    - Students → Task page (submission view)
- Notifications (submissions, feedback) are sent via **email**
- Limitation: Email is rarely used by students in Uzbekistan
- Cost: Sending email via providers (Resend, etc.) adds up at scale

---

## 2. New Flow (Hybrid: Google OAuth + Telegram Bot)

We keep **Google login as the core auth system**, but add Telegram-based notifications for both **teachers and students**.

---

## 3. For Whom?

- **Students**: Receive notifications via Telegram for:
    - When a teacher reviews their submission
    - Task-related alerts (e.g. reminders, deadlines)
- **Teachers**: Also receive Telegram notifications:
    - When students submit a task
    - New message or event from student side
- **System**: Continues to support existing users, avoids disruption

---

## 4. Updated Auth & Telegram Linking Flow

### After Google Login (for both students and teachers)

1. Check if `phone_number` exists on user record.
    - If not → force redirect to a phone number form.
2. After phone is saved:
    - Show instructions: “Open Telegram Bot to complete setup”
    - Provide link to open bot directly (`t.me/bot_name`)
3. Inside bot:
    - User sends their **phone number**
    - Bot finds matching user in DB and sends `/code 123456`
4. Back in web:
    - User inputs this code to confirm Telegram linking
    - ✅ Telegram is now connected to the account

### Redirect Logic

- **Students** logging in via task link:
    - After Telegram linking, redirect back to the original task page
- **Teachers**:
    - After linking, continue to dashboard as usual

---

## 5. Database Changes

### `users` table
- Add column: `phone_number` (nullable, but required after login)

### `telegram_users` table
Stores Telegram metadata.

| Column           | Type        |
|------------------|-------------|
| id               | BIGINT      |
| user_id          | BIGINT (FK) |
| telegram_user_id | STRING      |
| username         | STRING      |
| is_verified      | BOOLEAN     |
| created_at       | TIMESTAMP   |

### `otp_codes` table
Temporary storage for validation codes.

| Column     | Type        |
|------------|-------------|
| id         | BIGINT      |
| user_id    | BIGINT (FK) |
| code       | STRING      |
| expires_at | TIMESTAMP   |
| created_at | TIMESTAMP   |

---

## 6. Notification Mechanism

- On **student submission** → notify teacher via **Telegram**
- On **teacher feedback** → notify student via **Telegram**
- Fallback to email only if Telegram is not linked

---

## ✅ Summary

This upgraded auth + notification system:
- Maintains Google login flow (no disruption)
- Adds Telegram-based notifications for both roles
- Ensures minimal cost and high engagement
- Forces all users (new + existing) to add phone numbers and link Telegram account
- Handles student redirects after login gracefully

## 7. Steps
### ✅ Step 1 — Enter your phone number
We’ll use this to match your account inside our Telegram bot.

**Format:** `+998 90 123 45 67`

---

### ✅ Step 2 — Open the Telegram bot
Click the button below to open our official bot.

👉 [Open Bot](https://t.me/mareef_bot)

Make sure you're logged into Telegram with the same phone number.

---

### ✅ Step 3 — Send your phone number and grab your code
Once you start the bot, send your phone number.
The bot will reply with a 6-digit code tied to your account.

**Example response:**
`/code 512903`

---

### ✅ Step 4 — Didn’t get a code? Regenerate it
If your code expired or you lost it, just type `/code` in the bot again.
You’ll receive a new code valid for 5 minutes.

---

### ✅ Step 5 — Enter the code here
Paste the 6-digit code in the field on the left.
Once verified, your account will be linked to Telegram successfully.
