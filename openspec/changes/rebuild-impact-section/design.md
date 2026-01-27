# Design: Rebuild Impact Section

## Context
The Impact section (section 03) follows Experience and precedes Skills. It should create a "wow moment" that summarizes Oz's career achievements in a visually striking way. The section is animation-driven (not scroll-driven), meaning all content animates in based on time, blocking scroll until the animation completes.

**Stakeholders:** Portfolio visitors (recruiters, potential clients, tech leaders)
**Goal:** Fast, memorable communication of key achievements

## Goals / Non-Goals

**Goals:**
- Create a visually distinctive section that stands out
- Communicate 6 key metrics clearly and memorably
- Maintain consistency with existing animation system
- Work seamlessly on mobile and desktop
- Coordinate properly with ProfileImageTransition

**Non-Goals:**
- Interactive/clickable elements
- Scroll-driven content within the section
- Complex 3D or particle effects
- Loading external assets

## Animation Architecture

### Remotion Skill Reference
**IMPORTANT:** Before implementing, read these Remotion skill files:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/sequencing.md`

### Animation Timeline (210 frames at 30fps = 7 seconds)

```
Frame 0-30:    Header entrance (section number, title, line)
Frame 20-60:   Featured metric card appears (scale + opacity spring)
Frame 40-70:   Featured metric SVG symbol draws (stroke-dasharray)
Frame 50-100:  Featured metric number counts up
Frame 60-90:   Supporting metrics row 1 cascades in (3 items, 10-frame stagger)
Frame 80-110:  Supporting metrics row 2 cascades in (2 items, 10-frame stagger)
Frame 90-150:  All supporting numbers count up (staggered by entrance order)
Frame 100-150: Subtle glow/highlight pulse on featured metric
```

### Layout Architecture

**Desktop (width >= 768px):**
```
┌─────────────────────────────────────────────┐
│  03. Impact ────────────────                │
├─────────────────────────────────────────────┤
│                                             │
│      ┌─────────────────────────┐            │
│      │                         │            │
│      │       1M+               │            │
│      │    Users Impacted       │  FEATURED  │
│      │    [Leumi Bank App]     │            │
│      │                         │            │
│      └─────────────────────────┘            │
│                                             │
│   ┌───────┐  ┌───────┐  ┌───────┐          │
│   │  9+   │  │   5   │  │   5   │          │
│   │ Years │  │Projects│  │ Devs │          │
│   └───────┘  └───────┘  └───────┘          │
│                                             │
│        ┌───────┐  ┌───────┐                │
│        │  12   │  │  40%  │                │
│        │Juniors│  │Reduced│                │
│        └───────┘  └───────┘                │
│                                             │
└─────────────────────────────────────────────┘
```

**Mobile (width < 768px):**
```
┌───────────────────────┐
│ 03. Impact ─────      │
├───────────────────────┤
│  ┌─────────────────┐  │
│  │      1M+        │  │
│  │  Users Impacted │  │  FEATURED
│  └─────────────────┘  │
│                       │
│  ┌───────┐ ┌───────┐  │
│  │  9+   │ │   5   │  │
│  │ Years │ │ Proj  │  │
│  └───────┘ └───────┘  │
│                       │
│  ┌───────┐ ┌───────┐  │
│  │   5   │ │  12   │  │
│  │ Devs  │ │Junior │  │
│  └───────┘ └───────┘  │
│                       │
│     ┌───────────┐     │
│     │    40%    │     │
│     │  Reduced  │     │
│     └───────────┘     │
└───────────────────────┘
```

## Component Architecture

```
ImpactSection/
├── ImpactSection.tsx      # Main section component with layout
├── FeaturedMetric.tsx     # Large hero metric with special animation
├── MetricCard.tsx         # Supporting metric cards
└── MetricIcon.tsx         # SVG icon components for each metric type
```

### Component Responsibilities

**ImpactSection.tsx:**
- Layout container with responsive grid
- Entrance/exit animation coordination (same pattern as Experience/Summary)
- Header with section number and profile image spacer
- Orchestrates timing for child components

**FeaturedMetric.tsx:**
- Large card for the "1M+ Users" highlight
- Scale + fade entrance animation
- Number counting animation
- Optional subtle glow effect

**MetricCard.tsx:**
- Smaller supporting metric cards
- Fade + slide entrance animation
- Number counting (delayed until card settles)
- Compact responsive sizing

**MetricIcon.tsx:**
- SVG icons for each metric type:
  - `users` → Group of people silhouettes
  - `years` → Clock or timeline icon
  - `projects` → Folder/stack icon
  - `team` → Person with plus icon
  - `trained` → Graduation cap or upward chart
  - `improvement` → Trending arrow down (reduction)

## Decisions

### Decision 1: Featured Metric First
**What:** Make "1M+ Users" the featured metric (largest, most impressive)
**Why:** Creates visual hierarchy and communicates scale immediately
**Alternatives:** Equal sizing (rejected - less impactful), Random featured (rejected - less meaningful)

### Decision 2: Asymmetric Grid Layout
**What:** Use 3-2-1 or 3-2 pattern instead of uniform 2x3 grid
**Why:** More visually interesting, editorial feel, draws the eye
**Alternatives:** Uniform grid (rejected - current design, boring)

### Decision 3: SVG Icons (Optional, Phase 2)
**What:** Add simple geometric SVG icons to each metric
**Why:** Visual interest, quick recognition of metric type
**Implementation:** Can be added as enhancement after base layout works

### Decision 4: No Scroll Content
**What:** Section completes entirely via animation, no internal scroll
**Why:** Matches section config (`hasOverflowContent: false`), keeps it punchy
**Existing behavior:** Already configured this way in sections.ts

## Entrance/Exit Pattern (From Existing Sections)

Copy the pattern from SummarySection and ExperienceSection:

```typescript
// Entrance timing
const isEnteringForward = isEntering && !isEnteringBackward;
const FORWARD_ENTRANCE_DELAY = 30; // Wait for Experience exit

// Calculate entranceProgress
if (isReversing) {
  // Reversing: fade out from 1 → 0
  entranceProgress = interpolate(...)
} else if (isEnteringForward) {
  // Forward: delayed spring
  const delayedFrame = Math.max(0, sequenceFrame - FORWARD_ENTRANCE_DELAY);
  entranceProgress = spring({ frame: delayedFrame, ... });
} else {
  // Backward entrance or active
  entranceProgress = spring({ frame: sequenceFrame, ... });
}

// Exit animation
const exitAnimation = isReversing
  ? { opacity: 1, translateX: 0, scale: 1 }
  : calculateExitAnimation({ direction: 'right', ... });
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Asymmetric layout may look unbalanced on some screens | Test thoroughly on multiple screen sizes |
| Too many animations may feel busy | Keep animations subtle, use overlapping timing |
| Featured metric may dominate too much | Ensure supporting metrics are still readable |

## Migration Plan

1. Delete existing `ImpactSection.tsx` and `MetricBox.tsx`
2. Create new component structure
3. Implement base layout without animations
4. Add entrance animations
5. Add number counting
6. Test responsive behavior
7. Fine-tune timing based on visual review

## Open Questions

- [ ] Should we add subtle connecting lines between metrics? (Deferred to phase 2)
- [ ] Should icons be filled or outlined? (Start with outlined, can adjust)
- [ ] Exact color accent for featured metric glow? (Use existing accent color with transparency)
