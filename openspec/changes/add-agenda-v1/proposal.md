## Why

Simple Agenda has no application yet — only a project premise. People need a lightweight, personal way to see their day's activities laid out on a timeline and to add/edit them without ceremony. This change defines and delivers the first usable version (v1): a single-user, frontend-only agenda that renders activities as colored bars on per-day timelines and lets users manage them through a form. Starting frontend-first with browser persistence lets us prove the layout and data model before committing to any backend.

## What Changes

- Introduce a **vertical agenda view**: a scrollable list of full-width day-rows for the current month. Each row's X axis spans `00:00 → 24:00`; activities render as horizontal colored bars sized/positioned by their start and end times.
- **Overlap handling via greedy packing**: overlapping activities drop to sub-rows beneath and reuse freed sub-rows so packing stays compact; a day-row grows in height to fit its sub-rows.
- **Minimum bar width** for very short or zero-duration activities so they remain visible/clickable regardless of real duration.
- **Today affordances**: a red 1px vertical "now" line on today's row (current month only), a subtle highlight on today's row, and auto-scroll to today when the current month is shown.
- **Month navigation**: a centered month title (e.g. "June 2026") with `◀` / `▶` buttons to move to the previous/next month. Empty day-rows are rendered (days are never skipped).
- **Form-based activity management**: create, edit, and delete activities through a form (Title, Day, Start, End, Color, Notes). Clicking an empty day-row opens the form pre-filled with that day; clicking an activity bar opens the same form pre-filled with Save and Delete.
- **Single-day data model & validation**: an activity is `{ id, title, description, color, day, start, end }` with minute precision. Rule: `end` must be after `start`, and both must fall on the **same day**. Cross-midnight activities are not expressible — this keeps rendering simple (a bar never splits across rows).
- **Responsive hour axis**: full hour labels on desktop; on mobile, only `00:00` (left), `12:00` (center), `24:00` (right) to stay legible.
- **Local persistence**: activities are stored in browser `localStorage` so a refresh does not wipe data.

Decisions recorded (sensible defaults chosen; see design.md):
- Time inputs use a **15-minute step**, with free minute entry still allowed (model is minute-precision).
- Cancelling a brand-new (never-saved) activity **discards** it rather than saving an "Untitled" entry.

## Capabilities

### New Capabilities

- `agenda-view`: the vertical day-row calendar — layout, hour axis, greedy overlap packing, minimum bar width, today highlighting / now-line, month navigation, and responsive hour labels.
- `activity-management`: the activity data model, the create/edit/delete form, its affordances (click empty row / click bar), and same-day + ordering validation.
- `local-persistence`: persisting activities to browser `localStorage` and loading them on startup.

### Modified Capabilities

<!-- None — this is the first change; there are no existing specs to modify. -->

## Impact

- **New code**: a React + TypeScript frontend (app scaffold, agenda-view components, activity form, packing/layout logic, time helpers, localStorage data layer). No code exists yet, so this establishes the project structure.
- **Dependencies**: React, TypeScript, and a build toolchain (e.g. Vite). No backend, server, or external services.
- **Out of scope (v1 non-goals)**: user accounts/auth, any backend/server, multi-device sync, drag-to-create/resize/move, recurring activities, cross-midnight activities, and notifications/reminders.
