# Spec: Desktop-Only Layout

## Overview
The original App page (Remotion-based) is now exclusively for desktop displays (≥768px). All mobile-specific code should be removed.

---

## REMOVED Requirements

### Requirement: Mobile Layout Support
Desktop App components SHALL NOT contain mobile-specific layout code since mobile users are routed to the separate Home page.

#### Scenario: Mobile column layouts removed
- **Given** a desktop section component
- **When** the component renders
- **Then** it MUST NOT contain `flexDirection: isMobile ? 'column' : 'row'` patterns
- **And** it MUST use row-based layouts unconditionally

#### Scenario: Mobile image spacers removed
- **Given** a desktop section component with image positioning
- **When** the component renders
- **Then** it MUST NOT contain mobile-specific image spacer calculations
- **And** it MUST NOT conditionally render spacer elements for mobile

#### Scenario: Mobile sizing conditionals removed
- **Given** a desktop section component
- **When** calculating sizes, fonts, or spacing
- **Then** it MUST NOT use `isMobile ? mobileSize : desktopSize` patterns
- **And** it MUST use desktop values directly or desktop-range responsive scaling

#### Scenario: Mobile profile image transitions removed
- **Given** the ProfileImageTransition component
- **When** calculating image positions and sizes
- **Then** it MUST NOT contain mobile-specific position calculations
- **And** it MUST NOT contain mobile image size variants

---

## MODIFIED Requirements

### Requirement: Responsive Value Utilities
The `useViewport` hook MUST remain available but desktop App components MUST NOT use the `isMobile` flag.

#### Scenario: Desktop-only responsive scaling
- **Given** a desktop section component using responsive utilities
- **When** calculating responsive values
- **Then** values MUST scale smoothly across the desktop range (768-1200px)
- **And** the component MUST NOT reference the `isMobile` flag

#### Scenario: Viewport hook shared usage
- **Given** the `useViewport` hook
- **When** used by any component
- **Then** it MUST keep `isMobile`, `isTablet`, `isDesktop` flags (used by Home page)
- **But** desktop App components MUST ignore the `isMobile` flag

---

## ADDED Requirements

### Requirement: Desktop-Only Component Contracts
Desktop App components MUST assume a minimum viewport width of 768px and render desktop layouts unconditionally.

#### Scenario: Minimum supported width
- **Given** a desktop App component
- **When** the component renders
- **Then** it MUST assume minimum viewport width of 768px
- **And** it MUST NOT provide graceful degradation below this width

#### Scenario: Simplified layout code
- **Given** a desktop section component
- **When** determining layout structure
- **Then** it MUST use desktop layouts unconditionally
- **And** timeline rails, orbit visualizations, and desktop features MUST always render

#### Scenario: Fixed desktop values
- **Given** a desktop component calculating sizes
- **When** responsive scaling is unnecessary
- **Then** it SHOULD use fixed desktop values directly
- **Example:** `imageSize = 40` instead of `isMobile ? 32 : 40`
