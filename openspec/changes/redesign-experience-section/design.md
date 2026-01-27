# Experience Section - Technical Design

## Remotion Skill Reference
**IMPORTANT**: Before implementing any animation code, read:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`

All animations MUST use `interpolate()` and `spring()` functions. CSS transitions are FORBIDDEN.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ExperienceSection                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Header: [Image] 02. Experience ─────────────────     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────┐  ┌────────────────────────────────────────┐   │
│  │Timeline │  │ Content Area                            │   │
│  │ Rail    │  │                                         │   │
│  │    ●────┼──│ [Stacked Items - collapsed]             │   │
│  │    │    │  │ ┌─────────────────────────────────────┐ │   │
│  │    │    │  │ │ Role Title | Company | Date        │ │   │
│  │    │    │  │ └─────────────────────────────────────┘ │   │
│  │    │    │  │                                         │   │
│  │    ○────┼──│ [Active Item - expanded]                │   │
│  │    │    │  │ ┌─────────────────────────────────────┐ │   │
│  │    │    │  │ │ Role Title                          │ │   │
│  │    │    │  │ │ Company | Date                      │ │   │
│  │    │    │  │ │                                     │ │   │
│  │    │    │  │ │ Description text being typed...│   │ │   │
│  │    │    │  │ │                                     │ │   │
│  │    │    │  │ │ • Achievement 1                     │ │   │
│  │    │    │  │ │ • Achievement 2                     │ │   │
│  │    │    │  │ └─────────────────────────────────────┘ │   │
│  │    │    │  │                                         │   │
│  │    ○    │  │ [Upcoming items - hidden]               │   │
│  │    ○    │  │                                         │   │
│  └─────────┘  └────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Structure

### ExperienceSection.tsx (New)
Main container component managing:
- Section visibility and entrance animation
- Scroll progress to item index mapping
- Coordination of stacked/active/upcoming items

### TimelineRail.tsx (New)
Visual timeline indicator:
- Vertical line with dots for each item
- Active dot highlighted
- Progress indicator between dots

### TimelineItem.tsx (New)
Individual career item with states:
- `stacked` - Compact form at top
- `active` - Expanded with typewriter animation
- `upcoming` - Hidden, waiting to appear

### ExperienceData.ts (New)
Career history data structure extracted from professional summary.

---

## State Management

### Scroll-to-Item Mapping

```typescript
// Total scroll range divided by number of items
const SCROLL_PER_ITEM = 400; // pixels of scroll per timeline item
const totalItems = experienceData.length;

// Map contentScrollOffset to current item index and local progress
function getScrollState(scrollOffset: number) {
  const itemIndex = Math.floor(scrollOffset / SCROLL_PER_ITEM);
  const localProgress = (scrollOffset % SCROLL_PER_ITEM) / SCROLL_PER_ITEM;

  return {
    currentItemIndex: Math.min(itemIndex, totalItems - 1),
    localProgress, // 0-1 within current item
    phase: localProgress < 0.3 ? 'writing'
         : localProgress < 0.7 ? 'visible'
         : 'collapsing'
  };
}
```

### Item States

```typescript
type ItemState = {
  index: number;
  state: 'stacked' | 'expanding' | 'active' | 'collapsing' | 'upcoming';
  typewriterProgress: number; // 0-1, for text animation
  collapseProgress: number;   // 0-1, for shrinking animation
  stackOffset: number;        // Y position when stacked
};
```

---

## Animation Sequences

### 1. Entrance Animation (Auto-play)

```typescript
// Frame-based entrance during TRANSITIONING state
const entranceProgress = spring({
  frame: sequenceFrame,
  fps: FPS,
  config: { damping: 14, stiffness: 100 },
});

// Header fades in
const headerOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);

// First item writes (starts after header)
const typewriterStartFrame = 30;
const effectiveTypewriterFrame = Math.max(0, sequenceFrame - typewriterStartFrame);
```

### 2. Item Expansion (Scroll-driven)

```typescript
// When localProgress < 0.3, item is "writing"
const writeProgress = interpolate(localProgress, [0, 0.3], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// Typewriter uses writeProgress to determine visible characters
const visibleChars = Math.floor(writeProgress * totalChars);
```

### 3. Item Collapse (Scroll-driven)

```typescript
// When localProgress > 0.7, item is "collapsing"
const collapseProgress = interpolate(localProgress, [0.7, 1], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// Height shrinks from full to compact
const itemHeight = interpolate(collapseProgress, [0, 1], [expandedHeight, stackedHeight]);

// Text backward-writes (deletes)
const visibleChars = Math.floor((1 - collapseProgress) * totalChars);

// Y position moves upward to stack
const yOffset = interpolate(collapseProgress, [0, 1], [0, -stackPosition]);
```

### 4. Timeline Indicator

```typescript
// Dot position follows current item
const indicatorY = interpolate(
  currentItemIndex + localProgress,
  [0, totalItems],
  [firstDotY, lastDotY]
);

// Active dot scales up
const dotScale = isActive ? 1.3 : 1;
```

---

## Responsive Considerations

```typescript
// Desktop: timeline rail on left, content on right
// Mobile: timeline rail hidden or minimal, full-width content

const isMobile = viewport.width < 768;

const layout = isMobile ? {
  timelineVisible: false,
  contentWidth: '100%',
  stackedItemHeight: 40,
  expandedPadding: 16,
} : {
  timelineVisible: true,
  contentWidth: 'calc(100% - 80px)',
  stackedItemHeight: 50,
  expandedPadding: 32,
};
```

---

## Summary Section Changes

### Remove Slide-Out Exit

```typescript
// In SummarySection, when transitioning to Experience:
// Instead of calculateExitAnimation with direction: 'right'
// Use backward typewriter (isReversing already implemented)

const exitAnimation = isReversing || (isExiting && nextSection === 'experience')
  ? { opacity: 1, translateX: 0, scale: 1 } // No slide
  : calculateExitAnimation({...});
```

### ProfileImageTransition Updates

```typescript
// Add experience section handling
const experienceVisibility = useSectionVisibility('experience');

// Calculate experience header position (similar to summary)
if (experienceVisibility.isCurrent || experienceVisibility.isEntering) {
  // Position image in experience header
  const experienceX = // left side of header
  const experienceY = // aligned with "02. Experience"
}
```

---

## Data Structure

```typescript
// src/data/experienceData.ts
export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  client?: string;
  period: string;
  description: string;
  achievements?: string[];
  technologies?: string[];
};

export const experienceData: ExperienceItem[] = [
  {
    id: 'ai-architect',
    role: 'AI Solution Architect & R&D Manager',
    company: 'Abra',
    period: '2024 - Present',
    description: 'Leading AI-first development initiatives...',
    achievements: [
      '7 direct reports across 5 active projects',
      'Proposed and created AI-first delivery team business plan',
      'Delivered internal app in 2 months vs 3-month estimate',
    ],
  },
  // ... more items
];
```

---

## Performance Optimizations

1. **Virtualization**: Only render visible items + 1 buffer
2. **Memoization**: Memoize item components with stable keys
3. **Transform-only animations**: Use `transform` and `opacity` only
4. **Debounced scroll**: Batch scroll updates to reduce re-renders

---

## Testing Considerations

1. Test scroll in both directions
2. Test rapid scroll (skip items)
3. Test mobile touch gestures
4. Test entrance animation timing
5. Test backward navigation from next section
