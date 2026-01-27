# Impact Section Specification

## ADDED Requirements

### Requirement: Featured Metric Display
The Impact section SHALL display a featured/hero metric prominently at the top of the section, visually distinct from supporting metrics.

#### Scenario: Featured metric is highlighted
- **WHEN** the Impact section renders
- **THEN** the metric marked as `featured: true` in impactData SHALL be displayed larger than other metrics
- **AND** it SHALL occupy more visual space (approximately 2x the width of supporting metrics on desktop)

#### Scenario: Featured metric animates first
- **WHEN** the section entrance animation begins
- **THEN** the featured metric SHALL start animating before supporting metrics
- **AND** it SHALL use a scale + opacity spring animation

### Requirement: Asymmetric Supporting Metrics Layout
The Impact section SHALL display supporting metrics in an asymmetric grid pattern that creates visual interest.

#### Scenario: Desktop layout pattern
- **WHEN** viewport width is >= 768px
- **THEN** supporting metrics SHALL be arranged in rows (e.g., 3 metrics, then 2 metrics)
- **AND** the layout SHALL be centered within the content area

#### Scenario: Mobile layout pattern
- **WHEN** viewport width is < 768px
- **THEN** supporting metrics SHALL be arranged in a 2-column grid
- **AND** odd remaining metrics SHALL be centered

### Requirement: Staggered Cascade Animation
Supporting metrics SHALL animate in with a staggered cascade effect, creating a visually pleasing reveal sequence.

#### Scenario: Row-by-row reveal
- **WHEN** the section entrance animation progresses past the featured metric
- **THEN** supporting metrics SHALL appear with staggered delays (approximately 10 frames between each)
- **AND** metrics in the same row SHALL animate together or nearly together

#### Scenario: Number counting follows card entrance
- **WHEN** a metric card's entrance animation reaches approximately 80% progress
- **THEN** the number counting animation SHALL begin
- **AND** the number SHALL interpolate from 0 to the target value

### Requirement: Entrance and Exit Animation Coordination
The Impact section SHALL coordinate its animations with the overall section transition system and ProfileImageTransition.

#### Scenario: Forward entrance from Experience
- **WHEN** navigating forward from Experience section
- **THEN** the section SHALL delay its entrance animation by approximately 30 frames
- **AND** the ProfileImageTransition spacer SHALL coordinate with the header animation

#### Scenario: Backward exit to Experience
- **WHEN** navigating backward to Experience section
- **THEN** the section SHALL fade out using entranceProgress 1 → 0
- **AND** content SHALL remain stable (no slide) during reverse

#### Scenario: Forward exit to Skills
- **WHEN** navigating forward to Skills section
- **THEN** the section SHALL use standard exit animation with direction 'right'
- **AND** the section SHALL slide out while fading

## MODIFIED Requirements

### Requirement: Impact Data Structure
The impactData SHALL include additional fields for visual customization.

#### Scenario: Featured flag
- **WHEN** impactData is defined
- **THEN** each metric SHALL have an optional `featured` boolean field
- **AND** exactly one metric SHALL be marked as featured (typically "users")

#### Scenario: Icon identifier
- **WHEN** impactData is defined
- **THEN** each metric MAY have an optional `icon` string field
- **AND** valid icon values SHALL include: 'users', 'clock', 'folder', 'person-plus', 'graduation', 'trending-down'

## REMOVED Requirements

### Requirement: Uniform Grid Layout
**Reason:** Replaced by asymmetric layout for better visual interest
**Migration:** The uniform 2-column grid is replaced by featured metric + asymmetric supporting grid
