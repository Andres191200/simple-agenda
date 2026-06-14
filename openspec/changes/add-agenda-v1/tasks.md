## 1. Project scaffold

- [ ] 1.1 Initialize a Vite + React + TypeScript project at the repo root
- [ ] 1.2 Add base config (tsconfig, ESLint/Prettier optional), npm scripts (`dev`, `build`, `preview`), and a minimal `index.html` / `main.tsx` mount
- [ ] 1.3 Set up a styling approach (plain CSS or CSS modules) and a basic app shell layout
- [ ] 1.4 Add a unit test runner (e.g. Vitest) for the pure helpers

## 2. Domain model & time helpers

- [ ] 2.1 Define the `Activity` type `{ id, title, description, color, day, start, end }` (day `YYYY-MM-DD`, start/end `HH:mm`)
- [ ] 2.2 Implement time helpers: `minutesFromMidnight(HH:mm)`, `dayFraction(HH:mm)` → 0..1, and `formatTime`/parse utilities
- [ ] 2.3 Implement validation: `end > start` and same-day; return inline error messages for invalid input
- [ ] 2.4 Unit test time helpers and validation (valid, end<=start, boundary 00:00/24:00)

## 3. Greedy packing

- [ ] 3.1 Implement pure `packDay(activities) → { activity, subRow }[]` (sort by start, assign lowest free sub-row where previous `end <= start`)
- [ ] 3.2 Expose `subRowCount` so a day-row can size its height
- [ ] 3.3 Unit test packing: non-overlapping reuse, nested overlaps, identical times, zero-duration

## 4. Persistence layer

- [ ] 4.1 Implement load/save against `localStorage` under a versioned key (`simple-agenda:v1:activities`), serializing the activity list as JSON
- [ ] 4.2 Wrap reads in try/catch so missing/corrupt data falls back to an empty list without crashing
- [ ] 4.3 Create the app store (context or small store) holding activities + selected month; persist on every mutation
- [ ] 4.4 Unit test persistence: round-trip save/load, empty start, corrupt data fallback

## 5. Agenda view & layout

- [ ] 5.1 Build `MonthAgenda` that renders one `DayRow` per day of the selected month (including empty days)
- [ ] 5.2 Build `DayRow` with the `00:00–24:00` hour axis and day label; height driven by `subRowCount`
- [ ] 5.3 Build `ActivityBar` positioned by `left`/`width` percentages from time helpers, colored by the activity, honoring a minimum bar width
- [ ] 5.4 Wire greedy packing into `DayRow` so overlapping bars occupy distinct sub-rows
- [ ] 5.5 Implement responsive hour axis: full labels on desktop; only `00:00` / `12:00` / `24:00` on narrow viewports

## 6. Today indicators & month navigation

- [ ] 6.1 Render month title with `◀` / `▶` controls; switching month re-renders day-rows and updates the title
- [ ] 6.2 Highlight today's row; when the current month is shown, draw the red 1px now-line at `now` and auto-scroll to today
- [ ] 6.3 Scope now-line to the current month only; update it at most once per minute

## 7. Activity form (create / edit / delete)

- [ ] 7.1 Build `ActivityForm` with fields: Title, Day (date picker), Start, End (`<input type="time" step="900">`), Color (swatch picker), Notes
- [ ] 7.2 Support create mode (clicking empty row space opens it with `day` prefilled) and edit mode (clicking a bar opens it prefilled with Save + Delete)
- [ ] 7.3 Run inline validation before save; block invalid submissions with messages
- [ ] 7.4 Implement save (create/update), delete, and cancel — cancelling a brand-new activity discards it (no "Untitled")
- [ ] 7.5 Ensure saves/edits/deletes flow through the store and persist, and bars re-render accordingly

## 8. Verification & polish

- [ ] 8.1 Manually verify each spec scenario (layout, packing, min width, today/now-line, month nav, responsive axis, CRUD, validation, persistence-across-refresh)
- [ ] 8.2 Verify responsive behavior on a narrow viewport and that empty rows render
- [ ] 8.3 Run `openspec validate add-agenda-v1 --strict` and fix any issues
- [ ] 8.4 Confirm `build` produces a working static bundle (`vite build` + `preview`)
