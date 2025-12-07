# Mareff Writing Task Creation Page – Technical Specification

## Overview
The **Writing Task Creation** page in Mareff allows instructors to compose and publish a writing task for their students using a modern, minimal editor. The page is inspired by Medium’s clean writing interface and integrates the **BlockNote editor**, which offers Notion-style block editing in a free and open-source package.

---

## 🔧 Functional Requirements

### 📝 Input Fields
- **Title**:
  - Borderless, large text input.
  - Mapped to `writings.title`.
- **Content**:
  - Built with BlockNote editor.
  - Saved as JSON to `writings.content`.

### Supported Editor Blocks (via BlockNote):
- Headings (H1, H2, H3, H4, H5, H6)
- Paragraph
- Bold, Italic, Underline, Strikethrough
- Quote block
- Bullet list, Numbered list
- Code block
- Divider
- Image block
- Table block

🔔 **Toolbar should be hidden** — only expose block-level features via slash command (`/`).

### ➕ Drag Handle
- Display `+` and drag icon (`::`) on block hover or focus.
- Mimics Notion UX for block rearrangement.

---

## 🧭 Page Layout

| Section         | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| Top Left       | ← “Create a writing assignment for your students”                          |
| Top Right      | `Publish` button (ShadCN `<Button>`)                                       |
| Title Field    | Large, bold, borderless text input for writing title                       |
| Content Editor | BlockNote editor with supported blocks and clean UI                        |

---

## 🧪 Publishing Flow

### Step 1: Teacher clicks `Publish`
- Trigger modal popup (ShadCN `<Dialog>`)

### Step 2: Display "Limit writing time?" modal:
- Input fields: Hours, Minutes, Seconds (each accepts 0–59)
- Two buttons:
  - `Create without time`
  - `Create`
- If time fields are all `0`, treat as no time restriction
- Modal disappears on create or cancel

### Step 3: API Call
- POST `/writings`
- Payload:
  ```json
  {
    "title": "...",
    "content": {BlockNote JSON},
    "allocated_time": "HH:MM:SS" or null
  }
  ```
- On success: redirect to `/dashboard`

---

## 🛠️ Stack and Libraries
- **Editor**: [BlockNote](https://blocknotejs.org/)
- **UI**: TailwindCSS + ShadCN UI
- **Frontend**: React (with Inertia)
- **Backend**: Laravel (InertiaJS POST route)

---

## ✅ Validation
- Title must not be empty
- Content must have at least one block
- Allocated time is optional
- Client-side & server-side checks

---

## 🔐 Auth & Access
- Page accessible only to logged-in teachers (`role: 'teacher'`)
- Auth handled via Laravel Sanctum + Google OAuth

---

## 💡 Notes for AI Agents
- Build with ShadCN components.
- Do not include unused editor features.
- BlockNote is required.
- Keep the UI clean, minimalist, Medium-like.
- Use Tailwind classes like `prose`, `text-2xl`, `mt-8`, etc. for spacing.
- Dialog for time should be accessible and dismissible.
- Submission button state should show loading on submit.

This page lives at: `/writings/create`.
