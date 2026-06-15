## ADDED Requirements

### Requirement: Vertical day-row layout

The system SHALL display the agenda as a vertical, scrollable list of full-width day-rows for the selected month. Each day-row SHALL show a day label (e.g. "Mon 13") and a horizontal time axis spanning `00:00` to `24:00`.

#### Scenario: Days rendered as rows

- **WHEN** a month is displayed
- **THEN** one full-width row is rendered for each calendar day of that month, in chronological order, each showing its day label and a `00:00–24:00` time axis

#### Scenario: Empty days are still shown

- **WHEN** a day has no activities
- **THEN** its row is still rendered (days are never skipped), showing an empty time axis

### Requirement: Activities rendered as positioned bars

The system SHALL render each activity as a horizontal colored bar within its day-row, positioned and sized so its left edge corresponds to `start` and its right edge to `end` along the `00:00–24:00` axis. The bar SHALL use the activity's color.

#### Scenario: Bar reflects start and end

- **WHEN** an activity with `start = 09:00` and `end = 10:30` is rendered on its day-row
- **THEN** a bar appears spanning from the 09:00 position to the 10:30 position on that row's time axis, filled with the activity's color

#### Scenario: Minimum bar width for short activities

- **WHEN** an activity is very short or has `start == end` (zero duration)
- **THEN** its bar is rendered at a minimum width (a visual floor) so it remains visible and clickable, regardless of its real duration

### Requirement: Greedy overlap packing

When activities in the same day overlap in time, the system SHALL place overlapping bars on separate sub-rows beneath one another so no two bars visually overlap. The system SHALL reuse a freed sub-row once an earlier activity has ended (greedy interval packing), and the day-row's height SHALL grow to fit the number of sub-rows required.

#### Scenario: Overlapping activities stack

- **WHEN** two activities on the same day overlap in time
- **THEN** the second bar is placed on a sub-row beneath the first, and neither bar visually overlaps the other

#### Scenario: Sub-rows are reused

- **WHEN** activity A occupies a sub-row and ends before activity C starts on the same day
- **THEN** activity C reuses A's sub-row rather than adding a new one

#### Scenario: Row height grows to fit

- **WHEN** a day requires N sub-rows to display its activities without overlap
- **THEN** that day-row's height grows to accommodate all N sub-rows

### Requirement: Today indicators

The system SHALL visually highlight today's row and, while the current month is displayed, SHALL draw a single red 1px vertical line spanning all day-rows at the horizontal position corresponding to the current time of day. When the current month is first displayed, the view SHALL auto-scroll to today's row.

#### Scenario: Now-line spans all rows

- **WHEN** the current month is displayed
- **THEN** a single red 1px vertical line is drawn at the horizontal position corresponding to the current time, spanning across all day-rows (not confined to today's row)

#### Scenario: No now-line in other months

- **WHEN** a month other than the current month is displayed
- **THEN** no now-line is shown on any row

#### Scenario: Auto-scroll to today

- **WHEN** the current month is displayed
- **THEN** the view scrolls so today's row is visible, and today's row is visually highlighted

### Requirement: Month navigation

The system SHALL show a centered month title (e.g. "June 2026") with a previous (`◀`) and next (`▶`) control on either side. Activating a control SHALL switch the displayed month accordingly and re-render its day-rows.

#### Scenario: Navigate to next month

- **WHEN** the user activates the `▶` control
- **THEN** the view switches to the following month, updates the month title, and renders that month's day-rows

#### Scenario: Navigate to previous month

- **WHEN** the user activates the `◀` control
- **THEN** the view switches to the preceding month, updates the month title, and renders that month's day-rows

### Requirement: Responsive hour axis

The system SHALL adapt the hour axis labels to viewport width. On wide (desktop) viewports it SHALL show the full set of hour labels; on narrow (mobile) viewports it SHALL show only three labels: `00:00` at the left edge, `12:00` centered, and `24:00` at the right edge.

#### Scenario: Desktop axis

- **WHEN** the viewport is wide
- **THEN** the hour axis shows the full set of hour labels

#### Scenario: Mobile axis

- **WHEN** the viewport is narrow
- **THEN** the hour axis shows exactly three labels — `00:00` (left), `12:00` (center), `24:00` (right)
