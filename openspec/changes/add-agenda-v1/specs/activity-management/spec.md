## ADDED Requirements

### Requirement: Activity data model

An activity SHALL consist of: a unique `id`, a `title`, a `description`, a `color`, a `day`, a `start` time, and an `end` time. The `start` and `end` times SHALL support minute precision.

#### Scenario: Activity fields

- **WHEN** an activity is created
- **THEN** it has an `id`, `title`, `description`, `color`, `day`, `start`, and `end`, where `start` and `end` are times with minute precision

### Requirement: Same-day ordering validation

The system SHALL require that an activity's `end` is strictly after its `start` and that both `start` and `end` fall on the same `day`. Cross-midnight activities SHALL NOT be expressible. The system SHALL reject any activity that violates these rules and SHALL NOT persist it.

#### Scenario: Valid activity accepted

- **WHEN** the user submits an activity with `end` after `start` on the same day
- **THEN** the activity is accepted and saved

#### Scenario: End not after start rejected

- **WHEN** the user submits an activity whose `end` is equal to or before its `start`
- **THEN** the system shows an inline validation error and does not save the activity

#### Scenario: Cross-midnight not allowed

- **WHEN** the user attempts to set a `start` and `end` that would span across midnight (different days)
- **THEN** the system prevents it / shows a validation error, and the activity is not saved

### Requirement: Form-based create and edit

The system SHALL provide a form for creating and editing an activity with fields: Title, Day, Start, End, Color (swatch picker), and Notes/Description. The same form SHALL be used for both creating new activities and editing existing ones.

#### Scenario: Create via form

- **WHEN** the user opens the create form, fills in valid values, and submits
- **THEN** a new activity is created with those values and appears on the corresponding day-row

#### Scenario: Edit via form

- **WHEN** the user opens an existing activity in the form, changes values, and saves
- **THEN** the activity is updated and its bar re-renders to reflect the new values

#### Scenario: Discard a brand-new activity on cancel

- **WHEN** the user cancels the form for a brand-new activity that has never been saved
- **THEN** no activity is created (it is discarded rather than saved as "Untitled")

### Requirement: Form open affordances

The system SHALL open the form pre-filled with the relevant context based on where the user clicks. Clicking an empty area of a day-row SHALL open the create form with that day pre-selected. Clicking an existing activity bar SHALL open the form pre-filled with that activity's values, offering Save and Delete.

#### Scenario: Click empty day-row to create

- **WHEN** the user clicks an empty area of a day-row
- **THEN** the create form opens with the Day field pre-filled to that day

#### Scenario: Click activity bar to edit

- **WHEN** the user clicks an existing activity bar
- **THEN** the form opens pre-filled with that activity's values, and offers Save and Delete actions

### Requirement: Delete activity

The system SHALL allow deleting an existing activity from its edit form. After deletion the activity SHALL no longer appear on any day-row.

#### Scenario: Delete from edit form

- **WHEN** the user opens an existing activity and activates Delete
- **THEN** the activity is removed and its bar disappears from the day-row

### Requirement: Time input granularity

The system SHALL present Start and End time inputs that step in 15-minute increments by default while still allowing the user to enter arbitrary minute values (consistent with the minute-precision data model).

#### Scenario: Default 15-minute step

- **WHEN** the user adjusts a time input using its stepper controls
- **THEN** the value changes in 15-minute increments

#### Scenario: Free minute entry allowed

- **WHEN** the user types an arbitrary minute value (e.g. `09:07`) into a time input
- **THEN** the value is accepted at minute precision
