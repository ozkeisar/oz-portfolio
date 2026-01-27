# Contact Section Specification

## ADDED Requirements

### Requirement: Multiple Contact Methods
The Contact section SHALL display five contact methods: Email, Phone, WhatsApp, LinkedIn, and GitHub.

#### Scenario: All contact methods visible
Given the Contact section is visible
When the entrance animation completes
Then all five contact methods (Email, Phone, WhatsApp, LinkedIn, GitHub) are displayed with clickable links

#### Scenario: Email link
Given the Email contact card is visible
When the user clicks the Email card
Then the device email client opens with "ozkeisar@gmail.com" as recipient

#### Scenario: Phone link
Given the Phone contact card is visible
When the user clicks the Phone card
Then the device phone app initiates a call to "+972585990055"

#### Scenario: WhatsApp link
Given the WhatsApp contact card is visible
When the user clicks the WhatsApp card
Then WhatsApp opens with conversation to "+972585990055"

---

### Requirement: Bidirectional Animation Support
The Contact section SHALL support bidirectional animations for entering forward, entering backward, and exiting.

#### Scenario: Forward entrance animation
Given the user scrolls from Skills section to Contact section
When the Contact section becomes visible
Then the entrance animation plays in forward direction (header → invitation → contact nodes)

#### Scenario: Backward entrance animation
Given the user scrolls back from beyond Contact section
When the Contact section becomes visible
Then the entrance animation plays in forward direction with appropriate timing

#### Scenario: Exit animation (backward)
Given the Contact section is visible
When the user scrolls back toward Skills section
Then the exit animation plays (reverse of entrance: contact nodes → invitation → header)

---

### Requirement: Frame-Based Animation Only
The Contact section SHALL use ONLY frame-based animations via Remotion's `spring()` and `interpolate()` functions.

#### Scenario: No CSS transitions
Given the Contact section source code
When examining all style properties
Then no CSS `transition` or `animation` properties are present

#### Scenario: Spring-based entrance
Given the Contact section is entering
When animating element positions and opacities
Then all animations use `spring()` with appropriate damping/stiffness config

---

### Requirement: Responsive Layout
The Contact section SHALL adapt its layout across mobile, tablet, and desktop viewports.

#### Scenario: Mobile layout (< 768px)
Given viewport width is less than 768px
When the Contact section renders
Then contact methods display as vertical card stack

#### Scenario: Desktop layout (> 1024px)
Given viewport width is greater than 1024px
When the Contact section renders
Then contact methods display in constellation layout with connection lines

---

### Requirement: Section Header Pattern
The Contact section SHALL display a section header with number "05." matching the established portfolio pattern.

#### Scenario: Section header visible
Given the Contact section entrance animation begins
When the header animation phase completes (frames 0-30)
Then the header displays "05." in accent color followed by "Let's Connect" title with horizontal line
