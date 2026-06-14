## ADDED Requirements

### Requirement: Persist activities to local storage

The system SHALL persist all activities to the browser's `localStorage` whenever they change (create, edit, delete) so that data survives a page refresh. No backend or server SHALL be required.

#### Scenario: Data survives refresh

- **WHEN** the user creates or edits activities and then reloads the page
- **THEN** the previously saved activities are still present and displayed

#### Scenario: Deletion is persisted

- **WHEN** the user deletes an activity and reloads the page
- **THEN** the deleted activity does not reappear

### Requirement: Load activities on startup

The system SHALL load persisted activities from `localStorage` when the application starts and render them in the agenda view.

#### Scenario: Load on startup

- **WHEN** the application starts and `localStorage` contains saved activities
- **THEN** those activities are loaded and rendered on their day-rows

#### Scenario: Empty start

- **WHEN** the application starts and `localStorage` contains no saved activities
- **THEN** the agenda renders with empty day-rows and no errors

### Requirement: Resilient to invalid stored data

The system SHALL handle missing or malformed `localStorage` data gracefully, starting with an empty agenda rather than crashing.

#### Scenario: Corrupt data does not crash

- **WHEN** the stored activity data is missing or cannot be parsed
- **THEN** the application starts with an empty agenda and does not crash
