# Change: Redesign Skills Section with Neural Network Animation

## Why
The current Skills section is a static grid of cards that doesn't match the visual sophistication of the redesigned Summary and Experience sections. Oz's portfolio needs a Skills section that reflects his technical depth, leadership evolution, and AI-first innovation mindset through a beautiful, animated experience.

## What Changes
- **DELETE** existing `SkillsSection.tsx` component entirely - starting fresh
- **CREATE** new animated Skills section with "Neural Network of Expertise" concept
- **CREATE** supporting components for network visualization
- Skills data derived from Oz's professional summary (accurate, comprehensive)
- Pure frame-based animation (no scroll tracking) - animation plays to completion
- Bidirectional animation support (forward enter, backward enter, exit)
- Responsive design adapting from mobile (vertical flow) to desktop (radial network)

## Visual Concept: Neural Network of Expertise

The section visualizes Oz's skills as an interconnected neural network:

1. **Central Core** - "Oz Keisar" node pulses and expands first
2. **Category Nodes** - 6 skill categories radiate outward with connecting lines
3. **Skill Nodes** - Individual skills orbit/connect to their category
4. **Connection Lines** - Animated lines show relationships between skills
5. **Domain Labels** - Industry domains appear as subtle background context

### Skill Categories (from Professional Summary)
1. **Languages** - JavaScript, TypeScript, C#, Python
2. **Frontend** - React, React Native, Angular
3. **Backend** - Node.js, .NET
4. **Infrastructure** - AWS, Azure, Kubernetes, Docker, Microservices
5. **Data** - SQL, PostgreSQL, MongoDB
6. **Leadership** - Team Building, Hiring, Client Management, Business Development

## Animation Phases

### Phase 1: Core Reveal (frames 0-30)
- Central node fades in and pulses
- Section header animates in (matching Summary/Experience pattern)

### Phase 2: Category Expansion (frames 30-90)
- Category nodes spring outward from center
- Connecting lines draw from center to categories
- Staggered timing creates organic reveal

### Phase 3: Skill Population (frames 90-180)
- Individual skills spring into position around categories
- Each skill has subtle float/pulse animation
- Skill icons or abbreviations appear

### Phase 4: Network Connections (frames 180-240)
- Cross-category connection lines animate
- Shows how skills interconnect (e.g., React → Node.js → AWS)
- Network reaches final "alive" state

### Exit Animation
- Reverse of entrance (network contracts to center)
- Matches Summary/Experience exit pattern timing

## Technical Approach

### IMPORTANT: Before implementing, read:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`
- `src/components/sections/SummarySection.tsx` for entrance/exit patterns
- `src/components/sections/ExperienceSection.tsx` for bidirectional animation

### Animation Framework
- All animations via `spring()` and `interpolate()` from `../../utils/animation`
- NO CSS transitions or animations (FORBIDDEN per project.md)
- Frame-based using `sequenceFrame` from AnimationContext
- `useSectionVisibility()` for state management

### Responsive Design
- **Mobile (< 768px)**: Vertical stack with animated reveals
- **Tablet (768-1024px)**: 2-column grid with connections
- **Desktop (> 1024px)**: Full radial network visualization

## Impact
- Affected specs: New `skills-section` capability
- Affected code:
  - DELETE: `src/components/sections/SkillsSection.tsx`
  - CREATE: `src/components/sections/SkillsSection.tsx` (new)
  - CREATE: `src/components/skills/` directory with supporting components
