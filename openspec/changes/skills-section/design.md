# Skills Section Technical Design

## Context

The Skills section needs to showcase Oz's technical expertise in a visually compelling way that matches the redesigned Summary and Experience sections. The section uses pure frame-based animation (no scroll tracking) and must support bidirectional navigation.

**Reminder**: Before implementing, read the Remotion skill files:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`

## Goals / Non-Goals

### Goals
- Create visually striking "neural network" visualization of skills
- Pure frame-based animation using Remotion patterns
- Seamless entrance/exit matching Summary/Experience sections
- Responsive design for all viewports
- Accurate skill representation from Oz's professional background

### Non-Goals
- Interactive hover states (this is animation-driven, not interactive)
- Scroll-based content navigation (animation plays to completion)
- 3D effects (keeping it 2D for performance and simplicity)

## Decisions

### Decision 1: Network Layout Algorithm

**What**: Use polar coordinate positioning for desktop, grid for mobile

**Why**:
- Polar coordinates create the radial "neural network" effect naturally
- Easy to calculate positions with `Math.cos()` / `Math.sin()`
- Falls back gracefully to grid on mobile

```tsx
// Desktop: Polar positioning
const getCategoryPosition = (index: number, total: number, radius: number) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};
```

### Decision 2: Animation Timing Structure

**What**: 4-phase animation with specific frame ranges

| Phase | Frames | What Happens |
|-------|--------|--------------|
| 1 - Core | 0-30 | Header + center pulse |
| 2 - Categories | 30-90 | 6 category nodes expand |
| 3 - Skills | 90-180 | Skills populate categories |
| 4 - Connections | 180-240 | Cross-links animate |

**Why**: Matches the multi-phase pattern in Summary (typewriter phases) and Experience (timeline reveal)

### Decision 3: SVG for Connection Lines

**What**: Use inline SVG with animated `stroke-dashoffset` via interpolate

**Why**:
- Clean vector rendering at any scale
- `stroke-dasharray` + `stroke-dashoffset` enables line-drawing effect
- Fully controlled by frame, not CSS animation

```tsx
const lineProgress = interpolate(frame, [startFrame, endFrame], [1, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
// strokeDashoffset = lineLength * lineProgress
```

### Decision 4: Skill Data Structure

**What**: Typed data file with categories, skills, and optional metadata

```tsx
// src/data/skillsData.ts
type Skill = {
  name: string;
  icon?: string; // Optional icon identifier
  years?: number; // Years of experience
};

type SkillCategory = {
  id: string;
  name: string;
  color: string; // Accent color for category
  skills: Skill[];
};
```

**Why**:
- Separates data from presentation
- Allows future enhancement (icons, experience bars)
- Type-safe

### Decision 5: Exit Animation Pattern

**What**: Mirror entrance animation in reverse

**Why**:
- Consistent with Summary/Experience patterns
- Uses same frame ranges but inverted
- `isReversing` and `isExitingForward` flags from useSectionVisibility

```tsx
// When exiting, map sequenceFrame to reverse effectiveFrame
if (isReversing || isExitingForward) {
  effectiveFrame = TOTAL_ANIMATION_DURATION * (1 - sequenceFrame / EXIT_DURATION);
}
```

## Component Architecture

```
SkillsSection.tsx
├── Section header (04. Skills)
├── NetworkLayout.tsx
│   ├── CenterNode (decorative)
│   ├── CategoryNode[] (6 categories)
│   │   └── SkillNode[] (skills per category)
│   └── ConnectionLine[] (SVG paths)
```

## Responsive Breakpoints

| Viewport | Layout | Network Style |
|----------|--------|---------------|
| < 768px | Vertical stack | Cards with skill tags |
| 768-1024px | 2-column | Semi-radial, limited connections |
| > 1024px | Full radial | Complete neural network |

## Animation Constants

```tsx
// Timing (frames at 30 FPS)
const PHASE_1_END = 30;      // Core reveal complete
const PHASE_2_END = 90;      // Categories expanded
const PHASE_3_END = 180;     // Skills populated
const PHASE_4_END = 240;     // Connections complete

// Entrance delay (wait for Impact exit on forward entry)
const FORWARD_ENTRANCE_DELAY = 60;

// Exit duration
const EXIT_DURATION = 90;

// Spring configs
const CATEGORY_SPRING = { damping: 14, stiffness: 80 };
const SKILL_SPRING = { damping: 14, stiffness: 120 };
const CONNECTION_SPRING = { damping: 200 }; // Smooth, no bounce
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Performance with many animated nodes | Limit to ~30 skill nodes, use CSS transforms only |
| Complex positioning calculations | Pre-calculate layouts, memoize positions |
| Mobile readability | Fall back to simple card layout, skip network viz |

## Open Questions

1. Should skill nodes show years of experience as a visual indicator?
2. Should there be category icons (code bracket for Languages, cloud for Infra, etc.)?
3. Should connections animate continuously or settle to static?
