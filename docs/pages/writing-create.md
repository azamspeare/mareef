# Mareff Writing Task Creation Page – Technical Specification

## Overview
The **Writing Task Creation** page in Mareff allows instructors to compose a new writing assignment for their students in a focused, minimalistic editor. This page combines a **Medium-like** writing experience (clean interface, large title field, minimal chrome) with **Notion-style** block editing (block-level controls, drag-and-drop reordering). Instructors can enter a title and rich text content for the assignment, format it with headings or lists, and publish it for students.

## Design Goals
- **Clean, Minimal Interface**
- **Notion-Style Block Editor**
- **Focused Writing Experience**
- **Responsive & Accessible**

## Layout Structure
### Top Navigation Bar
- **Back Navigation**: Left-pointing arrow + "Create a writing assignment for your students"
- **Publish Button**: Right-aligned, ShadCN/UI button

### Editor Area
- **Title Input Field**
- **Rich Text Content Editor**
- No visible borders, clean white background

## React Component Structure
- `WritingsCreatePage`: Main Inertia page component
    - **Header Bar**: `<BackLink />` and `<PublishButton />`
    - **TitleField**: Large input styled like Medium title
    - **RichTextEditor**: TipTap-based Notion-style editor

## Rich Text Editor Configuration (TipTap)
- **Core Extensions**: `StarterKit`
- **Placeholder**
- **History**
- **Drag & Drop Reordering**: `DragHandle`
- **Custom Block Menu**: via "+" button and optional slash command
- **Styling of Blocks**: Tailwind Typography (`prose`)

## User Interactions & UX Behavior
- Entering Title
- Writing Content
- Drag-and-Drop Blocks
- Formatting Toolbar (optional)
- Back Navigation
- Publish Process (validation, API call, redirect)
- Error Handling
- Performance Considerations
- Mobile Behavior
- Draft Saving (future)

## Validation Requirements
- **Title Required**
- **Content Required**
- **Error Display**

## API Integration (Laravel Inertia)
- **Route & Controller**: `POST /writings -> WritingsController@store`
- **Request Handling**
- **Inertia Form Submission**
- **CSRF & Auth**
- **Feedback**

## UI Component Details (Tailwind + ShadCN)
- **Back Arrow Link**: Flex layout with Lucide `ArrowLeft` icon
- **Publish Button**: ShadCN `<Button>`
- **Title Field**: Borderless input styled with Tailwind
- **Editor Content Area**: `<EditorContent>` with `prose`
- **Dropdown Menu**: ShadCN Menu or Popover for block insertions
- **Animations & Transitions**: Subtle hover, dropdown fade, and publish feedback

## Conclusion
This document outlines the technical implementation of the `writings/create` page in Mareff. Follow this closely to match the expected UI/UX and backend integration.
