## ADDED Requirements

### Requirement: Home Page Route
The system SHALL provide a `/home` route that displays a scroll-animated portfolio page separate from the main landing page at `/`.

#### Scenario: User navigates to /home
- **WHEN** user navigates to `/home`
- **THEN** the Home page is displayed with entrance animation followed by scrollable content

#### Scenario: Landing page remains unchanged
- **WHEN** user navigates to `/`
- **THEN** the existing landing page is displayed with its original behavior

---

### Requirement: Entrance Animation Phase
The Home page SHALL display an entrance animation using Remotion's spring-based interpolation system before enabling content scrolling. There is no skip intro button - the intro is short enough to bear.

#### Scenario: Entrance animation plays on page load
- **WHEN** the Home page loads
- **THEN** the "Oz Keisar" SVG text animates with handwriting effect
- **AND** the profile image appears positioned inside the "O" letter
- **AND** scroll is locked during the entrance animation
- **AND** no header is visible during the entrance

#### Scenario: Entrance animation completes
- **WHEN** the entrance animation completes (~3.7 seconds)
- **THEN** native browser scrolling is enabled
- **AND** the page transitions to content scroll phase
- **AND** the hero section remains visible without header

#### Scenario: Mobile O-position calculation
- **WHEN** the entrance animation plays on mobile devices
- **THEN** the profile image is precisely positioned to fit inside the "O" letter
- **AND** the positioning accounts for responsive SVG scaling

---

### Requirement: Content Scroll Phase
After the entrance animation completes, the Home page SHALL enable native scrolling with viewport-triggered animations using Framer Motion.

#### Scenario: Native scrolling enabled
- **WHEN** the entrance animation completes
- **THEN** the user can scroll naturally using native browser scrolling
- **AND** scroll behavior feels native on both mobile and desktop

#### Scenario: Viewport-triggered animations
- **WHEN** the user scrolls and a content section enters the viewport
- **THEN** the section animates in with fade-up or slide effects
- **AND** animations trigger once (do not replay on scroll back)

#### Scenario: Stagger animations for multiple elements
- **WHEN** a section with multiple child elements enters the viewport
- **THEN** child elements animate sequentially with staggered delays

---

### Requirement: Home Page Content Sections
The Home page SHALL display portfolio content in the following sections using data from existing data files.

#### Scenario: Hero section displays
- **WHEN** the entrance animation completes
- **THEN** the hero section shows "Oz Keisar" name and "Engineering Manager & AI Innovation Lead" subtitle
- **AND** the header is NOT visible while hero section is in view

#### Scenario: Summary section displays bio
- **WHEN** the user scrolls to the Summary section
- **THEN** the professional bio content animates into view

#### Scenario: Experience section displays timeline
- **WHEN** the user scrolls to the Experience section
- **THEN** the 7 experience positions from experienceData.ts animate in as timeline items

#### Scenario: Impact section displays metrics
- **WHEN** the user scrolls to the Impact section
- **THEN** the 6 impact metrics from impactData.ts animate in with counter effects

#### Scenario: Skills section displays categories
- **WHEN** the user scrolls to the Skills section
- **THEN** the 6 skill categories from skillsData.ts animate in as a grid

#### Scenario: Contact section displays links
- **WHEN** the user scrolls to the Contact section
- **THEN** social links and contact information animate into view

---

### Requirement: Header with Shared Element Transition
The Home page header SHALL only appear after the user scrolls past the hero section, with the profile image transitioning to become the header icon.

#### Scenario: Header hidden during hero
- **WHEN** the hero section is in view
- **THEN** the header is NOT visible

#### Scenario: First scroll triggers header appearance
- **WHEN** the user initiates the first scroll past the hero section
- **THEN** the header animates into view
- **AND** the profile image performs a "shared element" transition to become the header icon

#### Scenario: Profile image becomes header icon
- **WHEN** the header appears after first scroll
- **THEN** the profile image smoothly animates from its hero position to the header icon position
- **AND** the image shrinks to header icon size during the transition

#### Scenario: Header hides on scroll down
- **WHEN** the user scrolls down past a threshold (80px) after header is visible
- **THEN** the header smoothly hides by translating upward

#### Scenario: Header shows on scroll up
- **WHEN** the user scrolls up (after header was previously visible)
- **THEN** the header smoothly reappears with the icon

#### Scenario: Header blur on scroll
- **WHEN** the header is visible and user has scrolled
- **THEN** the header displays a backdrop blur effect

---

### Requirement: Responsive Design
The Home page SHALL be fully responsive and work on mobile and desktop devices.

#### Scenario: Mobile layout
- **WHEN** the viewport width is less than 768px
- **THEN** sections display in single-column layout
- **AND** font sizes and spacing adjust for mobile

#### Scenario: Desktop layout
- **WHEN** the viewport width is 768px or greater
- **THEN** sections may display in multi-column layouts where appropriate
- **AND** font sizes and spacing adjust for desktop

---

### Requirement: Visual Styling
The Home page SHALL maintain visual consistency with the existing portfolio design.

#### Scenario: Dark theme
- **WHEN** the Home page is displayed
- **THEN** the background color is #0a1628 (dark blue)
- **AND** text uses the existing color scheme

#### Scenario: Glass morphism effects
- **WHEN** cards or containers are displayed
- **THEN** they use glass morphism styling (semi-transparent background, backdrop blur, subtle borders)
