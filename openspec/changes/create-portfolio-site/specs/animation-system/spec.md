# Animation System Specification

## ADDED Requirements

### Requirement: Frame-Based Interpolation
The system SHALL provide an `interpolate` function that maps input values to output values with optional clamping.

#### Scenario: Basic interpolation
- **WHEN** interpolate is called with value 50, inputRange [0, 100], outputRange [0, 1]
- **THEN** the function returns 0.5

#### Scenario: Clamped extrapolation
- **WHEN** interpolate is called with value -10, inputRange [0, 100], outputRange [0, 1], extrapolateLeft: 'clamp'
- **THEN** the function returns 0 (not -0.1)

#### Scenario: Crossfade pattern
- **WHEN** two elements use overlapping interpolation ranges (e.g., [0, 0.5] and [0.4, 0.9])
- **THEN** both elements are partially visible during the overlap, creating smooth crossfade

### Requirement: Spring Physics Animation
The system SHALL provide a `spring` function for natural-feeling entrance animations on initial page load.

#### Scenario: Spring entrance
- **WHEN** spring is called with frame 0, fps 60, config { damping: 14, stiffness: 100 }
- **THEN** the function returns a value that animates from 0 toward 1 with spring physics

#### Scenario: Delayed spring
- **WHEN** spring is called with frame - delay value
- **THEN** the animation starts after the specified frame delay

### Requirement: No CSS Transitions
The system SHALL NOT use CSS `transition` or `animation` properties for any element animations.

#### Scenario: Style application
- **WHEN** any animated style is applied to an element
- **THEN** the style value is calculated via interpolate, not CSS transitions

### Requirement: Color Morphing
The system SHALL store colors as RGB objects and interpolate each channel separately for smooth color transitions.

#### Scenario: Background color morph
- **WHEN** transitioning from color A to color B
- **THEN** each RGB channel (r, g, b) is interpolated independently using the frame progress
