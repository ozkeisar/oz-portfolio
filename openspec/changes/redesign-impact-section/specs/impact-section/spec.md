# Impact Section Specification

## ADDED Requirements

### Requirement: Impact Section Display

The Impact section SHALL display key professional metrics in an animated, visually engaging format.

#### Scenario: Section renders with header
- **WHEN** the Impact section becomes visible
- **THEN** a header displaying "03. Impact" with section number styling SHALL appear
- **AND** the header SHALL include a spacer for the profile image on mobile

#### Scenario: Metrics grid displays
- **WHEN** the section entrance animation completes
- **THEN** 4 metric boxes SHALL be displayed in a grid layout
- **AND** desktop layout SHALL show 4 columns
- **AND** mobile layout SHALL show 2 columns (2x2 grid)

---

### Requirement: SVG Line-Drawing Animation

Each metric box SHALL use SVG stroke animation (line-drawing effect) for its border, NOT fade-in.

#### Scenario: Box outline draws progressively
- **WHEN** a metric box begins its entrance animation
- **THEN** the box outline SHALL draw progressively using `stroke-dashoffset` animation
- **AND** the stroke SHALL animate from fully hidden to fully visible
- **AND** NO opacity/fade animation SHALL be used for the outline

#### Scenario: Staggered box entrance
- **WHEN** the Impact section entrance begins
- **THEN** each metric box SHALL start drawing with a staggered delay
- **AND** box 1 SHALL start at approximately frame 20
- **AND** subsequent boxes SHALL start with ~15 frame delays between them

---

### Requirement: Number Counting Animation

Metric numbers SHALL animate by counting up from 0 to their final value.

#### Scenario: Number counts up after box draws
- **WHEN** a metric box outline finishes drawing (or is mostly drawn)
- **THEN** the number inside SHALL count up from 0 to the target value
- **AND** the counting animation SHALL use interpolation (not setInterval)

#### Scenario: Suffix displays with number
- **WHEN** the number counting animation plays
- **THEN** the suffix ('+', 'M+', '%', etc.) SHALL be visible alongside the number
- **AND** the label text SHALL appear with the number

---

### Requirement: Profile Image Integration

The profile image component SHALL animate from Experience section to Impact section header.

#### Scenario: Image animates to Impact on forward navigation
- **WHEN** user navigates forward from Experience to Impact
- **THEN** the profile image SHALL animate from Experience position to Impact header position
- **AND** the animation SHALL be coordinated with the section entrance timing

#### Scenario: Image position in Impact header (desktop)
- **WHEN** Impact section is active on desktop viewport
- **THEN** the profile image SHALL be positioned in the header area
- **AND** the position SHALL be horizontally centered or left-aligned with content

#### Scenario: Image position in Impact header (mobile)
- **WHEN** Impact section is active on mobile viewport
- **THEN** the profile image SHALL be positioned in the header row
- **AND** a dynamic spacer SHALL push the section number to accommodate the image

---

### Requirement: Animation-Driven Entrance (No Scroll)

The Impact section entrance SHALL be animation-driven, not scroll-driven.

#### Scenario: Scrolling blocked during entrance
- **WHEN** the Impact section entrance animation is playing
- **THEN** the user SHALL NOT be able to scroll to the next section
- **AND** the section SHALL have `hasOverflowContent: false` in configuration

#### Scenario: Animation duration
- **WHEN** the Impact section entrance begins
- **THEN** the full animation sequence SHALL complete within approximately 180 frames (6 seconds at 30fps)
- **AND** after completion, the user MAY scroll to the next section

---

### Requirement: Accurate Professional Metrics

The displayed metrics SHALL reflect real data from the professional summary.

#### Scenario: Verified metrics displayed
- **WHEN** the Impact section displays metrics
- **THEN** the following metrics SHALL be shown:
  - 9+ years of experience
  - 1M+ users impacted (Leumi Bank App)
  - 12 juniors trained (AI-First Bootcamp)
  - 40% reduction in integration issues (Mockingbird)

---

### Requirement: Exit Animation

The Impact section SHALL have an exit animation consistent with the site's patterns.

#### Scenario: Forward exit to Skills
- **WHEN** user navigates forward from Impact to Skills
- **THEN** the Impact section SHALL animate out (slide right)
- **AND** the profile image SHALL transition to Skills section position

#### Scenario: Backward exit to Experience
- **WHEN** user navigates backward from Impact to Experience
- **THEN** the Impact section SHALL reverse its entrance animation
- **AND** the profile image SHALL transition back to Experience position
