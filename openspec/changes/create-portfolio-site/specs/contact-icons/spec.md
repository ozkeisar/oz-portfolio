# Contact Icons Specification

## ADDED Requirements

### Requirement: SVG Line Drawing Animation
Contact icons SHALL animate by drawing their paths progressively, not by morphing shapes.

#### Scenario: Path drawing effect
- **WHEN** contact icon progress increases from 0 to 1
- **THEN** the SVG stroke draws from 0% to 100% visible using stroke-dashoffset

#### Scenario: Drawing implementation
- **WHEN** an icon is rendered
- **THEN** it uses stroke-dasharray set to total path length and stroke-dashoffset interpolated from pathLength to 0

### Requirement: LinkedIn Icon
The system SHALL display a LinkedIn icon that draws itself as the contact section becomes visible.

#### Scenario: LinkedIn drawing
- **WHEN** contact progress is between 0.1 and 0.4
- **THEN** LinkedIn icon path draws from empty to complete

#### Scenario: LinkedIn link
- **WHEN** LinkedIn icon is clicked
- **THEN** user is navigated to Oz's LinkedIn profile

### Requirement: GitHub Icon
The system SHALL display a GitHub icon that draws itself as the contact section becomes visible.

#### Scenario: GitHub drawing
- **WHEN** contact progress is between 0.2 and 0.5
- **THEN** GitHub icon path draws from empty to complete

#### Scenario: GitHub link
- **WHEN** GitHub icon is clicked
- **THEN** user is navigated to Oz's GitHub profile (Mockingbird repo)

### Requirement: Email Icon
The system SHALL display an Email icon that draws itself as the contact section becomes visible.

#### Scenario: Email drawing
- **WHEN** contact progress is between 0.3 and 0.6
- **THEN** Email icon path draws from empty to complete

#### Scenario: Email link
- **WHEN** Email icon is clicked
- **THEN** user's email client opens with Oz's email address

### Requirement: No Emoji Usage
The system SHALL NOT use any emoji characters in the contact section or anywhere in the site.

#### Scenario: Icon rendering
- **WHEN** any icon is displayed
- **THEN** it is rendered as an SVG element, never as emoji text

### Requirement: Interactive Hover State
Contact icons SHALL have a subtle hover effect when user hovers over them.

#### Scenario: Hover effect
- **WHEN** user hovers over a contact icon
- **THEN** icon opacity or scale changes slightly to indicate interactivity
