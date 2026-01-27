# Experience Timeline Specification

## Overview
Scroll-driven career timeline with typewriter animations, item stacking, and smooth transitions.

---

## ADDED Requirements

### Requirement: Timeline Data Structure
The experience section MUST use a structured data format for career history.

#### Scenario: Data includes all required fields
- **Given** the experience data file exists
- **When** rendering a timeline item
- **Then** each item must have: id, role, company, period, description
- **And** optionally: client, achievements array, technologies array

#### Scenario: Data ordered chronologically
- **Given** the experience data array
- **When** items are rendered
- **Then** most recent role appears first (2024-Present)
- **And** oldest role appears last (2015-2017 IDF)

---

### Requirement: Entrance Animation
The experience section MUST animate in with typewriter effect on first item.

#### Scenario: Forward entrance from Summary
- **Given** user transitions from Summary to Experience (forward)
- **When** the TRANSITIONING state begins
- **Then** header fades in with spring animation
- **And** first timeline item text types character by character
- **And** timeline rail fades in synced with content
- **And** animation completes within enterDuration frames

#### Scenario: Backward entrance from next section
- **Given** user transitions from Impact to Experience (backward)
- **When** the TRANSITIONING state begins
- **Then** last viewed item state is restored
- **And** content appears at previous scroll position

---

### Requirement: Scroll-Controlled Progression
User scroll MUST control timeline item transitions.

#### Scenario: Scroll down expands next item
- **Given** experience section is active (CONTENT_SCROLL state)
- **And** current item is fully visible
- **When** user scrolls down past collapse threshold
- **Then** current item text backward-writes (deletes)
- **And** current item height shrinks to stacked size
- **And** current item moves upward to stack position
- **And** next item begins typewriter animation

#### Scenario: Scroll up reverses progression
- **Given** experience section is active
- **And** items are stacked above current
- **When** user scrolls up past expand threshold
- **Then** current item collapses back
- **And** previous stacked item expands
- **And** text re-types (forward typewriter)

#### Scenario: Scroll position maps to item state
- **Given** contentScrollOffset value
- **When** calculating item states
- **Then** offset 0-30% of item range = writing phase
- **And** offset 30-70% = visible phase
- **And** offset 70-100% = collapsing phase

---

### Requirement: Item Visual States
Timeline items MUST render differently based on state.

#### Scenario: Stacked state rendering
- **Given** an item in stacked state
- **When** rendered
- **Then** shows single line: "Role | Company | Period"
- **And** height is compact (40-50px)
- **And** positioned at top of content area
- **And** offset by number of stacked items above

#### Scenario: Active state rendering
- **Given** an item in active state
- **When** rendered
- **Then** shows full content: title, company, period, description
- **And** description uses typewriter animation
- **And** achievements list visible (if present)
- **And** height is expanded to fit content

#### Scenario: Upcoming state rendering
- **Given** an item in upcoming state
- **When** rendered
- **Then** item is not visible (opacity: 0 or not rendered)

---

### Requirement: Timeline Rail Indicator
Visual timeline MUST show progress through career history.

#### Scenario: Rail displays all items
- **Given** timeline rail is visible (desktop only)
- **When** rendered
- **Then** vertical line spans from first to last item
- **And** dot positioned for each timeline item
- **And** active item dot is highlighted/scaled

#### Scenario: Progress indicator moves
- **Given** user scrolls through items
- **When** contentScrollOffset changes
- **Then** progress indicator position updates
- **And** indicator smoothly interpolates between dots

---

### Requirement: Profile Image Integration
Profile image MUST transition into experience section header.

#### Scenario: Image moves to experience header
- **Given** transitioning from Summary to Experience
- **When** entrance animation plays
- **Then** image animates from summary position to experience header
- **And** image positioned left of "02. Experience" text
- **And** section header elements shift to accommodate

#### Scenario: Image moves with scroll on mobile
- **Given** mobile viewport (< 768px)
- **And** experience section is active
- **When** user scrolls content
- **Then** image in header moves with content scroll
- **And** follows same pattern as summary section

---

## MODIFIED Requirements

### Requirement: Summary Section Exit
Summary section exit behavior MUST change for Experience transition.

#### Scenario: Transition to Experience uses backward-write
- **Given** Summary section is current
- **When** transitioning to Experience (forward direction)
- **Then** Summary text backward-writes (deletes) as exit animation
- **And** NO slide-out translateX animation
- **And** image continues to Experience (not faded out)

#### Scenario: Transition to Hero unchanged
- **Given** Summary section is current
- **When** transitioning to Hero (backward direction)
- **Then** existing backward-write animation plays
- **And** image returns to Hero position

---

### Requirement: Section Configuration
Experience section config MUST support new behavior.

#### Scenario: Config enables content scroll
- **Given** experience section config in sections.ts
- **When** section becomes active
- **Then** hasOverflowContent is true
- **And** maxContentScroll is set based on item count
- **And** enterDuration supports initial typewriter timing

---

## Technical Constraints

1. All animations use `interpolate()` and `spring()` from Remotion patterns
2. CSS transitions are FORBIDDEN
3. Scroll offset maps linearly to timeline progression
4. Must work forwards and backwards
5. Must be responsive (mobile hides timeline rail)
6. Performance: smooth 60fps on modern devices
