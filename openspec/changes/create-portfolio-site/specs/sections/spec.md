# Sections Specification

## ADDED Requirements

### Requirement: Hero Section
The system SHALL display a hero section with Oz's name, title, and scroll indicator.

#### Scenario: Initial entrance animation
- **WHEN** page loads for the first time
- **THEN** name scales from 0.9 to 1 with fade, title slides up with fade, scroll hint appears last

#### Scenario: Hero frame range
- **WHEN** frame is between 0-100
- **THEN** hero section is fully visible and interactive

### Requirement: Summary Section
The system SHALL display a summary section with professional photo, one-liner bio, domain badges, and years of experience.

#### Scenario: Photo placement
- **WHEN** summary section is visible
- **THEN** Oz's photo appears on left side (desktop) or top (mobile) with text flowing beside/below

#### Scenario: Domain badges
- **WHEN** summary progress reaches 0.3-0.7
- **THEN** domain badges (Fintech, Cyber, Medical) fade in sequentially

#### Scenario: Summary frame range
- **WHEN** frame is between 100-250
- **THEN** summary section animates through its content

### Requirement: Experience Section
The system SHALL display a vertical timeline of Oz's career progression.

#### Scenario: Timeline builds on scroll
- **WHEN** user scrolls through experience section
- **THEN** timeline nodes and role cards appear sequentially from oldest to current

#### Scenario: Current role highlight
- **WHEN** current role (Abra - AI Lead) appears
- **THEN** it is visually highlighted with accent color

#### Scenario: Experience frame range
- **WHEN** frame is between 250-500
- **THEN** experience timeline animates through all roles

### Requirement: Impact Section
The system SHALL display key metrics with animated number counters.

#### Scenario: Number animation
- **WHEN** impact section progress increases
- **THEN** numbers animate from 0 to their final values (1M+, 7, 40%)

#### Scenario: Mockingbird callout
- **WHEN** impact section is visible
- **THEN** Mockingbird open-source project is highlighted with GitHub link

#### Scenario: Impact frame range
- **WHEN** frame is between 500-650
- **THEN** impact metrics animate

### Requirement: Skills Section
The system SHALL display technical and leadership skills in a grid layout.

#### Scenario: Skills grid reveal
- **WHEN** skills section progress increases
- **THEN** skill items fade in with staggered timing

#### Scenario: Skills categories
- **WHEN** skills section is visible
- **THEN** skills are grouped into Technical and Leadership categories

#### Scenario: Skills frame range
- **WHEN** frame is between 650-800
- **THEN** skills grid animates

### Requirement: Contact Section
The system SHALL display contact links with animated SVG icons.

#### Scenario: Contact visibility
- **WHEN** frame is between 800-900
- **THEN** contact section is fully visible with all icons drawn

### Requirement: Responsive Layout
All sections SHALL adapt their layout and sizing based on viewport dimensions.

#### Scenario: Mobile layout
- **WHEN** viewport width is less than 768px
- **THEN** sections use stacked vertical layout with smaller font sizes

#### Scenario: Desktop layout
- **WHEN** viewport width is 1200px or more
- **THEN** sections use full horizontal space with larger font sizes

#### Scenario: Responsive values
- **WHEN** any size/spacing value is calculated
- **THEN** it uses interpolate with viewport width as input
