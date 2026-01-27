# Design: Redesign Impact Section

## Context

The Impact section needs to showcase key metrics with a visually impressive entrance animation. The section follows Summary and Experience in the navigation flow, so the profile image must transition smoothly from Experience to Impact.

**Remotion Skill Reminder**: Before implementation, read:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`

## Goals

- Create a memorable, professional impact metrics display
- SVG line-drawing animation (stroke animation, NOT fade-in)
- Numbers count up dramatically after boxes are drawn
- Profile image transitions smoothly from Experience header
- Animation completes before user can scroll to next section

## Non-Goals

- Scroll-driven animation within the section
- 3D effects or complex WebGL
- External animation libraries

## Architecture

### Animation Sequence (Total: ~180 frames / 6 seconds at 30fps)

```
Frame 0-30:    Profile image animates from Experience to Impact header
Frame 20-80:   SVG box outlines draw (staggered, 4 boxes)
Frame 60-120:  Numbers count up inside boxes (staggered)
Frame 120-180: Hold for readability, then allow scroll
```

### SVG Line-Drawing Technique

Using `stroke-dasharray` and `stroke-dashoffset` for line-drawing effect:

```tsx
// Calculate total path length
const pathLength = 400; // rect perimeter: 2*(w+h)

// Animate dashoffset from pathLength (invisible) to 0 (fully drawn)
const drawProgress = spring({
  frame: boxFrame,
  fps: FPS,
  config: { damping: 20, stiffness: 60 },
});

const strokeDashoffset = interpolate(drawProgress, [0, 1], [pathLength, 0]);

<rect
  style={{
    strokeDasharray: pathLength,
    strokeDashoffset: strokeDashoffset,
    fill: 'none',
    stroke: colors.accent,
    strokeWidth: 2,
  }}
/>
```

### Component Structure

```
ImpactSection/
├── ImpactSection.tsx        # Main section component
├── MetricBox.tsx            # Individual SVG metric box
└── impactData.ts            # Metrics configuration
```

### MetricBox Component

Each metric box contains:
1. SVG `<rect>` for the outline (animated stroke)
2. Number display (counts up after box draws)
3. Label text (fades in with number)

```tsx
type ImpactMetric = {
  id: string;
  value: number;
  suffix: string;      // '+', 'M+', '%', etc.
  label: string;
  subLabel?: string;   // Optional detail line
};
```

### Metrics Data (from Professional Summary)

```tsx
const impactMetrics: ImpactMetric[] = [
  { id: 'years', value: 9, suffix: '+', label: 'Years Experience', subLabel: 'Full Stack & Leadership' },
  { id: 'users', value: 1, suffix: 'M+', label: 'Users Impacted', subLabel: 'Leumi Bank App' },
  { id: 'trained', value: 12, suffix: '', label: 'Juniors Trained', subLabel: 'AI-First Bootcamp' },
  { id: 'improvement', value: 40, suffix: '%', label: 'Integration Issues Reduced', subLabel: 'Mockingbird OSS' },
];
```

### ProfileImageTransition Integration

Add Impact section position calculations:

```tsx
// Impact header position (similar to Experience)
const impactVerticalPadding = responsiveSpacing(viewport.width, 20, 40);
const impactHeaderHeight = /* calculate based on header layout */;

// Desktop: center of content area
const impactDesktopX = viewport.width / 2;
const impactDesktopY = impactVerticalPadding + impactHeaderHeight / 2;

// Mobile: in header row like other sections
const impactMobileX = impactContentLeftEdge + imageSize / 2;
const impactMobileY = impactVerticalPadding + rowHeight / 2;
```

### Animation State Management

The section uses `hasOverflowContent: false` in config, meaning:
- No CONTENT_SCROLL state
- Animation completes → BUFFERING → IDLE
- User can then scroll to next section

Entrance animation timing in `sections.ts`:
```tsx
{
  id: 'impact',
  enterDuration: 180, // 6 seconds for full animation
  exitDuration: 45,
  exitDirection: 'right',
  hasOverflowContent: false,
}
```

## Layout

### Desktop (>768px)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         [img] 03. Impact ─────────────          │
│                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│   │   9+    │  │   1M+   │  │   12    │  │   40%   │
│   │  Years  │  │  Users  │  │ Trained │  │ Reduced │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────┐
│ [img] 03. Impact ── │
│                     │
│  ┌────────┐ ┌────────┐
│  │  9+    │ │  1M+   │
│  │ Years  │ │ Users  │
│  └────────┘ └────────┘
│  ┌────────┐ ┌────────┐
│  │  12    │ │  40%   │
│  │Trained │ │Reduced │
│  └────────┘ └────────┘
│                     │
└─────────────────────┘
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| SVG path length calculation complexity | Use simple rects with known perimeters |
| Animation too long (user impatience) | 6 seconds max, visual interest throughout |
| Mobile performance with SVG animations | Simple strokes only, no complex paths |

## Open Questions

1. Should boxes have rounded corners? (affects stroke animation)
2. Exact metrics to display - are the 4 selected metrics the best choices?
3. Should there be any interactivity after animation completes?

## Migration Plan

1. Delete existing `ImpactSection.tsx`
2. Create new component from scratch
3. Add Impact positions to `ProfileImageTransition.tsx`
4. Update section config timing
5. Test animation flow from Experience → Impact → Skills
