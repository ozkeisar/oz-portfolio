# Skills Section Specification

## ADDED Requirements

### Requirement: Neural Network Skills Visualization
The Skills section SHALL display Oz's technical expertise as an animated neural network visualization that reveals itself through frame-based animation without scroll interaction.

#### Scenario: Section entrance animation
- **WHEN** the Skills section becomes visible (entering forward from Impact)
- **THEN** the section header animates in with spring motion
- **AND** the network visualization builds outward from center
- **AND** category nodes expand with staggered timing
- **AND** skill nodes populate around their categories
- **AND** connection lines draw between related nodes
- **AND** the full animation completes without user scroll

#### Scenario: Section exit animation (forward)
- **WHEN** user scrolls forward past the Skills section
- **THEN** the network visualization contracts in reverse order
- **AND** connection lines retract first
- **AND** skill nodes fade/collapse toward categories
- **AND** category nodes collapse toward center
- **AND** the section fades out

#### Scenario: Section entrance animation (backward)
- **WHEN** user scrolls backward into the Skills section from the next section
- **THEN** the network visualization builds from the contracted state
- **AND** animation timing matches forward entrance pattern

### Requirement: Responsive Network Layout
The network visualization SHALL adapt to different viewport sizes with appropriate layouts for each breakpoint.

#### Scenario: Mobile viewport (< 768px)
- **WHEN** viewport width is less than 768px
- **THEN** skills display in a vertical card-based layout
- **AND** each category appears as a card with skill tags
- **AND** network connection lines are hidden
- **AND** animations remain spring-based but with vertical motion

#### Scenario: Tablet viewport (768px - 1024px)
- **WHEN** viewport width is between 768px and 1024px
- **THEN** skills display in a 2-column grid layout
- **AND** limited connection lines show between adjacent categories
- **AND** layout transitions smoothly from mobile

#### Scenario: Desktop viewport (> 1024px)
- **WHEN** viewport width exceeds 1024px
- **THEN** skills display as a full radial network
- **AND** category nodes position in a circle around center
- **AND** skill nodes orbit their respective categories
- **AND** connection lines show cross-category relationships

### Requirement: Skill Data Accuracy
The Skills section SHALL display accurate skill data derived from Oz Keisar's professional background.

#### Scenario: Skill categories match professional summary
- **WHEN** the section renders
- **THEN** it displays these categories: Languages, Frontend, Backend, Infrastructure, Data, Leadership
- **AND** Languages includes: JavaScript, TypeScript, C#, Python
- **AND** Frontend includes: React, React Native, Angular
- **AND** Backend includes: Node.js, .NET
- **AND** Infrastructure includes: AWS, Azure, Kubernetes, Docker, Microservices
- **AND** Data includes: SQL, PostgreSQL, MongoDB
- **AND** Leadership includes: Team Building, Hiring, Client Management, Business Development

### Requirement: Frame-Based Animation Only
The Skills section SHALL use only frame-based animation techniques consistent with project animation standards.

#### Scenario: Animation implementation
- **WHEN** any element animates in the Skills section
- **THEN** the animation uses `spring()` and `interpolate()` functions
- **AND** animation is driven by `sequenceFrame` from AnimationContext
- **AND** NO CSS `transition` property is used
- **AND** NO CSS `animation` property is used
- **AND** NO Tailwind animation classes are used

### Requirement: Section Header Consistency
The Skills section header SHALL match the visual pattern established by Summary and Experience sections.

#### Scenario: Header display
- **WHEN** the section header renders
- **THEN** it displays section number "04." in accent color monospace font
- **AND** title "Skills" appears next to the number
- **AND** a horizontal line extends from the title
- **AND** header animates in with spring motion
- **AND** mobile layout includes spacer for profile image

### Requirement: Bidirectional Navigation Support
The Skills section SHALL support seamless navigation in both forward and backward directions.

#### Scenario: Entering from Impact section (forward)
- **WHEN** user scrolls forward from Impact to Skills
- **THEN** entrance animation plays from collapsed to expanded state
- **AND** entrance is delayed appropriately for Impact exit to complete

#### Scenario: Entering from Contact section (backward)
- **WHEN** user scrolls backward from Contact to Skills
- **THEN** entrance animation plays from collapsed to expanded state
- **AND** network reaches full expanded state

#### Scenario: Exiting to Contact section (forward)
- **WHEN** user scrolls forward from Skills to Contact
- **THEN** exit animation plays as network contracts
- **AND** section fades/slides appropriately

#### Scenario: Exiting to Impact section (backward)
- **WHEN** user scrolls backward from Skills to Impact
- **THEN** exit animation reverses the entrance
- **AND** network contracts back to center before leaving viewport
