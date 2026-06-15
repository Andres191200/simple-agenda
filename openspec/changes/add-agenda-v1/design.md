## Context

Simple Agenda is greenfield — no code exists yet, only the project premise. v1 is a single-user, frontend-only React + TypeScript web app that renders a personal calendar of timed activities and lets the user manage them through a form. Persistence is browser `localStorage`; there is no backend. This design records the technical choices made during exploration so implementation can proceed without re-litigating them. See `proposal.md` for motivation and `specs/` for the normative requirements.

Key constraints:
- Frontend-first; no server, accounts, or network in v1.
- Activities are confined to a single day (no cross-midnight), by deliberate rule — this is what keeps rendering simple.
- Must stay legible on both desktop and mobile widths.

## Goals / Non-Goals

**Goals:**
- A clear vertical agenda: one row per day of the selected month, hours on the X axis, activities as colored bars.
- Correct, compact overlap handling (greedy interval packing) with growing row heights.
- Simple, complete activity lifecycle (create / edit / delete) through one reusable form with validation.
- Durable local data via `localStorage`, resilient to malformed/missing data.
- A component/data structure that makes the deferred v2 drag features cheap to add later.

**Non-Goals:**
- Backend, accounts/auth, multi-device sync.
- Drag-to-create / resize / move (v2).
- Recurring activities, cross-midnight activities, notifications/reminders.
- Timezone math beyond the user's local browser time.

## Decisions

### D1 — Layout model: day-rows with an hour-fraction coordinate system
Each day-row is a horizontal track whose width maps linearly to `00:00–24:00`. A bar's left/width are computed as fractions of the day: `left = minutesFromMidnight(start) / 1440`, `width = (minutesFromMidnight(end) - minutesFromMidnight(start)) / 1440`, expressed in `%`. This keeps positioning resolution-independent and trivially responsive.
- **Alternatives considered:** a fixed pixel-per-hour scale (simpler math but requires horizontal scrolling and breaks the "full-width row" intent); CSS grid with 24 (or 96) columns (snappy but fights minute precision). Percentage-of-day wins on simplicity + responsiveness.

### D2 — Greedy packing as a pure function
Overlap layout is computed by a pure function `packDay(activities) → { activity, subRow }[]`: sort by `start`, assign each activity the lowest sub-row index whose last-assigned activity has already ended (`end <= start`). Row height = `(maxSubRow + 1) * barHeight`. Keeping this pure makes it unit-testable and independent of React.
- **Alternatives considered:** naive "one sub-row per activity" (taller, wasteful) — rejected per spec; a full interval-graph coloring optimum — unnecessary, greedy is the agreed behavior and is O(n log n).

### D3 — Data model: store local wall-clock, confine to one day
`Activity = { id: string; title: string; description: string; color: string; day: string /* YYYY-MM-DD */; start: string /* HH:mm */; end: string /* HH:mm */ }`. `start`/`end` are minute-precision times **within** `day`. Because cross-midnight is disallowed, no entry ever spans rows and no render-time splitting logic is needed. `id` generated via `crypto.randomUUID()`.
- **Alternatives considered:** absolute `Date`/ISO timestamps for start/end (needed if we allowed midnight crossing — but we don't, so this adds timezone/parsing complexity for no benefit); separate `startMinutes`/`endMinutes` integers (fine internally, but strings are friendlier for `localStorage` and form binding — we convert to minutes only inside layout/validation helpers).

### D4 — One reusable form for create + edit
A single `ActivityForm` handles both modes, distinguished by whether it was opened with an existing activity. Opening context: clicking empty row space → create mode with `day` prefilled; clicking a bar → edit mode prefilled, with Save + Delete. Validation (`end > start`, same day) runs inline before save; invalid submissions are blocked. Cancelling a never-saved activity discards it (no "Untitled" rows).
- **Alternatives considered:** separate create/edit forms (duplication); inline-on-bar editing (that's the v2 drag story). One form keeps v1 small and is reused by v2.

### D5 — Time inputs: 15-minute step, free minute entry
Start/End use native `<input type="time" step="900">` (900s = 15 min) so steppers move in 15-minute jumps while typing still allows any minute (e.g. `09:07`). This satisfies the minute-precision model without a custom picker.
- **Alternatives considered:** custom dropdown of 15-min slots (loses free minute entry); 1-minute step (too fiddly to step through). Native input is zero-dependency and accessible.

### D6 — State & persistence: a thin store synced to localStorage
A single source of truth (React context or a tiny store such as `useReducer`/Zustand) holds the activity list and the selected month. A persistence layer reads on startup and writes on every mutation, wrapped in try/catch so corrupt/missing data falls back to an empty list. Activities are stored under one versioned key (e.g. `simple-agenda:v1:activities`).
- **Alternatives considered:** IndexedDB (more capacity but heavier API; unnecessary at v1 data volumes); per-activity keys (complicates atomic reads). One JSON blob under a versioned key is simplest and easy to migrate later.

### D7 — Today affordances scoped to current month
The now-line and auto-scroll only apply when the selected month is the current calendar month; the now-line position is `minutesFromMidnight(now)/1440`. A lightweight timer (e.g. update each minute) keeps the line current. Today's row gets a highlight class regardless of scroll. The now-line is rendered once as a **global overlay spanning all day-rows** (positioned over the rows container at `left: calc(var(--label-width) + (100% - var(--label-width)) * fraction)`), not as a per-row element — since the time-of-day axis is identical for every row, a single continuous line reads better than one confined to today's row.

### D8 — Tooling: Vite + React + TypeScript
Vite for fast dev/build, React + TypeScript for the app. No UI framework dependency required for v1; plain CSS (or CSS modules) suffices for the layout. Keeps the dependency surface minimal.

## Risks / Trade-offs

- **Sliver bars / unreadable titles on narrow viewports** → minimum bar width (D1/spec) keeps bars clickable; titles may truncate with ellipsis and rely on the edit form / tooltip for full text.
- **localStorage size & single-device** → acceptable for a personal v1; versioned key (D6) leaves a clean migration path to IndexedDB or a backend later.
- **No cross-midnight activities** → overnight items must be split by the user into two entries; accepted tradeoff that removes all render-splitting complexity.
- **Greedy packing can look "jumpy" after edits** → packing is deterministic from sorted start times, so the same data always lays out the same way; acceptable for v1 (no live drag to animate yet).
- **Now-line timer churn** → update at most once per minute to avoid needless re-renders.
- **Browser timezone/DST edge at midnight** → since times are wall-clock strings within a day and we never cross midnight, DST has no effect on stored data; only "what is today/now" uses local time.

## Migration Plan

Greenfield — no data or system to migrate. Deployment is a static frontend build (e.g. `vite build`) served from any static host. Rollback = redeploy the previous static build; user data in `localStorage` is untouched by deploys. The versioned storage key (D6) reserves room for a future schema migration if the model changes.

## Open Questions

- None blocking. The two previously-open decisions are resolved as defaults: time inputs use a 15-minute step with free minute entry (D5), and cancelling a brand-new activity discards it (D4). Choice of store implementation (plain context vs. a small library) is left to implementation discretion.
