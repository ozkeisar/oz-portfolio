# Design: Oz Keisar Portfolio Site

## Context
Creating a single-page portfolio that uses scroll-driven animations to present Oz Keisar's professional profile. The site must demonstrate technical excellence through its implementation while remaining performant on mobile devices.

**Key Constraint**: ALL animations MUST follow the morph pattern - using `spring()` and `interpolate()` functions, never CSS transitions.

## Goals / Non-Goals

### Goals
- Triggered animation sequences ("video" model) instead of continuous scroll mapping
- State machine for controlling animation flow
- Bidirectional playback (scroll up = reverse animation)
- Typewriter text effect for engaging content reveal
- Seamless mobile and desktop experience
- SVG line-drawing animations for contact icons
- Sections exit with alternating horizontal slide directions

### Non-Goals
- Multi-page navigation
- Backend/API integration
- CMS or content management
- Video/audio media embedding

## Architecture

### Animation State Machine
```
[INTRO] → scroll locked, entrance animation plays
    ↓
[IDLE] → waiting for user scroll input
    ↓ (user scrolls)
[TRANSITIONING] → scroll locked, enter animation plays as "video"
    ↓
[CONTENT_SCROLL] or [BUFFERING] → content overflow scroll or buffer period
    ↓ (user scrolls past content)
[EXITING] → scroll locked, exit animation plays
    ↓
[TRANSITIONING] → next section enters...
```

Scroll up = reverse playback (same locked sequences, played backward)

### Animation Timing
| Animation | Duration | Notes |
|-----------|----------|-------|
| Intro | 110 frames (~3.7s) | Hero entrance |
| Section enter | 90-300 frames | Varies by section content |
| Section exit | 45 frames (~1.5s) | Horizontal slide |
| Buffer | 400ms | Fixed time between animations |
| Typewriter | 25ms/char | Fast readable speed |

### Section Exit Directions (Alternating)
| Section | Exit Direction |
|---------|----------------|
| Hero | Left |
| Summary | Right |
| Experience | Left |
| Impact | Right |
| Skills | Left |
| Contact | Right (last section) |

### Component Hierarchy
```
App
└── AnimationProvider (state machine context)
    └── AnimationCanvas (fixed full viewport)
        ├── HeroSection
        ├── SummarySection (with Typewriter + photo placeholder)
        ├── ExperienceSection (vertical timeline)
        ├── ImpactSection (animated numbers)
        ├── SkillsSection (grid)
        ├── ContactSection (SVG line icons)
        └── ProfileImageTransition (animated photo)
```

### File Structure
```
src/
├── types/
│   └── animation.ts          # Type definitions for state machine
├── config/
│   └── sections.ts           # Section timing and configuration
├── reducers/
│   └── animationReducer.ts   # State machine reducer
├── hooks/
│   ├── useAnimationController.ts  # Core animation controller
│   ├── useExitAnimation.ts        # Exit animation calculations
│   └── useViewport.ts             # Responsive values
├── context/
│   └── AnimationContext.tsx  # React context provider
├── components/
│   ├── AnimationCanvas.tsx   # Fixed viewport container
│   ├── Typewriter.tsx        # Letter-by-letter text reveal
│   ├── ProfileImageTransition.tsx  # Animated photo
│   ├── sections/             # Section components
│   └── icons/                # SVG line-drawing icons
└── utils/
    ├── animation.ts          # interpolate, spring functions
    └── colors.ts             # RGB color system
```

## Decisions

### 1. Triggered Animation Sequences (State Machine)
**Decision**: Replace continuous scroll-to-frame mapping with a state machine that triggers locked "video" animation sequences.

**Rationale**:
- Prevents accidental section skipping from fast/long scrolls
- Each animation plays fully regardless of scroll amount
- Cleaner mental model: scroll = "next section please"
- Enables content overflow scrolling within sections
- Better support for typewriter and complex entrance animations

**Implementation**:
```tsx
type AnimationState =
  | 'INTRO'           // Initial entrance (scroll locked)
  | 'IDLE'            // Waiting for scroll
  | 'TRANSITIONING'   // Enter animation playing (scroll locked)
  | 'CONTENT_SCROLL'  // Section active, smooth scroll for overflow
  | 'EXITING'         // Exit animation playing (scroll locked)
  | 'BUFFERING';      // Post-animation buffer
```

### 2. useReducer for State Management
**Decision**: Use React's useReducer for the animation state machine.

**Rationale**:
- Complex state transitions are explicit and predictable
- Actions clearly describe what triggers each transition
- Easy to add new states or modify transition logic
- Better debugging with action logging

### 3. Typewriter Component
**Decision**: Create a dedicated Typewriter component for text reveal animations.

**Rationale**:
- Letter-by-letter reveal creates engagement
- Timing calculations based on character count
- Punctuation gets longer pauses for natural rhythm
- Supports bidirectional playback

**Implementation**:
```tsx
<Typewriter
  text="Hello world"
  startFrame={25}
  currentFrame={sequenceFrame}
  charDelay={25}  // ms per character
/>
```

### 4. Alternating Exit Directions
**Decision**: Sections exit with alternating horizontal slide directions (left, right, left, right...).

**Rationale**:
- Creates visual variety and flow
- Provides sense of progression through content
- More dynamic than uniform exit direction

### 5. Section Visibility Hook
**Decision**: Create `useSectionVisibility()` hook for consistent visibility logic.

**Rationale**:
- Encapsulates complex visibility rules
- Returns `isVisible`, `isCurrent`, `isExiting`, `isEntering` flags
- Sections only render when visible (performance)

### 6. Scroll Locking During Animations
**Decision**: Ignore all scroll events during TRANSITIONING, EXITING, and BUFFERING states.

**Rationale**:
- Prevents animation interruption
- User must wait for animation to complete
- Creates intentional, polished experience

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Animation feels slow | Tune durations, typewriter speed is adjustable |
| User frustrated by scroll lock | Keep animations short (1.5-3s), clear visual feedback |
| Complex state logic | Thorough testing, clear state transition diagram |
| Performance on mobile | Sections unmount when not visible, will-change hints |
| Long text takes too long | Typewriter speed tunable, enterDuration per section |

## Open Questions
- [RESOLVED] Photo: Using oz-photo.webp
- [RESOLVED] Accent color: Using gold #fbbf24
- Optimal typewriter speed for readability vs. patience
- Whether to add skip animation feature for impatient users
