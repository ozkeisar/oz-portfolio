# Scroll Controller Specification

## ADDED Requirements

### Requirement: Scroll-to-Frame Mapping
The system SHALL map scroll position to a frame number for driving animations.

#### Scenario: Frame calculation
- **WHEN** user scrolls to 50% of total scroll height
- **THEN** the frame number is 50% of total frames (e.g., 450 of 900)

#### Scenario: Top of page
- **WHEN** scroll position is 0
- **THEN** frame number is 0

#### Scenario: Bottom of page
- **WHEN** scroll position equals maximum scroll height
- **THEN** frame number equals total frames (900)

### Requirement: Bidirectional Playback
The system SHALL support animations playing in reverse when user scrolls up.

#### Scenario: Scroll up reverses animation
- **WHEN** user scrolls from frame 500 back to frame 400
- **THEN** all interpolated values reverse smoothly through their ranges

### Requirement: Scroll Context Provider
The system SHALL provide a React context that exposes current frame and total frames to all child components.

#### Scenario: Section receives frame
- **WHEN** a section component renders
- **THEN** it can access the current frame via useScrollFrame hook

### Requirement: Passive Scroll Listener
The system SHALL use passive scroll event listeners for performance.

#### Scenario: Scroll event handling
- **WHEN** scroll event listener is attached
- **THEN** the listener is registered with { passive: true } option

### Requirement: Section Progress Calculation
Each section SHALL calculate its own progress (0-1) based on its assigned frame range.

#### Scenario: Section within range
- **WHEN** current frame is 175 and section range is [100, 250]
- **THEN** section progress is 0.5

#### Scenario: Section before range
- **WHEN** current frame is 50 and section range is [100, 250]
- **THEN** section progress is 0 (clamped)

#### Scenario: Section after range
- **WHEN** current frame is 300 and section range is [100, 250]
- **THEN** section progress is 1 (clamped)
